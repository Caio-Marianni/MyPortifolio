import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { CollapsibleCard } from "@/components/admin/collapsible-card";
import { DocStatusBadge } from "@/components/admin/documents/doc-status";
import { Select } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON, BUTTON_SOLID, ROW_FOCUS } from "@/components/ui/styles";
import { DOC_KIND_LABEL, type Document, type Template } from "@/services/documents";
import type { Plan } from "@/services/plans";
import type { Project } from "@/services/projects";
import { generate } from "@/app/admin/(painel)/documentos/actions";

/** Gerar um rascunho: modelo + o projeto ou plano de onde saem valor, escopo e vencimento. Na
    ficha do cliente e no "Novo documento" da lista de documentos. */
export function GenerateForm({
  clientId,
  templates,
  projects,
  plans,
}: {
  clientId: number;
  templates: Template[];
  projects: Project[];
  plans: Plan[];
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
    /* flex que quebra, não grade fixa: na coluna da ficha os dois campos descem um embaixo do
       outro, na lista de documentos ficam lado a lado com o botão */
    <form action={generate} className="flex flex-wrap items-end gap-4">
      <input type="hidden" name="clientId" value={clientId} />
      <Select
        prefix="doc-"
        label="Modelo"
        name="templateId"
        className="min-w-[240px] flex-1"
        options={templates.map((template) => ({ value: String(template.id), label: `${DOC_KIND_LABEL[template.kind]} · ${template.name}` }))}
      />
      <Select
        prefix="doc-"
        label="Dados de"
        name="link"
        className="min-w-[240px] flex-1"
        options={[
          ...projects.map((project) => ({ value: `projeto:${project.id}`, label: `Projeto · ${project.title}` })),
          ...plans.map((plan) => ({ value: `plano:${plan.id}`, label: `Plano · ${plan.name}` })),
          { value: "", label: "Só os dados do cliente" },
        ]}
      />
      {/* mesma altura do campo ao lado, para a linha fechar reta */}
      <SubmitButton className={`${BUTTON_SOLID} sm:min-h-[46px]`} icon="file">
        Gerar rascunho
      </SubmitButton>
    </form>
  );
}

/** Documentos do cliente, na ficha: a lista e, embaixo, gerar um novo. */
export function ClientDocuments({
  clientId,
  documents,
  templates,
  projects,
  plans,
}: {
  clientId: number;
  documents: Document[];
  templates: Template[];
  projects: Project[];
  plans: Plan[];
}) {
  const sent = documents.filter((doc) => doc.status === "sent").length;
  const drafts = documents.filter((doc) => doc.status === "draft").length;

  return (
    <CollapsibleCard
      id="documentos"
      icon={<FileText className="h-4 w-4" strokeWidth={2.25} />}
      title="Documentos"
      count={documents.length}
      summary={[sent > 0 && `${sent} aguardando assinatura`, drafts > 0 && `${drafts} ${drafts === 1 ? "rascunho" : "rascunhos"}`].filter(Boolean).join(" · ")}
    >
      {/* linhas rentes às bordas do bloco, logo abaixo do fio do cabeçalho */}
      {documents.length > 0 && (
        <ul className="-mx-5 -mt-5 divide-y divide-ink/10 border-b border-ink/10 text-ui md:-mx-6">
          {documents.map((doc) => (
            <li key={doc.id}>
              <Link
                href={`/admin/documentos/${doc.id}`}
                className={`group flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 transition-colors hover:bg-ink/[0.04] md:px-6 ${ROW_FOCUS}`}
              >
                <span className="min-w-0 flex-1 font-semibold group-hover:underline group-hover:underline-offset-4">{doc.title}</span>
                <DocStatusBadge status={doc.status} />
                <ChevronRight className="h-4 w-4 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={2} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <GenerateForm clientId={clientId} templates={templates} projects={projects} plans={plans} />
    </CollapsibleCard>
  );
}
