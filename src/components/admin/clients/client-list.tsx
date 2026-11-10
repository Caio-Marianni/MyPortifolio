import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ClientStatus } from "@/components/admin/clients/client-status";
import { NUM, ROW_FOCUS, rise } from "@/components/ui/styles";
import { formatWhatsapp, type ClientRow } from "@/services/clients";
import { brl } from "@/services/money";

/* A lista é uma grade por linha, não uma tabela: a linha inteira é o link para a ficha, e no
   celular cada uma vira um cartão (nome e situação em cima, o resto embaixo) em vez de uma
   tabela rolando de lado. Colunas de largura fixa no desktop, para o cabeçalho e as linhas — que
   são grades separadas — caírem alinhados. */
const COLUMNS = "md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_120px_170px_16px] md:items-center md:gap-x-4";

const contracts = (client: ClientRow) =>
  [
    client.activePlans && `${client.activePlans} ${client.activePlans === 1 ? "plano" : "planos"}`,
    client.openProjects && `${client.openProjects} ${client.openProjects === 1 ? "projeto" : "projetos"}`,
  ]
    .filter(Boolean)
    .join(" · ");

function ClientLine({ client, index }: { client: ClientRow; index: number }) {
  return (
    /* entram em cascata quando a lista abre, como as listas do site */
    <li className={rise(index)}>
      <Link
        href={`/admin/clientes/${client.id}`}
        className={`group flex flex-wrap items-center gap-x-3 gap-y-1.5 px-5 py-4 text-ui transition-colors hover:bg-ink/[0.04] md:py-3 ${COLUMNS} ${ROW_FOCUS}`}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold group-hover:underline group-hover:underline-offset-4">{client.name}</span>
          {client.site && <span className="block truncate text-meta text-ink/55">{client.site}</span>}
        </span>
        {/* no celular, uma linha de detalhes embaixo; no desktop cada um é uma coluna (`contents`) */}
        <span className="flex flex-wrap gap-x-4 gap-y-0.5 text-meta text-ink/65 max-md:order-last max-md:basis-full md:contents md:text-ui">
          <span className={`text-ink/75 ${NUM} max-md:hidden`}>{client.whatsapp ? formatWhatsapp(client.whatsapp) : "—"}</span>
          <span className="md:text-ink/75">{contracts(client) || <span className="max-md:hidden">—</span>}</span>
          <span className={`${NUM} md:text-right`}>{client.monthly ? <>{brl(client.monthly)}<span className="md:hidden">/mês</span></> : <span className="max-md:hidden">—</span>}</span>
        </span>
        <span>
          <ClientStatus overdue={client.overdue} active={Boolean(client.activePlans || client.openProjects)} />
        </span>
        <ChevronRight className="h-4 w-4 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-ink max-md:hidden" strokeWidth={2} aria-hidden />
      </Link>
    </li>
  );
}

export function ClientList({ clients }: { clients: ClientRow[] }) {
  return (
    /* o fundo do CARD sem o padding dele: as linhas vão rentes à borda */
    <div className="bg-paper">
      <div className={`hidden border-b border-ink/15 px-5 py-3 font-mono text-meta uppercase tracking-[0.06em] text-ink/60 ${COLUMNS}`} aria-hidden>
        <span>Cliente</span>
        <span>WhatsApp</span>
        <span>Contratos</span>
        <span className="text-right">Mensal</span>
        <span>Situação</span>
      </div>
      {/* atrasados em cima: a ordem da lista é a ordem de cobrança (services/clients.ts) */}
      <ul className="divide-y divide-ink/10">
        {clients.map((client, i) => (
          <ClientLine key={client.id} client={client} index={i} />
        ))}
      </ul>
    </div>
  );
}
