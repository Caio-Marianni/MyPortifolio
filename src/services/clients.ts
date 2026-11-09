/* caminho relativo com extensão, como em services/admin.ts: o `npm run check` roda isto no node
   puro, que não conhece o alias `@/` */
import { TODAY, db, isForeignKeyError } from "./db.ts";
import { field, isEmail, tooLong } from "./form-input.ts";
import { NEXT_DUE } from "./plans.ts";

/* Clientes de web dev. Onde o site mora e quem é dono de cada conta ficam em "contas e acessos"
   (services/accounts.ts); dinheiro em planos, projetos e pagamentos. Senha não entra no banco. */

export const CLIENT_LIMITS = { name: 160, document: 24, whatsapp: 24, email: 160, address: 300, site: 200, notes: 2000 } as const;

export interface ClientFields {
  name: string;
  /** CPF ou CNPJ já com máscara — vai assim pro contrato */
  document: string | null;
  /** só dígitos, com o 55 na frente: o formato do wa.me */
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  site: string | null;
  notes: string | null;
}

export interface Client extends ClientFields {
  id: number;
}

/** linha da lista: o que dá pra decidir sem abrir a ficha */
export interface ClientRow {
  id: number;
  name: string;
  site: string | null;
  whatsapp: string | null;
  activePlans: number;
  openProjects: number;
  /** soma dos planos ativos, em centavos */
  monthly: number;
  /** plano com mensalidade vencida ou parcela de projeto vencida */
  overdue: boolean;
}

/** CPF (11 dígitos) ou CNPJ (14 posições) com a máscara de sempre; outra contagem é null.
    O CNPJ aceita letra nas 12 primeiras posições — é o formato alfanumérico que a Receita
    começou a emitir em julho de 2026. Dígito verificador não é conferido: um erro de
    digitação aparece no contrato, que você revisa antes de mandar. */
export function formatDocument(value: string): string | null {
  const clean = value.toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (/^\d{11}$/.test(clean)) return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  if (/^[0-9A-Z]{12}\d{2}$/.test(clean)) return clean.replace(/^(.{2})(.{3})(.{3})(.{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  return null;
}

/** Celular brasileiro com DDD, com ou sem o 55 → só dígitos com o 55. Outra contagem é null.
    ponytail: só número do Brasil; número de fora pediria o código do país num campo próprio. */
export function whatsappDigits(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) return digits;
  return null;
}

/** "5562999998888" → "+55 62 99999-8888" */
export function formatWhatsapp(digits: string): string {
  const local = digits.slice(2);
  return `+55 ${local.slice(0, 2)} ${local.slice(2, -4)}-${local.slice(-4)}`;
}

/** Conversa aberta com o cliente, já com o texto escrito quando houver. */
export const whatsappLink = (digits: string, message?: string): string =>
  `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/** site guardado como digitado ("loja.com.br"); o link precisa do protocolo */
export const siteHref = (site: string): string => (/^https?:\/\//i.test(site) ? site : `https://${site}`);

const LABELS: Record<keyof typeof CLIENT_LIMITS, string> = {
  name: "Nome",
  document: "CPF/CNPJ",
  whatsapp: "WhatsApp",
  email: "E-mail",
  address: "Endereço",
  site: "Site",
  notes: "Anotações",
};

export function readClient(form: FormData): { fields: ClientFields } | { error: string } {
  const values = {
    name: field(form, "name"),
    document: field(form, "document"),
    whatsapp: field(form, "whatsapp"),
    email: field(form, "email"),
    address: field(form, "address"),
    site: field(form, "site"),
    notes: field(form, "notes"),
  };

  if (!values.name) return { error: "Preencha o nome do cliente." };
  const long = tooLong(values, CLIENT_LIMITS);
  if (long) return { error: `${LABELS[long]} muito longo.` };

  const document = values.document ? formatDocument(values.document) : null;
  if (values.document && !document) return { error: "CPF tem 11 dígitos e CNPJ tem 14 posições." };
  const whatsapp = values.whatsapp ? whatsappDigits(values.whatsapp) : null;
  if (values.whatsapp && !whatsapp) return { error: "WhatsApp: celular com DDD, ex. 62 99999-8888." };
  if (values.email && !isEmail(values.email)) return { error: "E-mail inválido." };

  return {
    fields: {
      name: values.name,
      document,
      whatsapp,
      email: values.email || null,
      address: values.address || null,
      site: values.site || null,
      notes: values.notes || null,
    },
  };
}

/** Mensalidade vencida de plano ativo, ou parcela vencida de projeto que não foi cancelado. */
const OVERDUE = `(
  exists (select 1 from plans where plans.client_id = c.id and plans.status = 'active' and ${NEXT_DUE} < ${TODAY})
  or exists (select 1 from payments pay join projects pr on pr.id = pay.project_id
             where pr.client_id = c.id and pr.status <> 'canceled' and pay.paid_on is null and pay.due_on < ${TODAY})
)`;

/** Atrasados em cima: a ordem da lista é a ordem de cobrança. */
export async function listClients(): Promise<ClientRow[]> {
  return (await db().query(`
    select c.id, c.name, c.site, c.whatsapp,
           (select count(*)::int from plans p where p.client_id = c.id and p.status = 'active') as "activePlans",
           (select count(*)::int from projects pr where pr.client_id = c.id and pr.status in ('approved', 'in_progress')) as "openProjects",
           (select coalesce(sum(p.monthly_fee), 0)::int from plans p where p.client_id = c.id and p.status = 'active') as monthly,
           ${OVERDUE} as overdue
    from clients c
    order by overdue desc, c.name
  `)) as ClientRow[];
}

export async function getClient(id: number): Promise<Client | null> {
  const [row] = (await db()`
    select id, name, document, whatsapp, email, address, site, notes from clients where id = ${id}
  `) as Client[];
  return row ?? null;
}

export async function createClient(c: ClientFields): Promise<number> {
  const [row] = (await db()`
    insert into clients (name, document, whatsapp, email, address, site, notes)
    values (${c.name}, ${c.document}, ${c.whatsapp}, ${c.email}, ${c.address}, ${c.site}, ${c.notes})
    returning id
  `) as { id: number }[];
  return row.id;
}

export async function updateClient(id: number, c: ClientFields): Promise<void> {
  await db()`
    update clients set
      name = ${c.name}, document = ${c.document}, whatsapp = ${c.whatsapp}, email = ${c.email},
      address = ${c.address}, site = ${c.site}, notes = ${c.notes}
    where id = ${id}
  `;
}

/** `false` quando o cliente tem pagamento recebido ou documento enviado ou assinado: isso é
    histórico, e não sai por um clique. Contas, planos e projetos sem dinheiro registrado vão junto. */
export async function deleteClient(id: number): Promise<boolean> {
  const sql = db();
  try {
    /* parcela não recebida e rascunho não são histórico — saem antes, pra não travar a exclusão */
    await sql.transaction([
      sql`delete from payments where paid_on is null and project_id in (select id from projects where client_id = ${id})`,
      sql`delete from documents where client_id = ${id} and status = 'draft'`,
      sql`delete from clients where id = ${id}`,
    ]);
    return true;
  } catch (error) {
    if (isForeignKeyError(error)) return false;
    throw error;
  }
}
