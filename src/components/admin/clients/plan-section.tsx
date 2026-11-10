import Link from "next/link";
import { Pencil, Repeat, Trash2, Undo2 } from "lucide-react";
import { AddRow } from "@/components/admin/add-row";
import { Badge } from "@/components/admin/badge";
import { CollapsibleCard } from "@/components/admin/collapsible-card";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { Field, FormError, Select, TextArea } from "@/components/admin/fields";
import { IconLink } from "@/components/admin/icon-link";
import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON, BUTTON_SOLID, CARD_TITLE, INLINE_FORM, ITEM_CARD, NUM, flash } from "@/components/ui/styles";
import { br } from "@/services/dates";
import { MONEY_PATTERN, brl, moneyField } from "@/services/money";
import type { Payment } from "@/services/payments";
import { PLAN_LIMITS, PLAN_STATUSES, PLAN_STATUS_LABEL, type Plan } from "@/services/plans";
import { receivePlan, removePayment, removePlan, savePlan } from "@/app/admin/(painel)/clientes/[id]/actions";

/* Planos mensais do cliente. Cada um mostra o próximo vencimento e os últimos meses recebidos;
   o "Recebi" grava o mês que vence a seguir. O `id` de cada card (`plano-3`) é a âncora para onde
   as actions voltam (clientes/[id]/actions.ts). */

function PlanForm({ clientId, plan, erro, cancelHref }: { clientId: number; plan?: Plan; erro?: string; cancelHref: string }) {
  return (
    <form id={`plano-${plan?.id ?? "novo"}`} action={savePlan} className={`flex flex-col gap-5 ${INLINE_FORM}`}>
      <input type="hidden" name="clientId" value={clientId} />
      {plan && <input type="hidden" name="id" value={plan.id} />}
      <h3 className={CARD_TITLE}>{plan ? "Editar plano" : "Novo plano"}</h3>

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
          <input type="checkbox" name="reports" defaultChecked={plan?.reports ?? true} className="h-4 w-4 accent-accent" />
          Inclui relatório mensal
        </label>
      </div>

      <TextArea prefix="plan-" label="O que o plano inclui" name="includes" defaultValue={plan?.includes ?? ""} maxLength={PLAN_LIMITS.includes} />

      <FormError message={erro} />

      <div className="flex flex-wrap gap-2">
        <SubmitButton className={BUTTON_SOLID} icon="check">
          Salvar plano
        </SubmitButton>
        <Link href={cancelHref} scroll={false} className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function PlanCard({ plan, payments, page, excluir, feito }: { plan: Plan; payments: Payment[]; page: string; excluir?: string; feito?: string }) {
  const day = Number(plan.firstDue.slice(8));
  const anchor = `plano-${plan.id}`;

  return (
    <article id={anchor} className={`flex flex-col gap-4 ${ITEM_CARD} ${flash(feito === anchor)}`}>
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="text-[16px] font-semibold">{plan.name}</h3>
        <Badge tone={plan.status === "active" ? "ok" : "neutral"}>{PLAN_STATUS_LABEL[plan.status]}</Badge>
        {plan.overdue && <Badge tone="danger">Atrasado</Badge>}
        <span className="-my-1 ml-auto flex">
          <IconLink href={`${page}?plano=${plan.id}`} label="Editar plano" icon={Pencil} />
          <IconLink href={`${page}?excluir=plano-${plan.id}`} label="Excluir plano" icon={Trash2} danger />
        </span>
      </header>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-ui sm:grid-cols-4">
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
            <dt className="text-meta text-ink/60">{plan.overdue ? "Em atraso desde" : "Próximo vencimento"}</dt>
            <dd className={`${NUM} ${plan.overdue ? "font-semibold text-danger" : ""}`}>{br(plan.nextDue)}</dd>
          </div>
        )}
        {plan.overdueAmount > 0 && (
          <div>
            <dt className="text-meta text-ink/60">Vencido</dt>
            <dd className={`${NUM} font-semibold text-danger`}>{brl(plan.overdueAmount)}</dd>
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
                  fields={{ clientId: plan.clientId, id: payment.id, anchor }}
                  message="O mês volta a ficar em aberto."
                  cancelHref={page}
                />
              ) : (
                <span className="-my-1.5">
                  <IconLink href={`${page}?excluir=pagamento-${payment.id}`} label="Desfazer recebimento" icon={Undo2} danger />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {excluir === `plano-${plan.id}` ? (
        <DeleteConfirm action={removePlan} fields={{ clientId: plan.clientId, id: plan.id }} message="Exclui o plano." cancelHref={page} />
      ) : (
        plan.status === "active" && (
          /* a ação do plano: registra o mês que vence a seguir, o que aparece no botão */
          <form action={receivePlan}>
            <input type="hidden" name="clientId" value={plan.clientId} />
            <input type="hidden" name="id" value={plan.id} />
            <SubmitButton className={BUTTON_SOLID} icon="check">
              Recebi {br(plan.nextDue).slice(3)}
            </SubmitButton>
          </form>
        )
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
  feito,
  forceOpen,
}: {
  clientId: number;
  plans: Plan[];
  payments: Payment[];
  /** `?plano=`: "novo" ou o id em edição */
  open?: string;
  excluir?: string;
  erro?: string;
  /** `?feito=`: o item que a última ação mexeu, que pisca ao chegar */
  feito?: string;
  /** a URL aponta pra dentro do bloco: abre mesmo se estava recolhido */
  forceOpen: boolean;
}) {
  const page = `/admin/clientes/${clientId}`;
  const monthly = plans.filter((plan) => plan.status === "active").reduce((sum, plan) => sum + plan.monthlyFee, 0);

  return (
    <CollapsibleCard
      id="planos"
      icon={<Repeat className="h-4 w-4" strokeWidth={2.25} />}
      title="Planos mensais"
      count={plans.length}
      summary={monthly > 0 && `${brl(monthly)}/mês`}
      forceOpen={forceOpen}
    >
      {plans.length === 0 && open !== "novo" && <p className="text-ui text-ink/60">Sem plano mensal — só projeto, por enquanto.</p>}

      {/* cada plano um cartão; o formulário aberto entra no lugar dele */}
      {plans.map((plan) =>
        open === String(plan.id) ? (
          <PlanForm key={plan.id} clientId={clientId} plan={plan} erro={erro} cancelHref={page} />
        ) : (
          <PlanCard key={plan.id} plan={plan} payments={payments.filter((payment) => payment.planId === plan.id)} page={page} excluir={excluir} feito={feito} />
        ),
      )}

      {/* adicionar fica no fim, onde o plano novo vai entrar; o formulário abre no lugar da faixa */}
      {open === "novo" ? <PlanForm clientId={clientId} erro={erro} cancelHref={page} /> : <AddRow href={`${page}?plano=novo`}>Novo plano</AddRow>}
    </CollapsibleCard>
  );
}
