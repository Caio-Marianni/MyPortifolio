import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LIMITS } from "@/data/reviews";
import { COOKIE, validSession } from "@/services/admin";
import { getImage } from "@/services/reviews";

/* As imagens da avaliação moram no banco em base64 e saem por aqui, uma requisição por
   arquivo. É o que mantém o HTML da página de avaliações pequeno: sem esta rota, cada foto
   viajaria inteira dentro do markup de toda visita.

   `?i=` ausente é a foto do cliente; `?i=0..2` são as fotos do projeto.

   ponytail: banco como storage de imagem, sem CDN. O cache imutável de um ano faz o navegador
   e a borda pedirem uma vez só, e o volume é de dezenas de arquivos — trocar por blob storage
   se um dia virar centenas. */

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return new NextResponse(null, { status: 404 });

  const raw = request.nextUrl.searchParams.get("i");
  const index = raw === null ? undefined : Number(raw);
  if (index !== undefined && (!Number.isInteger(index) || index < 0 || index >= LIMITS.shots)) {
    return new NextResponse(null, { status: 404 });
  }

  /* Sessão do painel abre as não publicadas — sem ela, foto de avaliação pendente ou recusada
     não existe pra quem chutar o id. */
  const admin = validSession(cookies().get(COOKIE)?.value);

  let data: string | null;
  try {
    data = await getImage(id, index, admin);
  } catch (error) {
    console.error("[reviews] falha ao ler imagem:", error);
    return new NextResponse(null, { status: 500 });
  }
  if (!data) return new NextResponse(null, { status: 404 });

  return new NextResponse(Buffer.from(data, "base64"), {
    headers: {
      "Content-Type": "image/jpeg",
      /* o conteúdo de um id nunca muda: quem quiser trocar a foto manda outra avaliação */
      "Cache-Control": admin ? "private, max-age=60" : "public, max-age=31536000, immutable",
    },
  });
}
