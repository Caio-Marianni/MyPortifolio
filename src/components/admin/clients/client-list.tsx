import Link from "next/link";
import { WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { ClientLogo } from "@/components/admin/clients/client-logo";
import { ICON_BUTTON, NUM, TABLE, TABLE_FOOT, TABLE_HEAD } from "@/components/ui/styles";
import { chargeMessage, initials, siteHost, whatsappLink, type ClientRow } from "@/services/clients";
import { br, relativeDays, todayInBrazil } from "@/services/dates";
import { brl } from "@/services/money";

/* A lista responde "quem eu preciso cobrar e quando" sem abrir ficha: o próximo vencimento em
   palavras, o mensal e, só quando há, o valor em atraso — linha sem vermelho é linha em dia.
   No fim, o WhatsApp como ação (nos atrasados já com a cobrança escrita).

   A linha inteira leva à ficha, mas não é um <a> por fora: o WhatsApp é outro link, e link dentro
   de link não vale. O nome é o link, e o `after:inset-0` estica a área de clique dele pela linha
   toda; o WhatsApp fica por cima (`z-10`). No celular cada linha vira um cartão: nome e WhatsApp
   em cima, os números embaixo. Colunas de largura fixa no desktop, para cabeçalho, linhas e
   rodapé — grades separadas — caírem alinhados. */
const COLUMNS = "md:grid md:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_120px_minmax(0,1fr)_36px] md:items-center md:gap-x-4";

function ClientLine({ client, today }: { client: ClientRow; today: string }) {
  const late = client.overdueAmount > 0;
  const whatsapp =
    client.whatsapp &&
    whatsappLink(client.whatsapp, late && client.nextDue ? chargeMessage({ amount: client.overdueAmount, dueOn: client.nextDue }) : undefined);

  return (
    <li className={`group relative flex flex-wrap items-center gap-x-3 gap-y-1.5 px-5 py-4 text-ui transition-colors hover:bg-ink/[0.03] md:py-3 ${COLUMNS}`}>
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <ClientLogo host={siteHost(client.site)} initials={initials(client.name)} />
        <span className="min-w-0">
          <Link
            href={`/admin/clientes/${client.id}`}
            className="block truncate font-semibold outline-none after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4 focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ink"
          >
            {client.name}
          </Link>
          {client.site && <span className="block truncate text-meta text-ink/55">{client.site}</span>}
        </span>
      </span>

      {/* no celular fica na primeira linha, à direita do nome; no desktop é a última coluna */}
      <span className="relative z-10 md:order-last md:justify-self-end">
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={late ? `Cobrar ${client.name} no WhatsApp` : `WhatsApp de ${client.name}`}
            title={late ? "Cobrar no WhatsApp" : "Abrir WhatsApp"}
            className={ICON_BUTTON}
          >
            {/* a cor no ícone: no link ela brigaria com a do ICON_BUTTON */}
            <WhatsappLogoIcon className={`h-4 w-4 ${late ? "text-danger" : ""}`} aria-hidden weight="bold" />
          </a>
        )}
      </span>

      {/* no celular, uma linha de números embaixo; no desktop cada um é uma coluna (`contents`) */}
      <span className="flex flex-wrap gap-x-3 gap-y-0.5 text-meta text-ink/65 max-md:order-last max-md:basis-full md:contents md:text-ui">
        <span>
          {client.nextDue ? (
            <time dateTime={client.nextDue} title={br(client.nextDue)} className={`${NUM} ${late ? "font-semibold text-danger" : "md:text-ink/75"}`}>
              <span className="md:hidden">{late ? "venceu " : "vence "}</span>
              {relativeDays(client.nextDue, today)}
            </time>
          ) : (
            <span className="text-ink/40 max-md:hidden">—</span>
          )}
        </span>
        <span className={`${NUM} md:text-right`}>
          {client.monthly ? (
            <>
              {brl(client.monthly)}
              <span className="md:hidden">/mês</span>
            </>
          ) : (
            <span className="text-ink/40 max-md:hidden">—</span>
          )}
        </span>
        <span>
          {late && (
            <span className={`font-semibold text-danger ${NUM}`}>
              {brl(client.overdueAmount)}
              <span className="font-normal md:hidden"> em atraso</span>
            </span>
          )}
        </span>
      </span>
    </li>
  );
}

export function ClientList({ clients }: { clients: ClientRow[] }) {
  const today = todayInBrazil();

  return (
    <div className={TABLE}>
      {/* "Cliente" recuado o quadrado da logo + o vão (40 + 12px): o rótulo fica em cima do nome */}
      <div className={`hidden ${TABLE_HEAD} ${COLUMNS}`} aria-hidden>
        <span className="pl-[52px]">Cliente</span>
        <span>Próximo vencimento</span>
        <span className="text-right">Mensal</span>
        <span>Em atraso</span>
        <span />
      </div>
      {/* atrasados em cima: a ordem da lista é a ordem de cobrança (services/clients.ts) */}
      <ul className="divide-y divide-ink/10">
        {clients.map((client) => (
          <ClientLine key={client.id} client={client} today={today} />
        ))}
      </ul>
      {/* o total do que está na lista (respeita o filtro), na coluna do mensal */}
      <div className={`flex items-center justify-between ${TABLE_FOOT} ${COLUMNS}`}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/50 md:pl-[52px]">Mensal em planos</span>
        <span className="max-md:hidden" />
        <span className={`font-semibold ${NUM} md:text-right`}>{brl(clients.reduce((sum, client) => sum + client.monthly, 0))}</span>
        <span className="max-md:hidden" />
        <span className="max-md:hidden" />
      </div>
    </div>
  );
}
