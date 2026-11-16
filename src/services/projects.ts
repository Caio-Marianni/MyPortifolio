/* caminho relativo com extensão: o `npm run check` roda isto no node puro */
import { TODAY, db, isForeignKeyError } from "./db.ts";
import { relativeDays } from "./dates.ts";
import { field, oneOf, optionalDate, tooLong } from "./form-input.ts";
import { parseMoney } from "./money.ts";

/* Projeto de entrega única: escopo, valor, prazo e as parcelas combinadas (services/payments.ts). */

export type ProjectStatus = "proposal" | "approved" | "in_progress" | "delivered" | "canceled";
export const PROJECT_STATUSES: ProjectStatus[] = ["proposal", "approved", "in_progress", "delivered", "canceled"];
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  proposal: "Proposta",
  approved: "Aprovado",
  in_progress: "Em andamento",
  delivered: "Entregue",
  canceled: "Cancelado",
};

export const PROJECT_LIMITS = { title: 160, scope: 4000, notes: 2000 } as const;

export interface ProjectFields {
  title: string;
  scope: string | null;
  /** centavos; 0 = ainda a combinar */
  total: number;
  /** "YYYY-MM-DD" */
  deadline: string | null;
  status: ProjectStatus;
  notes: string | null;
}

export interface Project extends ProjectFields {
  id: number;
  clientId: number;
  /** já recebido, em centavos */
  paid: number;
  /** soma das parcelas combinadas, recebidas ou não */
  scheduled: number;
  /** alguma parcela vencida e não recebida */
  overdue: boolean;
}

export function readProject(form: FormData): { fields: ProjectFields } | { error: string } {
  const values = { title: field(form, "title"), scope: field(form, "scope"), notes: field(form, "notes") };
  const total = parseMoney(field(form, "total"));
  const deadline = optionalDate(field(form, "deadline"));
  const status = oneOf(field(form, "status"), PROJECT_STATUSES);

  if (!values.title) return { error: "Dê um nome ao projeto." };
  if (tooLong(values, PROJECT_LIMITS)) return { error: "Algum campo passou do tamanho." };
  if (total === null) return { error: "Valor inválido. Use o formato 1.500,00." };
  if (deadline === undefined) return { error: "Prazo inválido." };
  if (!status) return { error: "Situação inválida." };

  return {
    fields: { title: values.title, scope: values.scope || null, total, deadline, status, notes: values.notes || null },
  };
}

const SELECT = `
  select pr.id, pr.client_id as "clientId", pr.title, pr.scope, pr.total, pr.status, pr.notes,
         to_char(pr.deadline, 'YYYY-MM-DD') as deadline,
         (select coalesce(sum(amount), 0)::int from payments where project_id = pr.id and paid_on is not null) as paid,
         (select coalesce(sum(amount), 0)::int from payments where project_id = pr.id) as scheduled,
         (pr.status <> 'canceled' and exists (
           select 1 from payments where project_id = pr.id and paid_on is null and due_on < ${TODAY}
         )) as overdue
  from projects pr`;

/** Em andamento em cima, entregues e cancelados no fim. */
export async function listProjects(clientId: number): Promise<Project[]> {
  return (await db().query(
    `${SELECT} where pr.client_id = $1
     order by array_position(array['in_progress', 'approved', 'proposal', 'delivered', 'canceled'], pr.status), pr.id desc`,
    [clientId],
  )) as Project[];
}

export async function getProject(id: number): Promise<Project | null> {
  const [row] = (await db().query(`${SELECT} where pr.id = $1`, [id])) as Project[];
  return row ?? null;
}

/** Devolve o id do projeto novo: a ficha rola até ele. */
export async function createProject(clientId: number, p: ProjectFields): Promise<number> {
  const [row] = (await db()`
    insert into projects (client_id, title, scope, total, deadline, status, notes)
    values (${clientId}, ${p.title}, ${p.scope}, ${p.total}, ${p.deadline}, ${p.status}, ${p.notes})
    returning id
  `) as { id: number }[];
  return row.id;
}

/* O caminho de um projeto, na ordem; cancelado fica fora dele. */
const FLOW: ProjectStatus[] = ["proposal", "approved", "in_progress", "delivered"];

/** A etapa seguinte do caminho; null no fim (entregue) ou fora dele (cancelado). */
export function nextProjectStatus(status: ProjectStatus): ProjectStatus | null {
  const index = FLOW.indexOf(status);
  return index >= 0 && index < FLOW.length - 1 ? FLOW[index + 1] : null;
}

/** O prazo em palavras enquanto o projeto não foi entregue: "entrega em 12 dias", ou "prazo
    passou há 3 dias", que a ficha pinta de vermelho. Entregue ou cancelado não tem prazo a cumprir. */
export function deadlineNote(project: Pick<Project, "deadline" | "status">, today: string): { text: string; late: boolean } | null {
  if (!project.deadline || project.status === "delivered" || project.status === "canceled") return null;
  const late = project.deadline < today;
  return { text: `${late ? "prazo passou" : "entrega"} ${relativeDays(project.deadline, today)}`, late };
}

/** "Avançar para …": a próxima etapa sem abrir o formulário. Só muda se a etapa ainda for a que
    estava na tela — dois cliques seguidos não pulam duas etapas. */
export async function advanceProject(id: number): Promise<void> {
  const sql = db();
  const [row] = (await sql`select status from projects where id = ${id}`) as { status: ProjectStatus }[];
  const next = row ? nextProjectStatus(row.status) : null;
  if (next) await sql`update projects set status = ${next} where id = ${id} and status = ${row.status}`;
}

export async function updateProject(id: number, p: ProjectFields): Promise<void> {
  await db()`
    update projects set
      title = ${p.title}, scope = ${p.scope}, total = ${p.total}, deadline = ${p.deadline},
      status = ${p.status}, notes = ${p.notes}
    where id = ${id}
  `;
}

/** Parcelas não recebidas saem junto; `false` quando alguma já foi recebida — aí o projeto é
    cancelado, não excluído, e o dinheiro continua no histórico. */
export async function deleteProject(id: number): Promise<boolean> {
  const sql = db();
  try {
    await sql.transaction([
      sql`delete from payments where project_id = ${id} and paid_on is null`,
      sql`delete from projects where id = ${id}`,
    ]);
    return true;
  } catch (error) {
    if (isForeignKeyError(error)) return false;
    throw error;
  }
}
