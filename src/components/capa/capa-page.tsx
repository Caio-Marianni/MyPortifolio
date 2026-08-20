"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { LogoWatermark, RatingMark } from "@/components/ui/brand-marks";
import { type Track } from "@/data/reviews";
import { useLanguage } from "@/contexts/language-context";
import { useRating } from "@/contexts/reviews-context";
import { useTheme } from "@/contexts/theme-context";

/* Monograma vetorial do Logo-outline.svg, preenchido em vez de contornado — em ~30px o stroke some.
   O laranja entra por `currentColor`: atributo `fill` com hex não enxerga variável de tema. */
export function LogoMark() {
  return (
    <svg viewBox="-6 -6 512 512" className="h-full w-full text-accent" aria-hidden>
      <path
        d="M105 1L211 139L213 1L500 379L446 378L255 130L255 197L392 380L339 378L148 130L147 195L158 210L289 380L238 380L235 377L42 130L42 373L126 266L153 302L0 499L0 2L105 139Z"
        fill="currentColor"
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
      className="group flex items-center gap-[0.5em] font-bold focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      {(["pt", "en"] as const).map((code, i) => (
        <span key={code} className="flex items-center gap-[0.5em]">
          {i > 0 && <span className="opacity-30">/</span>}
          <span className={`transition-opacity ${language === code ?"opacity-100" : "opacity-40 group-hover:opacity-70"}`}>{code.toUpperCase()}</span>
        </span>
      ))}
    </button>
  );
}

/** Sol/lua no mesmo corpo do LangSwitch ao lado, medido em `em` para herdar de quem envolve.
    Quem troca o ícone é o CSS, não o estado: os dois são renderizados e o `dark:` esconde um.
    Isso resolve de graça o problema que o LangSwitch não tem — o servidor não sabe o tema do
    visitante, então qualquer ícone escolhido em JS erraria no primeiro render e piscaria.
    O nome acessível não cita o tema atual pelo mesmo motivo: diz o que o clique faz, e vale
    nos dois sentidos. */
export function ThemeSwitch() {
  const { toggleTheme } = useTheme();
  const { language } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={language === "pt" ? "Alternar tema claro e escuro" : "Toggle light and dark theme"}
      className="opacity-50 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      <Moon className="h-[1.35em] w-[1.35em] dark:hidden" strokeWidth={2.5} aria-hidden />
      <Sun className="hidden h-[1.35em] w-[1.35em] dark:block" strokeWidth={2.5} aria-hidden />
    </button>
  );
}

/* O limite de largura da página. As faixas pretas sangram até a viewport; só o que vai
   dentro delas respeita a medida, senão a barra ficaria com ombros creme nas laterais.
   Exportado porque quem usa `bleed` monta as próprias faixas e precisa da mesma medida. */
export const SHELL = "mx-auto w-full max-w-[1600px]";

/* Páginas onde o CTA de contato é link morto ou ruído: na própria página de contato, e no
   convite de avaliação, que é uma tarefa só — mandar o cliente pra outro lugar no meio dela
   é o jeito mais fácil de não receber a avaliação; e no painel de moderação. */
const NO_CTA = ["/contact", "/avaliar", "/admin"];

export interface CapaPageProps {
  /** título da página, em Makaio, dentro da própria navbar */
  wordmark: string;
  /** linha técnica, mostrada na faixa preta à frente dos números */
  descriptor?: string;
  /** números da frente, mostrados na faixa preta */
  stats?: ReactNode[];
  /** trilha cuja nota a faixa mostra; sem ela, a média geral. A nota sai das avaliações
      publicadas, então nada de número escrito à mão aqui. */
  track?: Track;
  /** dispensa o respiro em volta do conteúdo, para quem sangra até a borda (o dossiê de projetos) */
  bleed?: boolean;
  children: ReactNode;
}

/** Cabeçalho da capa aplicado a uma página de listagem: navbar com o título dentro e faixa
    de metadados. Compacto de propósito — quem chega pelo lobby já sabe o que veio ver, então
    o gesto de capa vira barra e a primeira peça começa logo abaixo. */
