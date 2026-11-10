import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import { AccountSection } from "@/components/admin/clients/account-section";
import { ChecklistSection } from "@/components/admin/clients/checklist-section";
import { ClientForm } from "@/components/admin/clients/client-form";
import { ClientStatus } from "@/components/admin/clients/client-status";
import { ContactCard } from "@/components/admin/clients/contact-card";
import { PaymentHistory } from "@/components/admin/clients/payment-history";
import { PlanSection } from "@/components/admin/clients/plan-section";
import { ProjectSection } from "@/components/admin/clients/project-section";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { ClientDocuments } from "@/components/admin/documents/client-documents";
import { FormError } from "@/components/admin/fields";
import { IconLink } from "@/components/admin/icon-link";
import { PageHeader } from "@/components/admin/page-header";
import { Stat } from "@/components/admin/stat";
import { BUTTON, CARD, CARD_TITLE, rise } from "@/components/ui/styles";
import { listAccounts } from "@/services/accounts";
import { isAdmin, requireAdmin } from "@/services/admin-session";
import { listChecklist } from "@/services/checklist";
import { getClient, whatsappLink } from "@/services/clients";
import { br } from "@/services/dates";
import { listDocuments, listTemplates } from "@/services/documents";
import { readId } from "@/services/form-input";
import { brl } from "@/services/money";
import { clientMoney, listClientPayments } from "@/services/payments";
import { listPlans } from "@/services/plans";
import { listProjects } from "@/services/projects";
import { removeClient } from "../actions";

/* Ficha do cliente: o dinheiro em quatro números no topo, contratos à esquerda (planos e
   projetos, onde o dinheiro acontece), e à direita o que se consulta (contato, contas, recebidos).
   Cada formulário abre por um parâmetro da URL — `?plano=novo`, `?projeto=3`, `?conta=nova` — no
   lugar do item, e a action devolve pra cá com `?feito=` e a âncora do item mexido, que pisca.

   Os blocos entram em cascata (`rise`) quando a ficha abre. Trocar só a query não remonta nada
   (o Next mantém a árvore), então a cascata não se repete a cada formulário aberto: só o que
   aparece de novo — o formulário, a confirmação — entra animado. */

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
    feito?: string;
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

  const [client, plans, projects, payments, accounts, documents, templates, checklist] = await Promise.all([
    getClient(id),
    listPlans(id),
    listProjects(id),
    listClientPayments(id),
    listAccounts(id),
    listDocuments(id),
    listTemplates(),
    listChecklist(id),
  ]);
  if (!client) notFound();

  const page = `/admin/clientes/${id}`;
  const money = clientMoney(plans, projects, payments);
  const hasContract = money.activePlans > 0 || projects.some((project) => project.status === "approved" || project.status === "in_progress");
  /* o erro é de quem estiver aberto; sem formulário aberto, ele é da ficha (exclusão recusada) */
  const formOpen = Boolean(searchParams.plano || searchParams.projeto || searchParams.parcela || searchParams.conta);
  const erroDaFicha = searchParams.editar === undefined && !formOpen ? searchParams.erro : undefined;
  /* A URL aponta pra dentro de um bloco — formulário aberto, item que acabou de mudar, exclusão
     sendo confirmada: esse bloco abre mesmo que você o tenha recolhido. */
  const touches = (...prefixes: string[]) =>
    [searchParams.feito, searchParams.excluir].some((value) => value && prefixes.some((prefix) => value.startsWith(prefix)));

  return (
    <>
      <PageHeader
        back={{ href: "/admin/clientes", label: "Clientes" }}
        title={client.name}
        description={<ClientStatus overdue={money.overdue > 0} active={hasContract} />}
        actions={
          <>
            {client.whatsapp && (
              <a href={whatsappLink(client.whatsapp)} target="_blank" rel="noopener noreferrer" className={BUTTON}>
                <MessageCircle className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                WhatsApp
              </a>
            )}
            <Link href={`${page}?editar`} className={BUTTON}>
              <Pencil className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              Editar
            </Link>
            <IconLink href={`${page}?excluir=cliente`} label="Excluir cliente" icon={Trash2} danger />
          </>
        }
      />

      {searchParams.excluir === "cliente" && (
        <div className={`${CARD} mb-6 border-l-2 border-danger ${rise(0)}`}>
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
        <section className={`${CARD} mb-6 border-l-2 border-accent ${rise(0)}`}>
          <h2 className={`${CARD_TITLE} mb-5`}>Dados do cliente</h2>
          <ClientForm client={client} erro={searchParams.erro} cancelHref={page} />
        </section>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <Stat
          className={rise(0)}
          label="Mensal em planos"
          value={brl(money.monthly)}
          hint={money.activePlans ? `${money.activePlans} ${money.activePlans === 1 ? "plano ativo" : "planos ativos"}` : "sem plano ativo"}
        />
        <Stat className={rise(1)} label="Recebido" value={brl(money.received)} hint="desde o início" />
        <Stat
          className={rise(2)}
          label="A receber"
          value={brl(money.open)}
          alert={money.overdue > 0}
          hint={money.overdue > 0 ? <span className="text-danger">{brl(money.overdue)} vencido</span> : "nada vencido"}
        />
        <Stat
          className={rise(3)}
          label="Próximo vencimento"
          value={money.next ? br(money.next.dueOn) : "—"}
          hint={money.next ? `${brl(money.next.amount)} · ${money.next.label}` : "nada agendado"}
        />
      </div>

      {/* Coluna principal: os contratos e o que se faz com eles — planos, projetos, contas (que
          pedem espaço para a grade de cartões) e documentos. À direita, o que se consulta. */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className={rise(4)}>
            <PlanSection
              clientId={id}
              plans={plans}
              payments={payments}
              open={searchParams.plano}
              excluir={searchParams.excluir}
              erro={searchParams.plano ? searchParams.erro : undefined}
              feito={searchParams.feito}
              forceOpen={Boolean(searchParams.plano) || touches("plano-", "pagamento-")}
            />
          </div>
          <div className={rise(5)}>
            <ProjectSection
              clientId={id}
              projects={projects}
              payments={payments}
              open={searchParams.projeto}
              parcela={searchParams.parcela}
              excluir={searchParams.excluir}
              erro={searchParams.projeto || searchParams.parcela ? searchParams.erro : undefined}
              feito={searchParams.feito}
              forceOpen={Boolean(searchParams.projeto || searchParams.parcela) || touches("projeto-", "parcela-")}
            />
          </div>
          <div className={rise(6)}>
            <AccountSection
              clientId={id}
              accounts={accounts}
              open={searchParams.conta}
              excluir={searchParams.excluir}
              erro={searchParams.conta ? searchParams.erro : undefined}
              feito={searchParams.feito}
              forceOpen={Boolean(searchParams.conta) || touches("conta-")}
            />
          </div>
          <div className={rise(7)}>
            <ClientDocuments clientId={id} documents={documents} templates={templates} projects={projects} plans={plans} />
          </div>
          <div className={rise(8)}>
            <ChecklistSection clientId={id} done={checklist} feito={searchParams.feito} />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div className={rise(5)}>
            <ContactCard client={client} editHref={`${page}?editar`} highlight={searchParams.feito === "contato"} />
          </div>
          <div className={rise(6)}>
            <PaymentHistory payments={payments} />
          </div>
        </div>
      </div>
    </>
  );
}
