/* caminho relativo com extensão: o `npm run check` roda isto no node puro */
import { db } from "./db.ts";
import { br, longDate, todayInBrazil } from "./dates.ts";
import { field, oneOf, optionalDate, tooLong } from "./form-input.ts";
import { brl } from "./money.ts";
import { formatWhatsapp, getClient, type Client } from "./clients.ts";
import { listClientPayments, type Payment } from "./payments.ts";
import { getPlan, type Plan } from "./plans.ts";
import { getProject, type Project } from "./projects.ts";

/* Propostas e contratos. O modelo tem {campos}; gerar um documento troca os campos pelos dados
   do cliente e do projeto ou plano, e daí em diante o texto é seu pra ajustar. Depois de
   assinado o documento trava: a trava mora no `where` das consultas, não só na tela. */

export type DocKind = "proposal" | "contract";
export const DOC_KINDS: DocKind[] = ["proposal", "contract"];
export const DOC_KIND_LABEL: Record<DocKind, string> = { proposal: "Proposta", contract: "Contrato" };

export type DocStatus = "draft" | "sent" | "signed";
export const DOC_STATUSES: DocStatus[] = ["draft", "sent", "signed"];
export const DOC_STATUS_LABEL: Record<DocStatus, string> = { draft: "Rascunho", sent: "Enviado", signed: "Assinado" };

export const DOC_LIMITS = { name: 120, title: 200, body: 60_000, signedUrl: 500 } as const;

/** Os campos que um modelo pode usar. A tela de modelos mostra esta lista. */
export const PLACEHOLDERS: { key: string; help: string }[] = [
  { key: "cliente", help: "nome ou empresa" },
  { key: "documento", help: "CPF ou CNPJ" },
  { key: "endereco", help: "endereço" },
  { key: "email", help: "e-mail" },
  { key: "whatsapp", help: "WhatsApp" },
  { key: "site", help: "site do cliente" },
  { key: "projeto", help: "nome do projeto" },
  { key: "escopo", help: "escopo do projeto" },
  { key: "valor", help: "valor total do projeto" },
  { key: "prazo", help: "prazo de entrega, por extenso" },
  { key: "parcelas", help: "uma linha por parcela — deixe numa linha sozinha" },
  { key: "plano", help: "nome do plano" },
  { key: "mensalidade", help: "valor mensal" },
  { key: "vencimento", help: "dia do vencimento" },
  { key: "inicio", help: "primeiro vencimento, por extenso" },
  { key: "inclui", help: "o que o plano cobre" },
  { key: "data", help: "data de hoje, por extenso" },
];

/* ---------- texto: preencher e formatar ---------- */

/** Troca cada {chave} pelo valor. Chave sem valor fica como está, entre chaves: à vista no
    rascunho pra você completar, em vez de sumir calada do contrato. */
export function fillTemplate(body: string, values: Record<string, string>): string {
  return body.replace(/\{([a-z_]+)\}/g, (match, key: string) => values[key] ?? match);
}

/** Os valores de cada campo pra um cliente e, quando houver, o projeto ou o plano do documento.
    Vazio fica de fora — e o campo continua à vista no texto. */
export function documentValues(input: {
  client: Client;
  project?: Project | null;
  plan?: Plan | null;
  installments?: Payment[];
  today: string;
}): Record<string, string> {
  const { client, project, plan, installments = [] } = input;
  const values: Record<string, string | null | undefined> = {
    cliente: client.name,
    documento: client.document,
    endereco: client.address,
    email: client.email,
    whatsapp: client.whatsapp && formatWhatsapp(client.whatsapp),
    site: client.site,
    data: longDate(input.today),
    projeto: project?.title,
    escopo: project?.scope,
    valor: project?.total ? brl(project.total) : null,
    prazo: project?.deadline && longDate(project.deadline),
    parcelas: installments
      .map((p) => `- ${brl(p.amount)}${p.description ? ` (${p.description})` : ""}, com vencimento em ${br(p.dueOn)}`)
      .join("\n"),
    plano: plan?.name,
    mensalidade: plan && brl(plan.monthlyFee),
    vencimento: plan && `todo dia ${Number(plan.firstDue.slice(8))} de cada mês`,
    inicio: plan && longDate(plan.firstDue),
    inclui: plan?.includes,
  };
  return Object.fromEntries(Object.entries(values).filter((entry): entry is [string, string] => Boolean(entry[1])));
}