export function CapaPage({ wordmark, descriptor, stats = [], track, bleed = false, children }: CapaPageProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const pageRating = useRating(track);

  /* Em /reviews a nota é a própria página, e o quadro já abre com a média geral em corpo
     grande: repetir a mesma nota na faixa é ruído. Sem ela e sem linha técnica nem números,
     a faixa inteira sai — uma tarja preta vazia embaixo da navbar seria pior que nenhuma. */
  const rating = pathname === "/reviews" ? null : pageRating;
  const showMeta = Boolean(descriptor) || stats.length > 0 || Boolean(rating);

  /* `data-page` é o gancho do globals.css que pinta o canvas de preto no mobile: sem ele o
     bounce do topo abre um vão creme acima da navbar preta. */
  return (
    <main data-page="capa" className="flex min-h-screen flex-col bg-surface font-inter text-ink">
      {/* Navbar preta emendando na faixa de metadados, como na pilha do mobile da capa.
          Uma linha só em qualquer largura: `items-center` alinha as três peças pelo meio e
          `flex-1` nas duas pontas mantém o título no centro, não importa o comprimento do
          rótulo de voltar nem do idioma. As pontas vão em span pra que o flex-1 não vire
          área clicável do link.
          Gruda no topo assim que a página rola; a sombra fica sempre ligada porque em repouso
          ela cai sobre a faixa de metadados, preto no preto — só aparece quando há rolagem e a
          barra passa a flutuar sobre o conteúdo, sem precisar de listener de scroll. */}
      <div className="sticky top-0 z-50 bg-chrome text-chrome-ink shadow-[0_14px_28px_-16px_rgba(0,0,0,0.75)]">
        <div
          className={`${SHELL} relative isolate flex items-center gap-4 px-5 py-3 text-[13px] md:px-8`}
        >
          {/* Fica no bloco de dentro, não no fundo sangrado, senão em tela larga a marca d'água
              some lá na borda da viewport, longe do resto do cabeçalho. */}
          <LogoWatermark />

          <span className="flex flex-1 items-center">
            {/* Abaixo de sm sobra só a seta: o rótulo é o que estica a ponta esquerda e
                empurra o resto da barra. O nome acessível fica no link, não no texto. */}
            <Link
              href="/"
              aria-label={t("projects.back")}
              className="flex items-center gap-3 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
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

          <span className="flex flex-1 items-center justify-end gap-4">
            <LangSwitch />
            <ThemeSwitch />
          </span>
        </div>
      </div>

      {/* Faixa de metadados: linha técnica e números à esquerda, avaliação à direita. Sem a
          zona da praça as estrelas não têm o que centrar, então elas fecham a faixa.
          Em tela pequena os textos descem um por linha, sempre encostados na esquerda, e a
          avaliação continua à direita — `items-center` no container a centra na altura desse
          bloco, em vez de deixá-la virar mais uma linha da lista. */}
      {showMeta && (
        <div className="border-t border-chrome-ink/10 bg-chrome">
          <div
            className={`${SHELL} flex items-center justify-between gap-4 overflow-hidden px-5 py-3 text-[12.5px] text-white/60 md:px-8`}
          >
            <span className="flex flex-col-reverse items-start gap-1.5 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-2">
              {descriptor && <span className="text-white/90">{descriptor}</span>}
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

            {/* Mesma nota do rail do hero, mas a desta trilha: cada página passa a sua. Some
                enquanto não houver avaliação publicada — 0.0 na faixa seria pior que nada.
                Clicar leva às avaliações; a própria página de avaliações não chega aqui. */}
            {rating && <RatingMark value={rating.value} stars={rating.stars} href="/reviews" label={t("reviews.see")} />}
          </div>
        </div>
      )}

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
      {!NO_CTA.includes(pathname) && (
        <Link href="/contact" className="group block bg-accent text-white transition-colors hover:bg-accent-hover">
          <span
            className={`${SHELL} flex flex-wrap items-center justify-between gap-x-8 gap-y-5 px-5 py-11 md:px-8 md:py-14`}
          >
            <span className="font-makaio text-[clamp(28px,4vw,52px)] font-black uppercase leading-none tracking-[0.06em]">
              {t("contact.subtitle")}
            </span>
            <span className="inline-flex items-center gap-2.5 text-[12.5px] transition-[gap] group-hover:gap-[18px]">
              {t("contact.title")}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            </span>
          </span>
        </Link>
      )}
    </main>
  );
}
