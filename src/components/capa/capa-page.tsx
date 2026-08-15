"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { RATING_FONT, Stars } from "@/components/proposal/proposal-slide";
import { useLanguage } from "@/contexts/language-context";

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

/** PT / EN: rótulos fixos, só a opacidade muda. Tamanho em `em` — herda de quem envolve.
    Um botão só, não dois: clicar em qualquer ponto intercala os dois idiomas. O nome acessível
    vai no idioma de destino, então diz o que o clique faz sem precisar de chave de tradução. */
export function LangSwitch() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === "pt" ? "Switch to English" : "Mudar para português"}
      className="group flex items-center gap-[0.5em] font-bold uppercase tracking-[0.2em] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      {(["pt", "en"] as const).map((code, i) => (
        <span key={code} className="flex items-center gap-[0.5em]">
          {i > 0 && <span className="opacity-30">/</span>}
          <span className={`transition-opacity ${language === code ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`}>{code.toUpperCase()}</span>
        </span>
      ))}
    </button>
  );
}

/* O limite de largura da página. As faixas pretas sangram até a viewport; só o que vai
   dentro delas respeita a medida, senão a barra ficaria com ombros creme nas laterais.
   Exportado porque quem usa `bleed` monta as próprias faixas e precisa da mesma medida. */
export const SHELL = "mx-auto w-full max-w-[1600px]";

export interface CapaPageProps {
  /** título da página, em Makaio, dentro da própria navbar */
  wordmark: string;
  /** traço manuscrito pendurado no título */
  script?: string;
  /** linha técnica, mostrada na faixa preta à frente dos números */
  descriptor?: string;
  /** números da frente, mostrados na faixa preta */
  stats?: ReactNode[];
  /** dispensa o respiro em volta do conteúdo, para quem sangra até a borda (o dossiê de projetos) */
  bleed?: boolean;
  children: ReactNode;
}

/** Cabeçalho da capa aplicado a uma página de listagem: navbar com o título dentro e faixa
    de metadados. Compacto de propósito — quem chega pelo lobby já sabe o que veio ver, então
    o gesto de capa vira barra e a primeira peça começa logo abaixo. */
