import Link from "next/link";
import { FolderKanban, Pencil, Trash2 } from "lucide-react";
import { AddRow } from "@/components/admin/add-row";
import { Badge } from "@/components/admin/badge";
import { CollapsibleCard } from "@/components/admin/collapsible-card";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { Field, FormError, Select, TextArea } from "@/components/admin/fields";
import { IconLink } from "@/components/admin/icon-link";
import { Steps } from "@/components/admin/steps";
import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON, BUTTON_SOLID, CARD_TITLE, INLINE_FORM, ITEM_CARD, NUM, flash } from "@/components/ui/styles";
import { br } from "@/services/dates";
import { MONEY_PATTERN, brl, moneyField } from "@/services/money";
import { PAYMENT_LIMITS, type Payment } from "@/services/payments";
import { PROJECT_LIMITS, PROJECT_STATUSES, PROJECT_STATUS_LABEL, type Project, type ProjectStatus } from "@/services/projects";
import { receivePayment, removePayment, removeProject, saveInstallment, saveProject } from "@/app/admin/(painel)/clientes/[id]/actions";

/* Projetos de entrega única e as parcelas combinadas de cada um. A parcela nasce "a receber"
   e o "Recebi" põe a data de hoje. Os `id` (`projeto-3`, `parcela-7`) são as âncoras para onde as
   actions voltam (clientes/[id]/actions.ts). */

/* o caminho do projeto; cancelado sai dele e aparece como etiqueta */
const STEPS = PROJECT_STATUSES.filter((status): status is Exclude<ProjectStatus, "canceled"> => status !== "canceled");

