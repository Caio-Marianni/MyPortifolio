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
          rounded-md
          overflow-hidden
          border border-b-0 border-white/10
          bg-gradient-to-b from-bg-board via-bg-board to-black/50
          theme-transition-500
        `}
        style={{
          boxShadow: `
            0 8px 12px 10px rgba(0, 0, 0, 1)
          `,
        }}
      >
        {/* Conteúdo do quadro */}
        <div className="relative w-full h-full">{children}</div>

        {/* Overlay de textura */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "url('/assets/images/texture/wall.png')",
            backgroundSize: "cover",
          }}
        />

        {/* Cantos decorativos (tachinhas nos cantos) */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-muted opacity-100 shadow-md shadow-black/60" />
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-muted opacity-100 shadow-md shadow-black/60" />
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-muted opacity-100 shadow-md shadow-black/60" />
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-muted opacity-100 shadow-md shadow-black/60" />
      </div>
    </div>
  );
}
