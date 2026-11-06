import Link from "next/link";
import { DocStatusBadge } from "@/components/admin/documents/doc-status";
import { Select } from "@/components/admin/fields";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE } from "@/components/admin/styles";
import { DOC_KIND_LABEL, type Document, type Template } from "@/services/documents";
import type { Plan } from "@/services/plans";
import type { Project } from "@/services/projects";
import { generate } from "@/app/admin/(painel)/documentos/actions";

/** Documentos do cliente e o atalho pra gerar um novo: modelo + o projeto ou plano de onde saem
    valor, escopo e vencimento. */
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
  return (
    <section className={`${CARD} flex flex-col gap-5`}>
      <h2 className={CARD_TITLE}>Documentos</h2>

      {documents.length > 0 && (
        <ul className="divide-y divide-ink/10 border-y border-ink/10 text-ui">
          {documents.map((doc) => (
            <li key={doc.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
              <Link href={`/admin/documentos/${doc.id}`} className="font-semibold underline-offset-4 hover:underline">
                {doc.title}
              </Link>
              <span className="ml-auto">
                <DocStatusBadge status={doc.status} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {templates.length === 0 ? (
        <p className="text-ui text-ink/60">
          Pra gerar proposta ou contrato, crie um modelo primeiro.{" "}
          <Link href="/admin/documentos/modelos" className={`${BUTTON} ml-1 inline-flex`}>
            Criar modelo
          </Link>
        </p>
      ) : (
        <form action={generate} className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <input type="hidden" name="clientId" value={clientId} />
          <Select
            prefix="doc-"
            label="Modelo"
            name="templateId"
            options={templates.map((template) => ({ value: String(template.id), label: `${DOC_KIND_LABEL[template.kind]} · ${template.name}` }))}
          />
          <Select
            prefix="doc-"
            label="Dados de"
            name="link"
            options={[
              ...projects.map((project) => ({ value: `projeto:${project.id}`, label: `Projeto · ${project.title}` })),
              ...plans.map((plan) => ({ value: `plano:${plan.id}`, label: `Plano · ${plan.name}` })),
              { value: "", label: "Só os dados do cliente" },
            ]}
          />
          <button type="submit" className={BUTTON_SOLID}>
            Gerar
          </button>
        </form>
      )}
    </section>
  );
}
