import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { ReactNode } from "react";

export interface SlideLink {
  href: string;
  label: string;
  /** hierarquia entre os dois CTAs: cheio puxa a ação principal, contorno acompanha */
  variant?: keyof typeof CTA_VARIANT;
}

/* Três pesos visuais distintos no bloco: CTA cheio, CTA de contorno e — na home — a pill de
   contexto, que é trilho claro com chip e não botão. Padding fica com cada composição, que
   fala em unidades próprias (cqw no 16:9, px na pilha). */
/* Botão de apoiar: bloco embaixo (a sombra sólida) + halo mais fundo, e no active o botão desce
   exatamente a altura do bloco e a sombra some — parece que afundou. Profundidade em `em` pra
   escalar junto com o corpo, que muda entre o 16:9 (cqw) e a pilha (px). */
export const CTA_BASE =
  "flex items-center justify-center gap-[0.4em] rounded-full transition-all duration-150 active:translate-y-[0.3em] active:[box-shadow:none] motion-reduce:transition-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#101010]";

export const CTA_VARIANT = {
  solid:
    "bg-[#101010] text-[#F1ECE5] hover:bg-[#101010]/80 [box-shadow:0_0.3em_0_0_#4A443C,0_0.5em_0_0_rgba(16,16,16,0.18)]",
  /* Fundo chapado, e não transparente: sobre o creme granulado o contorno vazado deixava o grão
     correr por dentro do botão e ele sumia no papel. Um tom acima do creme, então continua
     secundário diante do cheio mas lê como superfície apoiada em cima. */
  outline:
    "bg-[#F8F5EF] border border-[#101010]/25 text-[#101010]/80 hover:bg-white hover:text-[#101010] [box-shadow:0_0.3em_0_0_rgba(16,16,16,0.16),0_0.5em_0_0_rgba(16,16,16,0.07)]",
} as const;

/** Uma coluna do rodapé: dados em cima, ação embaixo. */
export interface SlideColumn {
  stats: ReactNode[];
  link: SlideLink;
}

/** Uma palavra do traço manuscrito, pendurada no wordmark e posicionada por conta própria:
    `top` em `em` do corpo dela mesma, `left` em % da largura do wordmark e `scale` como
    fração do corpo do wordmark — então tudo acompanha o CAIO quando o quadro muda de tamanho. */
export interface ScriptPart {
  text: string;
  top?: string;
  left?: string;
  scale?: number;
  /** inclinação em graus — negativo sobe da esquerda para a direita. O giro é em torno do ponto
      (`left`, `top`), que fica no começo da palavra: mexer nos dois continua arrastando a peça
      inteira, sem o vaivém de girar pelo centro. */
  rotate?: number;
}

/** Duas colunas de etiquetas verticais, cada uma ancorada no topo e na base. */
export interface SlideRail {
  innerTop?: ReactNode[];
  innerBottom?: ReactNode[];
  outerTop?: ReactNode[];
  outerBottom?: ReactNode[];
  /** nota grande e apagada, com as estrelas por cima */
  rating?: { value: string; stars: number };
}

/** Mesmo conteúdo alimenta o slide 16:9 e a pilha do mobile. */
export interface ProposalContent {
  image: string;
  wordmark: string;
  descriptor: string;
  script?: ScriptPart[];
  /* Classe de fonte de cada título — o slide não escolhe, quem monta o conteúdo escolhe. */
  scriptFont?: string;
  wordmarkFont?: string;
  descriptorFont?: string;
  /** marca: aba sangrando no desktop, cabeçalho no mobile */
  tab?: ReactNode;
  /** troca de idioma: canto superior direito nos dois */
  corner?: ReactNode;
  rail?: SlideRail;
  /** frase de fundo do rodapé — só a pilha do mobile compõe */
  strip?: string;
  /** object-position do retrato, ex.: "18% center" */
  imagePosition?: string;
  columns?: SlideColumn[];
  /** a pill de seleção — estilizada em `em`, cada composição define o corpo */
  children?: ReactNode;
  overlay?: ReactNode;
  priority?: boolean;
}

