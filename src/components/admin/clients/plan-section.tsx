import Link from "next/link";
import { Badge } from "@/components/admin/badge";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { Field, FormError, Select, TextArea } from "@/components/admin/fields";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE, NUM } from "@/components/ui/styles";
import { br } from "@/services/dates";
import { MONEY_PATTERN, brl, moneyField } from "@/services/money";
import type { Payment } from "@/services/payments";
import { PLAN_LIMITS, PLAN_STATUSES, PLAN_STATUS_LABEL, type Plan } from "@/services/plans";
import { receivePlan, removePayment, removePlan, savePlan } from "@/app/admin/(painel)/clientes/[id]/actions";

/* Planos mensais do cliente. Cada um mostra o próximo vencimento e os últimos meses recebidos;
   o "Recebi" grava o mês que vence a seguir. */

function PlanForm({ clientId, plan, erro, cancelHref }: { clientId: number; plan?: Plan; erro?: string; cancelHref: string }) {
  return (
    <form action={savePlan} className="flex flex-col gap-5">
      <input type="hidden" name="clientId" value={clientId} />
      {plan && <input type="hidden" name="id" value={plan.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field prefix="plan-" label="Nome do plano" name="name" required placeholder="Manutenção + relatório" defaultValue={plan?.name} maxLength={PLAN_LIMITS.name} />
        <Field
          prefix="plan-"
          label="Valor mensal (R$)"
          name="fee"
          required
          inputMode="decimal"
          pattern={MONEY_PATTERN}
          title="Formato 1.500,00"
          placeholder="350,00"
          defaultValue={plan ? moneyField(plan.monthlyFee) : ""}
        />
        <Field
          prefix="plan-"
          label="Primeiro vencimento (dia até 28)"
          name="firstDue"
          type="date"
          required
          defaultValue={plan?.firstDue}
        />
        <Select
          prefix="plan-"
          label="Situação"
          name="status"
          defaultValue={plan?.status ?? "active"}
          options={PLAN_STATUSES.map((status) => ({ value: status, label: PLAN_STATUS_LABEL[status] }))}
        />
        <Field
          prefix="plan-"
          label="ID da propriedade do GA4 (pro relatório)"
          name="gaProperty"
          inputMode="numeric"
          placeholder="123456789"
          defaultValue={plan?.gaProperty ?? ""}
          maxLength={PLAN_LIMITS.gaProperty}
        />
        <label className="flex items-center gap-2.5 self-end pb-2 text-ui text-ink/75">
          <input type="checkbox" name="reports" defaultChecked={plan?.reports ?? true} className="h-4 w-4 accent-[rgb(var(--accent))]" />
          Inclui relatório mensal
        </label>
      </div>

      <TextArea prefix="plan-" label="O que o plano inclui" name="includes" defaultValue={plan?.includes ?? ""} maxLength={PLAN_LIMITS.includes} />

      <FormError message={erro} />

      <div className="flex flex-wrap gap-2">
        <button type="submit" className={BUTTON_SOLID}>
          Salvar plano
        </button>
        <Link href={cancelHref} className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function PlanCard({ plan, payments, page, excluir }: { plan: Plan; payments: Payment[]; page: string; excluir?: string }) {
  const day = Number(plan.firstDue.slice(8));

  return (
    <article className="flex flex-col gap-4 border-t border-ink/10 pt-5 first:border-t-0 first:pt-0">
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="text-[16px] font-semibold">{plan.name}</h3>
        <Badge tone={plan.status === "active" ? "ok" : "neutral"}>{PLAN_STATUS_LABEL[plan.status]}</Badge>
        {plan.overdue && <Badge tone="danger">Atrasado</Badge>}
      </header>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-ui sm:grid-cols-4">
        <div>
          <dt className="text-meta text-ink/60">Mensalidade</dt>
          <dd className={NUM}>{brl(plan.monthlyFee)}</dd>
        </div>
        <div>
          <dt className="text-meta text-ink/60">Vence</dt>
          <dd>todo dia {day}</dd>
        </div>
        {plan.status === "active" && (
          <div>
            <dt className="text-meta text-ink/60">Próximo vencimento</dt>
            <dd className={`${NUM} ${plan.overdue ? "font-semibold text-danger" : ""}`}>{br(plan.nextDue)}</dd>
          </div>
        )}
        <div>
          <dt className="text-meta text-ink/60">Relatório</dt>
          <dd>{plan.reports ? (plan.gaProperty ? "Mensal, com GA4" : "Mensal, falta o GA4") : "Não inclui"}</dd>
        </div>
      </dl>

      {plan.includes && <p className="whitespace-pre-line text-ui leading-relaxed text-ink/75">{plan.includes}</p>}

      {payments.length > 0 && (
        <ul className="divide-y divide-ink/10 border-y border-ink/10 text-ui">
          {payments.slice(0, 4).map((payment) => (
            <li key={payment.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
              <span className="text-ink/75">{payment.description}</span>
              <span className={`ml-auto ${NUM}`}>{brl(payment.amount)}</span>
              <span className={`text-ink/60 ${NUM}`}>recebido {payment.paidOn && br(payment.paidOn)}</span>
              {excluir === `pagamento-${payment.id}` ? (
                <DeleteConfirm
                  action={removePayment}
                  fields={{ clientId: plan.clientId, id: payment.id }}
                  message="O mês volta a ficar em aberto."
                  cancelHref={page}
                />
              ) : (
                <Link href={`${page}?excluir=pagamento-${payment.id}`} className="text-meta text-ink/50 hover:text-danger">
                  desfazer
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}

      {excluir === `plano-${plan.id}` ? (
        <DeleteConfirm action={removePlan} fields={{ clientId: plan.clientId, id: plan.id }} message="Exclui o plano." cancelHref={page} />
      ) : (
        <form action={receivePlan} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="clientId" value={plan.clientId} />
          <input type="hidden" name="id" value={plan.id} />
          {plan.status === "active" && (
            <button type="submit" className={BUTTON_SOLID}>
              Recebi {br(plan.nextDue).slice(3)}
            </button>
          )}
          <Link href={`${page}?plano=${plan.id}`} className={`${BUTTON} ml-auto`}>
            Editar
          </Link>
          <Link href={`${page}?excluir=plano-${plan.id}`} className={`${BUTTON} text-danger`}>
            Excluir
          </Link>
        </form>
      )}
    </article>
  );
}

export function PlanSection({
  clientId,
  plans,
  payments,
  open,
  excluir,
  erro,
}: {
  clientId: number;
  plans: Plan[];
  payments: Payment[];
  /** `?plano=`: "novo" ou o id em edição */
  open?: string;
  excluir?: string;
  erro?: string;
}) {
  const page = `/admin/clientes/${clientId}`;

  return (
    <section className={`${CARD} flex flex-col gap-5`}>
      <header className="flex items-center justify-between gap-3">
        <h2 className={CARD_TITLE}>Planos mensais</h2>
        {open !== "novo" && (
          <Link href={`${page}?plano=novo`} className={BUTTON}>
            Novo plano
          </Link>
        )}
      </header>

      {open === "novo" && <PlanForm clientId={clientId} erro={erro} cancelHref={page} />}

      {plans.length === 0 && open !== "novo" && <p className="text-ui text-ink/60">Sem plano mensal — só projeto, por enquanto.</p>}

      {plans.map((plan) =>
        open === String(plan.id) ? (
          <PlanForm key={plan.id} clientId={clientId} plan={plan} erro={erro} cancelHref={page} />
        ) : (
          <PlanCard key={plan.id} plan={plan} payments={payments.filter((payment) => payment.planId === plan.id)} page={page} excluir={excluir} />
        ),
      )}
    </section>
  );
}
