"use client";

import { useState, type ReactNode } from "react";
import { Stars } from "@/components/ui/brand-marks";
import { FOCUS } from "@/components/ui/styles";
import { formatMonth, type Review } from "@/data/reviews";

/* A citação do Estilo B, a mesma na home (projeto em destaque, índice) e no quadro de avaliações.
   Caixa creme, quem falou em cima (rosto, nome, empresa · mês, estrelas à direita) e o que foi
   dito embaixo — é o "quem" que a pessoa procura primeiro.
   O quadro acrescenta rosto, etiqueta de trilha e, no pé, o projeto e as fotos (`avatar`, `tag`,
   `children`). */

export type QuoteReview = Pick<Review, "comment" | "name" | "company" | "rating" | "month">;

/* ponytail: "longo" pelo número de caracteres, não medindo a altura renderizada. Perto de 6
   linhas na coluna do card; trocar por medição (scrollHeight) se o corte errar muito. */
const LONG_COMMENT = 280;

export function Quote({
  review,
  language,
  withStars,
  collapsible,
  avatar,
  companyMark,
  tag,
  className = "",
  children,
  footer,
}: {
  review: QuoteReview;
  language: "pt" | "en";
  withStars?: boolean;
  /** corta o comentário longo em 6 linhas com "ler mais" */
  collapsible?: boolean;
  avatar?: ReactNode;
  /** marca pequena antes do nome da empresa (o logo do projeto avaliado) */
  companyMark?: ReactNode;
  /** etiqueta discreta ao lado do mês, ex.: a trilha */
  tag?: string;
  className?: string;
  children?: ReactNode;
  /** faixa no pé do card, de borda a borda: fica fora do padding, não depende de margem negativa */
  footer?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pt = language === "pt";
  const clamp = collapsible && review.comment.length > LONG_COMMENT;

  const signature = (
    /* As estrelas dividem a linha do nome, não a coluna inteira: assim empresa, mês e trilha
       ganham a largura toda embaixo e só quebram entre si, nunca no meio ("ago. / 2026"). */
    <figcaption className="flex items-center gap-3">
      {avatar}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center justify-between gap-3">
          <strong className="truncate text-ui text-ink">{review.name}</strong>
          {withStars && <Stars count={review.rating} className="shrink-0 text-[13px] text-accent" />}
        </span>
        <span className="flex flex-wrap items-center gap-x-1.5 text-meta text-ink/60">
          {review.company && (
            <span className="flex max-w-full items-center gap-1.5 truncate">
              {companyMark}
              {review.company} ·
            </span>
          )}
          <span className="whitespace-nowrap">{formatMonth(review.month, language)}</span>
          {tag && <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] text-ink/65">· {tag}</span>}
        </span>
      </span>
    </figcaption>
  );

  return (
    <figure className={`flex flex-col bg-[#F6F4F1] ${className}`}>
      <div className="flex flex-col gap-3 p-4">
        {signature}
        {/* comentário é opcional: quem só deu a nota fica com a assinatura, sem aspas vazias */}
        {review.comment && (
          <div className="flex flex-col items-start gap-1.5">
            <blockquote className={`text-ui leading-relaxed sm:text-[14px] ${clamp && !open ? "line-clamp-6" : ""}`}>
              “{review.comment}”
            </blockquote>
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
        )}
        {children}
      </div>
      {footer}
    </figure>
  );
}
