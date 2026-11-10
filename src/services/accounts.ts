/* caminho relativo com extensão: o `npm run check` roda isto no node puro */
import { db } from "./db.ts";
import { field, oneOf, optionalDate, tooLong } from "./form-input.ts";

/* Contas e acessos do cliente: domínio, hospedagem, Google Analytics… Quem é o dono, qual acesso
   você tem, onde entra e com qual login — nunca a senha. A conta é do cliente desde o primeiro
   dia; o que estiver no seu nome aparece marcado, porque é o que precisa ser transferido quando
   ele sair. */

export type Owner = "client" | "me";
export const OWNERS: Owner[] = ["client", "me"];
export const OWNER_LABEL: Record<Owner, string> = { client: "Do cliente", me: "No seu nome" };

export const ACCOUNT_LIMITS = { service: 120, access: 200, notes: 1000, url: 300, login: 160 } as const;

export interface AccountFields {
  service: string;
  owner: Owner;
  access: string | null;
  /** "YYYY-MM-DD" — renovação de domínio ou hospedagem */
  expiresOn: string | null;
  notes: string | null;
  /** onde se entra: o painel do serviço, como digitado ("registro.br") */
  url: string | null;
  /** o e-mail ou usuário de entrada — a senha não */
  login: string | null;
}

export interface Account extends AccountFields {
  id: number;
  clientId: number;
}

/* Endereço de painel: domínio com ponto, com ou sem http(s) na frente. Vai parar num href, então
   nada de outro esquema (`javascript:` não passa: não tem domínio com ponto antes dos dois-pontos). */
const URL_PATTERN = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/i;

export function readAccount(form: FormData): { fields: AccountFields } | { error: string } {
  const values = {
    service: field(form, "service"),
    access: field(form, "access"),
    notes: field(form, "notes"),
    url: field(form, "url"),
    login: field(form, "login"),
  };
  const owner = oneOf(field(form, "owner"), OWNERS);
  const expiresOn = optionalDate(field(form, "expiresOn"));

  if (!values.service) return { error: "Diga qual é o serviço, ex. Domínio (Registro.br)." };
  if (tooLong(values, ACCOUNT_LIMITS)) return { error: "Algum campo passou do tamanho." };
  if (!owner) return { error: "Dono inválido." };
  if (expiresOn === undefined) return { error: "Data de vencimento inválida." };
  if (values.url && !URL_PATTERN.test(values.url)) return { error: "Link do painel inválido, ex. registro.br ou https://hpanel.hostinger.com" };

  return {
    fields: {
      service: values.service,
      owner,
      access: values.access || null,
      expiresOn,
      notes: values.notes || null,
      url: values.url || null,
      login: values.login || null,
    },
  };
}

/* ---------- leitura na ficha ---------- */

export type ServiceKind = "domain" | "hosting" | "analytics" | "search" | "email" | "social" | "other";

/* A ordem conta: "Google Search Console" é busca antes de ser Google, "Meta Pixel" é medição antes
   de ser rede social, "Google Workspace" é e-mail. */
const KINDS: [ServiceKind, RegExp][] = [
  ["search", /search console|meu neg[oó]cio|perfil da empresa|business profile|bing/i],
  ["analytics", /analytics|\bga4\b|tag manager|\bgtm\b|clarity|hotjar|pixel/i],
  ["email", /e-?mail|gmail|workspace|outlook|microsoft 365|zoho|titan/i],
  ["domain", /dom[ií]nio|registro\.br|\bdns\b|godaddy|namecheap|cloudflare/i],
  ["hosting", /hospedagem|hosting|hostinger|hostgator|locaweb|kinghost|vercel|netlify|servidor|\bvps\b|cpanel/i],
  ["social", /instagram|facebook|\bmeta\b|linkedin|tiktok|youtube|twitter/i],
];

/** O tipo do serviço pelo nome que você deu — só para o ícone, então errar é barato. */
export const serviceKind = (service: string): ServiceKind => KINDS.find(([, pattern]) => pattern.test(service))?.[0] ?? "other";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Quanto falta para renovar, em palavras: "renova em 23 dias", "venceu há 2 dias". `late` já
    venceu, `soon` é até 30 dias — a mesma janela do aviso da visão geral. */
export function renewal(expiresOn: string, today: string): { text: string; tone: "late" | "soon" | "ok" } {
  const days = Math.round((Date.parse(expiresOn) - Date.parse(today)) / 86_400_000);
  if (days < 0) return { text: `venceu há ${plural(-days, "dia", "dias")}`, tone: "late" };
  if (days === 0) return { text: "renova hoje", tone: "soon" };
  if (days === 1) return { text: "renova amanhã", tone: "soon" };
  if (days <= 30) return { text: `renova em ${days} dias`, tone: "soon" };
  if (days < 365) return { text: `renova em ${plural(Math.round(days / 30), "mês", "meses")}`, tone: "ok" };
  return { text: `renova em ${plural(Math.round(days / 365), "ano", "anos")}`, tone: "ok" };
}

/** No seu nome primeiro (é o que pede ação quando o cliente sai), e em cada grupo a renovação mais
    próxima em cima; sem data, no fim. */
export async function listAccounts(clientId: number): Promise<Account[]> {
  return (await db().query(
    `select id, client_id as "clientId", service, owner, access, notes, url, login,
            to_char(expires_on, 'YYYY-MM-DD') as "expiresOn"
     from client_accounts
     where client_id = $1
     order by owner = 'me' desc, expires_on nulls last, service`,
    [clientId],
  )) as Account[];
}

/** Devolve o id da conta nova: a ficha rola até ela. */
export async function createAccount(clientId: number, a: AccountFields): Promise<number> {
  const [row] = (await db()`
    insert into client_accounts (client_id, service, owner, access, expires_on, notes, url, login)
    values (${clientId}, ${a.service}, ${a.owner}, ${a.access}, ${a.expiresOn}, ${a.notes}, ${a.url}, ${a.login})
    returning id
  `) as { id: number }[];
  return row.id;
}

export async function updateAccount(id: number, a: AccountFields): Promise<void> {
  await db()`
    update client_accounts set
      service = ${a.service}, owner = ${a.owner}, access = ${a.access}, expires_on = ${a.expiresOn},
      notes = ${a.notes}, url = ${a.url}, login = ${a.login}
    where id = ${id}
  `;
}

export async function deleteAccount(id: number): Promise<void> {
  await db()`delete from client_accounts where id = ${id}`;
}
