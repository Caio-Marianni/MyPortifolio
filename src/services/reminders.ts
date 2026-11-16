/* caminho relativo com extensão: o `npm run check` roda isto no node puro */
import { createHash, timingSafeEqual } from "node:crypto";
import { monthLabel } from "./dates.ts";
import type { Overview } from "./overview.ts";
import { reportMonth } from "./reports.ts";

/* Lembrete diário no celular pelo ntfy (ntfy.sh): o "Precisa de você" da Visão geral, em
   contagens. Só contagem — sem nome de cliente nem valor: a mensagem passa por um servidor de
   terceiro e fica guardada lá por algumas horas. O detalhe está no painel, que o toque abre.

   O tópico (NTFY_TOPIC) é o segredo: quem sabe o nome lê e publica nele. Por isso ele mesmo
   tranca a rota do cron (/api/lembrete) — quem o tem já publica no tópico direto pelo ntfy, então
   a rota não dá nada a mais. Um segredo a menos pra guardar. */

const PANEL = "https://www.caiomarianni.com.br/admin";

const count = (n: number, one: string, many: string): string | false => n > 0 && `${n} ${n === 1 ? one : many}`;

/** As linhas do lembrete; lista vazia = nada pendente, e aí não sai notificação. */
export function reminderLines(data: Overview, today: string): string[] {
  const day = Number(today.slice(8));
  return [
    count(data.overdue.length, "cobrança em atraso", "cobranças em atraso"),
    count(data.upcoming.filter((due) => due.dueOn === today).length, "vencimento hoje", "vencimentos hoje"),
    count(data.lateProjects.length, "projeto com prazo estourado", "projetos com prazo estourado"),
    /* os números do GA4 só fecham no dia 3: antes disso o relatório ainda não é pendência */
    day >= 3 && data.pendingReports > 0 && `Relatórios de ${monthLabel(reportMonth(today))} por enviar: ${data.pendingReports}`,
    count(data.awaitingSignature.length, "documento aguardando assinatura", "documentos aguardando assinatura"),
    count(data.expiring.length, "conta para renovar", "contas para renovar"),
    count(data.pendingReviews, "avaliação para moderar", "avaliações para moderar"),
    day === 1 && "Começo do mês: rode npm run backup",
  ].filter((line): line is string => typeof line === "string");
}

/** `Authorization: Bearer <tópico>`. Compara pelo digest: tamanhos iguais pro timingSafeEqual, e
    o segredo não vaza pelo tempo de resposta. */
export function reminderAuthorized(header: string | null, topic: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(header ?? ""), digest(`Bearer ${topic}`));
}

export async function sendReminder(topic: string, lines: string[]): Promise<void> {
  /* em JSON, não nos cabeçalhos do ntfy: cabeçalho HTTP não leva acento */
  const res = await fetch("https://ntfy.sh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, title: "Precisa de você", message: lines.join("\n"), click: PANEL }),
  });
  if (!res.ok) throw new Error(`O ntfy recusou o lembrete (${res.status}).`);
}
