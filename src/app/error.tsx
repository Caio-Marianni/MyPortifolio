"use client";

import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";
import { LogoMark } from "@/components/capa/capa-page";

/* Mesma gramática da 404. Pega o que estoura dentro de qualquer página — banco fora do ar
   numa action do painel, por exemplo — em vez da tela crua do Next. O detalhe do erro já
   foi registrado no servidor; aqui o visitante só ganha uma saída. Texto fixo em PT, como
   na 404. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center font-inter text-ink">
      <span className="mb-10 h-9 w-9">
        <LogoMark />
      </span>

      <p className="text-[12.5px] text-ink/60">Erro</p>

      <h1 className="my-4 font-makaio text-[clamp(32px,6vw,56px)] font-black uppercase leading-none tracking-[0.04em]">
        Algo deu errado
      </h1>

      <p className="max-w-xs text-[14px] leading-[1.6] text-ink/65">
        Não consegui concluir isso agora. Tente de novo em instantes.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-fill px-7 py-3 text-[13px] text-fill-ink transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <RotateCw className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          Tentar de novo
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-ink/25 px-7 py-3 text-[13px] transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <ArrowLeft className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
