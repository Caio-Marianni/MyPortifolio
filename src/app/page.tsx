"use client";

import { BoardCanvas } from "@/components/board/board-canvas";
import { BoardContainer } from "@/components/board/board-container";
import { Navbar } from "@/components/navigation/navbar";
import { ModalManager } from "@/components/modals/modal-manager";

export default function Home() {
  return (
    <main
      className={`
        relative min-h-screen
        bg-[var(--bg-primary)]
        theme-transition
        overflow-hidden
      `}
    >
      {/* Textura de fundo */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/images/textura-de-fundo-escuro.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Navbar horizontal no topo */}
      <Navbar />

      {/* Quadro de investigação com zoom/pan mobile */}
      <div className="relative w-full h-screen flex items-center justify-center pt-16">
        <BoardContainer>
          <BoardCanvas />
        </BoardContainer>
      </div>

      {/* Gerenciador de modais */}
      <ModalManager />
    </main>
  );
}
