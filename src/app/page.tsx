import type { Viewport } from "next";
import { EstiloB } from "@/components/estilo-b/estilo-b";
import type { ProjectReview } from "@/components/estilo-b/project-showcase";
import { getReviews } from "@/services/reviews";

/* Título, descrição e dados estruturados vêm do layout: a home é a página padrão do site. */

/* No celular o topo da página é a tarja preta: a barra do navegador emenda com ela, nos dois temas
   (o Estilo B fica sempre no claro, e a tarja do claro é --chrome #111111). */
export const viewport: Viewport = { themeColor: "#111111" };

/* mesmo ritmo da página de avaliações: depoimento novo aparece em até 5 min */
export const revalidate = 300;

export default async function Home() {
  /* Uma avaliação por projeto: a de maior nota e, no empate, o comentário mais longo — é a que
     mais diz. Avaliação sem comentário não entra: a coluna mostra o que o cliente escreveu. */
  const reviews: Record<number, ProjectReview> = {};
  for (const r of await getReviews()) {
    if (r.project === null || !r.comment.trim()) continue;
    const current = reviews[r.project];
    if (!current || r.rating > current.rating || (r.rating === current.rating && r.comment.length > current.comment.length)) {
      reviews[r.project] = r;
    }
  }

  /* o "já vi a intro" é lido antes da primeira pintura pelo themeScript do layout */
  return <EstiloB reviews={reviews} />;
}
