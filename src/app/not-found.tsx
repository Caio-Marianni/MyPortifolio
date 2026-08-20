import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/capa/capa-page";

/* Mesma gramática das outras páginas: creme, Makaio no número, mono na linha técnica.
   Texto fixo em PT — a 404 não monta o provider de idioma. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center font-inter text-ink">
      <span className="mb-10 h-9 w-9">
        <LogoMark />
      </span>

      <p className="text-[12.5px] text-ink/45">Erro</p>

      <h1 className="my-2 font-makaio text-[26vw] font-black leading-[0.85] tracking-widest md:text-[180px]">404</h1>

      <p className="max-w-xs text-[14px] leading-[1.6] text-ink/60">
        A página que você está procurando não existe ou foi removida.
      </p>

      <Link
        href="/"
        className="mt-10 flex items-center gap-2 rounded-full bg-fill px-7 py-3 text-[13px] text-fill-ink transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <ArrowLeft className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
        Voltar ao início
      </Link>
    </main>
  );
}
