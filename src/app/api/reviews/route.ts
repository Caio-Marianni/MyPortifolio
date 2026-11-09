import { NextRequest, NextResponse } from "next/server";
import { LIMITS, PUBLIC_INVITE, isJpegBase64 } from "@/data/reviews";
import { verifyInvite } from "@/services/invite";
import { readFields, text } from "@/services/review-input";
import { countRecent, createReview } from "@/services/reviews";

/* Fronteira de confiança: o corpo vem do navegador de quem avalia, que pode editar todos os
   campos. Duas portas:
   - com convite: o identificador assinado abre, como sempre (fotos do projeto liberadas);
   - sem convite: o formulário aberto da página de avaliações. Entra com o convite PUBLIC_INVITE,
     só com a foto de perfil, e passa por um campo-isca e por um teto de envios por hora.
   Nas duas, tudo nasce pendente: nada vai ao ar sem você aprovar no painel. A validação do
   formulário é cortesia visual; o portão de verdade é este.

   ponytail: o teto é global e contado no banco (sem Redis). Envios simultâneos podem passar dele
   por um ou dois; e um robô insistente trava o formulário aberto para todos até a hora virar —
   aí vale um captcha (Turnstile) ou limite por IP. */

/** avaliações abertas aceitas por hora, somando todo mundo */
const PUBLIC_PER_HOUR = 10;

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/* o formulário roda nos dois idiomas, então o erro volta no idioma de quem enviou */
const say = (en: boolean) => (pt: string, english: string) => (en ? english : pt);

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Corpo inválido.", 400);
  const t = say(body.lang === "en");

  const invite = text(body.invite);
  const open = !invite;
  /* campo-isca: escondido de quem usa o formulário, preenchido por robô. Responde "ok" para o
     robô não aprender a desviar, e não grava nada. */
  if (open && text(body.website)) return NextResponse.json({ ok: true }, { status: 201 });
  if (!open && !verifyInvite(invite, text(body.token) || undefined)) {
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
  /* foto do projeto é o que pesa no banco: no formulário aberto, só a de perfil */
  if (open && shots.length) return fail(t("Fotos do projeto só pelo link de avaliação.", "Project photos only through the review link."), 400);

  try {
    if (open && (await countRecent(PUBLIC_INVITE, 60)) >= PUBLIC_PER_HOUR) {
      return fail(t("Muitas avaliações agora. Tente de novo daqui a pouco.", "Too many reviews right now. Please try again shortly."), 429);
    }
    await createReview({ ...read.fields, invite: open ? PUBLIC_INVITE : invite, photo: photo || null, shots });
  } catch (error) {
    console.error("[reviews] falha ao gravar avaliação:", error);
    return fail(t("Não consegui salvar agora. Tente de novo em instantes.", "Could not save right now. Please try again in a moment."), 500);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