const VERT = "[writing-mode:vertical-rl] rotate-180 whitespace-nowrap";

/* Fonte da nota grande do rail — vale nas duas composições, então mora aqui e a pilha importa.
   Mesma ideia da comparação de fontes da home: uma linha descomentada, o resto de reserva. */
// export const RATING_FONT = "font-vacom";
export const RATING_FONT = "font-ricko";

/* Tetos em px: acima de ~1400px de quadro o cqw puro incha a micro-tipografia junto com o pôster. */
const RAIL_SIZE = "text-[clamp(10px,0.95cqw,12px)]";
const TAG = `${VERT} ${RAIL_SIZE} uppercase tracking-[0.18em] text-white/70`;

/* Wordmark ocupa sempre a mesma largura ótica: 4 letras a 9cqw é a proporção da referência. */
const WORDMARK_SPAN = 66;

/** Tamanho em `em` — acompanha o corpo de texto de quem a envolve, em qualquer composição. */
export function Stars({ count, vertical, className = "" }: { count: number; vertical?: boolean; className?: string }) {
  return (
    <span className={`inline-flex ${vertical ? "flex-col" : "flex-row"} items-center gap-[0.25em] ${className}`} role="img" aria-label={`${count} de 5`}>
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} className="h-[1em] w-[1em] fill-current" strokeWidth={0} aria-hidden />
      ))}
    </span>
  );
}

