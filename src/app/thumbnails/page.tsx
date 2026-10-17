"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { CapaPage } from "@/components/capa/capa-page";
import { useLanguage } from "@/contexts/language-context";
import { niches, thumbnails } from "@/data/thumbnails";

/* As versões saem prontas de `npm run thumbs` (AVIF em 640 e 1280, em public/thumbnail/<largura>/).
   O loader só escolhe a mais próxima: sem ele, o otimizador do Next convertia cada peça para
   AVIF no primeiro pedido, ~1s por imagem e por largura, com a galeria inteira na fila.
   Thumbnail nova ou trocada: rodar `npm run thumbs` antes do commit, senão a imagem não aparece. */
const THUMB_WIDTHS = [640, 1280];

function thumbLoader({ src, width }: ImageLoaderProps): string {
  const name = src.slice(src.lastIndexOf("/") + 1).replace(/\.\w+$/, "");
  const size = THUMB_WIDTHS.find((w) => w >= width) ?? THUMB_WIDTHS[THUMB_WIDTHS.length - 1];
  return `/thumbnail/${size}/${name}.avif`;
}

export default function ThumbnailsPage() {
  const { t, language } = useLanguage();
  const pt = language === "pt";

  return (
    <CapaPage
      bleed
      track="thumbs"
      wordmark={t("status.thumbnails")}
      descriptor={t("lobby.thumbs.line")}
      stats={[`${thumbnails.length} ${pt ? "na galeria" : "in gallery"}`, `${niches} ${pt ? "nichos" : "niches"}`]}
    >
      {/* Grade sangrando até a viewport: sem SHELL, sem bordas laterais. O topo emenda na faixa
          de metadados e só a linha de baixo fecha a grade; as divisórias internas são o `gap-px`
          mostrando o fundo. No mobile a peça ocupa a célula inteira — sem respiro, sem canto
          arredondado e sem legenda: uma coluna de thumbnails encostadas uma na outra. */}
      <div className="grid gap-px border-b border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-3">
        {thumbnails.map((thumb, i) => (
          /* ponytail: mesma célula neutra da grade de projetos — o estilo de cada peça vem depois. */
          <figure key={thumb.id} className="bg-surface sm:p-3">
            <div className="relative aspect-video overflow-hidden bg-surface-sunken sm:rounded-md">
              <Image
                src={thumb.image}
                loader={thumbLoader}
                /* a peça é o conteúdo da página, não decoração: nomeia pelo número e pelas tags */
                alt={`Thumbnail ${String(i + 1).padStart(2, "0")} — ${thumb.tags.join(", ")}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={i < 3}
                className="object-cover"
              />
              {/* mesmo grão discreto do retrato da capa */}
              <div
                className="pointer-events-none absolute inset-0 bg-[url('/assets/images/noise.webp')] bg-repeat opacity-[0.22] mix-blend-overlay"
                aria-hidden
              />
            </div>

            <figcaption className="hidden items-center justify-between gap-3 px-1 pb-1 pt-3 text-[12.5px] text-ink/60 sm:flex">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate">{thumb.tags.join(" · ")}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </CapaPage>
  );
}
