import { db } from "@/services/db";
import { summarize, type Review, type ReviewRecord, type ReviewSummary, type Status, type Track } from "@/data/reviews";
import type { PhotoEdit, ReviewFields, ShotEdit } from "@/services/review-input";

/* As colunas `photo` e `shots` guardam base64 e nunca entram numa listagem: o que sobe pro
   componente é se existe foto e quantas fotos do projeto há. O byte sai por `getImage`, que a
   rota /api/reviews/[id]/image serve com cache de um ano — assim a página de avaliações
   continua um HTML pequeno em vez de alguns MB de data URL. */
const PUBLIC_FIELDS = `id, name, company, track, rating, comment, project,
                       (photo is not null) as photo,
                       coalesce(array_length(shots, 1), 0) as shots,
                       to_char(created_at, 'YYYY-MM') as month,
                       version`;

/** Só o que você aprovou sai do banco: a moderação é o filtro do `select`, não do componente.
    A data sobe só como mês (`month`, "YYYY-MM"): é o que o card mostra. */
async function listApproved(): Promise<Review[]> {
  return (await db().query(`
    select ${PUBLIC_FIELDS}
    from reviews
    where status = 'approved'
    order by created_at desc
  `)) as Review[];
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
  return (await db().query(`
    select ${PUBLIC_FIELDS}, invite, email, status,
           to_char(created_at, 'DD/MM/YYYY') as "createdAt",
           to_char(created_at, 'YYYY-MM-DD') as date
    from reviews
    order by (status = 'pending') desc, created_at desc
  `)) as ReviewRecord[];
}

/** Uma imagem, em base64 cru. `index` ausente é a foto do cliente; com índice é a enésima foto
    do projeto. `admin` abre as não publicadas — sem ele, foto de avaliação pendente ou recusada
    não existe pra quem chuta o id. */
export async function getImage(id: number, index: number | undefined, admin: boolean): Promise<string | null> {
  const sql = db();
  const rows = (
    index === undefined
      ? await sql`select photo as data from reviews where id = ${id} and (status = 'approved' or ${admin}::boolean)`
      : await sql`select shots[${index + 1}::int] as data from reviews where id = ${id} and (status = 'approved' or ${admin}::boolean)`
  ) as { data: string | null }[];
  return rows[0]?.data ?? null;
}

export async function setStatus(id: number, status: Status): Promise<void> {
  await db()`update reviews set status = ${status} where id = ${id}`;
}

/** Apaga a linha inteira, imagens junto — foto e anexos moram em colunas dela, então não sobra
    órfão em lugar nenhum. Não tem volta: quem chama é o painel, depois de confirmar na tela.
    Para tirar do site sem perder o texto existe `setStatus(id, "rejected")`. */
export async function deleteReview(id: number): Promise<void> {
  await db()`delete from reviews where id = ${id}`;
}

export interface NewReview {
  invite: string;
  name: string;
  company: string | null;
  track: Track;
  rating: number;
  comment: string;
  /** base64 cru, sem o prefixo `data:` — a rota confere que é JPEG antes de chegar aqui */
  photo: string | null;
  shots: string[];
  project: number | null;
  /** só a avaliação cadastrada à mão no painel traz os dois: a do contratante entra pendente e hoje */
  status?: Status;
  /** "YYYY-MM-DD"; ausente é agora */
  date?: string;
}

/** Pendente por padrão — publicar é decisão sua, no painel. A cadastrada à mão pode já nascer
    publicada e com a data de quando chegou de verdade. */
export async function createReview(review: NewReview): Promise<void> {
  await db()`
    insert into reviews (invite, name, company, track, rating, comment, photo, shots, project, status, created_at)
    values (${review.invite}, ${review.name}, ${review.company}, ${review.track}, ${review.rating},
            ${review.comment}, ${review.photo}, ${review.shots}, ${review.project},
            ${review.status ?? "pending"}, coalesce(${review.date ?? null}::date::timestamptz, now()))
  `;
}

export interface ReviewEdit extends ReviewFields {
  /** "YYYY-MM-DD" — vira `created_at` à meia-noite; a rota já conferiu que é data válida */
  date: string;
  photo: PhotoEdit;
  /** a lista final, na ordem final: manter, tirar e reordenar são a mesma operação */
  shots: ShotEdit[];
}

/** Edição pelo painel. Lê as fotos do projeto que já estão lá pra montar a lista nova — o painel
    manda só o índice das que ficam, não o arquivo de volta. A versão sobe junto, e é ela que troca
    a URL das imagens (`reviewImage`) e fura o cache de um ano da rota.

    "stale" é índice de foto que não existe mais: outra aba editou antes. Melhor recusar que
    gravar uma lista com buraco. */
export async function updateReview(id: number, edit: ReviewEdit): Promise<"ok" | "not-found" | "stale"> {
  const sql = db();
  const [row] = (await sql`select shots from reviews where id = ${id}`) as { shots: string[] | null }[];
  if (!row) return "not-found";

  const current = row.shots ?? [];
  const shots = edit.shots.map((shot) => (typeof shot === "number" ? current[shot] : shot));
  if (shots.some((shot) => shot === undefined)) return "stale";

  const keepPhoto = edit.photo === "keep";
  await sql`
    update reviews set
      name = ${edit.name},
      company = ${edit.company},
      track = ${edit.track},
      rating = ${edit.rating},
      comment = ${edit.comment},
      project = ${edit.project},
      created_at = ${edit.date}::date,
      photo = case when ${keepPhoto}::boolean then photo else ${keepPhoto ? null : edit.photo}::text end,
      shots = ${shots},
      version = version + 1
    where id = ${id}
  `;
  return "ok";
}
