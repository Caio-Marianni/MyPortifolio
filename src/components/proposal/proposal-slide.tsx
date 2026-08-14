import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { ReactNode } from "react";

export interface SlideLink {
  href: string;
  label: string;
}

/** Uma coluna do rodapé: dados em cima, ação embaixo. */
export interface SlideColumn {
  stats: ReactNode[];
  link: SlideLink;
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
  script?: string;
  registered?: boolean;
  /* Classe de fonte de cada título — o slide não escolhe, quem monta o conteúdo escolhe. */
  scriptFont?: string;
  wordmarkFont?: string;
  descriptorFont?: string;
  /** marca: aba sangrando no desktop, cabeçalho no mobile */
  tab?: ReactNode;
  /** troca de idioma: canto superior direito nos dois */
  corner?: ReactNode;
  rail?: SlideRail;
  /** object-position do retrato, ex.: "18% center" */
  imagePosition?: string;
  columns?: SlideColumn[];
  /** a pill de seleção — estilizada em `em`, cada composição define o corpo */
  children?: ReactNode;
  overlay?: ReactNode;
  priority?: boolean;
}

const VERT = "[writing-mode:vertical-rl] rotate-180 whitespace-nowrap";

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

function RailGroup({ items = [] }: { items?: ReactNode[] }) {
  return (
    <div className="flex flex-col items-center gap-[1.6cqw]">
      {items.map((item, i) => (
        <span key={i} className={TAG}>
          {item}
        </span>
      ))}
    </div>
  );
}

function RailColumn({ top, bottom, middle }: { top?: ReactNode[]; bottom?: ReactNode[]; middle?: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between">
      <RailGroup items={top} />
      {middle}
      <RailGroup items={bottom} />
    </div>
  );
}

export function ProposalSlide({ image, wordmark, descriptor, script, registered, scriptFont = "font-comforter-brush", wordmarkFont = "", descriptorFont = "", tab, corner, rail, imagePosition, columns, children, overlay, priority }: ProposalContent) {
  /* Script acompanha o wordmark: fixo em cqw ele engolia palavras longas, que rendem fonte menor. */
  const wordmarkSize = WORDMARK_SPAN / wordmark.length;

  return (
    <section
      /* sem overflow-hidden: a aba da logo precisa escapar do quadro até a borda da tela */
      className="relative aspect-[16/9] w-full bg-[#F1ECE5] font-inter text-[#101010] [container-type:inline-size]"
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
            <div className="flex w-[12%] shrink-0 gap-[6%] bg-[#111111] px-[3%] py-[5%]">
              <RailColumn
                top={rail.innerTop}
                bottom={rail.innerBottom}
                middle={
                  rail.rating && (
                    <span className={`relative flex items-center justify-center ${RAIL_SIZE}`}>
                      <span className={`${VERT} absolute text-[4.2cqw] font-bold tracking-[-0.02em] text-white/[0.13]`} aria-hidden>
                        {rail.rating.value}
                      </span>
                      <Stars vertical count={rail.rating.stars} className="relative text-white/75" />
                    </span>
                  )
                }
              />
              <RailColumn top={rail.outerTop} bottom={rail.outerBottom} />
            </div>
          )}
        </div>

        {/* ── metade direita: marca, centrada nos dois eixos ── */}
        {/* ponytail: outline (não border) em cada elemento do bloco — é andaime pra ajustar o layout
            sem deslocar nada, já que outline não ocupa espaço. Apagar a classe quando estiver bom. */}
        <div className="flex w-1/2 flex-col items-center justify-center px-[3.2%] [&_*]:outline [&_*]:outline-1 [&_*]:outline-[#101010]/30">
          {/* âncora só do wordmark: o script pendura nele, não no bloco inteiro — senão o `left-[6%]`
              passa a medir a largura das colunas e o traço escorrega quando o texto muda. */}
          <div className="relative">
            {script && (
              <span className={`absolute -top-[0.42em] left-[6%] ${scriptFont} leading-none text-[#B4ADA3]`} style={{ fontSize: `${wordmarkSize * 0.47}cqw` }}>
                {script}
              </span>
            )}

            <h1 className={`relative ${wordmarkFont} font-black uppercase tracking-widest`} style={{ fontSize: `${wordmarkSize}cqw` }}>
              {wordmark}
              {registered && <span className="absolute -right-[0.62em] top-[0.05em] align-super text-[0.16em] font-normal tracking-normal">®</span>}
            </h1>
          </div>

          {/* text-indent compensa o tracking sobrando na última letra, senão o bloco cai pra esquerda */}
          <p className={`mt-[0.9em] text-center text-[clamp(11px,1.5cqw,20px)] ${descriptorFont} font-medium uppercase tracking-[0.52em] [text-indent:0.52em]`}>{descriptor}</p>

          {children && <div className="mt-[3.6cqw] flex justify-center text-[clamp(9px,0.8cqw,11px)]">{children}</div>}

          {columns && (
            <div className="mt-[4.4cqw] grid grid-cols-2 gap-x-[2.5cqw] text-[clamp(10px,0.85cqw,12px)] font-bold uppercase tracking-[0.06em]">
              {columns.map((column) => (
                <div key={column.link.href} className="flex flex-col items-start gap-[0.6em]">
                  {column.stats.map((stat, i) => (
                    <span key={i} className="flex h-[1.3em] items-center text-[#101010]/55">
                      {stat}
                    </span>
                  ))}
                  <Link
                    href={column.link.href}
                    className="mt-[0.4em] flex items-center gap-[0.4em] transition-opacity hover:opacity-55 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current"
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
        /* Sangra da borda da viewport até onde a aba já terminava: (100vw - quadro)/2 é a sobra
           de um lado, e a marca fica ancorada à direita, dentro da largura original. */
        <div className="absolute left-[calc((100%_-_100vw)_/_2)] top-[45%] flex min-h-[11%] w-[calc(5.4%_+_(100vw_-_100%)_/_2)] items-center justify-end bg-[#111111] p-[1cqw] text-[clamp(11px,1.05cqw,14px)] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_3px_12px_rgba(0,0,0,0.3)]">
          <span className="aspect-square w-[3.4cqw]">{tab}</span>
        </div>
      )}

      {corner && <div className="absolute right-[3.2%] top-[6%] z-10 text-[clamp(10px,0.85cqw,12px)]">{corner}</div>}

      {overlay}
    </section>
  );
}
