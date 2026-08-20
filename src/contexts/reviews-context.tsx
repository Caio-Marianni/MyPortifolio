"use client";

import { createContext, useContext, type ReactNode } from "react";
import { ratingMark, type ReviewSummary, type Track } from "@/data/reviews";

/* A nota aparece no rail do hero, na faixa de toda página interna e nas colunas do lobby —
   todas peças de cliente, e todas com o mesmo número. O layout raiz busca uma vez no servidor
   e passa por aqui, em vez de cada página virar um par servidor/cliente só pra receber a prop. */
const ReviewsContext = createContext<ReviewSummary | null>(null);

export function ReviewsProvider({ summary, children }: { summary: ReviewSummary; children: ReactNode }) {
  return <ReviewsContext.Provider value={summary}>{children}</ReviewsContext.Provider>;
}

/** Nota pronta pras peças de marca: geral sem argumento, da trilha com ele. `null` enquanto
    não houver avaliação daquele recorte — quem monta rail e faixa já esconde nota ausente. */
export function useRating(track?: Track) {
  const summary = useContext(ReviewsContext);
  if (!summary) return null;
  return ratingMark(track ? summary[track] : summary.overall);
}
