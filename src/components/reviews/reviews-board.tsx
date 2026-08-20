"use client";

import { useState } from "react";
import { CapaPage } from "@/components/capa/capa-page";
import { RATING_FONT, Stars } from "@/components/ui/brand-marks";
import { TRACKS, TRACK_LABEL, type Review, type ReviewSummary, type Track, type TrackStats } from "@/data/reviews";
import { useLanguage } from "@/contexts/language-context";

type Filter = Track | "all";

/* Nota de um recorte: algarismo, estrelas e quantas avaliações sustentam aquela média.
   Serve pro bloco preto da média geral e pras duas células de trilha, só mudando o corpo. */
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
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-45">{label}</span>

      {stats.count ? (
        <>
          <span className="flex items-end gap-4">
            <span className={`${RATING_FONT} ${size} font-bold leading-[0.8] tracking-[-0.04em]`}>
              {stats.avg.toFixed(1)}
            </span>
            <Stars count={Math.round(stats.avg)} className={`pb-[0.15em] text-[1.1em] ${starsClassName}`} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-45">
            {stats.count} {pt ? (stats.count === 1 ? "avaliação" : "avaliações") : stats.count === 1 ? "review" : "reviews"}
          </span>
        </>
      ) : (
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-45">
          {pt ? "sem avaliações ainda" : "no reviews yet"}
        </span>
      )}
    </div>
  );
}

export function ReviewsBoard({ reviews, summary }: { reviews: Review[]; summary: ReviewSummary }) {
  const { t, language } = useLanguage();
  const pt = language === "pt";
  const [filter, setFilter] = useState<Filter>("all");

  const visible = filter === "all" ? reviews : reviews.filter((review) => review.track === filter);
  const count = (key: Filter) => (key === "all" ? summary.overall.count : summary[key].count);

  return (
    <CapaPage
      bleed
      wordmark={t("status.reviews")}
      descriptor={t("reviews.line")}
      stats={[`${summary.overall.count} ${pt ? "publicadas" : "published"}`, pt ? "só de quem contratou" : "clients only"]}
    >
      {/* Média geral em bloco preto, emendando na faixa de metadados da capa — mesmo gesto da
          primeira ficha da página de projetos. */}
      <div className="bg-[#111111] text-[#F1ECE5]">
        <Score
          label={pt ? "Média geral" : "Overall"}
          stats={summary.overall}
          size="text-[clamp(72px,16vw,150px)]"
          starsClassName="text-[#FF5500]"
        />
      </div>

      {/* As duas trilhas dividem a linha; o fio entre elas é o gap mostrando o fundo. */}
      <div className="grid gap-px border-b border-[#101010]/15 bg-[#101010]/15 sm:grid-cols-2">
        {TRACKS.map((track) => (
          <div key={track} className="bg-[#F1ECE5]">
            <Score
              label={TRACK_LABEL[track]}
              stats={summary[track]}
              size="text-[clamp(48px,9vw,84px)]"
              starsClassName="text-[#101010]/55"
            />
          </div>
        ))}
      </div>

      {/* Filtro em texto, não em pill: o trilho deslizante do lobby só fecha a conta com duas
          opções, e aqui são três. Sublinhado marca o recorte ativo. */}
      <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-[#101010]/15 px-5 py-5 font-mono text-[10px] uppercase tracking-[0.18em] md:px-8">
        {(["all", ...TRACKS] as Filter[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`border-b pb-1 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current ${
              filter === key ? "border-[#FF5500] text-[#101010]" : "border-transparent text-[#101010]/40 hover:text-[#101010]"
            }`}
          >
            {key === "all" ? (pt ? "Todas" : "All") : TRACK_LABEL[key]} <span className="opacity-45">({count(key)})</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="px-5 py-16 text-[15px] leading-relaxed text-[#101010]/55 md:px-8">
          {pt
            ? "Nenhuma avaliação publicada por aqui ainda. As que chegam passam por conferência antes de aparecer."
            : "No reviews published here yet. The ones that come in are checked before they show up."}
        </p>
      ) : (
        <div className="grid gap-px bg-[#101010]/15 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((review) => (
            <figure key={review.id} className="flex flex-col gap-5 bg-[#F1ECE5] px-5 py-8 md:px-8">
              <Stars count={review.rating} className="text-[16px] text-[#FF5500]" />

              <blockquote className="flex-1 text-[15px] leading-relaxed text-[#101010]/80">{review.comment}</blockquote>

              <figcaption className="flex flex-col gap-1.5">
                <span className="font-makaio text-[20px] font-black uppercase leading-none tracking-[0.04em]">
                  {review.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#101010]/45">
                  {[review.company, TRACK_LABEL[review.track]].filter(Boolean).join(" · ")}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </CapaPage>
  );
}
