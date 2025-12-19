"use client";

import { BoardCanvas } from "@/components/board/board-canvas";
import { Navbar } from "@/components/navigation/navbar";
import { ModalManager } from "@/components/modals/modal-manager";
import { TopLight } from "@/components/ui/top-light";

export default function Home() {
  return (
    <main
      className={`
        relative overflow-x-hidden
        min-h-screen w-full
        bg-board-bg
        theme-transition-500
        md:h-screen md:overflow-hidden
      `}
    >
      {/* Efeito de luz no topo */}
      <TopLight />

      {/* Textura de fundo */}
      <div
        className="fixed inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/images/texture/buried.png')",
        }}
      />

      {/* Navbar horizontal no topo */}
      <Navbar />

      {/* Quadro de investigação */}
      <div className="relative w-full pt-20 md:pt-24 pb-8 md:h-screen md:flex md:items-center">
        <BoardCanvas />
      </div>

      {/* Gerenciador de modais */}
      <ModalManager />
    </main>
  );
}
