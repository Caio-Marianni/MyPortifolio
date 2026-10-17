import { NextRequest, NextResponse } from "next/server";
import { CONTACT_LIMITS, isEmail } from "@/data/contact";
import { createMessage, tooManyMessages } from "@/services/contact";

/* Fronteira de confiança do formulário de contato. Diferente da de avaliação, aqui não há
   convite assinado: qualquer um posta. Por isso dois portões — o campo isca, que só robô
   preenche, e o limite de envios por IP, contado no banco. */

const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/* o formulário roda nos dois idiomas, então o erro volta no idioma de quem enviou */
const say = (en: boolean) => (pt: string, english: string) => (en ? english : pt);

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Corpo inválido.", 400);
  const t = say(body.lang === "en");

  /* Isca preenchida: finge que deu certo. Responder erro ensinaria o robô a deixar o campo vazio. */
  if (text(body.website)) return NextResponse.json({ ok: true }, { status: 201 });

  const name = text(body.name);
  const email = text(body.email);
  const message = text(body.message);

  if (!name || name.length > CONTACT_LIMITS.name) return fail(t("Preencha seu nome.", "Please enter your name."), 400);
  if (!isEmail(email) || email.length > CONTACT_LIMITS.email) return fail(t("E-mail inválido.", "Invalid email."), 400);
  if (!message || message.length > CONTACT_LIMITS.message) {
    return fail(t("Escreva sua mensagem (até 4000 caracteres).", "Write your message (up to 4000 characters)."), 400);
  }

  /* IP de quem enviou, atrás do proxy da Vercel — mesmo critério do login do painel */
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "desconhecido";

  try {
    if (await tooManyMessages(ip)) {
      return fail(t("Muitas mensagens seguidas. Tente de novo mais tarde.", "Too many messages. Please try again later."), 429);
    }
    await createMessage({ name, email, message, ip });
  } catch (error) {
    console.error("[contact] falha ao gravar mensagem:", error);
    return fail(t("Não consegui enviar agora. Tente de novo em instantes.", "Could not send right now. Please try again in a moment."), 500);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
