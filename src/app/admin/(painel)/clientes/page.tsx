import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ClientForm } from "@/components/admin/clients/client-form";
import { ClientList } from "@/components/admin/clients/client-list";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON_SOLID, CARD, CARD_TITLE, rise } from "@/components/ui/styles";
import { requireAdmin } from "@/services/admin-session";
import { listClients } from "@/services/clients";
import { brl } from "@/services/money";

/* Lista de clientes. A conta de cada um — planos, projetos, pagamentos — fica na ficha
   (/admin/clientes/[id]); aqui só o que dá pra decidir de relance, com os atrasados em cima. */
export const metadata: Metadata = { title: "Clientes" };

const PAGE = "/admin/clientes";

type Params = { searchParams: Promise<{ novo?: string; erro?: string }> };

export default async function ClientesPage(props: Params) {
  await requireAdmin();
  const searchParams = await props.searchParams;

  /* Sem as tabelas (sql/migrations), a página avisa em vez de cair no error.tsx */
  const clients = await listClients().catch((error: unknown) => {
    console.error("[admin] falha ao ler clientes:", error);
    return null;
  });
  const list = clients ?? [];
  const mensal = list.reduce((sum, client) => sum + client.monthly, 0);

  return (
    <>
      <PageHeader
        title="Clientes"
        description={`${list.length} ${list.length === 1 ? "cliente" : "clientes"} · ${brl(mensal)}/mês em planos ativos`}
        actions={
          searchParams.novo === undefined && (
            <Link href={`${PAGE}?novo`} className={BUTTON_SOLID}>
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              Novo cliente
            </Link>
          )
        }
      />

      {searchParams.novo !== undefined && (
        <section className={`${CARD} mb-8 border-l-2 border-accent ${rise(0)}`}>
          <h2 className={`${CARD_TITLE} mb-5`}>Novo cliente</h2>
          <ClientForm erro={searchParams.erro} cancelHref={PAGE} />
        </section>
      )}

      {clients === null && (
        <p role="alert" className="text-ui text-danger">
          Não consegui ler os clientes. As tabelas foram criadas? Rode `npm run migrate`.
        </p>
      )}

      {clients?.length === 0 && searchParams.novo === undefined && (
        <p className="text-ui text-ink/60">Nenhum cliente ainda. Cadastre o primeiro no botão aí em cima.</p>
      )}

      {list.length > 0 && <ClientList clients={list} />}
    </>
  );
}
