"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Menu suspenso do painel (o filtro das listas, o "⋯" da ficha): um <details> de verdade —
   teclado e leitor de tela vêm do navegador. O JS só fecha o que o <details> sozinho não fecha:
   clique fora, Esc e clique num link do próprio menu (a tela não muda de rota, então nada o
   desmontaria). `trigger` é o conteúdo do botão; `label` vai no `title` e no texto escondido. */
export function Dropdown({ label, trigger, triggerClassName, children }: { label: string; trigger: ReactNode; triggerClassName: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (event: Event) => {
      const details = ref.current;
      if (!details?.open) return;
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !details.contains(event.target as Node)) details.open = false;
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <details ref={ref} className="relative">
      <summary title={label} className={`${triggerClassName} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
        {trigger}
        <span className="sr-only">{label}</span>
      </summary>
      <div
        onClick={(event) => {
          if ((event.target as Element).closest("a") && ref.current) ref.current.open = false;
        }}
        className="absolute right-0 top-full z-30 mt-2 min-w-[220px] rounded-lg border border-ink/10 bg-sheet p-1 shadow-[0_14px_30px_-12px_rgb(0_0_0/0.45)]"
      >
        {children}
      </div>
    </details>
  );
}