function ProjectForm({ clientId, project, erro, cancelHref }: { clientId: number; project?: Project; erro?: string; cancelHref: string }) {
  return (
    <form id={`projeto-${project?.id ?? "novo"}`} action={saveProject} className={`flex flex-col gap-5 ${INLINE_FORM}`}>
      <input type="hidden" name="clientId" value={clientId} />
      {project && <input type="hidden" name="id" value={project.id} />}
      <h3 className={CARD_TITLE}>{project ? "Editar projeto" : "Novo projeto"}</h3>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field prefix="project-" label="Projeto" name="title" required placeholder="Site institucional" defaultValue={project?.title} maxLength={PROJECT_LIMITS.title} />
        <Field
          prefix="project-"
          label="Valor total (R$) — vazio = a combinar"
          name="total"
          inputMode="decimal"
          pattern={MONEY_PATTERN}
          title="Formato 1.500,00"
          placeholder="3.000,00"
          defaultValue={project ? moneyField(project.total) : ""}
        />
        <Field prefix="project-" label="Prazo de entrega" name="deadline" type="date" defaultValue={project?.deadline ?? ""} />
        <Select
          prefix="project-"
          label="Situação"
          name="status"
          defaultValue={project?.status ?? "proposal"}
          options={PROJECT_STATUSES.map((status) => ({ value: status, label: PROJECT_STATUS_LABEL[status] }))}
        />
      </div>

      <TextArea prefix="project-" label="Escopo — o que entra e o que fica de fora" name="scope" rows={5} defaultValue={project?.scope ?? ""} maxLength={PROJECT_LIMITS.scope} />
      <TextArea prefix="project-" label="Anotações" name="notes" defaultValue={project?.notes ?? ""} maxLength={PROJECT_LIMITS.notes} />

      <FormError message={erro} />

      <div className="flex flex-wrap gap-2">
        <SubmitButton className={BUTTON_SOLID} icon="check">
          Salvar projeto
        </SubmitButton>
        <Link href={cancelHref} scroll={false} className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function InstallmentForm({ project, erro, cancelHref }: { project: Project; erro?: string; cancelHref: string }) {
  return (
    <form action={saveInstallment} className={`flex flex-col gap-4 ${INLINE_FORM}`}>
      <input type="hidden" name="clientId" value={project.clientId} />
      <input type="hidden" name="id" value={project.id} />
      <h4 className={CARD_TITLE}>Nova parcela</h4>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field prefix="parcela-" label="Descrição" name="description" placeholder="Entrada (50%)" maxLength={PAYMENT_LIMITS.description} />
        <Field prefix="parcela-" label="Valor (R$)" name="amount" required inputMode="decimal" pattern={MONEY_PATTERN} title="Formato 1.500,00" />
        <Field prefix="parcela-" label="Vencimento" name="dueOn" type="date" required />
      </div>
      <FormError message={erro} />
      <div className="flex flex-wrap gap-2">
        <SubmitButton className={BUTTON_SOLID} icon="plus">
          Adicionar parcela
        </SubmitButton>
        <Link href={cancelHref} scroll={false} className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Installment({ payment, project, page, excluir, feito }: { payment: Payment; project: Project; page: string; excluir?: string; feito?: string }) {
  const anchor = `parcela-${payment.id}`;

  if (excluir === anchor) {
    return (
      <li className="py-2">
        <DeleteConfirm
          action={removePayment}
          fields={{ clientId: project.clientId, id: payment.id, anchor: `projeto-${project.id}` }}
          message={payment.paidOn ? "Apaga o registro do recebimento." : "Apaga a parcela."}
          cancelHref={page}
        />
      </li>
    );
  }

  return (
    <li id={anchor} className={`flex scroll-mt-24 flex-wrap items-center gap-x-4 gap-y-1 py-2 ${flash(feito === anchor)}`}>
      <span className="text-ink/80">{payment.description ?? "Parcela"}</span>
      <span className={`ml-auto ${NUM}`}>{brl(payment.amount)}</span>
      {payment.paidOn ? (
        <span className={`text-ink/60 ${NUM}`}>recebida {br(payment.paidOn)}</span>
      ) : (
        <span className={`${NUM} ${payment.overdue ? "font-semibold text-danger" : "text-ink/60"}`}>
          {payment.overdue ? "venceu" : "vence"} {br(payment.dueOn)}
        </span>
      )}
      <form action={receivePayment} className="-my-1 flex items-center gap-1">
        <input type="hidden" name="clientId" value={project.clientId} />
        <input type="hidden" name="id" value={payment.id} />
        {!payment.paidOn && (
          <SubmitButton className={`${BUTTON} mr-1`} icon="check">
            Recebi
          </SubmitButton>
        )}
        <IconLink href={`${page}?excluir=${anchor}`} label={payment.paidOn ? "Apagar recebimento" : "Apagar parcela"} icon={Trash2} danger />
      </form>
    </li>
  );
}

function ProjectCard({
  project,
  payments,
  page,
  excluir,
  parcela,
  erro,
  feito,
}: {
  project: Project;
  payments: Payment[];
  page: string;
  excluir?: string;
  parcela?: string;
  erro?: string;
  feito?: string;
}) {
  /* o que falta combinar: valor total menos as parcelas já marcadas */
  const unscheduled = project.total - project.scheduled;
  const percent = project.total ? Math.min(100, Math.round((project.paid / project.total) * 100)) : 0;
  const anchor = `projeto-${project.id}`;

  return (
    <article id={anchor} className={`flex flex-col gap-4 ${ITEM_CARD} ${flash(feito === anchor)}`}>
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="text-[16px] font-semibold">{project.title}</h3>
        {project.status === "canceled" && <Badge>{PROJECT_STATUS_LABEL.canceled}</Badge>}
        {project.overdue && <Badge tone="danger">Parcela atrasada</Badge>}
        <span className="-my-1 ml-auto flex">
          <IconLink href={`${page}?projeto=${project.id}`} label="Editar projeto" icon={Pencil} />
          <IconLink href={`${page}?excluir=projeto-${project.id}`} label="Excluir projeto" icon={Trash2} danger />
        </span>
      </header>

      {project.status !== "canceled" && (
        <Steps label="Etapa do projeto" steps={STEPS.map((status) => PROJECT_STATUS_LABEL[status])} current={STEPS.indexOf(project.status)} />
      )}

      {/* Recebido sobre o total: a barra é o <progress> nativo, que já diz o valor ao leitor de
          tela. A trilha é a div de fora; a barra em si só pinta o laranja (pseudo-elementos do
          WebKit e do Firefox) e entra se revelando da esquerda, como se enchesse. */}
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
              className="block h-full w-full animate-reveal-x appearance-none bg-transparent motion-reduce:animate-none [&::-moz-progress-bar]:bg-accent [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-accent"
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
          <dd className={NUM}>{project.deadline ? br(project.deadline) : "—"}</dd>
        </div>
        {unscheduled > 0 && (
          <div>
            <dt className="text-meta text-ink/60">Sem parcela marcada</dt>
            <dd className={NUM}>{brl(unscheduled)}</dd>
          </div>
        )}
      </dl>

      {project.scope && <p className="whitespace-pre-line text-ui leading-relaxed text-ink/75">{project.scope}</p>}
      {project.notes && <p className="whitespace-pre-line text-ui leading-relaxed text-ink/60">{project.notes}</p>}

      {payments.length > 0 && (
        <ul className="divide-y divide-ink/10 border-y border-ink/10 text-ui">
          {/* a consulta vem da mais recente pra mais antiga; parcela se lê na ordem do calendário */}
          {[...payments].reverse().map((payment) => (
            <Installment key={payment.id} payment={payment} project={project} page={page} excluir={excluir} feito={feito} />
          ))}
        </ul>
      )}

      {excluir === anchor ? (
        <DeleteConfirm
          action={removeProject}
          fields={{ clientId: project.clientId, id: project.id }}
          message="Exclui o projeto e as parcelas não recebidas."
          cancelHref={page}
        />
      ) : parcela === String(project.id) ? (
        <InstallmentForm project={project} erro={erro} cancelHref={page} />
      ) : (
        <AddRow href={`${page}?parcela=${project.id}`} small>
          Nova parcela
        </AddRow>
      )}
    </article>
  );
}

export function ProjectSection({
  clientId,
  projects,
  payments,
  open,
  parcela,
  excluir,
  erro,
  feito,
  forceOpen,
}: {
  clientId: number;
  projects: Project[];
  payments: Payment[];
  /** `?projeto=`: "novo" ou o id em edição */
  open?: string;
  /** `?parcela=`: id do projeto com o formulário de parcela aberto */
  parcela?: string;
  excluir?: string;
  erro?: string;
  /** `?feito=`: o item que a última ação mexeu, que pisca ao chegar */
  feito?: string;
  /** a URL aponta pra dentro do bloco: abre mesmo se estava recolhido */
  forceOpen: boolean;
}) {
  const page = `/admin/clientes/${clientId}`;
  /* o que falta entrar dos projetos que seguem valendo */
  const toReceive = projects
    .filter((project) => project.status !== "canceled")
    .reduce((sum, project) => sum + Math.max(project.total - project.paid, 0), 0);

  return (
    <CollapsibleCard
      id="projetos"
      icon={<FolderKanban className="h-4 w-4" strokeWidth={2.25} />}
      title="Projetos"
      count={projects.length}
      summary={toReceive > 0 && `${brl(toReceive)} a receber`}
      forceOpen={forceOpen}
    >
      {projects.length === 0 && open !== "novo" && <p className="text-ui text-ink/60">Nenhum projeto ainda.</p>}

      {/* cada projeto um cartão; o formulário aberto entra no lugar dele */}
      {projects.map((project) =>
        open === String(project.id) ? (
          <ProjectForm key={project.id} clientId={clientId} project={project} erro={erro} cancelHref={page} />
        ) : (
          <ProjectCard
            key={project.id}
            project={project}
            payments={payments.filter((payment) => payment.projectId === project.id)}
            page={page}
            excluir={excluir}
            parcela={parcela}
            erro={erro}
            feito={feito}
          />
        ),
      )}

      {/* adicionar fica no fim, onde o projeto novo vai entrar; o formulário abre no lugar da faixa */}
      {open === "novo" ? <ProjectForm clientId={clientId} erro={erro} cancelHref={page} /> : <AddRow href={`${page}?projeto=novo`}>Novo projeto</AddRow>}
    </CollapsibleCard>
  );
}
