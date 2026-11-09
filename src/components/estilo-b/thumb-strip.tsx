"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { FOCUS } from "@/components/ui/styles";
import { SHEET_COUNT, SHEET_HEADER, SHEET_TITLE } from "@/components/estilo-b/tarja";
import { thumbLoader, thumbnails } from "@/data/thumbnails";
import { useScrollStrip } from "@/hooks/use-scroll-strip";

/* A segunda trilha na home do Estilo B: em vez de um link "Thumbnails" no canto, uma faixa com uma
   peça de cada nicho, que rola de lado (polegar, trackpad ou as setas) e encaixa peça a peça. A
   última peça é o "ver mais", e tudo leva à galeria.

   ponytail: a primeira de cada nicho, na ordem de data/thumbnails.ts. Para escolher outra, é só
   mudar a ordem lá. */
const picks = thumbnails.filter((thumb, i) => thumbnails.findIndex((t) => t.tags[0] === thumb.tags[0]) === i);

const ITEM = "w-[72%] shrink-0 snap-start sm:w-[44%] xl:w-[30%]";
/* Peça de thumbnail, a mesma na faixa da home e na galeria. Hover de YouTube em vez de zoom: a peça
   sobe um pouco, a sombra cresce, um brilho passa por ela e uma barra laranja corre pelo pé, como a barra de progresso que
   aparece quando o mouse para em cima de um vídeo. A barra vai dentro da peça (THUMB_BAR). */
export const THUMB_TILE =
  "relative flex aspect-video overflow-hidden rounded-lg shadow-[0_10px_18px_-10px_rgb(0_0_0/0.45)] transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_18px_26px_-12px_rgb(0_0_0/0.55)] group-focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 " +
  /* brilho: uma faixa de luz diagonal atravessa a peça quando o mouse entra. Só anima na ida — fora do
     hover a transição some e a faixa volta para fora sem ser vista. */
  "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:-translate-x-full before:bg-[linear-gradient(105deg,transparent_35%,rgb(255_255_255/0.32)_50%,transparent_65%)] group-hover:before:translate-x-full group-hover:before:transition-transform group-hover:before:duration-700 group-hover:before:ease-out motion-reduce:before:hidden";
export const THUMB_BAR =
  "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none";
/* seta por cima da faixa, centrada na altura das peças (a faixa tem pt-2 de folga para a peça subir
   no hover e pb-4 para a sombra) */
const ARROW =
  "absolute top-[calc(50%-4px)] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_16px_-4px_rgb(0_0_0/0.4)] transition-[opacity,transform] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function ThumbStrip({ language }: { language: "pt" | "en" }) {
  const pt = language === "pt";
  const { ref, atStart, atEnd, onScroll, scroll } = useScrollStrip<HTMLUListElement>();

  /* o degradê só do lado onde ainda há peças escondidas */
  const fade =
    atStart && atEnd
      ? ""
      : atStart
        ? "[mask-image:linear-gradient(to_right,black_85%,transparent)]"
        : atEnd
          ? "[mask-image:linear-gradient(to_left,black_85%,transparent)]"
          : "[mask-image:linear-gradient(to_right,transparent,black_12%,black_85%,transparent)]";

  return (
    <section aria-labelledby="estilo-b-thumbs" className="mt-16 flex flex-col">
      <div className={SHEET_HEADER}>
        <h2 id="estilo-b-thumbs" className={SHEET_TITLE}>
          Thumbnails
        </h2>
        {/* número declarado, não contado: a galeria do site é só uma amostra do que já foi feito */}
        <span className={SHEET_COUNT}>{pt ? "+300 thumbnails feitas" : "300+ thumbnails made"}</span>
      </div>
      <p className="mt-4 max-w-[60ch] text-body text-ink/75">{pt ? "Também faço thumbnails para YouTube." : "I also design YouTube thumbnails."}</p>

      <div className="relative mt-6">
        {/* Sangra até a borda da folha (margens negativas = padding dela) e devolve o respiro por
            dentro, para a primeira peça alinhar com o texto e a última poder encostar na borda. */}
        <ul
          ref={ref}
          onScroll={onScroll}
          className={`-mx-5 flex snap-x snap-mandatory scroll-px-5 -mt-2 gap-3 overflow-x-auto px-5 pb-4 pt-2 [scrollbar-width:none] lg:-mx-14 lg:scroll-px-14 lg:px-14 [&::-webkit-scrollbar]:hidden ${fade}`}
        >
          {picks.map((thumb) => (
            <li key={thumb.id} className={ITEM}>
              <Link
                href="/thumbnails"
                aria-label={pt ? `Thumbnail de ${thumb.tags[thumb.tags.length - 1]} — ver a galeria` : `${thumb.tags[thumb.tags.length - 1]} thumbnail — see the gallery`}
                className={`group block ${FOCUS}`}
              >
                <span className={`${THUMB_TILE} bg-chrome`}>
                  <Image
                    src={thumb.image}
                    loader={thumbLoader}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 44vw, 72vw"
                    className="object-cover"
                  />
                  <span className={THUMB_BAR} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
          {/* a última peça é o convite para o resto: mesma moldura, na tarja preta */}
          <li className={ITEM}>
            <Link href="/thumbnails" className={`group block ${FOCUS}`}>
              <span className={`${THUMB_TILE} flex-col items-center justify-center gap-2 bg-chrome text-chrome-ink`}>
                <Plus className="h-9 w-9 text-accent transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none" strokeWidth={2.5} aria-hidden />
                <span className="text-ui font-bold">{pt ? "Ver mais" : "See more"}</span>
              </span>
            </Link>
          </li>
        </ul>

        {/* Setas: só a que leva a algum lugar aparece. Fora da ordem do Tab — o teclado já percorre
            as peças uma a uma, e a faixa rola até cada uma que recebe o foco. */}
        <button
          type="button"
          onClick={() => scroll(-1)}
          tabIndex={-1}
          aria-label={pt ? "Thumbnails anteriores" : "Previous thumbnails"}
          className={`${ARROW} -left-2 lg:-left-5 ${atStart ? "pointer-events-none scale-90 opacity-0" : "opacity-100"}`}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          tabIndex={-1}
          aria-label={pt ? "Próximas thumbnails" : "Next thumbnails"}
          className={`${ARROW} -right-2 lg:-right-5 ${atEnd ? "pointer-events-none scale-90 opacity-0" : "opacity-100"}`}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        </button>
      </div>

      <Link href="/thumbnails" className={`mt-2 self-start py-1 text-ui font-semibold hover:text-accent ${FOCUS}`}>
        {pt ? "Ver a galeria →" : "See the gallery →"}
      </Link>
    </section>
  );
}
