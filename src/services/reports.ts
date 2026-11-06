/* caminho relativo com extensão: o `npm run check` roda isto no node puro */
import { TODAY, db } from "./db.ts";
import { monthlyAnalytics, type ReportData } from "./analytics.ts";
import { monthLabel, previousMonth } from "./dates.ts";
import { field, readId } from "./form-input.ts";
import { signInvite, verifyInvite } from "./invite.ts";
import { getPlan } from "./plans.ts";

/* Relatório mensal dos planos que incluem relatório. Gerar busca os números do GA4 e congela no
   banco; daí você escolhe as seções, escreve o recado e manda o link pelo WhatsApp. Enviado, o
   relatório trava: o cliente vê sempre o que recebeu. */

export const SECTIONS = ["totals", "channels", "events", "pages", "devices", "note"] as const;
export type Section = (typeof SECTIONS)[number];
export const SECTION_LABEL: Record<Section, string> = {
  totals: "Resumo do mês",
  channels: "De onde vieram as visitas",
  events: "Contatos pelo site",
  pages: "Páginas mais vistas",
  devices: "Celular ou computador",
  note: "Recado do mês",
};

export const NOTE_LIMIT = 3000;

export interface Report {
  id: number;
  planId: number;
  clientId: number;
  clientName: string;
  /** dígitos com o 55, ou null */
  whatsapp: string | null;
  site: string | null;
  planName: string;
  /** "YYYY-MM" */
  month: string;
  data: ReportData | null;
  sections: Section[];
  note: string | null;
  /** "YYYY-MM-DD" */
  sentOn: string | null;
}

/** O mês que o relatório cobre é o que já fechou: o anterior ao de hoje. */
export const reportMonth = (today: string): string => previousMonth(today.slice(0, 7));

/** Mês vindo da URL; qualquer outra coisa vira o mês padrão. */
export const readMonth = (value: string | undefined, fallback: string): string =>
  value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : fallback;

/* ---------- link do cliente ---------- */

/* O link carrega o id e uma assinatura com o mesmo segredo dos convites. O prefixo separa os
   dois usos: assinatura de convite não abre relatório. */
const sign = (id: number) => signInvite(`relatorio:${id}`);

export const reportToken = (id: number): string => `${id}-${sign(id)}`;

/** O id do relatório, se a assinatura confere; null em qualquer outro caso. */
export function readReportToken(token: string): number | null {
  const [rawId, signature] = token.split("-");
  const id = readId(rawId);
  return id && verifyInvite(`relatorio:${id}`, signature) ? id : null;
}

export const reportMessage = (report: Pick<Report, "clientName" | "month">, link: string): string =>
  `Olá, ${report.clientName}! Segue o relatório de ${monthLabel(report.month)} do seu site: ${link}`;

/* ---------- fila do mês ---------- */

export interface QueueItem {
  planId: number;
  planName: string;
  clientId: number;
  clientName: string;
  hasAnalytics: boolean;
  reportId: number | null;
  /** "YYYY-MM-DD" */
  sentOn: string | null;
}

/** Planos ativos com relatório que já valiam naquele mês, com o relatório do mês se houver. */
export async function listQueue(month: string): Promise<QueueItem[]> {
  return (await db().query(
    `select pl.id as "planId", pl.name as "planName", c.id as "clientId", c.name as "clientName",
            pl.ga_property is not null as "hasAnalytics",
            r.id as "reportId", to_char(r.sent_on, 'YYYY-MM-DD') as "sentOn"
     from plans pl
     join clients c on c.id = pl.client_id
     left join reports r on r.plan_id = pl.id and r.month = $1
     where pl.status = 'active' and pl.reports and to_char(pl.first_due, 'YYYY-MM') <= $1
     order by (r.sent_on is not null), c.name`,
    [month],
  )) as QueueItem[];
}

/* ---------- relatório ---------- */

const SELECT = `
  select r.id, r.plan_id as "planId", c.id as "clientId", c.name as "clientName", c.whatsapp, c.site,
         pl.name as "planName", r.month, r.data, r.sections, r.note,
         to_char(r.sent_on, 'YYYY-MM-DD') as "sentOn"
  from reports r
  join plans pl on pl.id = r.plan_id
  join clients c on c.id = pl.client_id`;

export async function getReport(id: number): Promise<Report | null> {
  const [row] = (await db().query(`${SELECT} where r.id = $1`, [id])) as Report[];
  return row ?? null;
}

/** Gera (ou atualiza os números de) o relatório do mês. As seções começam como as do último
    relatório do plano — o que você ajustou para este cliente continua ajustado. Relatório já
    enviado não muda. Erro do Google sobe com a mensagem dele, pra tela mostrar. */
export async function generateReport(planId: number, month: string): Promise<number | null> {
  const plan = await getPlan(planId);
  if (!plan) return null;

  const data = plan.gaProperty ? await monthlyAnalytics(plan.gaProperty, month) : null;
  const sql = db();
  const [last] = (await sql`
    select sections from reports where plan_id = ${planId} and month < ${month} order by month desc limit 1
  `) as { sections: Section[] }[];
  const sections = last?.sections ?? (data ? [...SECTIONS] : ["note"]);

  const [row] = (await sql`
    insert into reports (plan_id, month, data, sections)
    values (${planId}, ${month}, ${data ? JSON.stringify(data) : null}::jsonb, ${sections})
    on conflict (plan_id, month) do update set data = excluded.data, updated_at = now()
    where reports.sent_on is null
    returning id
  `) as { id: number }[];
  if (row) return row.id;

  /* já enviado: o `where` do conflito não deixou mexer, só devolve o id */
  const [sent] = (await sql`select id from reports where plan_id = ${planId} and month = ${month}`) as { id: number }[];
  return sent?.id ?? null;
}

export function readReportEdit(form: FormData): { sections: Section[]; note: string | null } | { error: string } {
  const sections = SECTIONS.filter((section) => form.getAll("sections").includes(section));
  const note = field(form, "note");
  if (note.length > NOTE_LIMIT) return { error: "Recado longo demais." };
  if (!sections.length) return { error: "Escolha ao menos uma seção." };
  return { sections, note: note || null };
}

/** Só antes de enviar. `false` quando já foi enviado. */
export async function updateReport(id: number, edit: { sections: Section[]; note: string | null }): Promise<boolean> {
  const rows = await db()`
    update reports set sections = ${edit.sections}, note = ${edit.note}, updated_at = now()
    where id = ${id} and sent_on is null
    returning id
  `;
  return rows.length > 0;
}

/** Enviado hoje, ou de volta a rascunho (`sent = false`) pra corrigir algo. */
export async function setReportSent(id: number, sent: boolean): Promise<void> {
  await db().query(
    `update reports set sent_on = ${sent ? TODAY : "null"}, updated_at = now() where id = $1`,
    [id],
  );
}
