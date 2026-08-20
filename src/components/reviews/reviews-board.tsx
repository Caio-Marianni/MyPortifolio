"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CapaPage, SHELL } from "@/components/capa/capa-page";
import { RATING_FONT, Stars } from "@/components/ui/brand-marks";
import { ReviewPhoto, ReviewShots } from "@/components/reviews/review-photo";
import { TRACKS, TRACK_LABEL, type Review, type ReviewSummary, type Track, type TrackStats } from "@/data/reviews";
import { useLanguage } from "@/contexts/language-context";

type Filter = Track | "all";

/** plural das duas línguas; sai na legenda de cada nota e no aviso do leitor de tela */
const plural = (count: number, pt: boolean) =>
  pt ? (count === 1 ? "avaliação" : "avaliações") : count === 1 ? "review" : "reviews";

/* Nota de um recorte: algarismo, estrelas e quantas avaliações sustentam aquela média.
   Serve pro bloco preto da média geral e pras duas células de trilha, só mudando o corpo.

   `size` vai na linha, não no algarismo: as estrelas se medem em `em`, e presas ao span de fora
   esse `em` era o do texto corrido — 18px de estrela encostados num número de 132px, igual nas
   duas notas. Na linha, o corpo que elas herdam é o do próprio número.
   `flex-wrap` é o para-quedas da conta: se a largura da fonte não fechar na célula, as estrelas
   descem uma linha em vez de furar a borda. */
function Score({
  label,
  stats,
  size,
  className = "",
  starsClassName,
}: {
  label: string;
  stats: TrackStats;
  size: string;
  className?: string;
  starsClassName: string;
}) {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <div className={`flex flex-col justify-center gap-3 px-5 py-9 md:px-8 ${className}`}>
      <span className="text-[12.5px] opacity-45">{label}</span>

      {stats.count ? (
        <>
          <span className={`flex flex-wrap items-end gap-x-[0.14em] gap-y-2 ${size}`}>
            <span className={`${RATING_FONT} font-bold leading-[0.8] tracking-[-0.04em]`}>{stats.avg.toFixed(1)}</span>
            <Stars count={Math.round(stats.avg)} className={`pb-[0.14em] text-[0.26em] ${starsClassName}`} />
          </span>
          <span className="text-[12.5px] opacity-45">
            {stats.count} {plural(stats.count, pt)}
          </span>
        </>
      ) : (
        <span className="text-[13px] opacity-45">
          {pt ? "sem avaliações ainda" : "no reviews yet"}
        </span>
      )}
    </div>
  );
}

