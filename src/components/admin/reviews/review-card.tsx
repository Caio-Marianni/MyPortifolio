import Link from "next/link";
import { Badge, type Tone } from "@/components/admin/badge";
import { DeleteConfirm } from "@/components/admin/delete-confirm";
import { ReviewEditor } from "@/components/admin/reviews/review-editor";
import { ReviewPhoto, ReviewShots } from "@/components/reviews/review-photo";
import { Stars } from "@/components/ui/brand-marks";
import { BUTTON, CARD } from "@/components/ui/styles";
import { allProjects } from "@/data/projects";
import { TRACK_LABEL, type ReviewRecord, type Status } from "@/data/reviews";
import { decide, remove } from "@/app/admin/(painel)/avaliacoes/actions";

const STATUS_LABEL: Record<Status, string> = {
  pending: "Pendente",
  approved: "No site",
  rejected: "Recusada",
};

const STATUS_TONE: Record<Status, Tone> = {
  pending: "accent",
  approved: "ok",
  rejected: "neutral",
};

/* Botão pra cada destino diferente do estado atual: a mesma fileira serve às três situações,
   sem um `if` por status. */
const MOVES: { status: Status; label: string }[] = [
  { status: "approved", label: "Publicar" },
  { status: "pending", label: "Voltar pra fila" },
  { status: "rejected", label: "Recusar" },
];

/* Mesma anatomia do quadro público e da ficha de projeto — foto, nome, nota e só então o texto —,
   pra que a avaliação tenha o mesmo peso nas três telas. O que é só seu (trilha, projeto, e-mail,
   convite, data) fica embaixo, longe da voz do cliente. */
export function ReviewCard({ page, review, excluindo, editando }: { page: string; review: ReviewRecord; excluindo: boolean; editando: boolean }) {
  const projeto = allProjects.find((project) => project.id === review.project)?.title;
  const meta = [TRACK_LABEL[review.track], projeto, review.email, `convite: ${review.invite}`, review.createdAt];

  /* Editar troca o card inteiro pelo formulário, no mesmo lugar da lista: a decisão de
     publicar continua nos botões de baixo, depois de salvar. */
  if (editando) {
    return (
      <article className={`${CARD} flex flex-col gap-4 border-l-2 border-accent`}>
        <ReviewEditor review={review} />
      </article>
    );
  }

  return (
    <article className={`${CARD} flex flex-col gap-4`}>
      <header className="flex items-center gap-4">
        <ReviewPhoto review={review} className="h-12 w-12 bg-ink/[0.07] text-[19px] text-ink/60" />

        <span className="flex min-w-0 flex-col gap-1.5">
          <span className="text-body leading-tight">
            <span className="font-semibold">{review.name}</span>
            {review.company && <span className="text-ink/60"> · {review.company}</span>}
          </span>

          <Stars count={review.rating} className="text-ui text-accent" />
        </span>

        <span className="ml-auto">
          <Badge tone={STATUS_TONE[review.status]}>{STATUS_LABEL[review.status]}</Badge>
        </span>
      </header>

      {review.comment ? (
        <blockquote className="text-body leading-relaxed text-ink/80">{review.comment}</blockquote>
      ) : (
        <p className="text-body italic leading-relaxed text-ink/60">Só a nota, sem comentário.</p>
      )}

      {/* As imagens só carregam aqui porque você tem sessão: a rota serve pendente e recusada
          apenas pra quem tem o cookie do painel. */}
      <ReviewShots review={review} label="Foto do projeto" />

      <p className="text-ui leading-tight text-ink/60">{meta.filter(Boolean).join(" · ")}</p>

      {excluindo ? (
        <DeleteConfirm action={remove} fields={{ id: review.id }} message="Some com texto e fotos. Não dá pra desfazer." cancelHref={page} />
      ) : (
        <form action={decide} className="flex flex-wrap items-center gap-2 pt-1">
          <input type="hidden" name="id" value={review.id} />
          {MOVES.filter((move) => move.status !== review.status).map((move) => (
            <button key={move.status} type="submit" name="status" value={move.status} className={BUTTON}>
              {move.label}
            </button>
          ))}

          <Link href={`${page}?editar=${review.id}`} className={`${BUTTON} ml-auto`}>
            Editar
          </Link>

          <Link href={`${page}?excluir=${review.id}`} className={`${BUTTON} text-danger`}>
            Excluir
          </Link>
        </form>
      )}
    </article>
  );
}
