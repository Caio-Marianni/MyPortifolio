"use client";

import { useEffect, useRef, useState } from "react";

/* A logo do cliente na lista: o favicon do site dele (o /api/favicon, o mesmo do gerador de QR)
   num quadrado da cor da folha. Sem site, ou se o ícone não vier, ficam as iniciais. Cliente só
   pelo `onError`; e um erro que acontece antes de hidratar o React não vê, então o efeito confere
   a imagem já quebrada também. Decorativa: o nome vem logo ao lado. */

const BOX = "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink/10 bg-sheet";

export function ClientLogo({ host, initials }: { host: string | null; initials: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (!host || failed) {
    return (
      <span aria-hidden className={`${BOX} font-mono text-meta font-semibold text-ink/60`}>
        {initials}
      </span>
    );
  }

  return (
    <span aria-hidden className={BOX}>
      {/* eslint-disable-next-line @next/next/no-img-element -- ícone de 24px da nossa própria rota; o otimizador não tem o que fazer */}
      <img ref={ref} src={`/api/favicon?domain=${host}`} alt="" width={24} height={24} loading="lazy" onError={() => setFailed(true)} className="h-6 w-6 object-contain" />
    </span>
  );
}
