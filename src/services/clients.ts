/* caminho relativo com extensão, como em services/admin.ts: o `npm run check` roda isto no node
   puro, que não conhece o alias `@/` */
import { db } from "./db.ts";
import { TRACKS, type Track } from "../data/reviews.ts";
import { text, validDate } from "./review-input.ts";

/* Clientes do painel e o "pago até" do plano mensal. Onde o site mora entra aqui; o acesso não
   — senha fica no gerenciador de senhas, e o máximo que `notes` diz é em qual pasta dele. */

export const CLIENT_LIMITS = { name: 160, contact: 160, site: 200, hosting: 120, notes: 2000 } as const;

/** teto do valor mensal, em centavos (R$ 100 mil): bem acima de qualquer plano, bem abaixo do `int` */
const MAX_FEE = 10_000_000;

/** "1.500,00", "1500", "150,5" — o jeito brasileiro, com ponto de milhar opcional. O `pattern`
    do campo no painel é esta mesma expressão, então o navegador barra antes de chegar aqui. */
export const MONEY_PATTERN = "\\d+(\\.\\d{3})*(,\\d{1,2})?";

export interface ClientFields {
  name: string;
  contact: string | null;
  track: Track;
  site: string | null;
  hosting: string | null;
  /** "YYYY-MM-DD" */
  domainUntil: string | null;
  /** centavos */
  monthlyFee: number;
  /** "YYYY-MM-DD" */
  paidUntil: string | null;
  notes: string | null;
}

export interface Client extends ClientFields {
  id: number;
  /** tem plano e o "pago até" já passou */
  overdue: boolean;
  /** domínio vence nos próximos 30 dias (ou já venceu) */
  domainSoon: boolean;
}

/** Reais digitados no painel → centavos. Vazio é "sem plano"; qualquer outra coisa fora do
    formato é erro, não zero — zero calado esconderia um cliente pagante. */
export function parseMoney(value: string): number | null {
  const clean = value.replace(/^R\$\s*/i, "").trim();
  if (!clean) return 0;
  if (!new RegExp(`^${MONEY_PATTERN}$`).test(clean)) return null;
  const [reais, centavos = ""] = clean.replace(/\./g, "").split(",");
  const cents = Number(reais) * 100 + Number(centavos.padEnd(2, "0"));
  return cents <= MAX_FEE ? cents : null;
}

/* sem limite de futuro: vencimento de domínio e "pago até" moram no futuro por natureza */
const date = (value: string) => (value === "" || validDate(value, "9999-12-31") ? value || null : undefined);

export function readClient(form: FormData): { fields: ClientFields } | { error: string } {
  const get = (key: string) => text(form.get(key));
  const name = get("name");
  const contact = get("contact");
  const track = get("track");
  const site = get("site");
  const hosting = get("hosting");
  const notes = get("notes");
  const monthlyFee = parseMoney(get("fee"));
  const domainUntil = date(get("domainUntil"));
  const paidUntil = date(get("paidUntil"));

  if (!name || name.length > CLIENT_LIMITS.name) return { error: "Preencha o nome do cliente." };
  if (!TRACKS.includes(track as Track)) return { error: "Trabalho inválido." };
  if (contact.length > CLIENT_LIMITS.contact) return { error: "Contato muito longo." };
  if (site.length > CLIENT_LIMITS.site) return { error: "Site muito longo." };
  if (hosting.length > CLIENT_LIMITS.hosting) return { error: "Hospedagem muito longa." };
  if (notes.length > CLIENT_LIMITS.notes) return { error: "Anotações muito longas." };
  if (monthlyFee === null) return { error: "Valor mensal inválido. Use o formato 1.500,00." };
  if (domainUntil === undefined) return { error: "Vencimento do domínio inválido." };
  if (paidUntil === undefined) return { error: "Data de \"pago até\" inválida." };

  return {
    fields: {
      name,
      contact: contact || null,
      track: track as Track,
      site: site || null,
      hosting: hosting || null,
      domainUntil,
      monthlyFee,
      paidUntil,
      notes: notes || null,
    },
  };
}

/* "Hoje" em Goiânia, não em UTC: o Neon roda em UTC, e às 21h daqui ele já estaria no dia
   seguinte — o cliente viraria atrasado três horas antes da hora. */
const TODAY = "(now() at time zone 'America/Sao_Paulo')::date";

export async function listClients(): Promise<Client[]> {
  return (await db().query(`
    select id, name, contact, track, site, hosting, notes,
           monthly_fee as "monthlyFee",
           to_char(domain_until, 'YYYY-MM-DD') as "domainUntil",
           to_char(paid_until, 'YYYY-MM-DD') as "paidUntil",
           coalesce(monthly_fee > 0 and paid_until < ${TODAY}, false) as overdue,
           coalesce(domain_until <= ${TODAY} + 30, false) as "domainSoon"
    from clients
    order by overdue desc, name
  `)) as Client[];
}

export async function createClient(c: ClientFields): Promise<void> {
  await db()`
    insert into clients (name, contact, track, site, hosting, domain_until, monthly_fee, paid_until, notes)
    values (${c.name}, ${c.contact}, ${c.track}, ${c.site}, ${c.hosting}, ${c.domainUntil}, ${c.monthlyFee}, ${c.paidUntil}, ${c.notes})
  `;
}

export async function updateClient(id: number, c: ClientFields): Promise<void> {
  await db()`
    update clients set
      name = ${c.name}, contact = ${c.contact}, track = ${c.track}, site = ${c.site}, hosting = ${c.hosting},
      domain_until = ${c.domainUntil}, monthly_fee = ${c.monthlyFee}, paid_until = ${c.paidUntil}, notes = ${c.notes}
    where id = ${id}
  `;
}

export async function deleteClient(id: number): Promise<void> {
  await db()`delete from clients where id = ${id}`;
}

/** "Recebi": soma um mês ao "pago até" — não a hoje. Quem paga atrasado um mês de dois que
    deve continua atrasado, em vez de ganhar os dias de graça. Sem data ainda, conta de hoje. */
export async function markPaid(id: number): Promise<void> {
  await db().query(
    `update clients
     set paid_until = (coalesce(paid_until, ${TODAY}) + interval '1 month')::date
     where id = $1`,
    [id],
  );
}
