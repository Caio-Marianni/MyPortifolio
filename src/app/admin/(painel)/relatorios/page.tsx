import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon, ChartBarIcon } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/admin/badge";
import { FormError } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON, BUTTON_SOLID, NUM, TABLE, TABLE_HEAD } from "@/components/ui/styles";
import { requireAdmin } from "@/services/admin-session";
import { br, monthLabel, previousMonth, todayInBrazil } from "@/services/dates";
import { listQueue, readMonth, reportMonth, type QueueItem } from "@/services/reports";
import { generate } from "./actions";

/* Os relatórios de um mês: um por plano ativo que inclui relatório. O padrão é o mês que acabou
   de fechar — e os números dele só fecham no dia 3, quando o lembrete toca. */
export const metadata: Metadata = { title: "Relatórios" };

const PAGE = "/admin/relatorios";

/* colunas fixas no desktop, para o cabeçalho e as linhas — grades separadas — caírem alinhados */
const COLUMNS = "md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_190px_110px] md:items-center md:gap-x-4";

/** "2026-12" → "2027-01" */
const nextMonth = (month: string) => {
  const [year, index] = month.split("-").map(Number);
  return index === 12 ? `${year + 1}-01` : `${year}-${String(index + 1).padStart(2, "0")}`;
};

function Situacao({ item }: { item: QueueItem }) {
  if (item.sentOn) return <Badge tone="ok">Enviado {br(item.sentOn).slice(0, 5)}</Badge>;
  if (item.reportId) return <Badge tone="accent">Gerado, falta enviar</Badge>;
  return <Badge>Não gerado</Badge>;
}

type Params = { searchParams: Promise<{ mes?: string; erro?: string }> };

export default async function RelatoriosPage(props: Params) {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const today = todayInBrazil();
  const current = reportMonth(today);
  const month = readMonth(searchParams.mes, current);
  const here = `${PAGE}?mes=${month}`;

  const queue = await listQueue(month).catch((error: unknown) => {
    console.error("[admin] falha ao ler relatórios:", error);
    return null;
  });
  const pending = (queue ?? []).filter((item) => !item.sentOn).length;
  /* antes do dia 3 o último dia do mês ainda está sendo processado pelo Google */
  const early = month === current && Number(today.slice(8)) < 3;

  return (
    <>
      <PageHeader
        title="Relatórios"
        icon={ChartBarIcon}
        description={`${monthLabel(month)} · ${pending ? `${pending} por enviar` : "nada pendente"}`}
        actions={
          <>
            <Link href={`${PAGE}?mes=${previousMonth(month)}`} className={`${BUTTON}`} aria-label="Mês anterior">
              <CaretLeftIcon className="h-4 w-4" aria-hidden weight="bold" />
            </Link>
            {month < current && (
              <Link href={`${PAGE}?mes=${nextMonth(month)}`} className={`${BUTTON}`} aria-label="Mês seguinte">
                <CaretRightIcon className="h-4 w-4" aria-hidden weight="bold" />
              </Link>
            )}
          </>
        }
      />

      {early && (
        <p className="mb-6 border-l-2 border-accent pl-4 text-ui leading-relaxed text-ink/75">
          Hoje é dia {Number(today.slice(8))}: os números de {monthLabel(month)} fecham no dia 3. Dá pra gerar agora e clicar em
          &ldquo;Atualizar números&rdquo; depois.
        </p>
      )}

      <div className="mb-6">
        <FormError message={searchParams.erro} />
      </div>

      {queue === null && (
        <p role="alert" className="text-ui text-danger">
          Não consegui ler os relatórios. A tabela foi criada? Rode `npm run migrate`.
        </p>
      )}

      {queue?.length === 0 && (
        <p className="text-ui text-ink/60">Nenhum plano ativo com relatório neste mês. O relatório se liga no plano, na ficha do cliente.</p>
      )}

      {queue && queue.length > 0 && (
        /* a grade por linha da lista de clientes: no celular cada relatório vira um cartão —
           cliente em cima, plano, situação e ação embaixo — em vez de uma tabela rolando de lado */
        <div className={TABLE}>
          <div className={`hidden ${TABLE_HEAD} ${COLUMNS}`} aria-hidden>
            <span>Cliente</span>
            <span>Plano</span>
            <span>Situação</span>
            <span />
          </div>
          <ul className="divide-y divide-ink/10">
            {queue.map((item) => (
              <li key={item.planId} className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-4 text-ui md:py-3 ${COLUMNS}`}>
                <span className="min-w-0 basis-full md:basis-auto">
                  <Link href={`/admin/clientes/${item.clientId}`} className="font-semibold underline-offset-4 hover:underline">
                    {item.clientName}
                  </Link>
                  {!item.hasAnalytics && <span className="block text-meta text-ink/55">sem GA4 — só o recado</span>}
                </span>
                <span className="text-ink/75">{item.planName}</span>
                <span className={NUM}>
                  <Situacao item={item} />
                </span>
                <span className="ml-auto md:text-right">
                  {item.reportId ? (
                    <Link href={`${PAGE}/${item.reportId}`} className={BUTTON}>
                      Abrir
                    </Link>
                  ) : (
                    <form action={generate}>
                      <input type="hidden" name="planId" value={item.planId} />
                      <input type="hidden" name="month" value={month} />
                      <input type="hidden" name="from" value={here} />
                      <button type="submit" className={BUTTON_SOLID}>
                        Gerar
                      </button>
                    </form>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
