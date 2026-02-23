"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { ToggleButtons } from "@/components/toggle-buttons";

export default function NotFound() {
  return (
    <>
      <ToggleButtons showThemeToggle={false} />
      <main className="flex items-center justify-center min-h-screen w-full bg-black text-white relative overflow-hidden">
        <div className="absolute h-full w-full bg-grid [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ backgroundImage: "url('/assets/images/noise.webp')", backgroundRepeat: "repeat" }}
        />
        <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_100%)]" />

        <div className="relative z-10 text-center px-10">
          <p className="text-xs font-mono text-zinc-600 tracking-[0.3em] uppercase mb-4">
            Erro
          </p>

          <h1
            className="text-[140px] md:text-[180px] font-bold leading-none text-zinc-900 select-none mb-2"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}
          >
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-3">
            Página não encontrada
          </h2>
          <p className="text-sm text-zinc-500 mb-10 max-w-sm mx-auto leading-relaxed">
            A página que você está procurando não existe ou foi removida.
          </p>

          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 rounded-lg hover:opacity-80 transition-opacity text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              Voltar ao início
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-5 py-2.5 border border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-lg transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
