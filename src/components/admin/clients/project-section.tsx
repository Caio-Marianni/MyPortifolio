import { CalendarDotsIcon, CurrencyCircleDollarIcon, FlagIcon, KanbanIcon, MoneyIcon, NoteIcon, PencilSimpleIcon, PlusIcon, ScrollIcon, TagIcon, TrashIcon } from "@phosphor-icons/react/ssr";
import { AddRow } from "@/components/admin/add-row";
import { Badge } from "@/components/admin/badge";
import { Field, FormError, Select, TextArea } from "@/components/admin/fields";
import { FormCard, FormCardDetails } from "@/components/admin/form-card";
import { IconLink } from "@/components/admin/icon-link";
import { ModalActions } from "@/components/admin/modal-actions";
import { ReceiveForm } from "@/components/admin/receive-form";
import { SectionCard } from "@/components/admin/section-card";
import { Steps } from "@/components/admin/steps";
import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON, BUTTON_ADD, BUTTON_SOLID, FOCUS, ITEM_CARD, NUM, flash } from "@/components/ui/styles";
import { br, relativeDays, todayInBrazil } from "@/services/dates";
import { MONEY_PATTERN, brl, moneyField } from "@/services/money";
import { PAYMENT_LIMITS, type Payment } from "@/services/payments";
import {
  PROJECT_LIMITS,
  PROJECT_STATUSES,
  PROJECT_STATUS_LABEL,
  deadlineNote,
  nextProjectStatus,
  type Project,
  type ProjectStatus,
} from "@/services/projects";
import { advanceStage, receivePayment, saveInstallment, saveProject } from "@/app/admin/(painel)/clientes/[id]/actions";

/* Projetos de entrega única e as parcelas combinadas de cada um. A parcela nasce "a receber"
   e o "Recebi" põe a data do recebimento (hoje, se você não mudar). Criar, editar, nova parcela e
   excluir abrem em janela (ClientModals, pela URL). Os `id` (`projeto-3`, `parcela-7`) são as
   âncoras para onde as actions voltam (clientes/[id]/actions.ts). */

/* o caminho do projeto; cancelado sai dele e aparece como etiqueta */
const STEPS = PROJECT_STATUSES.filter((status): status is Exclude<ProjectStatus, "canceled"> => status !== "canceled");

/* escopo de uma linha curta aparece inteiro; o resto fica recolhido na primeira linha */
const SHORT_SCOPE = 90;

/** O formulário do projeto, dentro da janela "Novo projeto" / "Editar projeto". */
export function ProjectForm({ clientId, project, erro, cancelHref }: { clientId: number; project?: Project; erro?: string; cancelHref: string }) {
  return (
    <form action={saveProject} className="flex flex-col gap-4">
      <input type="hidden" name="clientId" value={clientId} />
      {project && <input type="hidden" name="id" value={project.id} />}

      <FormCard icon={KanbanIcon} title="Projeto" columns={3}>
        <Field
          className="sm:col-span-3"
          prefix="project-"
          icon={TagIcon}
          label="Projeto"
          name="title"
          required
          autoFocus
          placeholder="Site institucional"
          defaultValue={project?.title}
          maxLength={PROJECT_LIMITS.title}
        />
        <Field
          prefix="project-"
          icon={CurrencyCircleDollarIcon}
          label="Valor total (R$)"
          name="total"
          inputMode="decimal"
          pattern={MONEY_PATTERN}
          title="Formato 1.500,00 — vazio é a combinar"
          placeholder="vazio = a combinar"
          defaultValue={project ? moneyField(project.total) : ""}
        />
        <Field prefix="project-" icon={CalendarDotsIcon} label="Prazo de entrega" name="deadline" type="date" defaultValue={project?.deadline ?? ""} />
        <Select
          prefix="project-"
          icon={FlagIcon}
          label="Situação"
          name="status"
          defaultValue={project?.status ?? "proposal"}
          options={PROJECT_STATUSES.map((status) => ({ value: status, label: PROJECT_STATUS_LABEL[status] }))}
        />
      </FormCard>

      <FormCard icon={ScrollIcon} title="Escopo" hint="o que entra e o que fica de fora" columns={1}>
        <TextArea prefix="project-" label={<span className="sr-only">Escopo</span>} name="scope" rows={5} defaultValue={project?.scope ?? ""} maxLength={PROJECT_LIMITS.scope} />
      </FormCard>

      <FormCardDetails icon={NoteIcon} title="Anotações" hint={project?.notes ? undefined : "opcional"} open={Boolean(project?.notes)}>
        <TextArea prefix="project-" label={<span className="sr-only">Anotações</span>} name="notes" defaultValue={project?.notes ?? ""} maxLength={PROJECT_LIMITS.notes} />
      </FormCardDetails>

      <FormError message={erro} />

      <ModalActions cancelHref={cancelHref}>
        <SubmitButton className={project ? BUTTON_SOLID : BUTTON_ADD} icon={project ? "check" : "plus"}>
          {project ? "Salvar projeto" : "Criar projeto"}
        </SubmitButton>
      </ModalActions>
    </form>
  );
}

