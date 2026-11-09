"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RATING_FONT } from "@/components/ui/brand-marks";
import { FOCUS } from "@/components/ui/styles";
import { DARK_3D, MONOGRAM, MarkBackdrop, Tarja, TarjaSheet } from "@/components/estilo-b/tarja";
import { useLanguage } from "@/contexts/language-context";

/* A 404 no Estilo B: a tarja com o monograma marcado a ferro e o número grande, a folha com o recado
   e o caminho de volta. Mora dentro do layout raiz, então tem idioma e o PT/EN da tarja funciona. */
export default function NotFound() {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <main data-page="estilo-b-404" className="theme-light flex min-h-screen flex-col bg-chrome font-inter text-ink lg:flex-row">
      <Tarja homeHref="/" backdrop={<MarkBackdrop path={MONOGRAM} />}>
        {/* o número no corpo do placar das avaliações: preenche a largura útil da tarja */}
        <p className={`${RATING_FONT} mt-40 text-[min(calc((100vw-40px)/1.6),200px)] font-bold leading-[0.8] tracking-[-0.04em] lg:mt-auto lg:text-[200px]`} aria-hidden>
          404
        </p>
      </Tarja>

      <TarjaSheet>
        <section className="flex max-w-[52ch] flex-col items-start gap-4 lg:my-auto">
          <h1 className={`${RATING_FONT} text-[clamp(32px,4vw,44px)] font-bold uppercase leading-none`}>{pt ? "Página não encontrada" : "Page not found"}</h1>
          <p className="text-body leading-relaxed text-ink/70">
            {pt ? "A página que você procura não existe ou foi removida." : "The page you're looking for doesn't exist or was removed."}
          </p>
          <Link href="/" className={`${DARK_3D} ${FOCUS} mt-4`}>
            <ArrowLeft className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
            {pt ? "Voltar ao início" : "Back to home"}
          </Link>
        </section>
      </TarjaSheet>
    </main>
  );
}
