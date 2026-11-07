import type { Metadata } from "next";
import { EstiloBReviews, type ReviewProject } from "@/components/estilo-b/estilo-b-reviews";
import { allProjects, projects as mainProjects } from "@/data/projects";
import { summarize } from "@/data/reviews";
import { getReviews } from "@/services/reviews";

/* As avaliações na proposta do Estilo B. Rascunho de design como a home dele: fora do índice. */
export const metadata: Metadata = {
  title: "Estilo B · Avaliações",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

export default async function EstiloBReviewsPage() {
  const reviews = await getReviews();

  /* só nome e capa dos projetos citados — o porquê está em app/reviews/page.tsx.
     Capa só os principais têm; secundário cai no monograma do `Cover`. */
  const projects: Record<number, ReviewProject> = Object.fromEntries(
    allProjects
      .filter((p) => reviews.some((r) => r.project === p.id))
      .map((p) => {
        const main = mainProjects.find((m) => m.id === p.id);
        return [p.id, { title: p.title, cover: main?.cover, coverFocus: main?.coverFocus, logo: main?.logo }] as const;
      }),
  );

  return <EstiloBReviews reviews={reviews} summary={summarize(reviews)} projects={projects} />;
}
