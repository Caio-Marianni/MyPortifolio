import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LogoWatermark, RatingMark } from "@/components/ui/brand-marks";
import { CTA_BASE, CTA_VARIANT, type ProposalContent } from "./proposal-slide";

/* Mobile: mesma matéria-prima do slide 16:9, composição outra.
   Nada de cqw aqui — sem container 16:9 as unidades de container colapsariam pra ~3px. */
export function ProposalStack({ image, wordmark, descriptor, script, scriptFont = "", wordmarkFont = "", descriptorFont = "", tab, corner, rail, strip, imagePosition, columns, children, overlay, priority }: ProposalContent) {
  /* O rail vertical vira faixa de três zonas, espelhando o desktop: credenciais à esquerda,
     avaliação ao centro, contexto à direita. `outerTop` (o relógio) fica de fora — com ele
     a faixa passa de 430px de conteúdo e quebra em duas linhas num aparelho de 390px. */
  const railLeft = rail?.outerBottom ?? [];
  const railRight = [...(rail?.innerTop ?? []), ...(rail?.innerBottom ?? [])];
  /* Uma linha por stat mais a do CTA: é a grade que as duas colunas passam a compartilhar. */
  const gridRows = Math.max(0, ...(columns?.map((column) => column.stats.length) ?? [])) + 1;

  return (
    /* Coluna de altura de tela: tudo abaixo tem altura intrínseca e a foto absorve a sobra,
       então o bloco da marca cabe sem rolar em qualquer aparelho. */
    <section className="grain-cream relative flex min-h-screen w-full flex-col overflow-hidden font-inter text-[#101010]">
      {/* Navbar preta emendando na foto e na faixa: o topo vira um bloco escuro contínuo,
          sem a fresta de creme que aparecia entre a barra e o retrato. */}
      <div className="relative isolate z-10 flex shrink-0 items-center justify-between overflow-hidden bg-[#111111] px-5 py-3 text-[#F1ECE5] shadow-lg shadow-black/40">
        <LogoWatermark />

        {tab && <span className="flex h-7 w-7 items-center justify-center">{tab}</span>}
        {corner && <span className="text-[11px]">{corner}</span>}
      </div>

      {/* basis-0 + flex-1 nos dois blocos: foto e infos dividem o que sobra em 50/50.
          min-h segura a foto em telas muito baixas; o bloco de infos nunca encolhe abaixo do conteúdo. */}
      <div className="relative min-h-[150px] w-full overflow-hidden bg-[#1A1A1A]">
        {/* mesmo `sizes` do slide: as duas composições coexistem no DOM, e assim pedem a mesma
            variante ao otimizador — um download só, em vez de dois. */}
        <Image src={image} alt="" fill sizes="50vw, 100vw" priority={priority} className="object-cover" style={{ objectPosition: imagePosition }} />
        <div className="pointer-events-none absolute inset-0 bg-[url('/assets/images/noise.webp')] bg-repeat opacity-[0.22] mix-blend-overlay" aria-hidden />
      </div>

      {(railLeft.length > 0 || railRight.length > 0 || rail?.rating) && (
        /* flex-1 nos dois lados: o centro fica centrado de verdade, não importa o texto das pontas.
           Com justify-between a zona mais larga empurrava as estrelas pro lado. */
        <div className="flex shrink-0 items-center gap-3 overflow-hidden bg-[#111111] px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white/70">
          <span className="flex flex-1 items-center gap-3">
            {railLeft.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </span>

          {rail?.rating && (
            <RatingMark
              value={rail.rating.value}
              stars={rail.rating.stars}
              starsClassName="text-white/50"
              href={rail.rating.href}
              label={rail.rating.label}
            />
          )}

          <span className="flex flex-1 items-center justify-end gap-3">
            {railRight.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </span>
        </div>
      )}

      {/* Âncora de altura zero logo abaixo da faixa: os filhos do overlay são todos absolutos,
          então ele desce da faixa preta sem empurrar nada da coluna. */}
      {overlay && <div className="relative z-30">{overlay}</div>}

      <div className="flex flex-1 basis-0 flex-col items-center justify-center px-5 py-8 z-10">
        {/* A medida do bloco mora aqui, não no h1: o descritor é irmão dele, então um `em`
            lá dentro mediria o pai, não o wordmark. Com o font-size no contêiner os dois
            filhos falam em `em` e escalam juntos. `-top-10` é rem, não se mexe com isso. */}
        <div className="relative w-fit -top-10" style={{ fontSize: `min(${(140 / wordmark.length).toFixed(2)}vw, 180px)` }}>
          {/* -mr anula o tracking sobrando depois da última letra: sem isso a caixa do h1
              é 0.1em mais larga que o desenho e o descritor passa da direita do wordmark. */}
          {/* leading < 1 corta o vão fantasma que a fonte reserva abaixo da linha de base: sem isso
              a caixa do h1 sobra ~0.3em e o descritor precisava de um -mt gigante pra compensar. */}
          <h1 className={`relative -mr-[0.11em] ${wordmarkFont} text-[1em] font-black uppercase leading-[0.75] tracking-widest`}>
            {wordmark}
          </h1>

          {/* Largura travada na do wordmark: justify só distribui entre palavras, então as letras
              vão separadas por espaço e cada vão vira uma oportunidade de justificação.
              O texto contínuo fica para leitor de tela, que senão soletraria o nome.

              Gap em px, não em em: o -mt antigo era 3.6em de 16px (fixo) compensando um h1 que
              escala em vw — os dois andavam em ritmos diferentes e o vão mudava a cada largura.

              Corpo em fração do wordmark, então o descritor engorda e afina junto com o CAIO. */}
          <p className={`w-full text-[0.09em] ${descriptorFont} font-medium uppercase [text-align-last:justify]`}>
            <span aria-hidden>{descriptor.split("").join(" ")}</span>
            <span className="sr-only">{descriptor}</span>
          </p>
        </div>

        {/* Toggle e colunas na mesma medida: a pill de contexto fecha exatamente em cima dos dois
            CTAs em vez de flutuar num centro só aproximado. O w-full da pill vai por variante
            porque o markup dela é compartilhado com o slide 16:9, onde ela tem que continuar
            do tamanho do conteúdo. */}
        <div className="mx-auto w-full max-w-[360px]">
          {children && <div className="flex justify-center text-[11px] [&>*]:w-full [&_button]:flex-1">{children}</div>}

          {columns && (
            /* subgrid: as linhas são definidas aqui e as duas colunas herdam, então cada stat da
               esquerda fica na altura exata do stat da direita mesmo quando um deles quebra em
               duas linhas — e os CTAs sempre fecham na última linha. Antes cada coluna empilhava
               por conta própria e um texto mais longo desalinhava a linha de baixo. */
            <div
              className="mt-5 grid grid-cols-2 gap-x-3 gap-y-[0.6em] text-[11px] font-bold uppercase tracking-[0.06em]"
              style={{ gridTemplateRows: `repeat(${gridRows}, auto)` }}
            >
              {columns.map((column) => (
                <div key={column.link.href} className="grid grid-rows-subgrid" style={{ gridRow: `span ${gridRows}` }}>
                  {column.stats.map((stat, i) => (
                    /* centralizado pra bater com o rótulo do CTA logo abaixo, que também é centrado */
                    <span key={i} className="flex min-h-[1.3em] items-center justify-center text-center leading-[1.35] text-[#101010]/55">
                      {stat}
                    </span>
                  ))}
                  <Link
                    href={column.link.href}
                    style={{ gridRowStart: gridRows }}
                    className={`mt-2 w-full px-3 py-[0.85em] ${CTA_BASE} ${CTA_VARIANT[column.link.variant ?? "solid"]}`}
                  >
                    {column.link.label}
                    <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {strip && (
        /* Textura, não informação: creme um tom abaixo do fundo, grande e cortado pela borda
           de baixo — mesma ideia da nota 5.0 cortada pela faixa. `-z-10` sumia atrás do bg
           da section; quem fica por cima é o z-10 do bloco da marca.

           Letras separadas por espaço (mesmo truque do descritor): cada vão vira oportunidade
           de justificação, então toda linha — inclusive a última — fecha exata na largura,
           em qualquer aparelho e em qualquer corpo de fonte. A quebra cai no meio da palavra,
           o que aqui é o efeito e não o defeito: é fundo, não texto pra ler.

           A cor vem de um gradiente recortado nas letras (bg-clip-text): opaco embaixo,
           sumindo pro topo. O stop de cima é a mesma cor com alpha 0 — `to-transparent`
           interpola por branco e suja o meio do degradê. */
        <p
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 -bottom-4 mx-1 origin-bottom translate-y-[0.14em] scale-y-[2]  select-none ${scriptFont} font-black text-[clamp(40px,8vw,150px)] uppercase leading-[0.95] bg-gradient-to-t from-[#c4c0b9] to-[#c4c0b9]/0 bg-clip-text text-transparent [text-align-last:justify] [text-align:justify]`}
        >
          {strip.split("").join(" ")}
        </p>
      )}
    </section>
  );
}
