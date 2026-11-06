import type { Metadata } from "next";
import { EstiloB } from "@/components/estilo-b/estilo-b";
import type { ProjectReview } from "@/components/estilo-b/project-showcase";
import { getReviews } from "@/services/reviews";

/* Proposta de home para comparar com a atual, mandada por link a quem vai opinar.
   Fora do índice: é rascunho de design, não página do site. */
export const metadata: Metadata = {
  title: "Estilo B",
  robots: { index: false, follow: false },
};

/* mesmo ritmo da página de avaliações: depoimento novo aparece em até 5 min */
export const revalidate = 300;

export default async function EstiloBPage() {
  /* Uma avaliação por projeto: a de maior nota e, no empate, o comentário mais longo — é a que
     mais diz. Avaliação sem comentário não entra: a coluna mostra o que o cliente escreveu. */
  const reviews: Record<number, ProjectReview> = {};
  for (const r of await getReviews()) {
    if (r.project === null || !r.comment.trim()) continue;
    const current = reviews[r.project];
    if (!current || r.rating > current.rating || (r.rating === current.rating && r.comment.length > current.comment.length)) {
      reviews[r.project] = { comment: r.comment, name: r.name, company: r.company, rating: r.rating, month: r.month };
    }
  }

  return <EstiloB reviews={reviews} />;
}
