import Link from "next/link";
import { ArrowUUpLeftIcon, CalendarDotsIcon, ChartBarIcon, CurrencyCircleDollarIcon, FlagIcon, HashIcon, ListChecksIcon, PencilSimpleIcon, PlusIcon, RepeatIcon, TagIcon, TrashIcon } from "@phosphor-icons/react/ssr";
import { AddRow } from "@/components/admin/add-row";
import { Badge } from "@/components/admin/badge";
import { Field, FormError, Select, TextArea } from "@/components/admin/fields";
import { FormCard, FormCardDetails } from "@/components/admin/form-card";
import { IconLink } from "@/components/admin/icon-link";
import { ModalActions } from "@/components/admin/modal-actions";
import { ReceiveForm } from "@/components/admin/receive-form";
import { SectionCard } from "@/components/admin/section-card";
import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON_ADD, BUTTON_SOLID, FOCUS, ITEM_CARD, NUM, flash } from "@/components/ui/styles";
import { br, monthName, relativeDays, todayInBrazil } from "@/services/dates";
import { MONEY_PATTERN, brl, moneyField } from "@/services/money";
import type { Payment } from "@/services/payments";
import { PLAN_LIMITS, PLAN_STATUSES, PLAN_STATUS_LABEL, type Plan } from "@/services/plans";
import type { QueueItem } from "@/services/reports";
import { receivePlan, savePlan } from "@/app/admin/(painel)/clientes/[id]/actions";

/* Planos mensais do cliente. Cada um mostra o próximo vencimento e o último mês recebido; o
   "Recebi" grava o mês que vence a seguir. Criar, editar e excluir abrem em janela (ClientModals,
   pela URL: `?plano=novo`, `?plano=3`, `?excluir=plano-3`). O `id` de cada card (`plano-3`) é a
   âncora para onde as actions voltam (clientes/[id]/actions.ts). */

/** O formulário do plano, dentro da janela "Novo plano" / "Editar plano". */
export function PlanForm({ clientId, plan, erro, cancelHref }: { clientId: number; plan?: Plan; erro?: string; cancelHref: string }) {
  return (
    <form action={savePlan} className="flex flex-col gap-4">
      <input type="hidden" name="clientId" value={clientId} />
      {plan && <input type="hidden" name="id" value={plan.id} />}

      <FormCard icon={RepeatIcon} title="Plano" columns={3}>
        <Field
          className="sm:col-span-3"
          prefix="plan-"
          icon={TagIcon}
          label="Nome do plano"
          name="name"
          required
          autoFocus
          placeholder="Manutenção + relatório"
          defaultValue={plan?.name}
          maxLength={PLAN_LIMITS.name}
        />
        <Field
          prefix="plan-"
          icon={CurrencyCircleDollarIcon}
          label="Valor mensal (R$)"
          name="fee"
          required
          inputMode="decimal"
          pattern={MONEY_PATTERN}
          title="Formato 1.500,00"
          placeholder="350,00"
          defaultValue={plan ? moneyField(plan.monthlyFee) : ""}
        />
        <Field prefix="plan-" icon={CalendarDotsIcon} label="1º vencimento (dia até 28)" name="firstDue" type="date" required defaultValue={plan?.firstDue} />
        <Select
          prefix="plan-"
          icon={FlagIcon}
          label="Situação"
          name="status"
          defaultValue={plan?.status ?? "active"}
          options={PLAN_STATUSES.map((status) => ({ value: status, label: PLAN_STATUS_LABEL[status] }))}
        />
      </FormCard>

      <FormCard icon={ChartBarIcon} title="Relatório mensal" hint="os acessos do site, todo dia 3">
        <label className="flex items-center gap-2.5 self-end pb-3 text-ui text-ink/75">
          <input type="checkbox" name="reports" defaultChecked={plan?.reports ?? true} className="h-4 w-4 accent-accent" />
          Inclui relatório mensal
        </label>
        <Field
          prefix="plan-"
          icon={HashIcon}
          label="ID da propriedade do GA4"
          name="gaProperty"
          inputMode="numeric"
          placeholder="123456789"
          defaultValue={plan?.gaProperty ?? ""}
          maxLength={PLAN_LIMITS.gaProperty}
        />
      </FormCard>

      {/* vai na proposta e no contrato do plano; recolhido até ter algo escrito */}
      <FormCardDetails icon={ListChecksIcon} title="O que o plano inclui" hint={plan?.includes ? undefined : "opcional"} open={Boolean(plan?.includes)}>
        <TextArea prefix="plan-" label={<span className="sr-only">O que o plano inclui</span>} name="includes" defaultValue={plan?.includes ?? ""} maxLength={PLAN_LIMITS.includes} />
      </FormCardDetails>

      <FormError message={erro} />

      <ModalActions cancelHref={cancelHref}>
        <SubmitButton className={plan ? BUTTON_SOLID : BUTTON_ADD} icon={plan ? "check" : "plus"}>
          {plan ? "Salvar plano" : "Criar plano"}
        </SubmitButton>
      </ModalActions>
    </form>
  );
}

