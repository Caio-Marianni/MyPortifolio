import Link from "next/link";
import { Star } from "lucide-react";
import type { ReactNode } from "react";

/* Peças de marca que apareciam copiadas em três arquivos cada (o slide 16:9, a pilha do
   mobile e a capa das páginas internas). Medem em `em` ou herdam classe, então continuam
   servindo às três composições sem saber em qual delas estão. */

/** Fonte da nota grande. Vale também para a versão vertical do rail, que fica no slide. */
export const RATING_FONT = "font-ricko";

/** Tamanho em `em` — acompanha o corpo de texto de quem a envolve, em qualquer composição. */
/* Atraso de cada estrela na onda de brilho, da primeira à quinta. Classes inteiras porque o
   Tailwind lê o código-fonte — montadas em pedaços não seriam geradas. */
const SHINE_DELAY = ["[animation-delay:0ms]", "[animation-delay:110ms]", "[animation-delay:220ms]", "[animation-delay:330ms]", "[animation-delay:440ms]"];

/* Atraso de cada estrela ao acender (`reveal`): começam quando a contagem da nota termina
   (~800ms, ver use-count-up) e vêm uma por uma. */
const REVEAL_DELAY = ["[animation-delay:700ms]", "[animation-delay:790ms]", "[animation-delay:880ms]", "[animation-delay:970ms]", "[animation-delay:1060ms]"];

/** `reveal`: as estrelas acendem uma por uma ao montar, no fim da contagem da nota.
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
  return (
    <span
      className={`inline-flex ${vertical ? "flex-col" : "flex-row"} items-center gap-[0.25em] ${className}`}
      role="img"
      aria-label={`${count} de 5`}
    >
      {Array.from({ length: count }, (_, i) => {
        const star = (
          <Star
            key={i}
            className={`h-[1em] w-[1em] fill-current ${shine ? `animate-star-shine motion-reduce:animate-none ${SHINE_DELAY[i]}` : ""}`}
            strokeWidth={0}
            aria-hidden
          />
        );
        /* o acender vai num invólucro: duas animações no mesmo elemento brigariam pela mesma
           propriedade `animation`, e o brilho sumiria */
        return reveal ? (
          <span key={i} className={`inline-flex animate-star-pop motion-reduce:animate-none ${REVEAL_DELAY[i]}`}>
            {star}
          </span>
        ) : (
          star
        );
      })}
    </span>
  );
}

/** Envelope que vira link quando recebe `href`, e continua um span quando não recebe. A nota
    da faixa e a do rail do 16:9 desenham diferente mas apontam pro mesmo lugar, então o que
    elas compartilham é só isto. O nome acessível vem de fora: as estrelas anunciam a nota,
    não para onde o clique leva. */
export function RatingLink({
  href,
  label,
  className = "",
  children,
}: {
  href?: string;
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  if (!href) return <span className={className}>{children}</span>;

  return (
    <Link
      href={href}
      aria-label={label}
      className={`${className} transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current`}
    >
      {children}
    </Link>
  );
}

/** Algarismo grande e apagado atrás das estrelas, cortado pela altura da faixa preta que o
    envolve — é fundo, não informação a ler, por isso o número vai em `aria-hidden` e quem
    anuncia a nota é o `Stars`. Faixa da pilha do mobile e faixa das páginas internas. */
export function RatingMark({
  value,
  stars,
  starsClassName = "text-chrome-ink/75",
  href,
  label,
}: {
  value: string;
  stars: number;
  starsClassName?: string;
  /** quando vem, a nota vira a porta da página de avaliações */
  href?: string;
  label?: string;
}) {
  return (
    <RatingLink href={href} label={label} className="relative flex shrink-0 items-center justify-center">
      <span
        className={`absolute ${RATING_FONT} text-[48px] font-bold leading-none tracking-[-0.04em] text-chrome-ink opacity-10`}
        aria-hidden
      >
        {value}
      </span>
      <Stars count={stars} className={`relative ${starsClassName}`} />
    </RatingLink>
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
