import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/ui/brand-marks";
import { button } from "@/components/ui/styles";

/* Mesma gramática das outras páginas: creme, Makaio no número, corpo na escala do site.
   Texto fixo em PT — a 404 não monta o provider de idioma. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center font-inter text-ink">
      <span className="mb-10 h-9 w-9">
        <LogoMark />
      </span>

      <p className="text-meta text-ink/60">Erro</p>

      <h1 className="my-2 font-makaio text-[26vw] font-black leading-[0.85] tracking-display md:text-[180px]">404</h1>

      <p className="max-w-xs text-ui leading-[1.6] text-ink/60">
        A página que você está procurando não existe ou foi removida.
      </p>

      <Link
        href="/"
        className={`mt-10 ${button("solid", "lg")}`}
      >
        <ArrowLeft className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
        Voltar ao início
      </Link>
    </main>
  );
}
