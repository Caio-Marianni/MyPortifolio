"use client";

import { ReactNode } from "react";

interface BoardFrameProps {
  children: ReactNode;
}

export function BoardFrame({ children }: BoardFrameProps) {
  return (
    <div className="relative w-full flex items-start justify-center p-4 md:p-8">
      {/* Quadro principal */}
      <div
        className={`
          relative w-full max-w-6xl
          aspect-[3/4] sm:aspect-[4/5] md:aspect-[4/3]
          bg-[var(--bg-primary)]
          border-4 border-[var(--frame-color)]
          rounded-sm
          shadow-2xl
          theme-transition
        `}
        style={{
          boxShadow: `
            0 0 0 8px var(--bg-secondary),
            0 25px 50px -12px rgba(0, 0, 0, 0.5)
          `,
        }}
      >
        {/* Textura de cortiça/quadro (sutil) */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Conteúdo do quadro */}
        <div className="relative w-full h-full">{children}</div>

        {/* Cantos decorativos (tachinhas nos cantos) */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[var(--frame-color)] opacity-40" />
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[var(--frame-color)] opacity-40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[var(--frame-color)] opacity-40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[var(--frame-color)] opacity-40" />
      </div>
    </div>
  );
}
