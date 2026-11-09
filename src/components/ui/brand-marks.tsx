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
      <path d={MONOGRAM} fill="currentColor" />
    </svg>
  );
}

export const MONOGRAM =
  "M105 1L211 139L213 1L500 379L446 378L255 130L255 197L392 380L339 378L148 130L147 195L158 210L289 380L238 380L235 377L42 130L42 373L126 266L153 302L0 499L0 2L105 139Z";

/** O monograma marcado a ferro na tarja, como couro queimado: a forma cheia, não o contorno.
    Quatro passadas da mesma forma, do fundo para a frente: o chamuscado em volta (marrom-escuro,
    borrado e irregular), a quina de baixo pegando luz (é o que faz a marca parecer afundada), o
    queimado marrom e o carvão no miolo — a mesma forma encolhida por `feMorphology`, então a borda
    fica mais clara que o centro, como ferro que esquentou mais no meio.
    O `feTurbulence` + `feDisplacementMap` é o que tira o traço de régua e deixa a borda comida.
    `evenodd`: forma com furo (o play vazado do ícone do YouTube) queima só a moldura. */
/** a estrela das avaliações, no mesmo quadro de 500 do monograma */
export const STAR = "M250 12L309 181L488 185L345 293L397 464L250 362L103 464L155 293L12 185L191 181Z";

export function BrandedMark({ className = "", path = MONOGRAM }: { className?: string; path?: string }) {
  return (
    <svg viewBox="-40 -40 580 580" className={className} aria-hidden>
      <defs>
        <filter id="burn-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" />
        </filter>
        <filter id="burn-core" x="-10%" y="-10%" width="120%" height="120%">
          <feMorphology operator="erode" radius="6" result="core" />
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="core" in2="noise" scale="10" result="rough" />
          <feGaussianBlur in="rough" stdDeviation="2.5" />
        </filter>
        <filter id="burn-scorch" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" result="warped" />
          <feGaussianBlur in="warped" stdDeviation="10" />
        </filter>
      </defs>
      {/* tudo mais escuro que a tarja, só um pouco quente: é textura, não segundo protagonista —
          o laranja da tarja fica com o monograma pequeno e o botão de contato */}
      <path d={path} fillRule="evenodd" fill="#2b170c" stroke="#2b170c" strokeWidth={24} strokeLinejoin="round" opacity={0.55} filter="url(#burn-scorch)" />
      <g filter="url(#burn-rough)">
        <path d={path} fillRule="evenodd" fill="rgb(var(--chrome-ink))" opacity={0.06} transform="translate(0 2.5)" />
        <path d={path} fillRule="evenodd" fill="#0b0705" />
      </g>
      <path d={path} fillRule="evenodd" fill="#000" opacity={0.7} filter="url(#burn-core)" />
    </svg>
  );
}
