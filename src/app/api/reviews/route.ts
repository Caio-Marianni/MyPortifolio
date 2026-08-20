import { NextRequest, NextResponse } from "next/server";
import { LIMITS, TRACKS, type Track } from "@/data/reviews";
import { verifyInvite } from "@/services/invite";
import { createReview } from "@/services/reviews";

/* Fronteira de confiança: o corpo vem do navegador do contratante, que pode editar todos os
   campos — só o identificador do convite é assinado, e é ele que abre a porta. A validação da
   página /avaliar é cortesia visual; o portão de verdade é este.

   ponytail: sem rate limit. O convite assinado já é o portão; quem não tem link não posta, e
   quem tem só consegue encher a fila de pendentes, que ninguém vê além de você. */

const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Corpo inválido.", 400);

  const invite = text(body.invite);
  if (!verifyInvite(invite, text(body.token) || undefined)) {
    return fail("Link de avaliação inválido.", 403);
  }

  const name = text(body.name);
  const company = text(body.company);
  const track = text(body.track);
  const comment = text(body.comment);
  const email = text(body.email);
  const rating = Number(body.rating);

  if (invite.length > LIMITS.invite) return fail("Convite inválido.", 400);
  if (!TRACKS.includes(track as Track)) return fail("Contexto inválido.", 400);
  if (!name || name.length > LIMITS.name) return fail("Preencha seu nome.", 400);
  if (company.length > LIMITS.company) return fail("Nome de empresa muito longo.", 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return fail("Nota deve ser de 1 a 5.", 400);
  if (!comment || comment.length > LIMITS.comment) return fail("Escreva um comentário.", 400);
  /* e-mail é opcional; quando vem, precisa parecer um — o resto é problema de quem digitou */
  if (email && (email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return fail("E-mail inválido.", 400);
  }

  try {
    await createReview({
      invite,
      name,
      company: company || null,
      track: track as Track,
      rating,
      comment,
      email: email || null,
    });
  } catch (error) {
    console.error("[reviews] falha ao gravar avaliação:", error);
    return fail("Não consegui salvar agora. Tente de novo em instantes.", 500);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
