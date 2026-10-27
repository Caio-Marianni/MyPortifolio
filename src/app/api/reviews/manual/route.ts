import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { COOKIE, validSession } from "@/services/admin";
import { readFields, readImages, text, validDate } from "@/services/review-input";
import { createReview } from "@/services/reviews";

/* Avaliação cadastrada à mão no painel — a que chegou por WhatsApp ou e-mail. Mesma tranca e
   mesmas regras da edição; a diferença é que aqui não há imagem pra manter, e ela pode já
   nascer publicada. `invite` fica "manual": é o que o painel mostra no lugar do link. */

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
const pt = (message: string) => message;

export async function POST(request: NextRequest) {
  if (!validSession((await cookies()).get(COOKIE)?.value)) return fail("Sessão expirada. Entre de novo.", 401);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Corpo inválido.", 400);

  const read = readFields(body, pt);
  if ("error" in read) return fail(read.error, 400);

  const date = text(body.date);
  if (!validDate(date, new Date().toISOString().slice(0, 10))) return fail("Data inválida (ou no futuro).", 400);

  const images = readImages(body, false);
  if ("error" in images) return fail(images.error, 400);

  try {
    await createReview({
      ...read.fields,
      invite: "manual",
      /* sem "keep" na criação, então o que sobra é base64 ou nada */
      photo: images.photo === "keep" ? null : images.photo,
      shots: images.shots.filter((shot): shot is string => typeof shot === "string"),
      date,
      status: body.publish === true ? "approved" : "pending",
    });
  } catch (error) {
    console.error("[reviews] falha ao cadastrar avaliação manual:", error);
    return fail("Não consegui salvar agora. Tente de novo em instantes.", 500);
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true }, { status: 201 });
}
