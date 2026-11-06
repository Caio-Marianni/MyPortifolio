/* caminho relativo com extensão: o `npm run check` roda isto no node puro */
import { TODAY, db } from "./db.ts";
import { field, optionalDate } from "./form-input.ts";
import { parseMoney } from "./money.ts";

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
