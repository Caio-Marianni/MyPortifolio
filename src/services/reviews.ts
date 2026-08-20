import { db } from "@/services/db";
import { summarize, type Review, type ReviewRecord, type ReviewSummary, type Status, type Track } from "@/data/reviews";

/** Só o que você aprovou sai do banco: a moderação é o filtro do `select`, não do componente.
    `created_at` fica no order by e não sobe pro componente — nada na tela mostra data. */
async function listApproved(): Promise<Review[]> {
  return (await db()`
    select id, name, company, track, rating, comment
    from reviews
    where status = 'approved'
    order by created_at desc
  `) as Review[];
}

/** Nunca lança: a nota é peça do cabeçalho de todas as páginas, e banco fora do ar não pode
    derrubar o site inteiro — sem avaliação, faixa e rail simplesmente não mostram nota. */
export async function getReviews(): Promise<Review[]> {
  try {
    return await listApproved();
  } catch (error) {
    console.error("[reviews] falha ao ler avaliações:", error);
    return [];
  }
}

export async function getSummary(): Promise<ReviewSummary> {
  return summarize(await getReviews());
}

/** Painel: tudo, com as pendentes em cima. A data já vem formatada do banco, que é mais barato
    que mandar ISO e formatar no cliente — e não corre risco de divergir na hidratação. */
export async function listAll(): Promise<ReviewRecord[]> {
  return (await db()`
    select id, invite, name, company, track, rating, comment, email, status,
           to_char(created_at, 'DD/MM/YYYY') as "createdAt"
    from reviews
    order by (status = 'pending') desc, created_at desc
  `) as ReviewRecord[];
}

export async function setStatus(id: number, status: Status): Promise<void> {
  await db()`update reviews set status = ${status} where id = ${id}`;
}

export interface NewReview {
  invite: string;
  name: string;
  company: string | null;
  track: Track;
  rating: number;
  comment: string;
  email: string | null;
}

/** Entra sempre como pendente — publicar é decisão sua, no painel. */
export async function createReview(review: NewReview): Promise<void> {
  await db()`
    insert into reviews (invite, name, company, track, rating, comment, email)
    values (${review.invite}, ${review.name}, ${review.company}, ${review.track}, ${review.rating}, ${review.comment}, ${review.email})
  `;
}