export function CapaPage({ wordmark, script, descriptor, stats = [], bleed = false, children }: CapaPageProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  /* `data-page` é o gancho do globals.css que pinta o canvas de preto no mobile: sem ele o
     bounce do topo abre um vão creme acima da navbar preta. */
  return (
    <main data-page="capa" className="flex min-h-screen flex-col bg-[#F1ECE5] font-inter text-[#101010]">
      {/* Navbar preta emendando na faixa de metadados, como na pilha do mobile da capa.
          Uma linha só em qualquer largura: `items-center` alinha as três peças pelo meio e
          `flex-1` nas duas pontas mantém o título no centro, não importa o comprimento do
          rótulo de voltar nem do idioma. As pontas vão em span pra que o flex-1 não vire
          área clicável do link.
          Gruda no topo assim que a página rola; a sombra fica sempre ligada porque em repouso
          ela cai sobre a faixa de metadados, preto no preto — só aparece quando há rolagem e a
          barra passa a flutuar sobre o conteúdo, sem precisar de listener de scroll. */}
      <div className="sticky top-0 z-50 bg-[#111111] text-[#F1ECE5] shadow-[0_14px_28px_-16px_rgba(0,0,0,0.75)]">
        <div
          className={`${SHELL} relative isolate flex items-center gap-4 px-5 py-3 text-[11px] md:px-8`}
        >
          {/* mesma marca d'água da navbar do mobile: outline cortado pela altura da barra.
              Fica no bloco de dentro, não no fundo sangrado, senão em tela larga ela some
              lá na borda da viewport, longe do resto do cabeçalho. */}
          <div
            className="pointer-events-none absolute inset-0 -left-1.5 -z-10 bg-[url('/Logo-outline.svg')] bg-[length:auto_400%] bg-left bg-no-repeat opacity-[0.18] [filter:saturate(0)]"
            aria-hidden
          />

          <span className="flex flex-1 items-center">
            {/* Abaixo de sm sobra só a seta: o rótulo é o que estica a ponta esquerda e
                empurra o resto da barra. O nome acessível fica no link, não no texto. */}
            <Link
              href="/"
              aria-label={t("projects.back")}
              className="flex items-center gap-3 uppercase tracking-[0.18em] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
              <span className="hidden sm:inline">{t("projects.back")}</span>
            </Link>
          </span>

          {/* `shrink-0` + `whitespace-nowrap`: o título manda na altura da barra e nunca quebra
              em duas linhas — quem cede espaço são as pontas. */}
          <h1 className="shrink-0 whitespace-nowrap font-makaio text-[clamp(26px,3.4vw,40px)] font-black uppercase leading-none tracking-[0.08em]">
            {wordmark}
          </h1>

          <span className="flex flex-1 items-center justify-end">
            <LangSwitch />
          </span>
        </div>
      </div>

      {/* Faixa de metadados: linha técnica e números à esquerda, avaliação à direita. Sem a
          zona da praça as estrelas não têm o que centrar, então elas fecham a faixa.
          Em tela pequena os textos descem um por linha, sempre encostados na esquerda, e a
          avaliação continua à direita — `items-center` no container a centra na altura desse
          bloco, em vez de deixá-la virar mais uma linha da lista. */}
      <div className="border-t border-[#F1ECE5]/10 bg-[#111111]">
        <div
          className={`${SHELL} flex items-center justify-between gap-4 overflow-hidden px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white/60 md:px-8`}
        >
          <span className="flex flex-col-reverse items-start gap-1.5 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-2">
            {descriptor && <span className="font-jetbrains-mono tracking-[0.3em] text-white/90">{descriptor}</span>}
            {/* Duas linhas no mobile, nunca uma por item: os números viajam juntos numa linha
                só. `flex-col-reverse` põe essa linha em cima e a linha técnica — a mais longa,
                por causa do tracking do mono — embaixo, de base da pirâmide. A partir de md o
                `contents` dissolve este span e os números voltam a ser itens soltos da faixa. */}
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5 md:contents">
              {stats.map((stat, i) => (
                <span key={i}>{stat}</span>
              ))}
            </span>
          </span>

          {/* Mesma nota do rail do hero: algarismo grande atrás das estrelas, cortado pela
              altura da faixa — é fundo, não informação a ler. */}
          <span className="relative flex shrink-0 items-center justify-center">
            <span
              className={`absolute ${RATING_FONT} text-[48px] font-bold leading-none tracking-[-0.04em] text-white opacity-10`}
              aria-hidden
            >
              5.0
            </span>
            <Stars count={5} className="relative text-white/75" />
          </span>
        </div>
      </div>

      {/* `flex-1`: com o main em coluna de altura de tela, o corpo estica e come a sobra
          vertical que o cabeçalho deixou — é o que dá altura de página cheia a quem preenche
          (o contato) sem número mágico de altura de navbar. Coluna flex também aqui dentro:
          `h-full` no filho não resolve contra um pai que só tem `min-height`, então quem quer
          a sobra pede `flex-1` em vez de porcentagem. */}
      {/* Com `bleed` o corpo abre mão do SHELL: quem sangra pinta faixas inteiras, e a medida
          de 1600 deixaria ombros creme nas laterais de cada faixa — o mesmo motivo pelo qual
          as barras pretas do topo põem o limite no bloco de dentro, não no fundo. */}
      <div className={bleed ? "flex flex-1 flex-col" : `${SHELL} flex flex-1 flex-col px-5 py-10 md:px-8 md:py-14`}>
        {children}
      </div>

      {/* O CTA saiu da navbar e virou o fecho da página: faixa inteira clicável, sangrando até
          a viewport como as barras do topo. Some na própria página de contato — CTA para onde
          já se está é link morto. */}
      {pathname !== "/contact" && (
        <Link href="/contact" className="group block bg-[#FF5500] text-white transition-colors hover:bg-[#E64D00]">
          <span
            className={`${SHELL} flex flex-wrap items-center justify-between gap-x-8 gap-y-5 px-5 py-11 md:px-8 md:py-14`}
          >
            <span className="font-makaio text-[clamp(28px,4vw,52px)] font-black uppercase leading-none tracking-[0.06em]">
              {t("contact.subtitle")}
            </span>
            <span className="inline-flex items-center gap-2.5 font-jetbrains-mono text-[10px] uppercase tracking-[0.18em] transition-[gap] group-hover:gap-[18px]">
              {t("contact.title")}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            </span>
          </span>
        </Link>
      )}
    </main>
  );
}
