import { NextRequest, NextResponse } from "next/server";
import { LIMITS, TRACKS, isJpegBase64, type Track } from "@/data/reviews";
import { projects } from "@/data/projects";
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
  const photo = text(body.photo);
  const shots: string[] = Array.isArray(body.shots) ? body.shots.map((shot: unknown) => text(shot)) : [];
  const rating = Number(body.rating);
  /* projeto vem do link que você gerou; id desconhecido vira "avaliação sem projeto" em vez
     de erro — o cliente não tem o que corrigir num campo que ele nem viu */
  const projectId = Number(body.project);
  const project = projects.some((p) => p.id === projectId) ? projectId : null;

  if (invite.length > LIMITS.invite) return fail("Convite inválido.", 400);
  if (!TRACKS.includes(track as Track)) return fail("Contexto inválido.", 400);
  if (!name || name.length > LIMITS.name) return fail("Preencha seu nome.", 400);
  if (company.length > LIMITS.company) return fail("Nome de empresa muito longo.", 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return fail("Nota deve ser de 1 a 5.", 400);
  if (comment.length > LIMITS.comment) return fail("Comentário muito longo.", 400);
  if (photo && !isJpegBase64(photo, LIMITS.photo)) return fail("Não consegui ler sua foto.", 400);
  if (shots.length > LIMITS.shots) return fail(`No máximo ${LIMITS.shots} fotos do projeto.`, 400);
  if (shots.some((shot) => !isJpegBase64(shot, LIMITS.shot))) return fail("Não consegui ler uma das fotos.", 400);

  try {
    await createReview({
      invite,
      name,
      company: company || null,
      track: track as Track,
      rating,
      comment,
      photo: photo || null,
      shots,
      project,
    });
  } catch (error) {
    console.error("[reviews] falha ao gravar avaliação:", error);
    return fail("Não consegui salvar agora. Tente de novo em instantes.", 500);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
