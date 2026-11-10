/* caminho relativo com extensão: o `npm run check` roda isto no node puro */
import { TODAY, db } from "./db.ts";
import { field, optionalDate } from "./form-input.ts";
import { parseMoney } from "./money.ts";
import type { Plan } from "./plans.ts";
import type { Project } from "./projects.ts";

/* Pagamentos dos dois tipos de contrato. Do plano, cada linha é um mês recebido (gravada pelo
   "Recebi" em services/plans.ts). Do projeto, cada linha é uma parcela combinada — nasce sem
   `paid_on` e ganha a data quando chega. */

export const PAYMENT_LIMITS = { description: 120 } as const;

export interface Payment {
  id: number;
  planId: number | null;
  projectId: number | null;
  description: string | null;
  /** centavos */
  amount: number;
  /** "YYYY-MM-DD" */
  dueOn: string;
  /** "YYYY-MM-DD"; null = a receber */
  paidOn: string | null;
  overdue: boolean;
}

export interface InstallmentFields {
  description: string | null;
  amount: number;
  dueOn: string;
}

export function readInstallment(form: FormData): { fields: InstallmentFields } | { error: string } {
  const description = field(form, "description");
  const amount = parseMoney(field(form, "amount"));
  const dueOn = optionalDate(field(form, "dueOn"));

  if (description.length > PAYMENT_LIMITS.description) return { error: "Descrição muito longa." };
  if (!amount) return { error: "Valor inválido. Use o formato 1.500,00." };
  if (!dueOn) return { error: "Preencha o vencimento da parcela." };

  return { fields: { description: description || null, amount, dueOn } };
}

/** Tudo do cliente, de plano e de projeto; a ficha separa por contrato. */
export async function listClientPayments(clientId: number): Promise<Payment[]> {
  return (await db().query(
    `select pay.id, pay.plan_id as "planId", pay.project_id as "projectId", pay.description, pay.amount,
            to_char(pay.due_on, 'YYYY-MM-DD') as "dueOn",
            to_char(pay.paid_on, 'YYYY-MM-DD') as "paidOn",
            (pay.paid_on is null and pay.due_on < ${TODAY}) as overdue
     from payments pay
     left join plans pl on pl.id = pay.plan_id
     left join projects pr on pr.id = pay.project_id
     where coalesce(pl.client_id, pr.client_id) = $1
     order by pay.due_on desc, pay.id desc`,
    [clientId],
  )) as Payment[];
}

export async function addInstallment(projectId: number, i: InstallmentFields): Promise<void> {
  await db()`
    insert into payments (project_id, description, amount, due_on)
    values (${projectId}, ${i.description}, ${i.amount}, ${i.dueOn})
  `;
}

/** Parcela recebida hoje. Só a que ainda estava em aberto: clicar duas vezes não muda a data. */
export async function receiveInstallment(id: number): Promise<void> {
  await db().query(`update payments set paid_on = ${TODAY} where id = $1 and paid_on is null`, [id]);
}

/** Desfaz um registro errado: parcela volta a não existir, mensalidade volta a ficar em aberto. */
export async function deletePayment(id: number): Promise<void> {
  await db()`delete from payments where id = ${id}`;
}

/** O dinheiro do cliente de relance, no topo da ficha. */
export interface ClientMoney {
  /** soma dos planos ativos, por mês */
  monthly: number;
  activePlans: number;
  /** tudo que já entrou, de plano e de projeto */
  received: number;
  /** a receber: parcelas de projeto em aberto mais mensalidades atrasadas */
  open: number;
  /** a parte de `open` que já venceu */
  overdue: number;
  /** o próximo vencimento que ainda não passou */
  next: { dueOn: string; label: string; amount: number } | null;
}

/** Monta o resumo com o que a ficha já carregou — nada de consulta a mais. Projeto cancelado não
    conta: parcela dele não é mais dinheiro a receber. */
export function clientMoney(plans: Plan[], projects: Project[], payments: Payment[]): ClientMoney {
  const active = plans.filter((plan) => plan.status === "active");
  const liveProjects = new Map(projects.filter((project) => project.status !== "canceled").map((project) => [project.id, project]));
  const open = payments.flatMap((payment) => {
    const project = payment.projectId === null ? undefined : liveProjects.get(payment.projectId);
    return project && !payment.paidOn ? [{ payment, project }] : [];
  });
  const sum = (amounts: number[]) => amounts.reduce((total, amount) => total + amount, 0);
  const planOverdue = sum(active.map((plan) => plan.overdueAmount));

  const upcoming = [
    ...active.filter((plan) => !plan.overdue).map((plan) => ({ dueOn: plan.nextDue, label: `Mensalidade · ${plan.name}`, amount: plan.monthlyFee })),
    ...open
      .filter(({ payment }) => !payment.overdue)
      .map(({ payment, project }) => ({ dueOn: payment.dueOn, label: `Parcela · ${project.title}`, amount: payment.amount })),
  ].sort((a, b) => a.dueOn.localeCompare(b.dueOn));

  return {
    monthly: sum(active.map((plan) => plan.monthlyFee)),
    activePlans: active.length,
    received: sum(payments.filter((payment) => payment.paidOn).map((payment) => payment.amount)),
    open: sum(open.map(({ payment }) => payment.amount)) + planOverdue,
    overdue: sum(open.filter(({ payment }) => payment.overdue).map(({ payment }) => payment.amount)) + planOverdue,
    next: upcoming[0] ?? null,
  };
}

/** O que entrou, mês a mês, do mais recente pro mais antigo: a linha do tempo do "Recebido". */
export function receivedByMonth(payments: Payment[]): { month: string; total: number; payments: (Payment & { paidOn: string })[] }[] {
  const paid = payments
    .filter((payment): payment is Payment & { paidOn: string } => payment.paidOn !== null)
    .sort((a, b) => b.paidOn.localeCompare(a.paidOn));
  const months: { month: string; total: number; payments: (Payment & { paidOn: string })[] }[] = [];
  for (const payment of paid) {
    const month = payment.paidOn.slice(0, 7);
    const last = months.at(-1);
    if (last?.month === month) {
      last.payments.push(payment);
      last.total += payment.amount;
    } else {
      months.push({ month, total: payment.amount, payments: [payment] });
    }
  }
  return months;
}
