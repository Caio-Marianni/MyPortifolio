import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon, UsersIcon } from "@phosphor-icons/react/ssr";
import { ActionNotice } from "@/components/admin/action-notice";
import { ClientForm } from "@/components/admin/clients/client-form";
import { ClientList } from "@/components/admin/clients/client-list";
import { RememberView } from "@/components/admin/clients/remember-view";
import { PageHeader } from "@/components/admin/page-header";
import { FilterMenu } from "@/components/admin/filter-menu";
import { Modal } from "@/components/admin/modal";
import { BUTTON_ADD } from "@/components/ui/styles";
import { requireAdmin } from "@/services/admin-session";
import { CLIENT_VIEWS, CLIENT_VIEW_LABEL, clientListHref, inView, listClients, type ClientView } from "@/services/clients";
import { oneOf } from "@/services/form-input";

/* Lista de clientes. A conta de cada um — planos, projetos, pagamentos — fica na ficha
   (/admin/clientes/[id]); aqui só o que dá pra decidir de relance, com os atrasados em cima. */
export const metadata: Metadata = { title: "Clientes" };

const PAGE = "/admin/clientes";

/* o filtro não achou ninguém ("todos" não chega aqui: com cliente cadastrado, ele sempre acha) */
const EMPTY_VIEW: Record<ClientView, string> = {
  ativos: "Nenhum cliente ativo agora. Os antigos estão em Inativos, no filtro.",
  atraso: "Nenhum cliente em atraso. Tudo em dia.",
  inativos: "Nenhum cliente inativo.",
  todos: "Nenhum cliente.",
};

type Params = { searchParams: Promise<{ novo?: string; erro?: string; ok?: string; ver?: string }> };

export default async function ClientesPage(props: Params) {
  await requireAdmin();
  const searchParams = await props.searchParams;

  /* Sem as tabelas (sql/migrations), a página avisa em vez de cair no error.tsx */
  const clients = await listClients().catch((error: unknown) => {
    console.error("[admin] falha ao ler clientes:", error);
    return null;
  });
  const all = clients ?? [];
  const view: ClientView = oneOf(searchParams.ver ?? "", CLIENT_VIEWS) ?? "ativos";
  const list = all.filter((client) => inView(client, view));
  /* a lista como está (com o filtro): pra onde a janela de cadastro volta ao fechar */
  const here = clientListHref(view);
  const active = all.filter((client) => inView(client, "ativos")).length;
  const late = all.filter((client) => client.overdue).length;
  /* a frase do header: o que muda de um dia pro outro */
  const summary =
    all.length === 0
      ? "Nenhum cliente ainda."
      : `${active} ${active === 1 ? "ativo" : "ativos"}${late ? ` · ${late} em atraso` : " · nada em atraso"}`;
  const views = CLIENT_VIEWS.map((value) => ({
    value,
    label: CLIENT_VIEW_LABEL[value],
    count: all.filter((client) => inView(client, value)).length,
    alert: value === "atraso",
  }));

  return (
    <>
      <PageHeader
        title="Clientes"
        icon={UsersIcon}
        description={summary}
        actions={
          <>
            {all.length > 0 && <FilterMenu base={PAGE} current={view} options={views} />}
            {/* o botão fica no lugar com a janela aberta: nada no header mexe */}
            <Link href={`${here}${here.includes("?") ? "&" : "?"}novo`} scroll={false} className={BUTTON_ADD}>
              <PlusIcon className="h-4 w-4" aria-hidden weight="bold" />
              Novo cliente
            </Link>
          </>
        }
      />

      {/* cadastro numa janela por cima da lista, em vez de um bloco que empurrava a página */}
      {searchParams.novo !== undefined && (
        <Modal title="Novo cliente" closeHref={here}>
          <ClientForm erro={searchParams.erro} cancelHref={here} />
        </Modal>
      )}

      {clients === null && (
        <p role="alert" className="text-ui text-danger">
          Não consegui ler os clientes. As tabelas foram criadas? Rode `npm run migrate`.
        </p>
      )}

      {clients?.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-ink/15 px-6 py-16 text-center">
          <UsersIcon className="h-8 w-8 text-ink/30" aria-hidden weight="regular" />
          <p className="text-ui text-ink/60">Nenhum cliente ainda.</p>
          <Link href={`${PAGE}?novo`} scroll={false} className={BUTTON_ADD}>
            <PlusIcon className="h-4 w-4" aria-hidden weight="bold" />
            Cadastrar o primeiro
          </Link>
        </div>
      )}

      {all.length > 0 && list.length === 0 && <p className="text-ui text-ink/60">{EMPTY_VIEW[view]}</p>}

      {list.length > 0 && <ClientList clients={list} />}

      <ActionNotice ok={searchParams.ok} closeHref={here} />
      <RememberView view={view} />
    </>
  );
}