export function ReviewsBoard({
  reviews,
  summary,
  projectTitles,
}: {
  reviews: Review[];
  summary: ReviewSummary;
  /** título dos projetos citados, resolvido no servidor — o porquê está em app/reviews/page.tsx */
  projectTitles: Record<number, string>;
}) {
  const { t, language } = useLanguage();
  const pt = language === "pt";
  const [filter, setFilter] = useState<Filter>("all");

  const visible = filter === "all" ? reviews : reviews.filter((review) => review.track === filter);
  const count = (key: Filter) => (key === "all" ? summary.overall.count : summary[key].count);

  return (
    /* Sem faixa de metadados aqui: a linha técnica, os números e a nota diziam em miniatura o
       que a faixa de notas logo abaixo diz em corpo grande. A navbar emenda direto nela. */
    <CapaPage bleed wordmark={t("status.reviews")}>
      {/* Uma faixa de notas só: a média geral em preto na metade esquerda, emendando na faixa de
          metadados da capa, e as duas trilhas dividindo a direita — antes o preto ia de ponta a
          ponta com um número num canto e o resto vazio. É a divisão da página de contato, `before`
          inclusive: o conteúdo para no SHELL como no resto do sistema e só o preto passa dele,
          correndo `w-screen` até a borda da viewport.
          Abaixo de lg a média fica sozinha na linha, mas as trilhas continuam lado a lado: três
          blocos de nota empilhados enterravam a primeira avaliação abaixo da dobra no celular. */}
      <div className="border-b border-ink/15">
        <div
          className={`${SHELL} relative isolate grid lg:grid-cols-2 lg:before:absolute lg:before:inset-y-0 lg:before:right-1/2 lg:before:-z-10 lg:before:w-screen lg:before:bg-chrome`}
        >
          <div className="bg-chrome text-chrome-ink">
            <Score
              label={pt ? "Média geral" : "Overall"}
              stats={summary.overall}
              size="text-[clamp(64px,10vw,132px)]"
              starsClassName="text-accent"
            />
          </div>

          {/* o fio entre as duas trilhas é o gap mostrando o fundo */}
          <div className="grid grid-cols-2 gap-px bg-ink/15">
            {TRACKS.map((track) => (
              <div key={track} className="bg-surface">
                <Score
                  label={TRACK_LABEL[track]}
                  stats={summary[track]}
                  size="text-[clamp(40px,4.4vw,64px)]"
                  starsClassName="text-ink/55"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtro em texto, não em pill: o trilho deslizante do lobby só fecha a conta com duas
          opções, e aqui são três. Sublinhado marca o recorte ativo. */}
      <div className="border-b border-ink/15">
        <div
          className={`${SHELL} flex flex-wrap items-center gap-x-7 gap-y-3 px-5 py-5 text-[12.5px] md:px-8`}
        >
          {(["all", ...TRACKS] as Filter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`border-b pb-1 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current ${
                filter === key ?"border-accent text-ink" : "border-transparent text-ink/40 hover:text-ink"
              }`}
            >
              {key === "all" ? (pt ? "Todas" : "All") : TRACK_LABEL[key]} <span className="opacity-45">({count(key)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* O filtro troca a lista sem mexer no foco: sem esta linha, quem usa leitor de tela clica e
          não ouve nada mudar. Só a contagem — reler a grade inteira a cada clique seria pior. */}
      <p className="sr-only" aria-live="polite">
        {visible.length} {plural(visible.length, pt)}
      </p>

      {visible.length === 0 ? (
        <p className={`${SHELL} px-5 py-16 text-[15px] leading-relaxed text-ink/55 md:px-8`}>
          {filter === "all"
            ? pt
              ? "Nenhuma avaliação publicada por aqui ainda. As que chegam passam por conferência antes de aparecer."
              : "No reviews published here yet. The ones that come in are checked before they show up."
            : pt
              ? `Nenhuma avaliação de ${TRACK_LABEL[filter]} publicada ainda.`
              : `No ${TRACK_LABEL[filter]} reviews published yet.`}
        </p>
      ) : (
        <div className="border-b border-ink/15">
          <div className={`${SHELL} grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-3`}>
            {visible.map((review) => (
              <figure key={review.id} className="flex flex-col gap-5 bg-surface px-5 py-8 md:px-8">
                {/* Quem falou vem antes do que foi dito: rosto, nome e nota ancoram a leitura da
                    citação. `figcaption` no topo é legal — o que a especificação pede é que ele
                    seja o primeiro ou o último filho do `figure`.
                    A trilha saiu daqui: ela já é o filtro no alto da página e a nota da faixa de
                    cima, então repetir "Web Dev" em cada card não conta nada de novo. */}
                <figcaption className="flex items-center gap-4">
                  <ReviewPhoto review={review} className="h-12 w-12 bg-ink/[0.07] text-[19px] text-ink/45" />

                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-[15px] leading-tight">
                      <span className="font-semibold">{review.name}</span>
                      {review.company && <span className="text-ink/45"> · {review.company}</span>}
                    </span>

                    <Stars count={review.rating} className="text-[13px] text-accent" />
                  </span>
                </figcaption>

                <blockquote className="flex-1 text-[15px] leading-relaxed text-ink/80">{review.comment}</blockquote>

                {/* A ficha do projeto já mostra a avaliação; este é o caminho de volta, que faltava.
                    O nome acessível diz para onde vai — sozinho, o título não conta que é link. */}
                {review.project !== null && projectTitles[review.project] && (
                  <Link
                    href={`/projects#p${review.project}`}
                    aria-label={`${pt ? "Ver projeto" : "See project"}: ${projectTitles[review.project]}`}
                    className="group inline-flex items-center gap-2 self-start text-[12.5px] text-ink/45 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
                  >
                    {projectTitles[review.project]}
                    <ArrowUpRight
                      className="h-3 w-3 transition-transform group-hover:-translate-y-px"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  </Link>
                )}

                {/* fotos que o próprio cliente anexou — some inteiro quando não veio nenhuma */}
                <ReviewShots review={review} label={pt ? "Foto do projeto" : "Project photo"} />
              </figure>
            ))}

            {/* ponytail: duas células cremes fixas em vez de contar quantas faltam por breakpoint.
                O fundo da grade é o fio, então a última linha incompleta aparecia como retângulo
                cinza no lugar dos cards que não existem. Quando a linha já fecha, as duas caem
                numa linha de altura zero e o preço é 1px a mais de fio no rodapé.
                Trocar por contagem por breakpoint se um dia isso incomodar. */}
            <div className="bg-surface" />
            <div className="bg-surface" />
          </div>
        </div>
      )}
    </CapaPage>
  );
}
