import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/admin/badge";
import { ClientForm } from "@/components/admin/clients/client-form";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON_SOLID, CARD, CARD_TITLE, NUM } from "@/components/admin/styles";
import { requireAdmin } from "@/services/admin-session";
import { formatWhatsapp, listClients, type ClientRow } from "@/services/clients";
import { brl } from "@/services/money";

/* Lista de clientes. A conta de cada um — planos, projetos, pagamentos — fica na ficha
   (/admin/clientes/[id]); aqui só o que dá pra decidir de relance, com os atrasados em cima. */
export const metadata: Metadata = { title: "Clientes" };

const PAGE = "/admin/clientes";

function Situacao({ client }: { client: ClientRow }) {
  if (client.overdue) return <Badge tone="danger">Atrasado</Badge>;
  if (client.activePlans || client.openProjects) return <Badge tone="ok">Em dia</Badge>;
  return <Badge>Sem contrato ativo</Badge>;
}

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
              Novo cliente
            </Link>
          )
        }
      />

      {searchParams.novo !== undefined && (
        <section className={`${CARD} mb-8 border-ink`}>
          <h2 className={`${CARD_TITLE} mb-5`}>Novo cliente</h2>
          <ClientForm erro={searchParams.erro} cancelHref={PAGE} />
        </section>
      )}

      {clients === null && (
        <p role="alert" className="text-[13px] text-danger">
          Não consegui ler os clientes. As tabelas foram criadas? Rode `npm run migrate`.
        </p>
      )}

      {clients?.length === 0 && searchParams.novo === undefined && (
        <p className="text-[14px] text-ink/60">Nenhum cliente ainda. Cadastre o primeiro no botão aí em cima.</p>
      )}

      {list.length > 0 && (
        /* tabela de verdade: no celular ela rola de lado em vez de espremer as colunas */
        <div className={`${CARD} overflow-x-auto p-0 md:p-0`}>
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="border-b border-ink/10 text-[12.5px] text-ink/60">
              <tr>
                <th className="px-5 py-3 font-normal">Cliente</th>
                <th className="px-5 py-3 font-normal">WhatsApp</th>
                <th className="px-5 py-3 font-normal">Contratos</th>
                <th className="px-5 py-3 text-right font-normal">Mensal</th>
                <th className="px-5 py-3 font-normal">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {list.map((client) => (
                <tr key={client.id} className="hover:bg-ink/[0.03]">
                  <td className="px-5 py-3">
                    <Link href={`${PAGE}/${client.id}`} className="font-semibold underline-offset-4 hover:underline">
                      {client.name}
                    </Link>
                    {client.site && <span className="block text-[12.5px] text-ink/55">{client.site}</span>}
                  </td>
                  <td className={`px-5 py-3 text-ink/75 ${NUM}`}>{client.whatsapp ? formatWhatsapp(client.whatsapp) : "—"}</td>
                  <td className="px-5 py-3 text-ink/75">
                    {[
                      client.activePlans && `${client.activePlans} ${client.activePlans === 1 ? "plano" : "planos"}`,
                      client.openProjects && `${client.openProjects} ${client.openProjects === 1 ? "projeto" : "projetos"}`,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </td>
                  <td className={`px-5 py-3 text-right ${NUM}`}>{client.monthly ? brl(client.monthly) : "—"}</td>
                  <td className="px-5 py-3">
                    <Situacao client={client} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
