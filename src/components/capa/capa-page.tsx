"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Stars } from "@/components/proposal/proposal-slide";
import { useLanguage } from "@/contexts/language-context";
import { useGoiasClock } from "@/hooks/use-goias-clock";

/* Monograma vetorial do Logo-outline.svg, preenchido em vez de contornado — em ~30px o stroke some. */
export function LogoMark() {
  return (
    <svg viewBox="-6 -6 512 512" className="h-full w-full" aria-hidden>
      <path
        d="M105 1L211 139L213 1L500 379L446 378L255 130L255 197L392 380L339 378L148 130L147 195L158 210L289 380L238 380L235 377L42 130L42 373L126 266L153 302L0 499L0 2L105 139Z"
        fill="#FF5500"
      />
    </svg>
  );
}

/** PT / EN: rótulos fixos, só o peso e a opacidade mudam. Tamanho em `em` — herda de quem envolve. */
export function LangSwitch() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-[0.5em] font-bold uppercase tracking-[0.2em]">
      {(["pt", "en"] as const).map((code, i) => (
        <span key={code} className="flex items-center gap-[0.5em]">
          {i > 0 && <span className="opacity-30">/</span>}
          <button
            type="button"
            onClick={() => language !== code && toggleLanguage()}
            aria-current={language === code}
            className={`transition-opacity focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current ${
              language === code ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}

export interface CapaPageProps {
  /** título grande, em Makaio */
  wordmark: string;
  /** traço manuscrito pendurado no título */
  script?: string;
  /** linha técnica sob o título */
  descriptor: string;
  /** números da frente; os globais (projetos, clientes, praça, hora) a faixa já traz */
  stats?: ReactNode[];
  children: ReactNode;
}

/** Cabeçalho da capa aplicado a uma página de listagem: navbar, masthead e faixa de metadados. */
export function CapaPage({ wordmark, script, descriptor, stats = [], children }: CapaPageProps) {
  const { t, language } = useLanguage();
  const clock = useGoiasClock();
  const pt = language === "pt";

  return (
    <main className="min-h-screen bg-[#F1ECE5] font-inter text-[#101010] [text-shadow:none]">
      {/* navbar preta emendando na faixa de metadados, como na pilha do mobile da capa */}
      <div className="flex items-center justify-between bg-[#111111] px-5 py-3 text-[11px] text-[#F1ECE5] md:px-8">
        <Link
          href="/capa"
          className="flex items-center gap-3 uppercase tracking-[0.18em] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          <span className="h-7 w-7 shrink-0">
            <LogoMark />
          </span>
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          {t("projects.back")}
        </Link>
        <LangSwitch />
      </div>

      <header className="px-5 pb-9 pt-11 md:px-8 md:pb-12 md:pt-16">
        {/* âncora só do título: o script pendura nele, não no bloco, senão o `left-[6%]`
            passa a medir a largura da página e o traço escorrega. */}
        <div className="relative w-fit">
          {script && (
            <span
              className="absolute -top-[0.42em] left-[6%] font-ricko leading-none text-[#B4ADA3]"
              style={{ fontSize: `min(${(34 / wordmark.length).toFixed(2)}vw, 34px)` }}
            >
              {script}
            </span>
          )}

          <h1
            className="relative font-makaio font-black uppercase tracking-widest"
            style={{ fontSize: `min(${(62 / wordmark.length).toFixed(2)}vw, 68px)` }}
          >
            {wordmark}
          </h1>
        </div>

        <p className="mt-[1.1em] font-jetbrains-mono text-[10px] font-medium uppercase tracking-[0.42em] text-[#101010]/60 md:text-[12px]">
          {descriptor}
        </p>
      </header>

      {/* Três zonas espelhando o rail do 16:9: números à esquerda, avaliação ao centro, praça à direita.
          flex-1 nas pontas mantém as estrelas centradas mesmo com textos de larguras diferentes. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-[#111111] px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white/70 md:px-8">
        <span className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
          {stats.map((stat, i) => (
            <span key={i}>{stat}</span>
          ))}
          <span>{t("status.stats")}</span>
          <span>{t("status.clients")}</span>
        </span>

        <Stars count={5} className="shrink-0 text-white/75" />

        <span className="flex flex-1 flex-wrap items-center justify-end gap-x-6 gap-y-2">
          <span>{t("status.location")}</span>
          <span>{clock ? `${clock.time} ${clock.period}` : "--:--"}</span>
          <span>{pt ? "Desde 2022" : "Since 2022"}</span>
        </span>
      </div>

      <div className="px-5 py-10 md:px-8 md:py-14">{children}</div>
    </main>
  );
}
