import Image from "next/image";
import Link from "next/link";

/* Mobile: empilhado no centro. md+: uma palavra de cada lado da foto. */
const WORD = "font-unifraktur text-[24vw] lowercase leading-[0.78] md:text-[17vw]";

const PORTRAIT = [
  "pointer-events-none absolute bottom-0 left-1/2 z-10 h-[86%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom",
  "[filter:grayscale(1)_contrast(1.1)]",
].join(" ");

/* Metade clicável, transparente. Mobile = banda horizontal, md+ = coluna. */
const HALF = [
  "group absolute z-20 flex flex-col justify-between px-6 py-8 focus-visible:outline-none",
  "inset-x-0 h-1/2 w-full md:inset-y-0 md:h-auto md:w-1/2 md:py-[15vh]",
].join(" ");

/* Floods vêm DEPOIS dos links no DOM: peer-* só enxerga irmão anterior.
   Sem hover no toque, então no mobile a cor já nasce acesa. */
const FLOOD = [
  "pointer-events-none absolute z-0 transition-opacity duration-300",
  "inset-x-0 h-1/2 w-full opacity-100 md:inset-y-0 md:h-auto md:w-1/2 md:opacity-0",
].join(" ");

/* Preto sobre o flood (7:1). No md+ o fundo cinza pede branco (5.7:1) até a cor acender. */
const CHROME = "font-jetbrains-mono text-[11px] uppercase leading-[1.6] tracking-[0.16em] text-black transition-colors duration-300 md:text-white";
const ON_LEFT = "peer-hover/left:text-black peer-focus-visible/left:text-black";
const ON_RIGHT = "peer-hover/right:text-black peer-focus-visible/right:text-black";

const GATE_TEXT = `${CHROME} group-hover:text-black group-focus-visible:text-black`;

interface GateProps {
  href: string;
  side: "left" | "right";
  index: string;
  world: string;
  line: string;
}

function Gate({ href, side, index, world, line }: GateProps) {
  /* Classes literais: nome de peer montado por interpolação foge do scan do JIT. */
  const place =
    side === "left"
      ? "peer/left top-0 items-start text-left md:left-0"
      : "peer/right bottom-0 items-start text-left md:right-0 md:top-0 md:items-end md:text-right";

  return (
    <Link href={href} className={`${HALF} ${place}`}>
      <span className={GATE_TEXT}>
        {index} — {world}
      </span>
      <span className={`${GATE_TEXT} max-w-[20ch] normal-case tracking-[0.08em]`}>
        {line}
        <span className="mt-2 block underline decoration-1 underline-offset-4 group-hover:no-underline">entrar ↗</span>
      </span>
    </Link>
  );
}

export function GothicHero() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-[#686564] text-black" aria-label="Caiom Morais">
      <Gate href="/thumbnails" side="left" index="01" world="Thumbnails" line="Capas que ganham o clique." />
      <Gate href="/projects" side="right" index="02" world="Web dev" line="Sites rápidos, do rascunho ao deploy." />

      <span className={`${FLOOD} top-0 bg-[#FF6B1A] md:left-0 md:peer-hover/left:opacity-100 md:peer-focus-visible/left:opacity-100`} aria-hidden />
      <span className={`${FLOOD} bottom-0 bg-[#31A8FF] md:right-0 md:top-0 md:peer-hover/right:opacity-100 md:peer-focus-visible/right:opacity-100`} aria-hidden />

      <Image src="/PfPic.png" alt="Caiom Morais" width={815} height={1075} priority className={PORTRAIT} />

      {/* Sem z-index/transform no h1: cada palavra empilha direto contra a foto.
          No mobile as duas ficam na frente, senão a foto engole "morais". */}
      <h1 className="pointer-events-none absolute inset-0">
        <span className={`${WORD} absolute left-3 top-[36%] z-20 md:left-5 md:top-1/2 md:-translate-y-1/2`}>caiom</span>
        <span className={`${WORD} absolute left-3 top-[54%] z-20 md:left-auto md:right-5 md:top-1/2 md:z-0 md:-translate-y-1/2`}>morais</span>
      </h1>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 py-6">
        <span className={`${CHROME} ${ON_LEFT}`}>fullstack · thumbmaker</span>

        <svg viewBox="-6 -6 512 512" className={`h-9 w-9 text-black transition-colors duration-300 md:text-white ${ON_LEFT} ${ON_RIGHT}`} aria-hidden>
          <path
            d="M105 1L211 139L213 1L500 379L446 378L255 130L255 197L392 380L339 378L148 130L147 195L158 210L289 380L238 380L235 377L42 130L42 373L126 266L153 302L0 499L0 2L105 139Z"
            fill="none"
            stroke="currentColor"
            strokeWidth={16}
            strokeLinejoin="miter"
          />
        </svg>

        <Link href="/contact" className={`${CHROME} ${ON_RIGHT} pointer-events-auto underline decoration-1 underline-offset-4 hover:no-underline`}>
          Contato →
        </Link>
      </header>

      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-30 hidden items-end justify-between px-6 py-6 md:flex">
        <span className={`${CHROME} ${ON_LEFT}`}>Goiânia · BR</span>
        <span className={`${CHROME} ${ON_RIGHT}`}>© 26</span>
      </footer>
    </section>
  );
}