/** O formulário da parcela, dentro da janela "Nova parcela". */
export function InstallmentForm({ project, erro, cancelHref }: { project: Project; erro?: string; cancelHref: string }) {
  return (
    <form action={saveInstallment} className="flex flex-col gap-4">
      <input type="hidden" name="clientId" value={project.clientId} />
      <input type="hidden" name="id" value={project.id} />
      <FormCard icon={MoneyIcon} title="Parcela" columns={3}>
        <Field prefix="parcela-" icon={TagIcon} label="Descrição" name="description" autoFocus placeholder="Entrada (50%)" maxLength={PAYMENT_LIMITS.description} />
        <Field prefix="parcela-" icon={CurrencyCircleDollarIcon} label="Valor (R$)" name="amount" required inputMode="decimal" pattern={MONEY_PATTERN} title="Formato 1.500,00" placeholder="1.500,00" />
        <Field prefix="parcela-" icon={CalendarDotsIcon} label="Vencimento" name="dueOn" type="date" required />
      </FormCard>
      <FormError message={erro} />
      <ModalActions cancelHref={cancelHref}>
        <SubmitButton className={BUTTON_ADD} icon="plus">
          Adicionar parcela
        </SubmitButton>
      </ModalActions>
    </form>
  );
}

function Installment({ payment, project, page, feito }: { payment: Payment; project: Project; page: string; feito?: string }) {
  const anchor = `parcela-${payment.id}`;

  return (
    <li id={anchor} className={`flex scroll-mt-24 flex-wrap items-center gap-x-4 gap-y-1 py-2 ${flash(feito === anchor)}`}>
      <span className="text-ink/80">{payment.description ?? "Parcela"}</span>
      <span className={`ml-auto ${NUM}`}>{brl(payment.amount)}</span>
      {payment.paidOn ? (
        <span className={`text-ink/60 ${NUM}`}>recebida {br(payment.paidOn)}</span>
      ) : (
        <span className={`${NUM} ${payment.overdue ? "font-semibold text-danger" : "text-ink/60"}`}>
          {payment.overdue ? "venceu" : "vence"} {br(payment.dueOn)} · {relativeDays(payment.dueOn, todayInBrazil())}
        </span>
      )}
      <span className="-my-1 flex items-center gap-1">
        {!payment.paidOn && <ReceiveForm action={receivePayment} fields={{ clientId: project.clientId, id: payment.id }} />}
        <IconLink href={`${page}?excluir=${anchor}`} label={payment.paidOn ? "Apagar recebimento" : "Apagar parcela"} icon={TrashIcon} danger />
      </span>
    </li>
  );
}

