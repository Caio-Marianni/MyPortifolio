import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportView } from "@/components/reports/report-view";
import { monthLabel } from "@/services/dates";
import { getReport, readReportToken } from "@/services/reports";

/* O relatório que o cliente abre pelo link do WhatsApp — sem login: quem tem o link assinado vê
   aquele relatório e só ele. Fora do índice. Sempre lido na hora, sem o cache de 5 minutos do
   site, pra que a correção feita antes de enviar já apareça. */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ token: string }> };

const load = async (props: Params) => {
  const id = readReportToken((await props.params).token);
  return id ? getReport(id) : null;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const report = await load(props).catch(() => null);
  return {
    title: { absolute: report ? `Relatório de ${monthLabel(report.month)} · ${report.clientName}` : "Relatório" },
    robots: { index: false, follow: false },
  };
}

export default async function RelatorioPage(props: Params) {
  const report = await load(props);
  if (!report) notFound();

  return (
    <main className="min-h-screen bg-surface px-5 py-10 md:py-16">
      <ReportView report={report} />
    </main>
  );
}