export type Block = { type: "h1" | "h2" | "p"; text: string } | { type: "ul"; items: string[] };

/** Formatação mínima dos documentos: "# " título, "## " seção, "- " item de lista, linha em
    branco separa parágrafo. Markdown de verdade pediria uma dependência pra estes quatro casos. */
export function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join("\n") });
    paragraph = [];
  };

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith("# ")) {
      flush();
      blocks.push({ type: "h1", text: line.slice(2).trim() });
    } else if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("- ")) {
      flush();
      const last = blocks.at(-1);
      if (last?.type === "ul") last.items.push(line.slice(2).trim());
      else blocks.push({ type: "ul", items: [line.slice(2).trim()] });
    } else if (line) {
      paragraph.push(line);
    } else {
      flush();
    }
  }
  flush();
  return blocks;
}

/** **negrito** dentro de uma linha: os pedaços ímpares do split são os que estavam entre `**`. */
export const splitBold = (text: string): { text: string; bold: boolean }[] =>
  text
    .split(/\*\*(.+?)\*\*/)
    .map((part, i) => ({ text: part, bold: i % 2 === 1 }))
    .filter((part) => part.text);

/* ---------- modelos ---------- */

export interface TemplateFields {
  kind: DocKind;
  name: string;
  body: string;
}

export interface Template extends TemplateFields {
  id: number;
  /** "DD/MM/YYYY" */
  updatedAt: string;
}

export function readTemplate(form: FormData): { fields: TemplateFields } | { error: string } {
  const values = { name: field(form, "name"), body: field(form, "body") };
  const kind = oneOf(field(form, "kind"), DOC_KINDS);

  if (!kind) return { error: "Tipo inválido." };
  if (!values.name) return { error: "Dê um nome ao modelo." };
  if (!values.body) return { error: "O modelo está vazio." };
  if (tooLong(values, { name: DOC_LIMITS.name, body: DOC_LIMITS.body })) return { error: "Texto longo demais." };

  return { fields: { kind, ...values } };
}

const TEMPLATE_SELECT = `select id, kind, name, body, to_char(updated_at, 'DD/MM/YYYY') as "updatedAt" from document_templates`;

export async function listTemplates(): Promise<Template[]> {
  return (await db().query(`${TEMPLATE_SELECT} order by kind, name`)) as Template[];
}

export async function getTemplate(id: number): Promise<Template | null> {
  const [row] = (await db().query(`${TEMPLATE_SELECT} where id = $1`, [id])) as Template[];
  return row ?? null;
}

export async function createTemplate(t: TemplateFields): Promise<void> {
  await db()`insert into document_templates (kind, name, body) values (${t.kind}, ${t.name}, ${t.body})`;
}

export async function updateTemplate(id: number, t: TemplateFields): Promise<void> {
  await db()`update document_templates set kind = ${t.kind}, name = ${t.name}, body = ${t.body}, updated_at = now() where id = ${id}`;
}

/** Documento já gerado é cópia do texto, não referência: apagar o modelo não mexe nele. */
export async function deleteTemplate(id: number): Promise<void> {
  await db()`delete from document_templates where id = ${id}`;
}

/* ---------- documentos ---------- */

export interface Document {
  id: number;
  clientId: number;
  clientName: string;
  projectId: number | null;
  planId: number | null;
  kind: DocKind;
  title: string;
  body: string;
  status: DocStatus;
  /** "YYYY-MM-DD" */
  signedOn: string | null;
  signedUrl: string | null;
  /** "DD/MM/YYYY" */
  updatedAt: string;
}

const DOC_SELECT = `
  select d.id, d.client_id as "clientId", c.name as "clientName", d.project_id as "projectId", d.plan_id as "planId",
         d.kind, d.title, d.body, d.status, d.signed_url as "signedUrl",
         to_char(d.signed_on, 'YYYY-MM-DD') as "signedOn",
         to_char(d.updated_at, 'DD/MM/YYYY') as "updatedAt"
  from documents d join clients c on c.id = d.client_id`;

/** Sem cliente, todos — a tela de documentos; com cliente, os dele — a ficha. */
export async function listDocuments(clientId?: number): Promise<Document[]> {
  return (await (clientId
    ? db().query(`${DOC_SELECT} where d.client_id = $1 order by d.updated_at desc`, [clientId])
    : db().query(`${DOC_SELECT} order by d.updated_at desc`))) as Document[];
}

