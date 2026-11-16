import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { ArrowRightIcon, FileTextIcon, PlusIcon, UserIcon } from "@phosphor-icons/react/ssr";
import { GenerateForm } from "@/components/admin/documents/client-documents";
import { DocumentList } from "@/components/admin/documents/document-list";
import { Select } from "@/components/admin/fields";
import { FilterMenu } from "@/components/admin/filter-menu";
import { FormCard } from "@/components/admin/form-card";
import { Modal } from "@/components/admin/modal";
import { ModalActions } from "@/components/admin/modal-actions";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON, BUTTON_ADD, BUTTON_SOLID } from "@/components/ui/styles";
import { requireAdmin } from "@/services/admin-session";
import { getClient, listClients } from "@/services/clients";
import { DOC_STATUSES, DOC_STATUS_LABEL, listDocuments, listTemplates } from "@/services/documents";
import { readId } from "@/services/form-input";
import { listPlans } from "@/services/plans";
import { listProjects } from "@/services/projects";

/* Todos os documentos, de todos os clientes. O "Novo documento" abre uma janela por cima da lista
   (`?novo`) que pede primeiro o cliente — é de lá que saem os dados que o modelo pede — e depois
   o modelo e o projeto ou plano. */
export const metadata: Metadata = { title: "Documentos" };

const PAGE = "/admin/documentos";

const withParam = (href: string, param: string) => `${href}${href.includes("?") ? "&" : "?"}${param}`;

/** O miolo da janela. Escolher o cliente é um formulário GET (`next/form`: navega sem recarregar,
    e a janela fica aberta) que volta com `?cliente=`; daí o mesmo formulário de gerar da ficha,
    já com os projetos e planos dele. `here`: a lista com o filtro, pra onde a janela volta. */
async function NewDocument({ clientId, here, erro }: { clientId: number | null; here: string; erro?: string }) {
  const client = clientId ? await getClient(clientId) : null;

  if (!client) {
    const clients = await listClients();
    if (clients.length === 0) {
      return (
        <p className="text-ui text-ink/60">
          Cadastre um cliente primeiro.{" "}
          <Link href="/admin/clientes?novo" className="font-semibold text-ink underline-offset-4 hover:underline">
            Novo cliente
          </Link>
        </p>
      );
    }
    const ver = new URLSearchParams(here.split("?")[1]).get("ver");
    return (
      <Form action={PAGE} scroll={false} className="flex flex-col gap-4">
        <input type="hidden" name="novo" value="" />
        {ver && <input type="hidden" name="ver" value={ver} />}
        <FormCard icon={UserIcon} title="Cliente" hint="os dados do documento saem dele" columns={1}>
          <Select label="Cliente" name="cliente" icon={UserIcon} options={clients.map((c) => ({ value: String(c.id), label: c.name }))} />
        </FormCard>
        <ModalActions cancelHref={here}>
          <button type="submit" className={BUTTON_SOLID}>
            Continuar
            <ArrowRightIcon className="h-4 w-4" aria-hidden weight="bold" />
          </button>
        </ModalActions>
      </Form>
    );
  }

  const [templates, projects, plans] = await Promise.all([listTemplates(), listProjects(client.id), listPlans(client.id)]);
  return (
    <div className="flex flex-col gap-4">
      <p className="flex flex-wrap items-baseline justify-between gap-3 text-ui">
        <span>
          Para <span className="font-semibold">{client.name}</span>
        </span>
        <Link href={withParam(here, "novo")} scroll={false} className="text-meta font-semibold text-ink/60 hover:text-ink">
          Trocar cliente
        </Link>
      </p>
      <GenerateForm
        clientId={client.id}
        templates={templates}
        projects={projects}
        plans={plans}
        cancelHref={here}
        from={withParam(here, `novo&cliente=${client.id}`)}
        erro={erro}
      />
    </div>
  );
}

type Params = { searchParams: Promise<{ ver?: string; novo?: string; cliente?: string; erro?: string }> };

export default async function DocumentosPage(props: Params) {
  await requireAdmin();
  const { ver: param, novo, cliente, erro } = await props.searchParams;

  const docs = await listDocuments().catch((error: unknown) => {
    console.error("[admin] falha ao ler documentos:", error);
    return null;
  });
  const all = docs ?? [];
  const ver = DOC_STATUSES.find((status) => status === param) ?? "todos";
  const shown = ver === "todos" ? all : all.filter((doc) => doc.status === ver);
  /* a lista como está (com o filtro): pra onde a janela volta ao fechar */
  const here = ver === "todos" ? PAGE : `${PAGE}?ver=${ver}`;

  return (
    <>
      <PageHeader
        title="Documentos"
        icon={FileTextIcon}
        description="Propostas e contratos, de todos os clientes."
        actions={
          <>
            <FilterMenu
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
            <Link href={`${PAGE}/modelos`} className={BUTTON}>
              <FileTextIcon className="h-4 w-4" aria-hidden weight="bold" />
              Modelos
            </Link>
            {/* o botão fica no lugar com a janela aberta: nada no header mexe */}
            <Link href={withParam(here, "novo")} scroll={false} className={BUTTON_ADD}>
              <PlusIcon className="h-4 w-4" aria-hidden weight="bold" />
              Novo documento
            </Link>
          </>
        }
      />

      {novo !== undefined && docs !== null && (
        <Modal title="Novo documento" closeHref={here}>
          <NewDocument clientId={readId(cliente ?? null)} here={here} erro={erro} />
        </Modal>
      )}

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
