import type { Metadata, Viewport } from "next";
import { ReviewsPage, type ReviewProject } from "@/components/site/reviews-page";
import { allProjects, projects as mainProjects } from "@/data/projects";
import { summarize } from "@/data/reviews";
import { getReviews } from "@/services/reviews";

export const metadata: Metadata = {
  title: "Avaliações",
  description:
    "O que os clientes disseram sobre o trabalho: média geral e notas por contexto, desenvolvimento web e thumbnails.",
  openGraph: {
    title: "Avaliações | Caio Marianni",
    description: "O que os clientes disseram sobre o trabalho: média geral e notas por contexto.",
    url: "https://www.caiomarianni.com.br/reviews",
  },
  alternates: {
    canonical: "https://www.caiomarianni.com.br/reviews",
  },
};

/* No celular o topo da página é a tarja preta: a barra do navegador emenda com ela, nos dois temas
   (o site fica sempre no claro, e a tarja do claro é --chrome #111111). */
export const viewport: Viewport = { themeColor: "#111111" };

/* Avaliação nova entra pela moderação, não pelo minuto: 5 min de ISR é atualização de sobra
   e a página continua servindo HTML pronto em vez de bater no Neon a cada visita. */
export const revalidate = 300;

export default async function Reviews() {
  const reviews = await getReviews();

  /* Só nome, capa e logo dos projetos que alguma avaliação cita: o quadro é componente de cliente
     e importar data/projects lá arrastaria a lista inteira pro pacote do visitante — o mesmo motivo
     do prefill em app/avaliar/page.tsx. Capa só os principais têm; secundário cai na hachura. */
  const projects: Record<number, ReviewProject> = Object.fromEntries(
    allProjects
      .filter((p) => reviews.some((r) => r.project === p.id))
      .map((p) => {
        const main = mainProjects.find((m) => m.id === p.id);
        return [p.id, { title: p.title, cover: main?.cover, coverFocus: main?.coverFocus, logo: main?.logo }] as const;
      }),
  );

  return <ReviewsPage reviews={reviews} summary={summarize(reviews)} projects={projects} />;
}
