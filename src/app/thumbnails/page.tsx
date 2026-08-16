"use client";

import Image from "next/image";
import { CapaPage } from "@/components/capa/capa-page";
import { useLanguage } from "@/contexts/language-context";
import { thumbnails } from "@/data/thumbnails";

export default function ThumbnailsPage() {
  const { t, language } = useLanguage();
  const pt = language === "pt";

  return (
    <CapaPage
      bleed
      wordmark={t("status.thumbnails")}
      descriptor={t("lobby.thumbs.line")}
      stats={[`${thumbnails.length} ${pt ? "na galeria" : "in gallery"}`, t("lobby.thumbs.stat")]}
    >
      {/* Grade sangrando até a viewport: sem SHELL, sem bordas laterais. O topo emenda na faixa
          de metadados e só a linha de baixo fecha a grade; as divisórias internas são o `gap-px`
          mostrando o fundo. */}
      <div className="grid gap-px border-b border-[#101010]/15 bg-[#101010]/15 sm:grid-cols-2 lg:grid-cols-3">
        {thumbnails.map((thumb, i) => (
          /* ponytail: mesma célula neutra da grade de projetos — o estilo de cada peça vem depois. */
          <figure key={thumb.id} className="bg-[#F1ECE5] p-3">
            <div className="relative aspect-video overflow-hidden rounded-md bg-[#1A1A1A]">
              <Image
                src={thumb.image}
                alt=""
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

            <figcaption className="flex items-center justify-between gap-3 px-1 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#101010]/45">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate">{thumb.tags.join(" · ")}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </CapaPage>
  );
}