function RailGroup({ items = [], className = "" }: { items?: ReactNode[]; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-[1.6cqw] ${className}`}>
      {items.map((item, i) => (
        <span key={i} className={TAG}>
          {item}
        </span>
      ))}
    </div>
  );
}

/* flex-1 nos dois grupos das pontas: a nota cai no centro exato da coluna, não onde a sobra
   entre "12:34 PM" e "Desde 2022" deixar — mesmo truque da faixa do mobile. Com justify-between
   o grupo mais alto empurrava as estrelas pra fora do meio. */
function RailColumn({ top, bottom, middle }: { top?: ReactNode[]; bottom?: ReactNode[]; middle?: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <RailGroup items={top} className="flex-1" />
      {middle}
      <RailGroup items={bottom} className="flex-1 justify-end" />
    </div>
  );
}

export function ProposalSlide({ image, wordmark, descriptor, script, scriptFont = "font-comforter-brush", wordmarkFont = "", descriptorFont = "", tab, corner, rail, imagePosition, columns, children, overlay, priority }: ProposalContent) {
  /* Script acompanha o wordmark: fixo em cqw ele engolia palavras longas, que rendem fonte menor. */
  const wordmarkSize = WORDMARK_SPAN / wordmark.length;
  /* Uma linha por stat mais a do CTA: é a grade que as duas colunas passam a compartilhar. */
  const gridRows = Math.max(0, ...(columns?.map((column) => column.stats.length) ?? [])) + 1;

  return (
    <section
      /* sem overflow-hidden: a aba da logo precisa escapar do quadro até a borda da tela */
      className="grain-cream relative aspect-[16/9] w-full font-inter text-[#101010] [container-type:inline-size]"
    >
      {/* Duas metades de verdade, 50/50. A aba e o canto seguem absolutos: filhos fora de fluxo
          não são itens de flex, então continuam se posicionando pela section. */}
      <div className="flex h-full w-full">
        {/* ── metade esquerda: retrato + rail de metadados ──
            py em %: resolve pela largura do quadro, e 2.475% da largura = os 4.4% de altura de antes. */}
        <div className="flex w-1/2 py-[2.475%] pl-[3.2%]">
          <div className="relative flex-1 overflow-hidden bg-[#1A1A1A]">
            <Image src={image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" priority={priority} className="object-cover" style={{ objectPosition: imagePosition }} />
            {/* mesmo grão do resto do site, bem mais discreto: só quebra o digital liso da foto */}
            <div className="pointer-events-none absolute inset-0 bg-[url('/assets/images/noise.webp')] bg-repeat opacity-[0.22] mix-blend-overlay" aria-hidden />
          </div>

          {rail && (
            /* `relative` só pra ordem de pintura: a foto é um elemento posicionado, então sem isso
               ela subiria por cima da sombra. Offset negativo em X e spread negativo jogam a sombra
               pra dentro da foto e seguram o vazamento no creme da direita. Em cqw, escala com o quadro. */
            <div className="relative flex w-[12%] shrink-0 gap-[6%] bg-[#111111] px-[3%] py-[5%] shadow-[-0.6cqw_0_1.4cqw_-0.35cqw_rgba(0,0,0,0.55)]">
              <RailColumn
                top={rail.innerTop}
                bottom={rail.innerBottom}
                middle={
                  rail.rating && (
                    <span className={`relative flex shrink-0 items-center justify-center ${RAIL_SIZE}`}>
                      {/* Duas correções para a nota bater com as estrelas, que é o que define o centro:
                          1. `leading-none` — sem ele a caixa da linha mede a entrelinha inteira, e como
                             o texto é vertical essa sobra fica no eixo horizontal, o eixo do desalinho.
                          2. O 0.09em de calibragem — o algarismo não tem descendente, então a mancha
                             senta do lado do ascendente e não no meio do em. Em vertical-rl o ascendente
                             aponta pra direita, o rotate-180 joga pra esquerda, daí o empurrão pra lá.
                          ponytail: 0.09em é métrica de fonte, não conta fechada — trocar RATING_FONT
                          pede reconferir só esse número. `left/top-1/2` deixa a centragem explícita
                          em vez de depender da posição estática que o flex dá a filho absoluto. */}
                      <span
                        className={`${VERT} absolute left-1/2 top-1/2 -translate-x-[calc(50%_-_0.09em)] -translate-y-1/2 ${RATING_FONT} text-[4.2cqw] font-bold leading-none tracking-[-0.02em] text-white/[0.1]`}
                        aria-hidden
                      >
                        {rail.rating.value}
                      </span>
                      <Stars vertical count={rail.rating.stars} className="relative translate-x-1.5 text-white/75" />
                    </span>
                  )
                }
              />
              <RailColumn top={rail.outerTop} bottom={rail.outerBottom} />
            </div>
          )}
        </div>

        {/* ── metade direita: marca, centrada nos dois eixos ── */}
        <div className="flex w-1/2 flex-col items-center justify-center px-[3.2%]">
          {/* âncora só do wordmark: o script pendura nele, não no bloco inteiro — senão o `left-[6%]`
              passa a medir a largura das colunas e o traço escorrega quando o texto muda.
              A medida do bloco mora aqui e não no h1, como na pilha do mobile: o descritor é irmão
              dele, então um `em` lá dentro mediria o pai, não o wordmark. */}
          <div className="relative isolate" style={{ fontSize: `${wordmarkSize}cqw` }}>
            {/* whitespace-nowrap: cada palavra é uma peça só, quem escolhe onde ela quebra é
                quem monta o conteúdo — pondo outra peça, não deixando a linha estourar.
                -z-10 joga o traço atrás do CAIO e do descritor; é o `isolate` do bloco que segura
                a camada negativa aqui dentro, senão ela sumiria atrás do creme do quadro. */}
            {script?.map(({ text, top = "-0.42em", left = "6%", scale = 0.47, rotate = 0 }) => (
              <span
                key={text}
                className={`bg-gradient-to-bl from-[#c4c0b9] to-[#c4c0b9]/0 bg-clip-text text-transparent absolute -z-10 whitespace-nowrap ${scriptFont} leading-none text-[#B4ADA3]`}
                style={{
                  top,
                  left,
                  fontSize: `${wordmarkSize * scale}cqw`,
                  transform: `rotate(${rotate}deg)`,
                  transformOrigin: "0 50%",
                }}
              >
                {text}
              </span>
            ))}

            {/* -mb come o vão fantasma que a linha reserva abaixo da base — é o que cola o descritor
                no pé do wordmark. Vai de margem e não de `leading`, senão o script (ancorado no topo
                da caixa) escorregaria junto. -mr anula o tracking sobrando depois da última letra,
                senão a caixa é 0.11em mais larga que o desenho e o descritor passa da direita. */}
            <h1 className={`-mb-[0.4em] -mr-[0.11em] ${wordmarkFont} text-[1em] font-black uppercase tracking-widest`}>{wordmark}</h1>

            {/* Largura travada na do wordmark: justify só distribui entre palavras, então as letras
                vão separadas por espaço e cada vão vira oportunidade de justificação. O texto contínuo
                fica para leitor de tela, que senão soletraria o nome. Corpo em fração do wordmark,
                então o descritor engorda e afina junto com o CAIO. */}
            <p className={`w-full text-[0.09em] ${descriptorFont} font-medium uppercase [text-align-last:justify]`}>
              <span aria-hidden>{descriptor.split("").join(" ")}</span>
              <span className="sr-only">{descriptor}</span>
            </p>
          </div>

          {/* Toggle e colunas na mesma medida — a da metade —, como na pilha do mobile: a pill de
              contexto fecha exatamente em cima dos dois CTAs em vez de flutuar num centro só
              aproximado. O w-full da pill vai por variante porque o markup dela é compartilhado. */}
          {/* Respiro maior acima do que abaixo: a pill governa a coluna esquerda dos CTAs, então
              anda com eles em vez de boiar no meio do caminho entre o wordmark e o bloco de baixo. */}
          {children && <div className="mt-[20px] flex w-full justify-center text-[clamp(9px,0.8cqw,11px)] [&>*]:w-[80%] [&_button]:flex-1">{children}</div>}

          {columns && (
            /* subgrid, igual à pilha do mobile: as linhas moram aqui e as duas colunas herdam,
               então stat da esquerda e stat da direita ficam na mesma altura mesmo com textos
               de comprimentos diferentes, e os CTAs fecham na última linha. */
            <div
              className="mt-[2.4cqw] grid w-full grid-cols-2 gap-x-[2.5cqw] gap-y-[0.6em] text-[clamp(10px,0.85cqw,12px)] font-bold uppercase tracking-[0.06em]"
              style={{ gridTemplateRows: `repeat(${gridRows}, auto)` }}
            >
              {columns.map((column) => (
                <div key={column.link.href} className="grid grid-rows-subgrid" style={{ gridRow: `span ${gridRows}` }}>
                  {column.stats.map((stat, i) => (
                    /* centralizado pra bater com o rótulo do CTA logo abaixo, que também é centrado */
                    <span key={i} className="flex h-[1.3em] items-center justify-center text-center text-[#101010]/55">
                      {stat}
                    </span>
                  ))}
                  <Link
                    href={column.link.href}
                    style={{ gridRowStart: gridRows }}
                    className={`mt-[0.6em] px-[1.2em] py-[0.75em] ${CTA_BASE} ${CTA_VARIANT[column.link.variant ?? "solid"]}`}
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

      {tab && (
        /* Sangra da borda da viewport até 8% do quadro: (100vw - quadro)/2 é a sobra de um lado.
           Os 8% posicionam a marca — ancorada à direita, com 1cqw de respiro — a partir de 3.6%,
           já dentro da foto, que começa em 3.2%. */
        <div className="absolute left-[calc((100%_-_100vw)_/_2)] top-[45%] isolate flex min-h-[11%] w-[calc(8%_+_(100vw_-_100%)_/_2)] items-center justify-end overflow-hidden bg-[#111111] p-[1cqw] text-[clamp(11px,1.05cqw,14px)] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_3px_12px_rgba(0,0,0,0.3)]">
          {/* mesma marca d'água da navbar do mobile: outline cortado pela altura da faixa, colado
              na borda da tela — é textura, não informação. */}
          <div
            className="pointer-events-none absolute inset-0 -left-[0.6cqw] -z-10 bg-[url('/Logo-outline.svg')] bg-[length:auto_400%] bg-left bg-no-repeat opacity-[0.18] [filter:saturate(0)]"
            aria-hidden
          />

          <span className="aspect-square w-[3.4cqw]">{tab}</span>
        </div>
      )}

      {corner && <div className="absolute right-[3.2%] top-[6%] z-10 text-[clamp(10px,0.85cqw,12px)]">{corner}</div>}

      {overlay}
    </section>
  );
}
