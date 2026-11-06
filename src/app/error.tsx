"use client";

import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";
import { LogoMark } from "@/components/ui/brand-marks";
import { button } from "@/components/ui/styles";

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

      <p className="text-meta text-ink/60">Erro</p>

      <h1 className="my-4 font-makaio text-[clamp(32px,6vw,56px)] font-black uppercase leading-none tracking-display">
        Algo deu errado
      </h1>

      <p className="max-w-xs text-ui leading-[1.6] text-ink/65">
        Não consegui concluir isso agora. Tente de novo em instantes.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className={button("solid", "lg")}
        >
          <RotateCw className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          Tentar de novo
        </button>

        <Link
          href="/"
          className={button("outline", "lg")}
        >
          <ArrowLeft className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
