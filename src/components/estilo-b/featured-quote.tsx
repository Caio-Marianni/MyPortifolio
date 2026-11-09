import { useState } from "react";
import { ReviewPhoto, ReviewShots } from "@/components/reviews/review-photo";
import { Stars } from "@/components/ui/brand-marks";
import { FOCUS } from "@/components/ui/styles";
import { formatMonth, type Review } from "@/data/reviews";

/* A avaliação dentro de um projeto em destaque. Separada da `Quote` porque aqui a ordem se
   inverte: o que foi dito vem primeiro, grande, e quem disse assina embaixo — o card do quadro de
   avaliações segue com o "quem" em cima, que lá é o que a pessoa procura.
   Sem caixa fechada: o fio laranja à esquerda separa a citação do texto do projeto, e o creme da
   antiga caixa entra como gradiente que some para a direita — dá corpo ao bloco sem virar mais
   um retângulo cheio ao lado da moldura do site e da tecla areia. */

/* mesmo corte da `Quote`, pelo número de caracteres */
const LONG_COMMENT = 280;

/** "desapego a fila anda" já diz "A Fila Anda": num destaque, o nome do projeto está no título logo acima */
const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
const repeatsProject = (company: string, project: string) => normalize(company).includes(normalize(project));

export function FeaturedQuote({ review, projectTitle, language }: { review: Review; projectTitle: string; language: "pt" | "en" }) {
  const [open, setOpen] = useState(false);
  const pt = language === "pt";
  const clamp = review.comment.length > LONG_COMMENT;
  const company = review.company && !repeatsProject(review.company, projectTitle) ? review.company : null;

  return (
    <figure className="flex flex-col gap-4 border-l-2 border-accent bg-gradient-to-r from-[#F6F4F1] to-transparent py-4 pl-5 pr-4">
      <div className="flex flex-col items-start gap-1.5">
        <span className="h-[26px] font-serif text-[56px] leading-none text-accent" aria-hidden>
          “
        </span>
        <blockquote className={`max-w-[65ch] text-body leading-relaxed text-ink/75 ${clamp && !open ? "line-clamp-5" : ""}`}>{review.comment}</blockquote>
        {clamp && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={`text-meta font-semibold text-ink/70 underline-offset-4 hover:text-ink hover:underline ${FOCUS}`}
          >
            {open ? (pt ? "ler menos" : "show less") : pt ? "ler mais" : "read more"}
          </button>
        )}
      </div>

      {/* as fotos que o cliente anexou são prova: no destaque vão grandes, não em miniatura */}
      {review.shots > 0 && (
        <div className="max-w-[380px]">
          <ReviewShots review={review} label={pt ? "Foto do projeto" : "Project photo"} />
        </div>
      )}

      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <ReviewPhoto review={review} className="h-11 w-11 bg-ink/[0.07] text-[16px] text-ink/60" />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="flex items-center gap-2.5">
            <strong className="truncate text-ui text-ink">{review.name}</strong>
            <Stars count={review.rating} className="shrink-0 text-meta text-accent" />
          </span>
          <span className="text-meta text-ink/60">
            {company && `${company} · `}
            {formatMonth(review.month, language)}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
