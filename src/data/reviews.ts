/* Formato e contas das avaliações. Sem import de banco de propósito: os componentes de cliente
   (hero, capa, quadro de avaliações) leem daqui, e o acesso ao Neon fica em services/reviews.ts. */

/** as duas trilhas do site — as mesmas pills do lobby */
export type Track = "web" | "thumbs";

export const TRACKS: Track[] = ["web", "thumbs"];

export const TRACK_LABEL: Record<Track, string> = { web: "Web Dev", thumbs: "Thumbnails" };

/** pendente até você decidir; recusada não volta pra fila nem aparece no site */
export type Status = "pending" | "approved" | "rejected";

/** o que o site mostra */
export interface Review {
  id: number;
  name: string;
  /** canal ou empresa; opcional porque nem todo cliente tem um */
  company: string | null;
  track: Track;
  rating: number;
  comment: string;
}

/** o que o painel mostra: tudo do site mais o que só interessa a você */
export interface ReviewRecord extends Review {
  /** o link que gerou a avaliação — diz de quem você esperava esta resposta */
  invite: string;
  email: string | null;
  status: Status;
  /** já formatado no `select`; nada de Intl no cliente pra não brigar com a hidratação */
  createdAt: string;
}

export interface TrackStats {
  avg: number;
  count: number;
}

export type ReviewSummary = Record<"overall" | Track, TrackStats>;

const stats = (list: Review[]): TrackStats => ({
  count: list.length,
  avg: list.length ? list.reduce((sum, r) => sum + r.rating, 0) / list.length : 0,
});

/* ponytail: média em JS em cima da lista que a página já busca, em vez de um segundo
   `select avg(...) group by track`. Com dezenas de avaliações não há o que otimizar —
   trocar por agregação no banco se um dia a lista virar paginada. */
export function summarize(reviews: Review[]): ReviewSummary {
  return {
    overall: stats(reviews),
    web: stats(reviews.filter((r) => r.track === "web")),
    thumbs: stats(reviews.filter((r) => r.track === "thumbs")),
  };
}

/** O par que as peças de marca consomem. `null` sem avaliação nenhuma: a faixa esconde a nota
    em vez de anunciar 0.0 — quem monta rail e capa já trata rating ausente. */
export function ratingMark(stats: TrackStats): { value: string; stars: number } | null {
  if (!stats.count) return null;
  return { value: stats.avg.toFixed(1), stars: Math.round(stats.avg) };
}

/** Limites do formulário — validados no cliente e de novo na rota, que é a fronteira real. */
export const LIMITS = { name: 80, company: 80, comment: 600, email: 120, invite: 60 } as const;
