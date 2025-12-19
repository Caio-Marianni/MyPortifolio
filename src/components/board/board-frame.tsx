"use client";

import { ReactNode } from "react";

interface BoardFrameProps {
  children: ReactNode;
}

export function BoardFrame({ children }: BoardFrameProps) {
  return (
    <div className="relative w-full flex items-start justify-center p-4 md:p-8 ">
      {/* Quadro principal */}
      <div
        className={`
          relative w-full max-w-6xl
          aspect-[3/4] sm:aspect-[4/5] md:aspect-[4/3]
          rounded-lg
          shadow-2xl
          theme-transition-500
          overflow-hidden
          border-4 border-stone-950
          highlight-top
        `}
        style={{
          backgroundImage: "url('/assets/images/textura-de-fundo-escuro.jpg')",
          boxShadow: `
            0 0 0 8px var(--bg-accent),
            0 25px 50px -12px rgba(0, 0, 0, 1)
          `,
        }}
      >
        {/* Conteúdo do quadro */}
        <div className="relative w-full h-full">{children}</div>

        {/* Light effect */}
        <div className="absolute inset-0 bg-[var(--bg-board)] opacity-50 pointer-events-none theme-transition" />

        {/* Cantos decorativos (tachinhas nos cantos) */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[var(--color-white)] opacity-40" />
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[var(--color-white)] opacity-40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[var(--color-white)] opacity-40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[var(--color-white)] opacity-40" />
      </div>
    </div>
  );
}
