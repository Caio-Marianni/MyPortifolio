import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyIcon, DotsThreeIcon, EnvelopeSimpleIcon, NoteIcon, PencilSimpleIcon, PlusIcon, TrashIcon, WalletIcon, WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { ActionNotice } from "@/components/admin/action-notice";
import { AccountSection } from "@/components/admin/clients/account-section";
import { ClientLogo } from "@/components/admin/clients/client-logo";
import { ClientModals } from "@/components/admin/clients/client-modals";
import { PaymentHistory } from "@/components/admin/clients/payment-history";
import { PlanSection } from "@/components/admin/clients/plan-section";
import { ProjectSection } from "@/components/admin/clients/project-section";
import { SheetTabs, TabLink } from "@/components/admin/clients/sheet-tabs";
import { sheetTab, tabHref } from "@/components/admin/clients/tabs";
import { CopyButton } from "@/components/admin/copy-field";
import { ClientDocuments } from "@/components/admin/documents/client-documents";
import { Dropdown } from "@/components/admin/dropdown";
import { FormError } from "@/components/admin/fields";
import { IconLink } from "@/components/admin/icon-link";
import { PageHeader } from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { Stat } from "@/components/admin/stat";
import { BUTTON, BUTTON_ADD, FOCUS, ICON_BUTTON, MENU_ITEM } from "@/components/ui/styles";
import { listAccounts, renewal } from "@/services/accounts";
import { isAdmin, requireAdmin } from "@/services/admin-session";
import {
  CLIENT_VIEWS,
  CLIENT_VIEW_COOKIE,
  chargeMessage,
  clientListHref,
  getClient,
  initials,
  siteHost,
  siteHref,
  whatsappLink,
} from "@/services/clients";
import { br, relativeDays, todayInBrazil } from "@/services/dates";
import { listDocuments, listTemplates } from "@/services/documents";
import { oneOf, readId } from "@/services/form-input";
import { brl } from "@/services/money";
import { clientMoney, listClientPayments, type ClientMoney } from "@/services/payments";
import { listPlans } from "@/services/plans";
import { listProjects } from "@/services/projects";
import { listQueue, reportMonth } from "@/services/reports";

/* Ficha do cliente, em abas (`?aba=`): Financeiro — os números, planos, projetos e, ao lado, as
   anotações e o que entrou —, Contas e acessos e Documentos. As três vêm montadas daqui
   e a troca entre elas é no navegador (SheetTabs), sem voltar ao servidor. Os dados de contato moram
   na janela de editar; à mão ficam o site (embaixo do nome), o WhatsApp e, no "⋯", e-mail, CPF/CNPJ
   e endereço.
   Todo formulário e toda confirmação abrem numa janela pela URL (ClientModals); a action devolve
   pra cá com `?feito=` e a âncora do item mexido, que pisca, e a aba sai do que foi mexido. */

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    aba?: string;
    editar?: string;
    excluir?: string;
    plano?: string;
    projeto?: string;
    parcela?: string;
    conta?: string;
    gerar?: string;
    erro?: string;
    feito?: string;
    /** o aviso da última ação (ActionNotice) e o pagamento que o "Desfazer" desfaz */
    ok?: string;
    desfazer?: string;
  }>;
};

