import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SquaresFourIcon, WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { ActionNotice } from "@/components/admin/action-notice";
import { Badge } from "@/components/admin/badge";
import { FormError } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { ReceiveForm } from "@/components/admin/receive-form";
import { Stat } from "@/components/admin/stat";
import { BUTTON, CARD, CARD_TITLE, FOCUS, NUM } from "@/components/ui/styles";
import { requireAdmin } from "@/services/admin-session";
import { whatsappLink } from "@/services/clients";
import { br, longDate, monthLabel, monthName, relativeDays, todayInBrazil } from "@/services/dates";
import { readId } from "@/services/form-input";
import { brl } from "@/services/money";
import { chargeMessage, getOverview, type Due } from "@/services/overview";
import { reportMonth } from "@/services/reports";
import { receivePayment, receivePlan } from "./clientes/[id]/actions";

/* Visão geral: o dinheiro do mês em quatro números e, embaixo, só o que pede ação — cobrar,
   mandar, renovar, responder. O que está em dia não aparece. Vencimento se resolve aqui mesmo:
   "Recebi" grava e volta pra cá, "Cobrar" abre o WhatsApp com a mensagem pronta. */
export const metadata: Metadata = { title: "Visão geral" };

/** Uma linha da lista de pendências: o quê, de quem (o link pra resolver) e, ao lado, os
    números e as ações — fora do link, que botão dentro de link não vale. */
function Item({ href, children, aside }: { href: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 text-ui">
      <Link href={href} className={`min-w-0 flex-1 underline-offset-4 hover:underline ${FOCUS}`}>
        {children}
      </Link>
      {aside}
    </li>
  );
}

/** Data em palavras ("há 5 dias"), com a data exata no `title` e no `dateTime`. */
function When({ iso, today, className = "" }: { iso: string; today: string; className?: string }) {
  return (
    <time dateTime={iso} title={br(iso)} className={`${NUM} ${className}`}>
      {relativeDays(iso, today)}
    </time>
  );
}

function DueItem({ due, late, today }: { due: Due; late: boolean; today: string }) {
  return (
    <Item
      href={`/admin/clientes/${due.clientId}`}
      aside={
        <>
          <span className={`${NUM} ${late ? "font-semibold text-danger" : "text-ink/70"}`}>{brl(due.amount)}</span>
          <When iso={due.dueOn} today={today} className={`w-[88px] text-right ${late ? "text-danger" : "text-ink/55"}`} />
          <span className="flex basis-full flex-wrap items-center justify-end gap-2">
            {late && due.whatsapp && (
              <a href={whatsappLink(due.whatsapp, chargeMessage(due))} target="_blank" rel="noopener noreferrer" className={BUTTON}>
                <WhatsappLogoIcon className="h-4 w-4" aria-hidden weight="bold" />
                Cobrar
              </a>
            )}
            <ReceiveForm
              action={due.kind === "plan" ? receivePlan : receivePayment}
              fields={{ clientId: due.clientId, id: due.refId, voltar: "painel" }}
            />
          </span>
        </>
      }
    >
      <span className="font-semibold">{due.clientName}</span> <span className="text-ink/60">· {due.label}</span>
    </Item>
  );
}

type Params = { searchParams: Promise<{ ok?: string; desfazer?: string; cliente?: string; erro?: string }> };

export default async function VisaoGeralPage(props: Params) {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const today = todayInBrazil();
  const undoId = readId(searchParams.desfazer);
  const undoClient = readId(searchParams.cliente);

  const data = await getOverview().catch((error: unknown) => {
    console.error("[admin] falha ao montar a visão geral:", error);
    return null;
  });

  if (!data) {
    return (
      <>
        <PageHeader icon={SquaresFourIcon} title="Visão geral" />
        <p role="alert" className="text-ui text-danger">
          Não consegui ler o banco. As tabelas foram criadas? Rode `npm run migrate`.
        </p>
      </>
    );
  }

  const reportsOf = reportMonth(today);
  const actions =
    data.overdue.length +
    data.lateProjects.length +
    data.awaitingSignature.length +
    data.expiring.length +
    (data.pendingReports ? 1 : 0) +
    (data.pendingReviews ? 1 : 0);

  return (
    <>
      <PageHeader icon={SquaresFourIcon} title="Visão geral" description={longDate(today)} />

      {searchParams.erro && (
        <div className="mb-6">
          <FormError message={searchParams.erro} />
        </div>
      )}

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
            <p className="mt-4 text-ui text-ink/60">Tudo em dia.</p>
          ) : (
            <ul className="mt-2 divide-y divide-ink/10">
              {data.overdue.map((due, i) => (
                <DueItem key={`overdue-${i}`} due={due} today={today} late />
              ))}

              {data.lateProjects.map((project) => (
                <Item
                  key={`project-${project.id}`}
                  href={`/admin/clientes/${project.clientId}#projeto-${project.id}`}
                  aside={
                    <>
                      <span className="text-ui text-danger">prazo passou</span>
                      <When iso={project.deadline} today={today} className="w-[88px] text-right text-danger" />
                    </>
                  }
                >
                  <span className="font-semibold">{project.clientName}</span> <span className="text-ink/60">· {project.title}</span>
                </Item>
              ))}

              {data.pendingReports > 0 && (
                <Item href="/admin/relatorios" aside={<Badge tone="accent">{data.pendingReports}</Badge>}>
                  Relatórios de {monthLabel(reportsOf)} por enviar
                  {Number(today.slice(8)) < 3 && <span className="text-ink/55"> · números fecham dia 3</span>}
                </Item>
              )}

              {data.awaitingSignature.map((doc) => (
                <Item
                  key={`doc-${doc.id}`}
                  href={`/admin/documentos/${doc.id}`}
                  aside={
                    <>
                      <Badge tone="accent">Aguardando assinatura</Badge>
                      {/* desde quando: o que diz se já é hora de cobrar a resposta */}
                      <When iso={doc.sentOn} today={today} className="w-[88px] text-right text-ink/55" />
                    </>
                  }
                >
                  <span className="font-semibold">{doc.clientName}</span> <span className="text-ink/60">· {doc.title}</span>
                </Item>
              ))}

              {data.expiring.map((account, i) => (
                <Item
                  key={`account-${i}`}
                  href={`/admin/clientes/${account.clientId}?aba=contas`}
                  aside={
                    <span className="text-ui text-danger">
                      {account.expiresOn < today ? "venceu" : "renova"} <When iso={account.expiresOn} today={today} />
                    </span>
                  }
                >
                  <span className="font-semibold">{account.clientName}</span> <span className="text-ink/60">· {account.service}</span>
                </Item>
              ))}

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
            <p className="mt-4 text-ui text-ink/60">Nada vencendo.</p>
          ) : (
            <ul className="mt-2 divide-y divide-ink/10">
              {data.upcoming.map((due, i) => (
                <DueItem key={`upcoming-${i}`} due={due} today={today} late={false} />
              ))}
            </ul>
          )}
        </section>
      </div>

      <ActionNotice
        ok={searchParams.ok}
        undo={undoId && undoClient ? { clientId: undoClient, id: undoId, voltar: "painel" } : undefined}
        closeHref="/admin"
      />
    </>
  );
}
