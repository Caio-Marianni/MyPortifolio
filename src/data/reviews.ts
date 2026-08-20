/* Formato e contas das avaliações. Sem import de banco de propósito: os componentes de cliente
   (hero, capa, quadro de avaliações) leem daqui, e o acesso ao Neon fica em services/reviews.ts. */

/** as duas trilhas do site — as mesmas pills do lobby */
export type Track = "web" | "thumbs";

export const TRACKS: Track[] = ["web", "thumbs"];

export const TRACK_LABEL: Record<Track, string> = { web: "Web Dev", thumbs: "Thumbnails" };

/** pendente até você decidir; recusada não volta pra fila nem aparece no site */
export type Status = "pending" | "approved" | "rejected";

/** o que o site mostra. As imagens entram aqui como presença e contagem, nunca como bytes:
    o base64 mora no banco e chega pelo endereço abaixo, senão o HTML da página carregaria
    alguns MB por avaliação. */
export interface Review {
  id: number;
  name: string;
  /** canal ou empresa; opcional porque nem todo cliente tem um */
  company: string | null;
  track: Track;
  rating: number;
  comment: string;
  /** id do projeto em data/projects.ts; nulo quando o trabalho avaliado não está publicado */
  project: number | null;
  /** o cliente mandou foto? o arquivo em si vem por `reviewImage(id)` */
  photo: boolean;
  /** quantas fotos do projeto ele anexou — as URLs são `reviewImage(id, 0..shots-1)` */
  shots: number;
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

/** Endereço da imagem de uma avaliação: sem índice é a foto do cliente, com índice é a
    enésima foto do projeto. Uma função só porque quem monta a URL são quatro telas. */
export function reviewImage(id: number, index?: number): string {
  return index === undefined ? `/api/reviews/${id}/image` : `/api/reviews/${id}/image?i=${index}`;
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

/** Limites do formulário — validados no cliente e de novo na rota, que é a fronteira real.
    `photo` e `shot` contam caracteres de base64, que é como a imagem viaja e como ela é
    guardada: ~4 caracteres por 3 bytes, então 80k ≈ 60KB e 600k ≈ 450KB. O navegador já
    redimensiona antes de enviar (services/image.ts); estes números são o teto de quem
    resolver mandar à mão. */
export const LIMITS = {
  name: 80,
  company: 80,
  comment: 600,
  email: 120,
  invite: 60,
  photo: 80_000,
  shot: 600_000,
  shots: 3,
} as const;

/* Imagem chega e é guardada como base64 cru de JPEG, sem prefixo `data:` — assim não há mime
   declarado pelo cliente pra confiar. Todo JPEG começa com os bytes FF D8 FF, que em base64
   são sempre os caracteres "/9j/": dá pra conferir a assinatura do arquivo sem decodificar. */
const JPEG_BASE64 = /^\/9j\/[A-Za-z0-9+/]*={0,2}$/;

/** Mora aqui, junto de LIMITS, porque é a mesma regra dos dois lados: o formulário para antes
    de enviar e a rota confere de novo, que é a fronteira de verdade. */
export function isJpegBase64(data: string, limit: number): boolean {
  return data.length > 0 && data.length <= limit && data.length % 4 === 0 && JPEG_BASE64.test(data);
}
