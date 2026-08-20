import type { Metadata } from "next";
import { ReviewsBoard } from "@/components/reviews/reviews-board";
import { projects } from "@/data/projects";
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

/* Avaliação nova entra pela moderação, não pelo minuto: 5 min de ISR é atualização de sobra
   e a página continua servindo HTML pronto em vez de bater no Neon a cada visita. */
export const revalidate = 300;

export default async function ReviewsPage() {
  const reviews = await getReviews();

  /* Só o título dos projetos que alguma avaliação cita: o quadro é componente de cliente e
     importar data/projects lá arrastaria a lista inteira pro pacote do visitante pra ler uma
     palavra por card — o mesmo motivo do prefill em app/avaliar/page.tsx. */
  const projectTitles: Record<number, string> = Object.fromEntries(
    projects.filter((p) => reviews.some((r) => r.project === p.id)).map((p) => [p.id, p.title] as const),
  );

  return <ReviewsBoard reviews={reviews} summary={summarize(reviews)} projectTitles={projectTitles} />;
}