/** "Relatório de outubro: gerado, falta enviar" — a situação do relatório do mês que fechou, com o
    link pra ele (ou pra página do mês, se ainda não foi gerado). Só quando o plano deve relatório
    nesse mês (`listQueue`). */
function ReportLine({ report, month }: { report: QueueItem; month: string }) {
  const [status, href] = report.sentOn
    ? [`enviado em ${br(report.sentOn).slice(0, 5)}`, `/admin/relatorios/${report.reportId}`]
    : report.reportId
      ? ["gerado, falta enviar", `/admin/relatorios/${report.reportId}`]
      : ["não gerado", `/admin/relatorios?mes=${month}`];

  return (
    <p className="flex flex-wrap items-center gap-x-2 text-ui">
      <ChartBarIcon className="h-4 w-4 text-ink/45" aria-hidden weight="bold" />
      <span className="text-ink/60">Relatório de {monthName(month)}:</span>
      <Link href={href} className={`rounded underline decoration-ink/25 underline-offset-4 hover:decoration-ink ${report.sentOn ? "" : "font-semibold"} ${FOCUS}`}>
        {status}
      </Link>
    </p>
  );
}

function PlanCard({ plan, payments, report, reportMonth, page, feito }: { plan: Plan; payments: Payment[]; report?: QueueItem; reportMonth: string; page: string; feito?: string }) {
  const day = Number(plan.firstDue.slice(8));
  const anchor = `plano-${plan.id}`;
  /* a consulta vem do mais recente pro mais antigo: o primeiro é o último que entrou */
  const last = payments.find((payment) => payment.paidOn);

  return (
    <article id={anchor} className={`flex flex-col gap-4 ${ITEM_CARD} ${flash(feito === anchor)}`}>
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="text-[15px] font-semibold">{plan.name}</h3>
        {/* etiqueta só quando foge do normal: plano ativo e em dia não precisa dizer nada */}
        {plan.status !== "active" && <Badge>{PLAN_STATUS_LABEL[plan.status]}</Badge>}
        {plan.overdue && <Badge tone="danger">Atrasado</Badge>}
        <span className="-my-1 ml-auto flex">
          <IconLink href={`${page}?plano=${plan.id}`} label="Editar plano" icon={PencilSimpleIcon} />
          <IconLink href={`${page}?excluir=plano-${plan.id}`} label="Excluir plano" icon={TrashIcon} danger />
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
            <dd className={`${NUM} ${plan.overdue ? "font-semibold text-danger" : ""}`}>
              {br(plan.nextDue)} <span className="text-meta font-normal opacity-75">· {relativeDays(plan.nextDue, todayInBrazil())}</span>
            </dd>
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

      {report && <ReportLine report={report} month={reportMonth} />}

      {/* só o último recebimento, com o desfazer; o histórico inteiro está em "Recebido" */}
      {last?.paidOn && (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-ink/10 py-1.5 text-ui">
          <span className="text-meta text-ink/60">Último</span>
          <span className="text-ink/75">{last.description}</span>
          <span className={`ml-auto ${NUM}`}>{brl(last.amount)}</span>
          <span className={`text-ink/60 ${NUM}`}>recebido {br(last.paidOn)}</span>
          <span className="-my-1">
            <IconLink href={`${page}?excluir=pagamento-${last.id}`} label="Desfazer recebimento" icon={ArrowUUpLeftIcon} danger />
          </span>
        </p>
      )}

      {plan.status === "active" && (
        /* a ação do plano: registra o mês que vence a seguir, o que aparece no botão */
        <ReceiveForm action={receivePlan} fields={{ clientId: plan.clientId, id: plan.id }} label={`Recebi ${br(plan.nextDue).slice(3)}`} solid />
      )}
    </article>
  );
}

export function PlanSection({
  clientId,
  plans,
  payments,
  reports,
  reportMonth,
  feito,
}: {
  clientId: number;
  plans: Plan[];
  payments: Payment[];
  /** a fila de relatórios de `reportMonth` deste cliente */
  reports: QueueItem[];
  reportMonth: string;
  feito?: string;
}) {
  const page = `/admin/clientes/${clientId}`;
  const monthly = plans.filter((plan) => plan.status === "active").reduce((sum, plan) => sum + plan.monthlyFee, 0);

  return (
    <SectionCard
      id="planos"
      icon={<RepeatIcon className="h-4 w-4" weight="bold" aria-hidden />}
      title="Planos mensais"
      count={plans.length}
      summary={monthly > 0 && `${brl(monthly)}/mês`}
      action={plans.length > 0 && <IconLink href={`${page}?plano=novo`} label="Novo plano" icon={PlusIcon} />}
    >
      {plans.length === 0 ? (
        <AddRow href={`${page}?plano=novo`}>Novo plano</AddRow>
      ) : (
        plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            payments={payments.filter((payment) => payment.planId === plan.id)}
            report={reports.find((report) => report.planId === plan.id)}
            reportMonth={reportMonth}
            page={page}
            feito={feito}
          />
        ))
      )}
    </SectionCard>
  );
}
