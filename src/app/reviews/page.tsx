import type { Metadata } from "next";
import { ReviewsBoard } from "@/components/reviews/reviews-board";
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

  return <ReviewsBoard reviews={reviews} summary={summarize(reviews)} />;
}
