import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Plus } from "lucide-react";
import { GenerateForm } from "@/components/admin/documents/client-documents";
import { DocumentList } from "@/components/admin/documents/document-list";
import { Select } from "@/components/admin/fields";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE } from "@/components/ui/styles";
import { requireAdmin } from "@/services/admin-session";
import { getClient, listClients } from "@/services/clients";
import { DOC_STATUSES, DOC_STATUS_LABEL, listDocuments, listTemplates } from "@/services/documents";
import { readId } from "@/services/form-input";
import { listPlans } from "@/services/plans";
import { listProjects } from "@/services/projects";

/* Todos os documentos, de todos os clientes. O "Novo documento" pede primeiro o cliente — é de
   lá que saem os dados que o modelo pede — e depois o modelo e o projeto ou plano. */
export const metadata: Metadata = { title: "Documentos" };

const PAGE = "/admin/documentos";

/** "Novo documento": escolher o cliente é um formulário GET que recarrega a página com
    `?cliente=`; daí o mesmo formulário de gerar da ficha, já com os projetos e planos dele. */
async function NewDocument({ clientId }: { clientId: number | null }) {
  const client = clientId ? await getClient(clientId) : null;

  if (!client) {
    const clients = await listClients();
    return (
      <section className={`${CARD} mb-8 flex flex-col gap-5 border-l-2 border-accent`}>
        <h2 className={CARD_TITLE}>Novo documento · 1 de 2</h2>
        {clients.length === 0 ? (
          <p className="text-ui text-ink/60">
            Cadastre um cliente primeiro.{" "}
            <Link href="/admin/clientes?novo" className="font-semibold text-ink underline-offset-4 hover:underline">
              Novo cliente
            </Link>
          </p>
        ) : (
          <form className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <input type="hidden" name="novo" value="" />
            <Select label="Cliente" name="cliente" options={clients.map((c) => ({ value: String(c.id), label: c.name }))} />
            <button type="submit" className={`${BUTTON_SOLID} sm:min-h-[46px]`}>
              Continuar
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            </button>
            <Link href={PAGE} className={`${BUTTON} sm:min-h-[46px]`}>
              Cancelar
            </Link>
          </form>
        )}
      </section>
    );
  }

  const [templates, projects, plans] = await Promise.all([listTemplates(), listProjects(client.id), listPlans(client.id)]);
  return (
    <section className={`${CARD} mb-8 flex flex-col gap-5 border-l-2 border-accent`}>
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className={CARD_TITLE}>Novo documento · 2 de 2</h2>
        <span className="flex gap-4 text-meta">
          <Link href={`${PAGE}?novo`} className="font-semibold text-ink/60 hover:text-ink">
            Trocar cliente
          </Link>
          <Link href={PAGE} className="font-semibold text-ink/60 hover:text-ink">
            Cancelar
          </Link>
        </span>
      </header>
      <p className="text-ui">
        Para <span className="font-semibold">{client.name}</span>
      </p>
      <GenerateForm clientId={client.id} templates={templates} projects={projects} plans={plans} />
    </section>
  );
}

type Params = { searchParams: Promise<{ ver?: string; novo?: string; cliente?: string }> };

export default async function DocumentosPage(props: Params) {
  await requireAdmin();
  const { ver: param, novo, cliente } = await props.searchParams;

  const docs = await listDocuments().catch((error: unknown) => {
    console.error("[admin] falha ao ler documentos:", error);
    return null;
  });
  const all = docs ?? [];
  const ver = DOC_STATUSES.find((status) => status === param) ?? "todos";
  const shown = ver === "todos" ? all : all.filter((doc) => doc.status === ver);

  return (
    <>
      <PageHeader
        title="Documentos"
        description="Propostas e contratos, de todos os clientes."
        actions={
          <>
            <Link href={`${PAGE}/modelos`} className={BUTTON}>
              <FileText className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              Modelos
            </Link>
            {novo === undefined && (
              <Link href={`${PAGE}?novo`} className={BUTTON_SOLID}>
                <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                Novo documento
              </Link>
            )}
          </>
        }
      />

      {novo !== undefined && docs !== null && <NewDocument clientId={readId(cliente ?? null)} />}

      <FilterTabs
        base={PAGE}
        current={ver}
        options={[
          { value: "todos", label: "Todos", count: all.length },
          ...DOC_STATUSES.map((status) => ({
            value: status,
            label: DOC_STATUS_LABEL[status],
            count: all.filter((doc) => doc.status === status).length,
          })),
        ]}
      />

      {docs === null && (
        <p role="alert" className="text-ui text-danger">
          Não consegui ler os documentos. A tabela foi criada? Rode `npm run migrate`.
        </p>
      )}

      {docs !== null && shown.length === 0 && (
        <p className="text-ui text-ink/60">
          {all.length === 0 ? "Nenhum documento ainda. Crie um modelo e gere o primeiro no botão aí em cima." : "Nada neste filtro."}
        </p>
      )}

      {shown.length > 0 && <DocumentList docs={shown} />}
    </>
  );
}