export async function getDocument(id: number): Promise<Document | null> {
  const [row] = (await db().query(`${DOC_SELECT} where d.id = $1`, [id])) as Document[];
  return row ?? null;
}

/** Gera um rascunho a partir do modelo, preenchido com o cliente e o projeto ou plano escolhido.
    `null` quando cliente ou modelo não existem. */
export async function generateDocument(input: {
  clientId: number;
  templateId: number;
  projectId: number | null;
  planId: number | null;
}): Promise<number | null> {
  const [client, template, project, plan, payments] = await Promise.all([
    getClient(input.clientId),
    getTemplate(input.templateId),
    input.projectId ? getProject(input.projectId) : null,
    input.planId ? getPlan(input.planId) : null,
    input.projectId ? listClientPayments(input.clientId) : [],
  ]);
  if (!client || !template) return null;

  /* projeto ou plano de outro cliente não entra: o vínculo vem de um campo do formulário */
  const ownProject = project?.clientId === client.id ? project : null;
  const ownPlan = plan?.clientId === client.id ? plan : null;
  const installments = ownProject
    ? payments.filter((p) => p.projectId === ownProject.id).sort((a, b) => a.dueOn.localeCompare(b.dueOn))
    : [];

  const body = fillTemplate(template.body, documentValues({ client, project: ownProject, plan: ownPlan, installments, today: todayInBrazil() }));
  const title = `${DOC_KIND_LABEL[template.kind]} — ${ownProject?.title ?? ownPlan?.name ?? client.name}`;

  const [row] = (await db()`
    insert into documents (client_id, project_id, plan_id, kind, title, body)
    values (${client.id}, ${ownProject?.id ?? null}, ${ownPlan?.id ?? null}, ${template.kind}, ${title}, ${body})
    returning id
  `) as { id: number }[];
  return row.id;
}

export function readDocumentText(form: FormData): { title: string; body: string } | { error: string } {
  const values = { title: field(form, "title"), body: field(form, "body") };
  if (!values.title) return { error: "Dê um título ao documento." };
  if (!values.body) return { error: "O documento está vazio." };
  if (tooLong(values, { title: DOC_LIMITS.title, body: DOC_LIMITS.body })) return { error: "Texto longo demais." };
  return values;
}

/** Só rascunho muda de texto. `false` quando o documento não é mais rascunho. */
export async function updateDocumentText(id: number, text: { title: string; body: string }): Promise<boolean> {
  const rows = await db()`
    update documents set title = ${text.title}, body = ${text.body}, updated_at = now()
    where id = ${id} and status = 'draft'
    returning id
  `;
  return rows.length > 0;
}

/** Rascunho ↔ enviado. Assinado não volta: a trava é o `status <> 'signed'`. */
export async function setDocumentSent(id: number, sent: boolean): Promise<void> {
  await db()`
    update documents set status = ${sent ? "sent" : "draft"}, updated_at = now()
    where id = ${id} and status = ${sent ? "draft" : "sent"}
  `;
}

export function readSignature(form: FormData): { signedOn: string; signedUrl: string | null } | { error: string } {
  const signedOn = optionalDate(field(form, "signedOn"));
  const signedUrl = field(form, "signedUrl");
  if (!signedOn) return { error: "Preencha a data da assinatura." };
  if (signedUrl.length > DOC_LIMITS.signedUrl) return { error: "Link longo demais." };
  if (signedUrl && !/^https:\/\//i.test(signedUrl)) return { error: "O link do PDF assinado precisa começar com https://" };
  return { signedOn, signedUrl: signedUrl || null };
}

/** Registra a assinatura e trava o documento de vez. */
export async function signDocument(id: number, signature: { signedOn: string; signedUrl: string | null }): Promise<void> {
  await db()`
    update documents set status = 'signed', signed_on = ${signature.signedOn}, signed_url = ${signature.signedUrl}, updated_at = now()
    where id = ${id} and status <> 'signed'
  `;
}

/** Assinado não sai. `false` quando o documento já estava assinado. */
export async function deleteDocument(id: number): Promise<boolean> {
  const rows = await db()`delete from documents where id = ${id} and status <> 'signed' returning id`;
  return rows.length > 0;
}
