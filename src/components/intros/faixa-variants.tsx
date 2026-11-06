"use client";

import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/ui/brand-marks";
import { HeroFinal } from "./hero-final";

/* Variações da ideia 1 (faixa partida). Todas terminam no mesmo HeroFinal; o que muda é como
   o preto sai da frente. Tempos no intros.css, seção "1x". */

const SLICES = ["i1", "i2", "i3", "i4", "i5", "i6"];

/* ── 1b. Persiana: a faixa se parte em fatias, metade some na tarja, metade sai pela direita ── */
export function FatiasScene() {
  return (
    <div className="faixa relative h-full overflow-hidden">
      <HeroFinal />
      <div className="absolute inset-0 flex flex-col overflow-hidden md:left-[38%]">
        {SLICES.map((i, n) => (
          <div key={i} className={`fatia ${i} ${n % 2 ? "to-left" : ""} flex-1 bg-chrome`} />
        ))}
        <div className="faixa-line absolute inset-y-0 left-0 hidden w-[3px] bg-accent md:block" />
      </div>
    </div>
  );
}

/* ── 1c. Corte diagonal: a linha risca em diagonal e as duas metades se separam ── */
export function CorteScene() {
  return (
    <div className="faixa corte relative h-full overflow-hidden">
      <HeroFinal />
      <div className="corte-a absolute inset-0 bg-chrome [clip-path:polygon(0_0,100%_0,0_100%)]" />
      <div className="corte-b absolute inset-0 bg-chrome [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <line className="corte-line" x1="100" y1="0" x2="0" y2="100" pathLength={1} stroke="rgb(var(--accent))" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/* ── 1d. Contador: 0→100 com a linha laranja de progresso; no 100 a faixa sobe ── */
export function ContadorScene({ k }: { k: number }) {
  const numRef = useRef<HTMLSpanElement>(null);

  /* escreve direto no nó, sem re-render por quadro */
  useEffect(() => {
    const duration = 1100 * k;
    const start = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      if (numRef.current) numRef.current.textContent = String(Math.round(100 * (1 - (1 - p) ** 3)));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [k]);

  return (
    <div className="faixa contador relative h-full overflow-hidden">
      <HeroFinal />
      <div className="contador-cover absolute inset-0 flex flex-col justify-between bg-chrome p-6 text-chrome-ink md:left-[38%] md:p-10 lg:p-14">
        <div className="flex justify-between font-mono text-meta uppercase tracking-[0.14em] text-chrome-ink/50">
          <span>Portfólio</span>
          <span>2022 — 2026</span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <span className="font-mono text-meta uppercase tracking-[0.14em] text-chrome-ink/50">Sites · Thumbnails</span>
          <span className="font-ricko text-[clamp(96px,16vw,260px)] font-bold leading-[0.8] tracking-[-0.04em] tabular-nums">
            <span ref={numRef}>0</span>
            <span className="text-accent">%</span>
          </span>
        </div>
        <div className="contador-bar absolute inset-x-0 bottom-0 h-[3px] bg-accent" />
      </div>
    </div>
  );
}

/* ── 1e. Logo-máscara: a marca aparece no centro e vira o buraco por onde o site surge ── */
export function LogoMascaraScene() {
  return (
    <div className="faixa mascara relative h-full overflow-hidden">
      <HeroFinal />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <mask id="logo-hole" maskUnits="userSpaceOnUse" x="-50" y="-50" width="200" height="200">
            <rect x="-50" y="-50" width="200" height="200" fill="white" />
            <g className="mascara-hole">
              <svg x="44" y="44" width="12" height="12" viewBox="-6 -6 512 512" className="text-black">
                <LogoMarkPath />
              </svg>
            </g>
          </mask>
        </defs>
        <rect x="-50" y="-50" width="200" height="200" className="fill-chrome" mask="url(#logo-hole)" />
        <g className="mascara-mark">
          <svg x="44" y="44" width="12" height="12" viewBox="-6 -6 512 512" className="text-accent">
            <LogoMarkPath />
          </svg>
        </g>
      </svg>
    </div>
  );
}

/* LogoMark devolve um <svg> com classe própria; dentro de máscara precisa só do <path>. */
function LogoMarkPath() {
  return (
    <path
      d="M105 1L211 139L213 1L500 379L446 378L255 130L255 197L392 380L339 378L148 130L147 195L158 210L289 380L238 380L235 377L42 130L42 373L126 266L153 302L0 499L0 2L105 139Z"
      fill="currentColor"
    />
  );
}

/* ── 1f. Varredura: a tarja entra pela direita carregando o nome e estaciona à esquerda ── */
export function VarreduraScene() {
  return (
    <div className="faixa varre relative h-full overflow-hidden">
      <HeroFinal />
    </div>
  );
}

/* ── 1g. No scroll: quem abre a faixa é a rolagem, não o relógio ── */
export function ScrollScene() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="relative h-[260%]">
        <div className="faixa-scroll sticky top-0 h-[100dvh] overflow-hidden">
          <HeroFinal />
          <div className="scroll-cover absolute inset-0 bg-chrome md:left-[38%]">
            <div className="scroll-line absolute inset-y-0 left-0 w-[3px] bg-accent" />
            <div className="scroll-hint absolute inset-x-0 bottom-28 flex flex-col items-center gap-2 font-mono text-meta uppercase tracking-[0.3em] text-chrome-ink/60">
              <span className="h-6 w-6 text-accent">
                <LogoMark />
              </span>
              role para abrir ↓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