function ProjectCard({ project, payments, page, feito }: { project: Project; payments: Payment[]; page: string; feito?: string }) {
  /* o que falta combinar: valor total menos as parcelas já marcadas */
  const unscheduled = project.total - project.scheduled;
  const percent = project.total ? Math.min(100, Math.round((project.paid / project.total) * 100)) : 0;
  const anchor = `projeto-${project.id}`;
  const next = nextProjectStatus(project.status);
  const deadline = deadlineNote(project, todayInBrazil());
  const scopeFits = project.scope !== null && !project.scope.includes("\n") && project.scope.length <= SHORT_SCOPE;

  return (
    <article id={anchor} className={`flex flex-col gap-4 ${ITEM_CARD} ${flash(feito === anchor)}`}>
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="text-[15px] font-semibold">{project.title}</h3>
        {project.status === "canceled" && <Badge>{PROJECT_STATUS_LABEL.canceled}</Badge>}
        {project.overdue && <Badge tone="danger">Parcela atrasada</Badge>}
        <span className="-my-1 ml-auto flex">
          <IconLink href={`${page}?projeto=${project.id}`} label="Editar projeto" icon={PencilSimpleIcon} />
          <IconLink href={`${page}?excluir=projeto-${project.id}`} label="Excluir projeto" icon={TrashIcon} danger />
        </span>
      </header>

      {project.status !== "canceled" && (
        <div className="flex flex-col gap-3">
          <Steps label="Etapa do projeto" steps={STEPS.map((status) => PROJECT_STATUS_LABEL[status])} current={STEPS.indexOf(project.status)} />
          {/* a próxima etapa num clique, sem abrir o formulário inteiro */}
          {next && (
            <form action={advanceStage} className="self-start">
              <input type="hidden" name="clientId" value={project.clientId} />
              <input type="hidden" name="id" value={project.id} />
              <SubmitButton className={BUTTON} icon="next">
                Avançar para {PROJECT_STATUS_LABEL[next]}
              </SubmitButton>
            </form>
          )}
        </div>
      )}

      {/* Recebido sobre o total: a barra é o <progress> nativo, que já diz o valor ao leitor de
          tela. A trilha é a div de fora; a barra em si só pinta o laranja (pseudo-elementos do
          WebKit e do Firefox). */}
      {project.total > 0 && (
        <div className="flex flex-col gap-2 text-ui">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <span>
              <span className={`font-semibold ${NUM}`}>{brl(project.paid)}</span>
              <span className="text-ink/60"> de {brl(project.total)} recebidos</span>
            </span>
            <span className={`font-mono text-meta text-ink/60 ${NUM}`}>{percent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
            <progress
              value={project.paid}
              max={project.total}
              aria-label="Recebido do valor total"
              className="block h-full w-full appearance-none bg-transparent [&::-moz-progress-bar]:bg-accent [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-accent"
            />
          </div>
        </div>
      )}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-ui sm:grid-cols-4">
        {project.total === 0 && (
          <>
            <div>
              <dt className="text-meta text-ink/60">Valor</dt>
              <dd>a combinar</dd>
            </div>
            <div>
              <dt className="text-meta text-ink/60">Recebido</dt>
              <dd className={NUM}>{brl(project.paid)}</dd>
            </div>
          </>
        )}
        <div>
          <dt className="text-meta text-ink/60">Prazo</dt>
          <dd className={`${NUM} ${deadline?.late ? "font-semibold text-danger" : ""}`}>
            {project.deadline ? br(project.deadline) : "—"}
            {deadline && <span className="text-meta font-normal opacity-75"> · {deadline.text}</span>}
          </dd>
        </div>
        {unscheduled > 0 && (
          <div>
            <dt className="text-meta text-ink/60">Sem parcela marcada</dt>
            <dd className={NUM}>{brl(unscheduled)}</dd>
          </div>
        )}
      </dl>

      {project.scope &&
        (scopeFits ? (
          <p className="text-ui leading-relaxed text-ink/75">{project.scope}</p>
        ) : (
          <details className="group text-ui">
            <summary className={`flex cursor-pointer list-none items-baseline gap-3 rounded [&::-webkit-details-marker]:hidden ${FOCUS}`}>
              <span className="min-w-0 flex-1 truncate text-ink/75 group-open:hidden">{project.scope.split("\n")[0]}</span>
              <span className="ml-auto shrink-0 text-meta text-ink/55 underline decoration-ink/25 underline-offset-4 hover:text-ink">
                <span className="group-open:hidden">ver escopo</span>
                <span className="hidden group-open:inline">recolher escopo</span>
              </span>
            </summary>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink/75">{project.scope}</p>
          </details>
        ))}
      {project.notes && <p className="whitespace-pre-line text-ui leading-relaxed text-ink/60">{project.notes}</p>}

      {payments.length > 0 && (
        <ul className="divide-y divide-ink/10 border-y border-ink/10 text-ui">
          {/* a consulta vem da mais recente pra mais antiga; parcela se lê na ordem do calendário */}
          {[...payments].reverse().map((payment) => (
            <Installment key={payment.id} payment={payment} project={project} page={page} feito={feito} />
          ))}
        </ul>
      )}

      <AddRow href={`${page}?parcela=${project.id}`} small>
        Nova parcela
      </AddRow>
    </article>
  );
}

export function ProjectSection({ clientId, projects, payments, feito }: { clientId: number; projects: Project[]; payments: Payment[]; feito?: string }) {
  const page = `/admin/clientes/${clientId}`;
  /* o que falta entrar dos projetos que seguem valendo */
  const toReceive = projects
    .filter((project) => project.status !== "canceled")
    .reduce((sum, project) => sum + Math.max(project.total - project.paid, 0), 0);

  return (
    <SectionCard
      id="projetos"
      icon={<KanbanIcon className="h-4 w-4" weight="bold" aria-hidden />}
      title="Projetos"
      count={projects.length}
      summary={toReceive > 0 && `${brl(toReceive)} a receber`}
      action={projects.length > 0 && <IconLink href={`${page}?projeto=novo`} label="Novo projeto" icon={PlusIcon} />}
    >
      {projects.length === 0 ? (
        <AddRow href={`${page}?projeto=novo`}>Novo projeto</AddRow>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            payments={payments.filter((payment) => payment.projectId === project.id)}
            page={page}
            feito={feito}
          />
        ))
      )}
    </SectionCard>
  );
}
