import { Star } from "lucide-react";

/* Peças de marca que apareciam copiadas em três arquivos cada (o slide 16:9, a pilha do
   mobile e a capa das páginas internas). Medem em `em` ou herdam classe, então continuam
   servindo às três composições sem saber em qual delas estão. */

/** Fonte da nota grande. Vale também para a versão vertical do rail, que fica no slide. */
export const RATING_FONT = "font-ricko";

/** Tamanho em `em` — acompanha o corpo de texto de quem a envolve, em qualquer composição. */
/* Atraso de cada estrela na onda de brilho, da primeira à quinta. Classes inteiras porque o
   Tailwind lê o código-fonte — montadas em pedaços não seriam geradas. */
const SHINE_DELAY = ["[animation-delay:0ms]", "[animation-delay:110ms]", "[animation-delay:220ms]", "[animation-delay:330ms]", "[animation-delay:440ms]"];

/* Quanto do trilho fica cheio no fim, por nota (0 a 5): recorte da direita. Classes inteiras porque
   o Tailwind lê o código-fonte.
   ponytail: 20% por estrela ignora o vão entre elas; nota 4 recorta um tico da quarta. Só a 5
   (a de sempre) fecha exata. */
const FILL_END = [
  "[--fill-end:inset(0_100%_0_0)]",
  "[--fill-end:inset(0_80%_0_0)]",
  "[--fill-end:inset(0_60%_0_0)]",
  "[--fill-end:inset(0_40%_0_0)]",
  "[--fill-end:inset(0_20%_0_0)]",
  "[--fill-end:inset(0_0_0_0)]",
];

/** `reveal`: as cinco estrelas ficam sempre visíveis, escuras, e a cor enche da esquerda para a
    direita no ritmo da contagem da nota (800ms, mesma curva do use-count-up). Só existe na tarja
    preta — o trilho escuro é calculado para ela. `--reveal-offset` atrasa o enchimento para quem
    conta mais tarde (a home, depois da intro).
    `shine`: de tempos em tempos uma onda de luz passa pelas estrelas, da esquerda para a
    direita. Só para a nota em destaque — em toda lista de card viraria pisca-pisca. */
export function Stars({
  count,
  vertical,
  shine,
  reveal,
  className = "",
}: {
  count: number;
  vertical?: boolean;
  shine?: boolean;
  reveal?: boolean;
  className?: string;
}) {
  const layout = `inline-flex ${vertical ? "flex-col" : "flex-row"} items-center gap-[0.25em]`;
  const row = (length: number, glow: boolean) =>
    Array.from({ length }, (_, i) => (
      <Star
        key={i}
        className={`h-[1em] w-[1em] fill-current ${glow ? `animate-star-shine motion-reduce:animate-none ${SHINE_DELAY[i]}` : ""}`}
        strokeWidth={0}
        aria-hidden
      />
    ));

  if (!reveal) {
    return (
      <span className={`${layout} ${className}`} role="img" aria-label={`${count} de 5`}>
        {row(count, !!shine)}
      </span>
    );
  }

  return (
    <span className={`relative ${layout} ${className}`} role="img" aria-label={`${count} de 5`}>
      {/* trilho: as cinco, escuras, sempre ali */}
      <span className={`${layout} text-chrome-ink/15`}>{row(5, false)}</span>
      {/* A cor por cima, recortada pela direita. O recorte final mora em `--fill-end` também fora da
          animação: com movimento reduzido ela não roda e a nota aparece cheia de cara. Brilho e
          enchimento em elementos diferentes, senão disputariam a mesma propriedade `animation`. */}
      <span
        className={`absolute inset-0 ${layout} ${FILL_END[Math.max(0, Math.min(5, count))]} animate-star-fill [animation-delay:var(--reveal-offset,0ms)] [clip-path:var(--fill-end)] motion-reduce:animate-none`}
      >
        {row(5, !!shine)}
      </span>
    </span>
  );
}

/** Contorno da logo cortado pela altura da faixa preta que o envolve, colado na borda
    esquerda: é textura, não informação. O deslocamento à esquerda entra por `className`
    porque o slide 16:9 mede em cqw e as barras do site medem em rem. */
export function LogoWatermark({ className = "-left-1.5" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 bg-[url('/Logo-outline.svg')] bg-[length:auto_400%] bg-left bg-no-repeat opacity-[0.18] [filter:saturate(0)] ${className}`}
      aria-hidden
    />
  );
}

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
