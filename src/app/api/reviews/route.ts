import { NextRequest, NextResponse } from "next/server";
import { LIMITS, isJpegBase64 } from "@/data/reviews";
import { verifyInvite } from "@/services/invite";
import { readFields, text } from "@/services/review-input";
import { createReview } from "@/services/reviews";

/* Fronteira de confiança: o corpo vem do navegador do contratante, que pode editar todos os
   campos — só o identificador do convite é assinado, e é ele que abre a porta. A validação da
   página /avaliar é cortesia visual; o portão de verdade é este.

   ponytail: sem rate limit. O convite assinado já é o portão; quem não tem link não posta, e
   quem tem só consegue encher a fila de pendentes, que ninguém vê além de você. */

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/* o formulário roda nos dois idiomas, então o erro volta no idioma de quem enviou */
const say = (en: boolean) => (pt: string, english: string) => (en ? english : pt);

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Corpo inválido.", 400);
  const t = say(body.lang === "en");

  const invite = text(body.invite);
  if (!verifyInvite(invite, text(body.token) || undefined)) {
    return fail(t("Link de avaliação inválido.", "Invalid review link."), 403);
  }

  if (invite.length > LIMITS.invite) return fail(t("Convite inválido.", "Invalid invite."), 400);

  const read = readFields(body, t);
  if ("error" in read) return fail(read.error, 400);

  const photo = text(body.photo);
  const shots: string[] = Array.isArray(body.shots) ? body.shots.map((shot: unknown) => text(shot)) : [];
  if (photo && !isJpegBase64(photo, LIMITS.photo)) return fail(t("Não consegui ler sua foto.", "Could not read your photo."), 400);
  if (shots.length > LIMITS.shots) return fail(t(`No máximo ${LIMITS.shots} fotos do projeto.`, `At most ${LIMITS.shots} project photos.`), 400);
  if (shots.some((shot) => !isJpegBase64(shot, LIMITS.shot))) return fail(t("Não consegui ler uma das fotos.", "Could not read one of the photos."), 400);

  try {
    await createReview({ ...read.fields, invite, photo: photo || null, shots });
  } catch (error) {
    console.error("[reviews] falha ao gravar avaliação:", error);
    return fail(t("Não consegui salvar agora. Tente de novo em instantes.", "Could not save right now. Please try again in a moment."), 500);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
