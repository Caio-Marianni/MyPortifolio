import type { Metadata } from "next";
import Link from "next/link";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { Field, FormError, Select, TextArea } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE, NUM } from "@/components/admin/styles";
import { STARTERS } from "@/data/document-starters";
import { requireAdmin } from "@/services/admin-session";
import { DOC_KINDS, DOC_KIND_LABEL, DOC_LIMITS, PLACEHOLDERS, listTemplates, type Template, type TemplateFields } from "@/services/documents";
import { removeTemplate, saveTemplate } from "../actions";

/* Modelos de proposta e contrato: o texto que você escreve uma vez, com {campos} que a ficha do
   cliente preenche. Criar parte de um esqueleto (data/document-starters.ts) ou do zero. */
export const metadata: Metadata = { title: "Modelos" };

const PAGE = "/admin/documentos/modelos";

function TemplateForm({ id, template, erro }: { id?: number; template: TemplateFields; erro?: string }) {
  return (
    <form action={saveTemplate} className={`${CARD} flex flex-col gap-5 border-ink`}>
      {id && <input type="hidden" name="id" value={id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome do modelo" name="name" required defaultValue={template.name} maxLength={DOC_LIMITS.name} />
        <Select
          label="Tipo"
          name="kind"
          defaultValue={template.kind}
          options={DOC_KINDS.map((kind) => ({ value: kind, label: DOC_KIND_LABEL[kind] }))}
        />
      </div>
      <TextArea
        label="Texto — # título · ## seção · - item · **negrito** · {campo}"
        name="body"
        required
        rows={26}
        defaultValue={template.body}
        maxLength={DOC_LIMITS.body}
        className="[&_textarea]:font-mono [&_textarea]:text-ui [&_textarea]:leading-relaxed"
      />
      <FormError message={erro} />
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={BUTTON_SOLID}>
          Salvar modelo
        </button>
        <Link href={PAGE} className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function TemplateRow({ template, excluindo }: { template: Template; excluindo: boolean }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
      <span className="font-semibold">{template.name}</span>
      <span className="text-ui text-ink/60">{DOC_KIND_LABEL[template.kind]}</span>
      <span className={`text-ui text-ink/50 ${NUM}`}>editado {template.updatedAt}</span>
      {excluindo ? (
        <DeleteConfirm
          action={removeTemplate}
          fields={{ id: template.id }}
          message="Documentos já gerados não mudam."
          cancelHref={PAGE}
        />
      ) : (
        <span className="ml-auto flex gap-2">
          <Link href={`${PAGE}?editar=${template.id}`} className={BUTTON}>
            Editar
          </Link>
          <Link href={`${PAGE}?excluir=${template.id}`} className={`${BUTTON} text-danger`}>
            Excluir
          </Link>
        </span>
      )}
    </li>
  );
}

type Params = { searchParams: Promise<{ novo?: string; editar?: string; excluir?: string; erro?: string }> };

export default async function ModelosPage(props: Params) {
  await requireAdmin();
  const searchParams = await props.searchParams;

  const templates = await listTemplates().catch((error: unknown) => {
    console.error("[admin] falha ao ler modelos:", error);
    return null;
  });
  const editing = templates?.find((template) => String(template.id) === searchParams.editar);
  const starter = searchParams.novo ? STARTERS[searchParams.novo] : undefined;

  return (
    <>
      <PageHeader
        back={{ href: "/admin/documentos", label: "Documentos" }}
        title="Modelos"
        description="Escreva uma vez; a ficha do cliente preenche os campos."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          {starter && <TemplateForm template={starter} erro={searchParams.erro} />}
          {editing && <TemplateForm id={editing.id} template={editing} erro={searchParams.erro} />}

          {!starter && !editing && (
            <section className={`${CARD} flex flex-col gap-4`}>
              <h2 className={CARD_TITLE}>Novo modelo</h2>
              <p className="text-ui leading-relaxed text-ink/65">
                Os esqueletos já trazem os campos no lugar. Troque o que está entre colchetes pelos seus dados e revise com um advogado antes do primeiro uso.
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STARTERS).map(([key, value]) => (
                  <Link key={key} href={`${PAGE}?novo=${key}`} className={BUTTON}>
                    {value.name || "Em branco"}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {templates === null ? (
            <p role="alert" className="text-ui text-danger">
              Não consegui ler os modelos. A tabela foi criada? Rode `npm run migrate`.
            </p>
          ) : (
            templates.length > 0 && (
              <section className={CARD}>
                <h2 className={CARD_TITLE}>Seus modelos</h2>
                <ul className="mt-2 divide-y divide-ink/10 text-ui">
                  {templates.map((template) => (
                    <TemplateRow key={template.id} template={template} excluindo={searchParams.excluir === String(template.id)} />
                  ))}
                </ul>
              </section>
            )
          )}
        </div>

        <aside className={`${CARD} text-ui`}>
          <h2 className={CARD_TITLE}>Campos</h2>
          <dl className="mt-3 flex flex-col gap-1.5">
            {PLACEHOLDERS.map((placeholder) => (
              <div key={placeholder.key} className="flex flex-wrap gap-x-2">
                <dt className="font-mono text-ink">{`{${placeholder.key}}`}</dt>
                <dd className="text-ink/60">{placeholder.help}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 leading-relaxed text-ink/60">Campo que o cliente não tem fica entre chaves no rascunho, à vista pra você completar.</p>
        </aside>
      </div>
    </>
  );
}
