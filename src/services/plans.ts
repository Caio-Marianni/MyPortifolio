/* caminho relativo com extensão: o `npm run check` roda isto no node puro */
import { TODAY, db, isForeignKeyError } from "./db.ts";
import { field, oneOf, optionalDate, tooLong } from "./form-input.ts";
import { parseMoney } from "./money.ts";

/* Plano mensal: manutenção e relatório. Cada "Recebi" grava um pagamento do mês que vence a
   seguir — o histórico é a própria lista de pagamentos, e o atraso sai dela. */

export type PlanStatus = "active" | "paused" | "ended";
export const PLAN_STATUSES: PlanStatus[] = ["active", "paused", "ended"];
export const PLAN_STATUS_LABEL: Record<PlanStatus, string> = { active: "Ativo", paused: "Pausado", ended: "Encerrado" };

export const PLAN_LIMITS = { name: 120, includes: 2000, gaProperty: 20 } as const;

/** Próximo vencimento: um mês depois do último pago, ou o primeiro vencimento se nada foi pago.
    Quem paga um de dois meses atrasados continua atrasado, em vez de ganhar os dias de graça.
    Precisa de `plans` no FROM da consulta. */
export const NEXT_DUE = `coalesce(
  (select max(pay.due_on) from payments pay where pay.plan_id = plans.id) + interval '1 month',
  plans.first_due
)::date`;

export interface PlanFields {
  name: string;
  /** centavos */
  monthlyFee: number;
  /** "YYYY-MM-DD"; o dia dela é o dia de vencimento de todo mês */
  firstDue: string;
  status: PlanStatus;
  includes: string | null;
  /** o plano inclui relatório mensal */
  reports: boolean;
  /** id numérico da propriedade do Google Analytics 4 */
  gaProperty: string | null;
}

export interface Plan extends PlanFields {
  id: number;
  clientId: number;
  /** "YYYY-MM-DD" */
  nextDue: string;
  overdue: boolean;
}

export function readPlan(form: FormData): { fields: PlanFields } | { error: string } {
  const values = { name: field(form, "name"), includes: field(form, "includes"), gaProperty: field(form, "gaProperty") };
  const monthlyFee = parseMoney(field(form, "fee"));
  const firstDue = optionalDate(field(form, "firstDue"));
  const status = oneOf(field(form, "status"), PLAN_STATUSES);

  if (!values.name) return { error: "Dê um nome ao plano, ex. Manutenção + relatório." };
  if (tooLong(values, PLAN_LIMITS)) return { error: "Algum campo passou do tamanho." };
  if (!monthlyFee) return { error: "Valor mensal inválido. Use o formato 1.500,00." };
  if (!firstDue) return { error: "Preencha o primeiro vencimento." };
  if (Number(firstDue.slice(8)) > 28) return { error: "Vencimento até o dia 28 — fevereiro não tem 29, 30 e 31." };
  if (!status) return { error: "Situação inválida." };
  if (values.gaProperty && !/^\d{6,15}$/.test(values.gaProperty)) {
    return { error: "ID da propriedade do GA4: só os números (Administrador → Detalhes da propriedade)." };
  }

  return {
    fields: {
      name: values.name,
      monthlyFee,
      firstDue,
      status,
      includes: values.includes || null,
      reports: form.get("reports") === "on",
      gaProperty: values.gaProperty || null,
    },
  };
}

const SELECT = `
  select id, client_id as "clientId", name, monthly_fee as "monthlyFee", status, includes, reports,
         ga_property as "gaProperty",
         to_char(first_due, 'YYYY-MM-DD') as "firstDue",
         to_char(${NEXT_DUE}, 'YYYY-MM-DD') as "nextDue",
         (status = 'active' and ${NEXT_DUE} < ${TODAY}) as overdue
  from plans`;

export async function listPlans(clientId: number): Promise<Plan[]> {
  return (await db().query(`${SELECT} where client_id = $1 order by (status = 'active') desc, id`, [clientId])) as Plan[];
}

export async function getPlan(id: number): Promise<Plan | null> {
  const [row] = (await db().query(`${SELECT} where id = $1`, [id])) as Plan[];
  return row ?? null;
}

export async function createPlan(clientId: number, p: PlanFields): Promise<void> {
  await db()`
    insert into plans (client_id, name, monthly_fee, first_due, status, includes, reports, ga_property)
    values (${clientId}, ${p.name}, ${p.monthlyFee}, ${p.firstDue}, ${p.status}, ${p.includes}, ${p.reports}, ${p.gaProperty})
  `;
}

export async function updatePlan(id: number, p: PlanFields): Promise<void> {
  await db()`
    update plans set
      name = ${p.name}, monthly_fee = ${p.monthlyFee}, first_due = ${p.firstDue}, status = ${p.status},
      includes = ${p.includes}, reports = ${p.reports}, ga_property = ${p.gaProperty}
    where id = ${id}
  `;
}

/** `false` quando o plano já tem pagamento registrado: aí ele é encerrado, não excluído. */
export async function deletePlan(id: number): Promise<boolean> {
  try {
    await db()`delete from plans where id = ${id}`;
    return true;
  } catch (error) {
    if (isForeignKeyError(error)) return false;
    throw error;
  }
}

/** "Recebi": grava o pagamento do mês que vence a seguir, com o valor atual do plano. */
export async function receivePlanPayment(id: number): Promise<void> {
  await db().query(
    `insert into payments (plan_id, description, amount, due_on, paid_on)
     select id, 'Mensalidade ' || to_char(${NEXT_DUE}, 'MM/YYYY'), monthly_fee, ${NEXT_DUE}, ${TODAY}
     from plans where id = $1`,
    [id],
  );
}
