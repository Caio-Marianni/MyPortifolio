/* caminho relativo com extensão, como em services/admin.ts: o `npm run check` roda isto no node
   puro, que não conhece o alias `@/` */
import { LIMITS, TRACKS, isJpegBase64, type Track } from "../data/reviews.ts";
import { allProjects } from "../data/projects.ts";

/* Leitura e validação dos campos de uma avaliação que vêm de fora — o envio do cliente
   (/api/reviews) e a edição no painel (/api/reviews/[id]) conferem as mesmas regras, então
   elas moram num lugar só. Sem banco aqui: é função pura, testável por `npm run check`. */

/** Mensagem nos dois idiomas; quem chama escolhe qual sai. */
export type Say = (pt: string, en: string) => string;

export const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export interface ReviewFields {
  name: string;
  company: string | null;
  track: Track;
  rating: number;
  comment: string;
  /** id desconhecido vira "sem projeto" em vez de erro — no envio do cliente ele nem vê o campo */
  project: number | null;
}

export function readFields(body: Record<string, unknown>, t: Say): { fields: ReviewFields } | { error: string } {
  const name = text(body.name);
  const company = text(body.company);
  const track = text(body.track);
  const comment = text(body.comment);
  const rating = Number(body.rating);
  const projectId = Number(body.project);

  if (!TRACKS.includes(track as Track)) return { error: t("Contexto inválido.", "Invalid context.") };
  if (!name || name.length > LIMITS.name) return { error: t("Preencha seu nome.", "Please enter your name.") };
  if (company.length > LIMITS.company) return { error: t("Nome de empresa muito longo.", "Company name is too long.") };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: t("Nota deve ser de 1 a 5.", "Rating must be from 1 to 5.") };
  }
  if (comment.length > LIMITS.comment) return { error: t("Comentário muito longo.", "Comment is too long.") };

  return {
    fields: {
      name,
      company: company || null,
      track: track as Track,
      rating,
      comment,
      project: allProjects.some((p) => p.id === projectId) ? projectId : null,
    },
  };
}

/** "YYYY-MM-DD" que existe no calendário e não está no futuro — `today` entra por parâmetro
    pra conta ser testável. 2026-02-31 cai aqui: o Date rola pra março e a volta não bate. */
export function validDate(value: string, today: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value && value <= today;
}

/** Foto do cliente: manter a que está ("keep", só na edição), tirar (`null`) ou trocar (base64 cru). */
export type PhotoEdit = "keep" | string | null;
/** Foto do projeto: número é a que já estava, pelo índice atual (só na edição); texto é nova, em base64. */
export type ShotEdit = number | string;

/** Imagens que chegam do painel — na edição (`allowKeep`) dá pra manter as que já estão; na
    criação tudo é novo. O tamanho de cada uma é o mesmo teto do formulário do contratante. */
export function readImages(
  body: Record<string, unknown>,
  allowKeep: boolean,
): { photo: PhotoEdit; shots: ShotEdit[] } | { error: string } {
  const photo: PhotoEdit = allowKeep && body.photo === "keep" ? "keep" : text(body.photo) || null;
  /* "keep" sem `allowKeep` cai aqui como texto qualquer — e texto que não é JPEG é recusado */
  if (photo !== null && !(allowKeep && photo === "keep") && !isJpegBase64(photo, LIMITS.photo)) {
    return { error: "Não consegui ler a foto do cliente." };
  }

  if (!Array.isArray(body.shots) || body.shots.length > LIMITS.shots) {
    return { error: `No máximo ${LIMITS.shots} fotos do projeto.` };
  }
  const shots: ShotEdit[] = [];
  for (const shot of body.shots as unknown[]) {
    const keep = allowKeep && shot && typeof shot === "object" ? Number((shot as { keep?: unknown }).keep) : NaN;
    if (Number.isInteger(keep) && keep >= 0 && keep < LIMITS.shots) shots.push(keep);
    else if (isJpegBase64(text(shot), LIMITS.shot)) shots.push(text(shot));
    else return { error: "Não consegui ler uma das fotos do projeto." };
  }
  return { photo, shots };
}
