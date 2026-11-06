import Link from "next/link";
import { Badge, type Tone } from "@/components/admin/badge";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { Field, FormError, Select, TextArea } from "@/components/admin/fields";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE, NUM } from "@/components/admin/styles";
import { br } from "@/services/dates";
import { MONEY_PATTERN, brl, moneyField } from "@/services/money";
import { PAYMENT_LIMITS, type Payment } from "@/services/payments";
import { PROJECT_LIMITS, PROJECT_STATUSES, PROJECT_STATUS_LABEL, type Project, type ProjectStatus } from "@/services/projects";
import { receivePayment, removePayment, removeProject, saveInstallment, saveProject } from "@/app/admin/(painel)/clientes/[id]/actions";

/* Projetos de entrega única e as parcelas combinadas de cada um. A parcela nasce "a receber"
   e o "Recebi" põe a data de hoje. */

const STATUS_TONE: Record<ProjectStatus, Tone> = {
  proposal: "neutral",
  approved: "accent",
  in_progress: "accent",
  delivered: "ok",
  canceled: "neutral",
};

function ProjectForm({ clientId, project, erro, cancelHref }: { clientId: number; project?: Project; erro?: string; cancelHref: string }) {
  return (
    <form action={saveProject} className="flex flex-col gap-5">
      <input type="hidden" name="clientId" value={clientId} />
      {project && <input type="hidden" name="id" value={project.id} />}

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
        <button type="submit" className={BUTTON_SOLID}>
          Salvar projeto
        </button>
        <Link href={cancelHref} className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function InstallmentForm({ project, erro, cancelHref }: { project: Project; erro?: string; cancelHref: string }) {
  return (
    <form action={saveInstallment} className="flex flex-col gap-4 border border-ink/15 p-4">
      <input type="hidden" name="clientId" value={project.clientId} />
      <input type="hidden" name="id" value={project.id} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field prefix="parcela-" label="Descrição" name="description" placeholder="Entrada (50%)" maxLength={PAYMENT_LIMITS.description} />
        <Field prefix="parcela-" label="Valor (R$)" name="amount" required inputMode="decimal" pattern={MONEY_PATTERN} title="Formato 1.500,00" />
        <Field prefix="parcela-" label="Vencimento" name="dueOn" type="date" required />
      </div>
      <FormError message={erro} />
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={BUTTON_SOLID}>
          Adicionar parcela
        </button>
        <Link href={cancelHref} className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Installment({ payment, clientId, page, excluir }: { payment: Payment; clientId: number; page: string; excluir?: string }) {
  if (excluir === `parcela-${payment.id}`) {
    return (
      <li className="py-2">
        <DeleteConfirm
          action={removePayment}
          fields={{ clientId, id: payment.id }}
          message={payment.paidOn ? "Apaga o registro do recebimento." : "Apaga a parcela."}
          cancelHref={page}
        />
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
      <span className="text-ink/80">{payment.description ?? "Parcela"}</span>
      <span className={`ml-auto ${NUM}`}>{brl(payment.amount)}</span>
      {payment.paidOn ? (
        <span className={`text-ink/60 ${NUM}`}>recebida {br(payment.paidOn)}</span>
      ) : (
        <span className={`${NUM} ${payment.overdue ? "font-semibold text-danger" : "text-ink/60"}`}>
          {payment.overdue ? "venceu" : "vence"} {br(payment.dueOn)}
        </span>
      )}
      <form action={receivePayment} className="flex items-center gap-3">
        <input type="hidden" name="clientId" value={clientId} />
        <input type="hidden" name="id" value={payment.id} />
        {!payment.paidOn && (
          <button type="submit" className={BUTTON}>
            Recebi
          </button>
        )}
        <Link href={`${page}?excluir=parcela-${payment.id}`} className="text-[12.5px] text-ink/50 hover:text-danger">
          excluir
        </Link>
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
}: {
  project: Project;
  payments: Payment[];
  page: string;
  excluir?: string;
  parcela?: string;
  erro?: string;
}) {
  /* o que falta combinar: valor total menos as parcelas já marcadas */
  const unscheduled = project.total - project.scheduled;

  return (
    <article className="flex flex-col gap-4 border-t border-ink/10 pt-5 first:border-t-0 first:pt-0">
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="text-[16px] font-semibold">{project.title}</h3>
        <Badge tone={STATUS_TONE[project.status]}>{PROJECT_STATUS_LABEL[project.status]}</Badge>
        {project.overdue && <Badge tone="danger">Parcela atrasada</Badge>}
      </header>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[14px] sm:grid-cols-4">
        <div>
          <dt className="text-[12.5px] text-ink/60">Valor</dt>
          <dd className={NUM}>{project.total ? brl(project.total) : "a combinar"}</dd>
        </div>
        <div>
          <dt className="text-[12.5px] text-ink/60">Recebido</dt>
          <dd className={NUM}>{brl(project.paid)}</dd>
        </div>
        <div>
          <dt className="text-[12.5px] text-ink/60">Prazo</dt>
          <dd className={NUM}>{project.deadline ? br(project.deadline) : "—"}</dd>
        </div>
        {unscheduled > 0 && (
          <div>
            <dt className="text-[12.5px] text-ink/60">Sem parcela marcada</dt>
            <dd className={NUM}>{brl(unscheduled)}</dd>
          </div>
        )}
      </dl>

      {project.scope && <p className="whitespace-pre-line text-[14px] leading-relaxed text-ink/75">{project.scope}</p>}
      {project.notes && <p className="whitespace-pre-line text-[13px] leading-relaxed text-ink/60">{project.notes}</p>}

      {payments.length > 0 && (
        <ul className="divide-y divide-ink/10 border-y border-ink/10 text-[13.5px]">
          {/* a consulta vem da mais recente pra mais antiga; parcela se lê na ordem do calendário */}
          {[...payments].reverse().map((payment) => (
            <Installment key={payment.id} payment={payment} clientId={project.clientId} page={page} excluir={excluir} />
          ))}
        </ul>
      )}

      {parcela === String(project.id) && <InstallmentForm project={project} erro={erro} cancelHref={page} />}

      {excluir === `projeto-${project.id}` ? (
        <DeleteConfirm
          action={removeProject}
          fields={{ clientId: project.clientId, id: project.id }}
          message="Exclui o projeto e as parcelas não recebidas."
          cancelHref={page}
        />
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {parcela !== String(project.id) && (
            <Link href={`${page}?parcela=${project.id}`} className={BUTTON}>
              Nova parcela
            </Link>
          )}
          <Link href={`${page}?projeto=${project.id}`} className={`${BUTTON} ml-auto`}>
            Editar
          </Link>
          <Link href={`${page}?excluir=projeto-${project.id}`} className={`${BUTTON} text-danger`}>
            Excluir
          </Link>
        </div>
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
}) {
  const page = `/admin/clientes/${clientId}`;

  return (
    <section className={`${CARD} flex flex-col gap-5`}>
      <header className="flex items-center justify-between gap-3">
        <h2 className={CARD_TITLE}>Projetos</h2>
        {open !== "novo" && (
          <Link href={`${page}?projeto=novo`} className={BUTTON}>
            Novo projeto
          </Link>
        )}
      </header>

      {open === "novo" && <ProjectForm clientId={clientId} erro={erro} cancelHref={page} />}

      {projects.length === 0 && open !== "novo" && <p className="text-[14px] text-ink/60">Nenhum projeto ainda.</p>}

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
          />
        ),
      )}
    </section>
  );
}
