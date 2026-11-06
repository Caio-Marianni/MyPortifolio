import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { AccountSection } from "@/components/admin/clients/account-section";
import { ClientForm } from "@/components/admin/clients/client-form";
import { PaymentHistory } from "@/components/admin/clients/payment-history";
import { PlanSection } from "@/components/admin/clients/plan-section";
import { ProjectSection } from "@/components/admin/clients/project-section";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { ClientDocuments } from "@/components/admin/documents/client-documents";
import { FormError } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON, CARD, CARD_TITLE } from "@/components/admin/styles";
import { listAccounts } from "@/services/accounts";
import { isAdmin, requireAdmin } from "@/services/admin-session";
import { formatWhatsapp, getClient, siteHref, whatsappLink } from "@/services/clients";
import { listDocuments, listTemplates } from "@/services/documents";
import { readId } from "@/services/form-input";
import { listClientPayments } from "@/services/payments";
import { listPlans } from "@/services/plans";
import { listProjects } from "@/services/projects";
import { removeClient } from "../actions";

/* Ficha do cliente: contratos à esquerda (planos e projetos, onde o dinheiro acontece), e à
   direita o que se consulta (dados, contas, recebidos). Cada formulário abre por um parâmetro
   da URL — `?plano=novo`, `?projeto=3`, `?conta=nova` — e a action devolve pra cá. */

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    editar?: string;
    excluir?: string;
    plano?: string;
    projeto?: string;
    parcela?: string;
    conta?: string;
    erro?: string;
  }>;
};

/* a metadata roda à parte da página: confere a sessão por conta própria, senão o nome vazaria */
export async function generateMetadata(props: Params): Promise<Metadata> {
  const id = readId((await props.params).id);
  const client = id && (await isAdmin()) ? await getClient(id).catch(() => null) : null;
  return { title: client?.name ?? "Cliente" };
}

export default async function ClientePage(props: Params) {
  await requireAdmin();
  const id = readId((await props.params).id);
  const searchParams = await props.searchParams;
  if (!id) notFound();

  const [client, plans, projects, payments, accounts, documents, templates] = await Promise.all([
    getClient(id),
    listPlans(id),
    listProjects(id),
    listClientPayments(id),
    listAccounts(id),
    listDocuments(id),
    listTemplates(),
  ]);
  if (!client) notFound();

  const page = `/admin/clientes/${id}`;
  /* o erro é de quem estiver aberto; sem formulário aberto, ele é da ficha (exclusão recusada) */
  const formOpen = Boolean(searchParams.plano || searchParams.projeto || searchParams.parcela || searchParams.conta);
  const erroDaFicha = searchParams.editar === undefined && !formOpen ? searchParams.erro : undefined;

  return (
    <>
      <PageHeader
        back={{ href: "/admin/clientes", label: "Clientes" }}
        title={client.name}
        description={
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            {client.document && <span>{client.document}</span>}
            {client.email && (
              <a href={`mailto:${client.email}`} className="underline-offset-4 hover:underline">
                {client.email}
              </a>
            )}
            {client.site && (
              <a href={siteHref(client.site)} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                {client.site}
              </a>
            )}
          </span>
        }
        actions={
          <>
            {client.whatsapp && (
              <a
                href={whatsappLink(client.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BUTTON} inline-flex items-center gap-2`}
              >
                {formatWhatsapp(client.whatsapp)}
                <MessageCircle className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
              </a>
            )}
            <Link href={`${page}?editar`} className={BUTTON}>
              Editar
            </Link>
            <Link href={`${page}?excluir=cliente`} className={`${BUTTON} text-danger`}>
              Excluir
            </Link>
          </>
        }
      />

      {searchParams.excluir === "cliente" && (
        <div className={`${CARD} mb-6 border-danger`}>
          <DeleteConfirm
            action={removeClient}
            fields={{ id }}
            message="Exclui o cliente com contas, planos, projetos e rascunhos. Pagamento recebido ou documento enviado impedem."
            cancelHref={page}
          />
        </div>
      )}

      {erroDaFicha && (
        <div className="mb-6">
          <FormError message={erroDaFicha} />
        </div>
      )}

      {searchParams.editar !== undefined && (
        <section className={`${CARD} mb-6 border-ink`}>
          <h2 className={`${CARD_TITLE} mb-5`}>Dados do cliente</h2>
          <ClientForm client={client} erro={searchParams.erro} cancelHref={page} />
        </section>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          <PlanSection
            clientId={id}
            plans={plans}
            payments={payments}
            open={searchParams.plano}
            excluir={searchParams.excluir}
            erro={searchParams.plano ? searchParams.erro : undefined}
          />
          <ProjectSection
            clientId={id}
            projects={projects}
            payments={payments}
            open={searchParams.projeto}
            parcela={searchParams.parcela}
            excluir={searchParams.excluir}
            erro={searchParams.projeto || searchParams.parcela ? searchParams.erro : undefined}
          />
          <ClientDocuments clientId={id} documents={documents} templates={templates} projects={projects} plans={plans} />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          {(client.address || client.notes) && (
            <section className={`${CARD} flex flex-col gap-3 text-[13.5px]`}>
              <h2 className={CARD_TITLE}>Dados</h2>
              {client.address && <p className="text-ink/75">{client.address}</p>}
              {client.notes && <p className="whitespace-pre-line leading-relaxed text-ink/75">{client.notes}</p>}
            </section>
          )}
          <AccountSection
            clientId={id}
            accounts={accounts}
            open={searchParams.conta}
            excluir={searchParams.excluir}
            erro={searchParams.conta ? searchParams.erro : undefined}
          />
          <PaymentHistory payments={payments} />
        </div>
      </div>
    </>
  );
}
