import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ExternalLink, MessageCircle } from "lucide-react";
import { Badge } from "@/components/admin/badge";
import { CopyField } from "@/components/admin/copy-field";
import { FormError, TextArea } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE } from "@/components/admin/styles";
import { ReportView } from "@/components/reports/report-view";
import { requireAdmin } from "@/services/admin-session";
import { whatsappLink } from "@/services/clients";
import { br, monthLabel } from "@/services/dates";
import { readId } from "@/services/form-input";
import { NOTE_LIMIT, SECTIONS, SECTION_LABEL, getReport, reportMessage, reportToken } from "@/services/reports";
import { generate, markReportSent, saveReport } from "../actions";

/* Um relatório: à esquerda como o cliente vai ver, à direita o que você ajusta e o envio. O
   envio é você quem faz — o botão abre a conversa do cliente com texto e link escritos. */
export const metadata: Metadata = { title: "Relatório" };

const PAGE = "/admin/relatorios";

type Params = { params: Promise<{ id: string }>; searchParams: Promise<{ erro?: string }> };

export default async function RelatorioAdminPage(props: Params) {
  await requireAdmin();
  const id = readId((await props.params).id);
  const { erro } = await props.searchParams;
  const report = id ? await getReport(id) : null;
  if (!report) notFound();

  /* link do host da requisição, como o convite: no localhost sai link local */
  const cabecalhos = await headers();
  const link = `${cabecalhos.get("x-forwarded-proto") ?? "http"}://${cabecalhos.get("host")}/relatorio/${reportToken(report.id)}`;
  const sent = Boolean(report.sentOn);

  return (
    <>
      <PageHeader
        back={{ href: `${PAGE}?mes=${report.month}`, label: "Relatórios" }}
        title={`Relatório de ${monthLabel(report.month)}`}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href={`/admin/clientes/${report.clientId}`} className="underline-offset-4 hover:underline">
              {report.clientName}
            </Link>
            <span>{report.planName}</span>
            {sent ? <Badge tone="ok">Enviado {report.sentOn && br(report.sentOn)}</Badge> : <Badge tone="accent">Falta enviar</Badge>}
          </span>
        }
        actions={
          <a href={link} target="_blank" rel="noopener noreferrer" className={`${BUTTON} inline-flex items-center gap-2`}>
            Abrir como o cliente
            <ExternalLink className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          </a>
        }
      />

      <div className="mb-6">
        <FormError message={erro} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className={`${CARD} min-w-0 bg-surface py-8 md:py-10`}>
          {!report.data && (
            <p className="mx-auto mb-6 max-w-[760px] text-ui text-ink/60">
              Sem números: o plano não tem o ID da propriedade do GA4. O cliente vê só o recado.
            </p>
          )}
          <ReportView report={report} />
        </div>

        <aside className="flex flex-col gap-6">
          <section className={`${CARD} flex flex-col gap-4`}>
            <h2 className={CARD_TITLE}>Enviar</h2>
            <CopyField value={link} />
            <a
              href={report.whatsapp ? whatsappLink(report.whatsapp, reportMessage(report, link)) : `https://wa.me/?text=${encodeURIComponent(reportMessage(report, link))}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BUTTON_SOLID} inline-flex items-center justify-center gap-2`}
            >
              Mandar no WhatsApp
              <MessageCircle className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
            </a>
            {!report.whatsapp && <p className="text-meta text-ink/55">Cliente sem WhatsApp na ficha: o WhatsApp abre pra você escolher a conversa.</p>}
            <form action={markReportSent}>
              <input type="hidden" name="id" value={report.id} />
              <input type="hidden" name="sent" value={sent ? "0" : "1"} />
              <button type="submit" className={`${BUTTON} w-full`}>
                {sent ? "Reabrir pra corrigir" : "Marcar como enviado"}
              </button>
            </form>
          </section>

          {!sent && (
            <form action={saveReport} className={`${CARD} flex flex-col gap-4`}>
              <input type="hidden" name="id" value={report.id} />
              <h2 className={CARD_TITLE}>O que o cliente vê</h2>
              <fieldset className="flex flex-col gap-2 text-ui">
                <legend className="sr-only">Seções</legend>
                {SECTIONS.map((section) => (
                  <label key={section} className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      name="sections"
                      value={section}
                      defaultChecked={report.sections.includes(section)}
                      disabled={section !== "note" && !report.data}
                      className="h-4 w-4 accent-[rgb(var(--accent))]"
                    />
                    {SECTION_LABEL[section]}
                  </label>
                ))}
              </fieldset>
              <TextArea
                label="Recado do mês — o que foi feito, o que vem aí"
                name="note"
                rows={6}
                defaultValue={report.note ?? ""}
                maxLength={NOTE_LIMIT}
              />
              <button type="submit" className={`${BUTTON_SOLID} self-start`}>
                Salvar
              </button>
            </form>
          )}

          {!sent && (
            <form action={generate} className={`${CARD} flex flex-col gap-3`}>
              <input type="hidden" name="planId" value={report.planId} />
              <input type="hidden" name="month" value={report.month} />
              <input type="hidden" name="from" value={`${PAGE}/${report.id}`} />
              <p className="text-ui leading-relaxed text-ink/65">
                Os números ficam congelados no dia em que você gera. Gerou antes do dia 3, ou acabou de pôr o GA4 no plano? Atualize.
              </p>
              <button type="submit" className={`${BUTTON} self-start`}>
                Atualizar números
              </button>
            </form>
          )}
        </aside>
      </div>
    </>
  );
}
