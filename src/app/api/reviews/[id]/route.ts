import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { COOKIE, validSession } from "@/services/admin";
import { readFields, readImages, text, validDate } from "@/services/review-input";
import { updateReview } from "@/services/reviews";

/* Edição de avaliação pelo painel. Rota e não server action porque a action para em 1 MB de
   corpo, e três fotos do projeto passam disso. A tranca é a mesma do painel: sem sessão, 401 —
   a rota é pública como qualquer outra, quem guarda é o cookie. Painel só em português. */

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
const pt = (message: string) => message;

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validSession(cookies().get(COOKIE)?.value)) return fail("Sessão expirada. Entre de novo.", 401);

  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return fail("Avaliação inexistente.", 404);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Corpo inválido.", 400);

  const read = readFields(body, pt);
  if ("error" in read) return fail(read.error, 400);

  const date = text(body.date);
  if (!validDate(date, new Date().toISOString().slice(0, 10))) return fail("Data inválida (ou no futuro).", 400);

  const images = readImages(body, true);
  if ("error" in images) return fail(images.error, 400);

  let result: Awaited<ReturnType<typeof updateReview>>;
  try {
    result = await updateReview(id, { ...read.fields, ...images, date });
  } catch (error) {
    console.error("[reviews] falha ao editar avaliação:", error);
    return fail("Não consegui salvar agora. Tente de novo em instantes.", 500);
  }
  if (result === "not-found") return fail("Avaliação inexistente.", 404);
  if (result === "stale") return fail("As fotos mudaram em outra aba. Recarregue o painel e edite de novo.", 409);

  /* mesma revalidação da moderação: a nota e o mês aparecem em páginas que o layout raiz serve */
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
