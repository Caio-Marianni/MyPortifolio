import Link from "next/link";
import { FilePlusIcon, FileTextIcon, LinkSimpleIcon } from "@phosphor-icons/react/ssr";
import { AddRow } from "@/components/admin/add-row";
import { DocStatusBadge } from "@/components/admin/documents/doc-status";
import { FormError, Select } from "@/components/admin/fields";
import { FormCard } from "@/components/admin/form-card";
import { IconLink } from "@/components/admin/icon-link";
import { ModalActions } from "@/components/admin/modal-actions";
import { SectionCard } from "@/components/admin/section-card";
import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON, BUTTON_SOLID, NUM, ROW_FOCUS } from "@/components/ui/styles";
import { br } from "@/services/dates";
import { DOC_KIND_LABEL, type DocKind, type Document, type Template } from "@/services/documents";
import type { Plan } from "@/services/plans";
import type { Project } from "@/services/projects";
import { generate } from "@/app/admin/(painel)/documentos/actions";

/** Gerar um rascunho: modelo + o projeto ou plano de onde saem valor, escopo e vencimento. Sempre
    numa janela — o "Novo documento" da lista e o "Gerar documento" da ficha. `cancelHref` fecha
    a janela; `from` é a tela dela, pra onde o erro da action volta. */
export function GenerateForm({
  clientId,
  templates,
  projects,
  plans,
  cancelHref,
  from,
  erro,
}: {
  clientId: number;
  templates: Template[];
  projects: Project[];
  plans: Plan[];
  cancelHref: string;
  from?: string;
  erro?: string;
}) {
  if (templates.length === 0) {
    return (
      <p className="flex flex-wrap items-center gap-3 text-ui text-ink/60">
        Pra gerar proposta ou contrato, crie um modelo primeiro.
        <Link href="/admin/documentos/modelos" className={BUTTON}>
          Criar modelo
        </Link>
      </p>
    );
  }

  return (
    <form action={generate} className="flex flex-col gap-4">
      <input type="hidden" name="clientId" value={clientId} />
      {from && <input type="hidden" name="from" value={from} />}
      <FormCard icon={FileTextIcon} title="Documento" hint="o rascunho sai preenchido com os dados escolhidos">
        <Select
          prefix="doc-"
          icon={FileTextIcon}
          label="Modelo"
          name="templateId"
          options={templates.map((template) => ({ value: String(template.id), label: `${DOC_KIND_LABEL[template.kind]} · ${template.name}` }))}
        />
        <Select
          prefix="doc-"
          icon={LinkSimpleIcon}
          label="Dados de"
          name="link"
          options={[
            ...projects.map((project) => ({ value: `projeto:${project.id}`, label: `Projeto · ${project.title}` })),
            ...plans.map((plan) => ({ value: `plano:${plan.id}`, label: `Plano · ${plan.name}` })),
            { value: "", label: "Só os dados do cliente" },
          ]}
        />
      </FormCard>
      <FormError message={erro} />
      <ModalActions cancelHref={cancelHref}>
        <SubmitButton className={BUTTON_SOLID} icon="file">
          Gerar rascunho
        </SubmitButton>
      </ModalActions>
    </form>
  );
}

/* "Proposta" é feminino, "Contrato" é masculino: o particípio concorda */
const ENDING: Record<DocKind, string> = { proposal: "a", contract: "o" };

/** "Contrato · assinado em 05/11", "Proposta · enviada em 03/11", "Proposta · rascunho". Enviado e
    assinado travam o texto, então o `updatedAt` deles é o dia em que mudaram de situação. */
function docLine(doc: Document): string {
  const ending = ENDING[doc.kind];
  const status =
    doc.status === "signed" && doc.signedOn
      ? `assinad${ending} em ${br(doc.signedOn).slice(0, 5)}`
      : doc.status === "sent"
        ? `enviad${ending} em ${doc.updatedAt.slice(0, 5)}`
        : "rascunho";
  return `${DOC_KIND_LABEL[doc.kind]} · ${status}`;
}

/** Documentos do cliente, na aba Documentos da ficha: a lista, e o "Gerar documento" que abre a
    janela (`?aba=documentos&gerar`, ClientModals). */
export function ClientDocuments({ clientId, documents }: { clientId: number; documents: Document[] }) {
  const sent = documents.filter((doc) => doc.status === "sent").length;
  const drafts = documents.filter((doc) => doc.status === "draft").length;
  const generateHref = `/admin/clientes/${clientId}?aba=documentos&gerar`;

  return (
    <SectionCard
      id="documentos"
      icon={<FileTextIcon className="h-4 w-4" weight="bold" aria-hidden />}
      title="Documentos"
      count={documents.length}
      summary={[sent > 0 && `${sent} aguardando assinatura`, drafts > 0 && `${drafts} ${drafts === 1 ? "rascunho" : "rascunhos"}`].filter(Boolean).join(" · ")}
      action={documents.length > 0 && <IconLink href={generateHref} label="Gerar documento" icon={FilePlusIcon} />}
    >
      {documents.length === 0 ? (
        <AddRow href={generateHref}>Gerar proposta ou contrato</AddRow>
      ) : (
        /* linhas rentes às bordas do bloco, logo abaixo do fio do cabeçalho */
        <ul className="-mx-5 -my-5 divide-y divide-ink/10 text-ui md:-mx-6 md:-my-6">
          {documents.map((doc) => (
            <li key={doc.id}>
              <Link
                href={`/admin/documentos/${doc.id}`}
                className={`group flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 hover:bg-ink/[0.04] md:px-6 ${ROW_FOCUS}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold group-hover:underline group-hover:underline-offset-4">{doc.title}</span>
                  <span className={`block text-meta text-ink/55 ${NUM}`}>{docLine(doc)}</span>
                </span>
                <DocStatusBadge status={doc.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
