import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/admin/badge";
import { PageHeader } from "@/components/admin/page-header";
import { CARD, CARD_TITLE, NUM } from "@/components/admin/styles";
import { requireAdmin } from "@/services/admin-session";
import { br, longDate, monthLabel, monthName, todayInBrazil } from "@/services/dates";
import { brl } from "@/services/money";
import { getOverview, type Due } from "@/services/overview";
import { reportMonth } from "@/services/reports";

/* Visão geral: o dinheiro do mês em quatro números e, embaixo, só o que pede ação — cobrar,
   mandar, renovar, responder. O que está em dia não aparece. */
export const metadata: Metadata = { title: "Visão geral" };

function Stat({ label, value, alert = false }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className={`${CARD} flex flex-col gap-1 ${alert ? "border-danger" : ""}`}>
      <span className="text-[12.5px] text-ink/60">{label}</span>
      {/* escala com a tela: "R$ 12.500,00" precisa caber em meia largura de celular */}
      <span className={`whitespace-nowrap text-[clamp(18px,4.8vw,28px)] font-semibold leading-tight ${alert ? "text-danger" : ""}`}>{value}</span>
    </div>
  );
}

/** Uma linha da lista de pendências: o quê, de quem, e o link pra resolver. */
function Item({ href, children, aside }: { href: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <li>
      <Link href={href} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-[14px] hover:bg-ink/[0.03]">
        <span className="min-w-0 flex-1">{children}</span>
        {aside}
      </Link>
    </li>
  );
}

function DueItem({ due, late }: { due: Due; late: boolean }) {
  return (
    <Item
      href={`/admin/clientes/${due.clientId}`}
      aside={
        <>
          <span className={`${NUM} ${late ? "font-semibold text-danger" : "text-ink/70"}`}>{brl(due.amount)}</span>
          <span className={`w-[78px] text-right text-[13px] text-ink/55 ${NUM}`}>{br(due.dueOn)}</span>
        </>
      }
    >
      <span className="font-semibold">{due.clientName}</span> <span className="text-ink/60">· {due.label}</span>
    </Item>
  );
}

export default async function VisaoGeralPage() {
  await requireAdmin();
  const today = todayInBrazil();

  const data = await getOverview().catch((error: unknown) => {
    console.error("[admin] falha ao montar a visão geral:", error);
    return null;
  });

  if (!data) {
    return (
      <>
        <PageHeader title="Visão geral" />
        <p role="alert" className="text-[13px] text-danger">
          Não consegui ler o banco. As tabelas foram criadas? Rode `npm run migrate`.
        </p>
      </>
    );
  }

  const reportsOf = reportMonth(today);
  const actions =
    data.overdue.length +
    data.awaitingSignature.length +
    data.expiring.length +
    (data.pendingReports ? 1 : 0) +
    (data.newMessages ? 1 : 0) +
    (data.pendingReviews ? 1 : 0);

  return (
    <>
      <PageHeader title="Visão geral" description={longDate(today)} />

      {/* quatro lado a lado só com folga: em 1024 o menu come a largura e o valor vazaria */}
      <div className="mb-8 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <Stat label="Receita mensal (planos)" value={brl(data.monthly)} />
        <Stat label={`Recebido em ${monthName(today.slice(0, 7))}`} value={brl(data.received)} />
        <Stat label="Em atraso" value={brl(data.overdueAmount)} alert={data.overdueAmount > 0} />
        <Stat label="Clientes ativos" value={String(data.activeClients)} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className={CARD}>
          <h2 className={CARD_TITLE}>Precisa de você</h2>

          {actions === 0 ? (
            <p className="mt-4 text-[14px] text-ink/60">Tudo em dia.</p>
          ) : (
            <ul className="mt-2 divide-y divide-ink/10">
              {data.overdue.map((due, i) => (
                <DueItem key={`overdue-${i}`} due={due} late />
              ))}

              {data.pendingReports > 0 && (
                <Item href="/admin/relatorios" aside={<Badge tone="accent">{data.pendingReports}</Badge>}>
                  Relatórios de {monthLabel(reportsOf)} por enviar
                  {Number(today.slice(8)) < 3 && <span className="text-ink/55"> · números fecham dia 3</span>}
                </Item>
              )}

              {data.awaitingSignature.map((doc) => (
                <Item key={`doc-${doc.id}`} href={`/admin/documentos/${doc.id}`} aside={<Badge tone="accent">Aguardando assinatura</Badge>}>
                  <span className="font-semibold">{doc.clientName}</span> <span className="text-ink/60">· {doc.title}</span>
                </Item>
              ))}

              {data.expiring.map((account, i) => (
                <Item
                  key={`account-${i}`}
                  href={`/admin/clientes/${account.clientId}`}
                  aside={<span className={`text-[13px] text-danger ${NUM}`}>renova {br(account.expiresOn)}</span>}
                >
                  <span className="font-semibold">{account.clientName}</span> <span className="text-ink/60">· {account.service}</span>
                </Item>
              ))}

              {data.newMessages > 0 && (
                <Item href="/admin/mensagens" aside={<Badge tone="accent">{data.newMessages}</Badge>}>
                  {data.newMessages === 1 ? "Mensagem nova" : "Mensagens novas"} pelo site
                </Item>
              )}

              {data.pendingReviews > 0 && (
                <Item href="/admin/avaliacoes?ver=pending" aside={<Badge tone="accent">{data.pendingReviews}</Badge>}>
                  {data.pendingReviews === 1 ? "Avaliação esperando" : "Avaliações esperando"} moderação
                </Item>
              )}
            </ul>
          )}
        </section>

        <section className={CARD}>
          <h2 className={CARD_TITLE}>Vence nos próximos 7 dias</h2>
          {data.upcoming.length === 0 ? (
            <p className="mt-4 text-[14px] text-ink/60">Nada vencendo.</p>
          ) : (
            <ul className="mt-2 divide-y divide-ink/10">
              {data.upcoming.map((due, i) => (
                <DueItem key={`upcoming-${i}`} due={due} late={false} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
