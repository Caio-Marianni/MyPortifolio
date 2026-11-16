import { NextResponse, type NextRequest } from "next/server";
import { todayInBrazil } from "@/services/dates";
import { getOverview } from "@/services/overview";
import { reminderAuthorized, reminderLines, sendReminder } from "@/services/reminders";

/* Chamada uma vez por dia pelo cron da Cloudflare (custom-worker.ts), de dentro do próprio Worker.
   Como toda rota, é pública: só segue com o tópico do ntfy no Authorization (services/reminders.ts). */

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: NextRequest) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return fail("NTFY_TOPIC não definido — lembrete desligado.", 503);
  if (!reminderAuthorized(request.headers.get("authorization"), topic)) return fail("Não autorizado.", 401);

  try {
    const lines = reminderLines(await getOverview(), todayInBrazil());
    if (lines.length > 0) await sendReminder(topic, lines);
    return NextResponse.json({ ok: true, sent: lines.length > 0 });
  } catch (error) {
    console.error("[lembrete] falhou:", error);
    return fail("Não consegui montar ou enviar o lembrete.", 500);
  }
}