/* a metadata roda à parte da página: confere a sessão por conta própria, senão o nome vazaria */
export async function generateMetadata(props: Params): Promise<Metadata> {
  const id = readId((await props.params).id);
  const client = id && (await isAdmin()) ? await getClient(id).catch(() => null) : null;
  return { title: client?.name ?? "Cliente" };
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** A frase do header: o que muda de um dia pro outro. Atraso manda, em vermelho. */
function headline(money: ClientMoney, today: string, hasContract: boolean): ReactNode {
  if (money.overdue > 0 && money.overdueSince) {
    const since = relativeDays(money.overdueSince, today);
    return (
      <span className="text-danger">
        {brl(money.overdue)} em atraso {since === "ontem" ? "desde ontem" : since}
      </span>
    );
  }
  const parts = [money.monthly > 0 && `${brl(money.monthly)}/mês`, money.next && `vence ${relativeDays(money.next.dueOn, today)}`].filter(Boolean);
  if (parts.length > 0) return parts.join(" · ");
  return hasContract ? "Em dia" : "Sem contrato ativo";
}

export default async function ClientePage(props: Params) {
  await requireAdmin();
  const id = readId((await props.params).id);
  const searchParams = await props.searchParams;
  if (!id) notFound();

  const today = todayInBrazil();
  const month = reportMonth(today);
  const [client, plans, projects, payments, accounts, documents, templates, reports] = await Promise.all([
    getClient(id),
    listPlans(id),
    listProjects(id),
    listClientPayments(id),
    listAccounts(id),
    listDocuments(id),
    listTemplates(),
    listQueue(month, id),
  ]);
  if (!client) notFound();

  /* a seta volta pra lista no filtro em que você a deixou (RememberView) */
  const listView = oneOf((await cookies()).get(CLIENT_VIEW_COOKIE)?.value ?? "", CLIENT_VIEWS) ?? "ativos";
  const page = `/admin/clientes/${id}`;
  const tab = sheetTab(searchParams);
  /* a aba que a URL pediu: pra onde as janelas voltam ao fechar */
  const here = tabHref(page, tab);

  const money = clientMoney(plans, projects, payments);
  const late = money.overdue > 0 && money.overdueSince !== null;
  const hasContract = money.activePlans > 0 || projects.some((project) => project.status === "approved" || project.status === "in_progress");
  const undoId = readId(searchParams.desfazer);

  /* o erro é da janela aberta; sem janela, ele é da ficha (exclusão recusada) */
  const modalOpen =
    searchParams.editar !== undefined ||
    searchParams.gerar !== undefined ||
    Boolean(searchParams.plano || searchParams.projeto || searchParams.parcela || searchParams.conta || searchParams.excluir);
  const erroDaFicha = modalOpen ? undefined : searchParams.erro;
  const hasContactExtras = Boolean(client.email || client.document || client.address);

  /* só com texto; fica em cima do "Recebido", que é onde o olho passa antes de cobrar ou ligar */
  const notes = client.notes && (
    <SectionCard
      id="anotacoes"
      icon={<NoteIcon className="h-4 w-4" weight="bold" aria-hidden />}
      title="Anotações"
      action={<IconLink href={`${page}?editar`} label="Editar anotações" icon={PencilSimpleIcon} />}
    >
      <p className="whitespace-pre-line text-ui leading-relaxed text-ink/75">{client.notes}</p>
    </SectionCard>
  );

  return (
    <>
      <PageHeader
        back={{ href: clientListHref(listView), label: "Clientes" }}
        leading={<ClientLogo host={siteHost(client.site)} initials={initials(client.name)} />}
        title={client.name}
        subtitle={
          client.site && (
            <a href={siteHref(client.site)} target="_blank" rel="noopener noreferrer" className={`rounded underline-offset-4 hover:text-ink hover:underline ${FOCUS}`}>
              {client.site}
            </a>
          )
        }
        description={headline(money, today, hasContract)}
        actions={
          <>
            {client.whatsapp && (
              <a
                href={whatsappLink(client.whatsapp, late && money.overdueSince ? chargeMessage({ amount: money.overdue, dueOn: money.overdueSince }) : undefined)}
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON}
              >
                <WhatsappLogoIcon className={`h-4 w-4 ${late ? "text-danger" : ""}`} aria-hidden weight="bold" />
                {late ? "Cobrar" : "WhatsApp"}
              </a>
            )}
            <TabLink page={page} query="editar" className={BUTTON}>
              <PencilSimpleIcon className="h-4 w-4" aria-hidden weight="bold" />
              Editar
            </TabLink>
            {/* o contato de vez em quando e o que é raro e perigoso ficam fora da vista, atrás do "⋯" */}
            <Dropdown label="Mais ações" triggerClassName={ICON_BUTTON} trigger={<DotsThreeIcon className="h-[18px] w-[18px]" aria-hidden weight="bold" />}>
              {client.email && (
                <a href={`mailto:${client.email}`} title={client.email} className={MENU_ITEM}>
                  <EnvelopeSimpleIcon className="h-4 w-4" aria-hidden weight="bold" />
                  Enviar e-mail
                </a>
              )}
              {client.document && (
                <CopyButton value={client.document} label="Copiar CPF/CNPJ" className={MENU_ITEM}>
                  <CopyIcon className="h-4 w-4" aria-hidden weight="bold" />
                  Copiar CPF/CNPJ
                </CopyButton>
              )}
              {client.address && (
                <CopyButton value={client.address} label="Copiar endereço" className={MENU_ITEM}>
                  <CopyIcon className="h-4 w-4" aria-hidden weight="bold" />
                  Copiar endereço
                </CopyButton>
              )}
              {hasContactExtras && <hr className="my-1 border-ink/10" />}
              <TabLink page={page} query="excluir=cliente" className={`${MENU_ITEM} text-danger`}>
                <TrashIcon className="h-4 w-4" aria-hidden weight="bold" />
                Excluir cliente
              </TabLink>
            </Dropdown>
          </>
        }
      />

      {erroDaFicha && (
        <div className="mb-6">
          <FormError message={erroDaFicha} />
        </div>
      )}

      <SheetTabs
        page={page}
        info={{
          financeiro: { alert: late },
          contas: {
            count: String(accounts.length),
            alert: accounts.some((account) => account.expiresOn !== null && renewal(account.expiresOn, today).tone === "late"),
          },
          documentos: { count: String(documents.length) },
        }}
        panels={{
          /* Sem plano nem projeto não há número nenhum pra mostrar: uma chamada só, com os dois
             caminhos. Com contrato, os números em cima, planos e projetos à esquerda e, à direita,
             as anotações e o que já entrou. O "Mensal" só aparece com plano ativo. */
          financeiro:
            plans.length === 0 && projects.length === 0 ? (
              <div className={`grid items-start gap-6 ${notes ? "lg:grid-cols-[minmax(0,1fr)_320px]" : ""}`}>
                <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-ink/15 px-6 py-16 text-center">
                  <WalletIcon className="h-8 w-8 text-ink/30" aria-hidden weight="regular" />
                  <p className="text-ui text-ink/60">Comece por um plano mensal ou um projeto.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Link href={`${page}?plano=novo`} scroll={false} className={BUTTON_ADD}>
                      <PlusIcon className="h-4 w-4" aria-hidden weight="bold" />
                      Plano mensal
                    </Link>
                    <Link href={`${page}?projeto=novo`} scroll={false} className={BUTTON_ADD}>
                      <PlusIcon className="h-4 w-4" aria-hidden weight="bold" />
                      Projeto
                    </Link>
                  </div>
                </div>
                {notes}
              </div>
            ) : (
              <>
                <div className={`mb-6 grid gap-3 md:gap-4 ${money.activePlans > 0 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                  <Stat
                    label="A receber"
                    value={brl(money.open)}
                    alert={money.overdue > 0}
                    hint={money.overdue > 0 ? <span className="text-danger">{brl(money.overdue)} vencido</span> : "nada vencido"}
                  />
                  <Stat
                    label="Próximo vencimento"
                    value={money.next ? capitalize(relativeDays(money.next.dueOn, today)) : "—"}
                    hint={money.next ? `${br(money.next.dueOn)} · ${brl(money.next.amount)} · ${money.next.label}` : "nada agendado"}
                  />
                  {money.activePlans > 0 && (
                    <Stat
                      label="Mensal"
                      value={brl(money.monthly)}
                      hint={`por mês · ${money.activePlans} ${money.activePlans === 1 ? "plano ativo" : "planos ativos"}`}
                    />
                  )}
                </div>
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="flex min-w-0 flex-col gap-6">
                    <PlanSection clientId={id} plans={plans} payments={payments} reports={reports} reportMonth={month} feito={searchParams.feito} />
                    <ProjectSection clientId={id} projects={projects} payments={payments} feito={searchParams.feito} />
                  </div>
                  <div className="flex min-w-0 flex-col gap-6">
                    {notes}
                    <PaymentHistory payments={payments} />
                  </div>
                </div>
              </>
            ),
          contas: <AccountSection clientId={id} accounts={accounts} feito={searchParams.feito} />,
          documentos: <ClientDocuments clientId={id} documents={documents} />,
        }}
      />

      <ClientModals
        params={searchParams}
        here={here}
        client={client}
        plans={plans}
        projects={projects}
        payments={payments}
        accounts={accounts}
        templates={templates}
      />

      <ActionNotice
        ok={searchParams.ok}
        undo={undoId ? { clientId: id, id: undoId, anchor: searchParams.feito ?? "" } : undefined}
        closeHref={here}
      />
    </>
  );
}
