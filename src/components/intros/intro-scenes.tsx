"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/ui/brand-marks";
import { usePhases } from "@/hooks/use-phases";
import { useTyped } from "@/hooks/use-typed";
import { HeroFinal, THUMB_SRC, WEB_SRC, Wordmark } from "./hero-final";

/* As seis intros do laboratório. Cada uma recebe `k` (1 normal, 4 câmera lenta) e termina no
   mesmo HeroFinal, menos a 6, que é ela mesma a proposta de layout. */

type SceneProps = { k: number };

/* ── 1. A faixa partida varre a tela ── */
export function FaixaScene() {
  return (
    <div className="faixa relative h-full overflow-hidden">
      <HeroFinal />
      <div className="faixa-cover absolute inset-0 bg-chrome md:left-[38%]">
        <div className="faixa-line absolute inset-y-0 left-0 hidden w-[3px] bg-accent md:block" />
      </div>
    </div>
  );
}

/* ── 2. A assinatura se escreve e voa pro lugar ── */
export function AssinaturaScene({ k }: SceneProps) {
  const phase = usePhases([1900], k);
  if (phase > 0) return <HeroFinal />;

  return (
    <div className="flex h-full items-center justify-center bg-chrome text-chrome-ink [view-transition-name:tarja]">
      <div className="flex flex-col items-center [view-transition-name:wordmark]">
        <svg viewBox="0 0 640 190" className="w-[min(80vw,620px)]" aria-label="Caio">
          <text x="50%" y="170" textAnchor="middle" fontSize="210" className="sig-text font-makaio tracking-display">
            CAIO
          </text>
        </svg>
        <span className="sig-sub -mr-[0.62em] mt-3 font-mono text-[clamp(12px,1.6vw,20px)] uppercase">Marianni</span>
      </div>
    </div>
  );
}

/* ── 3. A thumbnail se monta camada por camada ── */
export function ThumbScene({ k }: SceneProps) {
  const phase = usePhases([2300], k);
  if (phase > 0) return <HeroFinal />;

  return (
    <div className="flex h-full items-center justify-center bg-chrome p-6">
      <div className="relative aspect-video w-[min(88vw,960px)] overflow-hidden rounded-lg bg-black [view-transition-name:thumb]">
        <Image src={THUMB_SRC} alt="" fill priority sizes="960px" className="tb-bg object-cover" />
        <div className="tb-shade absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,transparent_30%,rgb(0_0_0/0.7))]" />

        {/* guias do editor: terços e área segura */}
        <div className="tb-guides pointer-events-none absolute inset-0">
          <div className="absolute inset-[6%] border border-dashed border-accent/70" />
          <div className="absolute inset-y-0 left-1/3 border-l border-accent/40" />
          <div className="absolute inset-y-0 left-2/3 border-l border-accent/40" />
          <div className="absolute inset-x-0 top-1/3 border-t border-accent/40" />
          <div className="absolute inset-x-0 top-2/3 border-t border-accent/40" />
        </div>

        <div className="absolute left-[7%] top-[14%] rotate-[-4deg]">
          <h2 className="tb-title font-makaio text-[clamp(36px,7.5vw,104px)] leading-[0.9] text-white [-webkit-text-stroke:3px_black] [paint-order:stroke_fill] [text-shadow:0_6px_0_rgb(0_0_0/0.6)]">
            CAIO
            <br />
            <span className="text-[#FFD400]">MARIANNI</span>
          </h2>
          {/* caixa de seleção com alças, como se alguém tivesse acabado de soltar o texto */}
          <div className="tb-select pointer-events-none absolute -inset-3 border border-sky-400">
            {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos) => (
              <span key={pos} className={`absolute h-2 w-2 border border-sky-400 bg-white ${pos}`} />
            ))}
          </div>
        </div>

        <svg viewBox="0 0 960 540" className="pointer-events-none absolute inset-0 h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path className="tb-draw tb-arrow" d="M470 360 C 540 420, 600 410, 640 330 M612 340 L640 330 L648 360" stroke="#FFD400" strokeWidth="14" />
          <ellipse className="tb-draw tb-circle" cx="760" cy="250" rx="140" ry="160" stroke="rgb(var(--accent))" strokeWidth="10" />
        </svg>

        <span className="tb-badge absolute bottom-[4%] right-[3%] rounded bg-black/85 px-2 py-0.5 font-mono text-[clamp(10px,1.4vw,16px)] font-bold text-white">
          12:04
        </span>
      </div>
    </div>
  );
}

/* ── 4. Timeline de editor: a playhead passa, a página toca ── */
const FPS = 24;
const TRACKS = [
  { name: "V2", clips: [{ from: 0, to: 33, label: "título", tone: "bg-accent/80" }, { from: 66, to: 100, label: "texto", tone: "bg-accent/80" }] },
  { name: "V1", clips: [{ from: 0, to: 33, label: "caio.mov", tone: "bg-chrome-ink/30" }, { from: 33, to: 66, label: "sites.mov", tone: "bg-chrome-ink/45" }, { from: 66, to: 100, label: "thumbs.mov", tone: "bg-chrome-ink/30" }] },
];
/* ponytail: onda fixa e pseudoaleatória, só cenografia */
const WAVE = Array.from({ length: 120 }, (_, i) => 4 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.31)) * 22);

function timecode(ms: number) {
  const totalFrames = Math.floor((ms / 1000) * FPS);
  const ff = totalFrames % FPS;
  const ss = Math.floor(totalFrames / FPS) % 60;
  return `00:00:${String(ss).padStart(2, "0")}:${String(ff).padStart(2, "0")}`;
}

export function TimelineScene({ k }: SceneProps) {
  const phase = usePhases([3300], k);
  const tcRef = useRef<HTMLSpanElement>(null);

  /* o timecode escreve direto no nó: 60 re-renders por segundo só pra um texto seria desperdício */
  useEffect(() => {
    if (phase > 0) return;
    const start = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const ms = Math.min((now - start) / k, 3000);
      if (tcRef.current) tcRef.current.textContent = timecode(ms);
      if (ms < 3000) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [phase, k]);

  if (phase > 0) return <HeroFinal />;

  return (
    <div className="flex h-full flex-col gap-4 bg-[#0c0c0c] p-4 font-mono text-meta text-chrome-ink/70 md:p-6">
      <div className="flex flex-1 items-center justify-center">
        <div className="relative aspect-video w-[min(90vw,780px)] overflow-hidden rounded bg-black ring-1 ring-white/10 [view-transition-name:monitor]">
          <div className="tl-shot s1 absolute inset-0 flex items-center justify-center bg-chrome text-chrome-ink">
            <div className="push">
              <Wordmark className="scale-75" />
            </div>
          </div>
          <div className="tl-shot s2 absolute inset-0">
            <div className="push absolute inset-0">
              <Image src={WEB_SRC} alt="" fill sizes="780px" className="object-cover object-top" />
            </div>
            <span className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 font-makaio text-[clamp(18px,3vw,36px)] text-white">SITES & SISTEMAS</span>
          </div>
          <div className="tl-shot s3 absolute inset-0">
            <div className="push absolute inset-0">
              <Image src={THUMB_SRC} alt="" fill sizes="780px" className="object-cover" />
            </div>
            <span className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 font-makaio text-[clamp(18px,3vw,36px)] text-[#FFD400]">THUMBNAILS</span>
          </div>
          <span className="absolute left-3 top-2 text-[10px] uppercase tracking-[0.14em] text-white/50">Program · caio_marianni.prproj</span>
        </div>
      </div>

      <div className="rounded-lg bg-white/[0.04] p-3 ring-1 ring-white/10">
        <div className="mb-2 flex items-center justify-between">
          <span ref={tcRef} className="text-ui font-bold tabular-nums text-accent">
            00:00:00:00
          </span>
          <span className="uppercase tracking-[0.14em] text-chrome-ink/40">Sequência 01 · {FPS} fps</span>
        </div>
        <div className="relative grid grid-cols-[32px_1fr] gap-x-2 gap-y-1.5">
          <span />
          <div className="flex h-3 justify-between border-b border-white/15">
            {Array.from({ length: 31 }, (_, i) => (
              <span key={i} className={`w-px bg-white/25 ${i % 10 === 0 ? "h-3" : "h-1.5"}`} />
            ))}
          </div>
          {TRACKS.map((track) => (
            <TrackRow key={track.name} name={track.name}>
              {track.clips.map((c) => (
                <div
                  key={c.label}
                  className={`absolute inset-y-0 truncate rounded-sm border border-black/40 px-1.5 leading-7 text-chrome-ink ${c.tone} ${CLIP_POS[c.from]} ${CLIP_WIDTH[c.to - c.from]}`}
                >
                  {c.label}
                </div>
              ))}
            </TrackRow>
          ))}
          <TrackRow name="A1">
            <svg viewBox="0 0 240 28" preserveAspectRatio="none" className="absolute inset-0 h-full w-full rounded-sm bg-emerald-900/40">
              {WAVE.map((h, i) => (
                <rect key={i} x={i * 2} y={14 - h / 2} width="1.2" height={h} className="fill-emerald-400/70" />
              ))}
            </svg>
          </TrackRow>
          <div className="pointer-events-none absolute inset-y-0 left-10 right-0">
            <div className="tl-playhead absolute inset-y-0 w-px bg-accent">
              <span className="absolute -left-[5px] -top-1 h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* classes estáticas para o Tailwind enxergar; as posições da timeline são só estes terços */
const CLIP_POS: Record<number, string> = { 0: "left-0", 33: "left-[33.33%]", 66: "left-[66.66%]" };
const CLIP_WIDTH: Record<number, string> = { 33: "w-[33.33%]", 34: "w-[33.34%]" };

function TrackRow({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <>
      <span className="leading-7 text-chrome-ink/40">{name}</span>
      <div className="relative h-7">{children}</div>
    </>
  );
}

/* ── 5. Código que compila na página ── */
const CODE = `$ npx caio --render

<Hero
  nome="Caio Marianni"
  faz={["sites", "thumbnails"]}
  desde={2022}
/>

✓ compilado em 0.8s`;
const MS_PER_CHAR = 28;

export function CodigoScene({ k }: SceneProps) {
  const typed = useTyped(CODE, MS_PER_CHAR * k);
  const phase = usePhases([CODE.length * MS_PER_CHAR + 500], k);
  if (phase > 0) return <HeroFinal />;

  return (
    <div className="flex h-full items-center justify-center bg-surface p-6">
      <div className="w-[min(90vw,620px)] overflow-hidden rounded-xl bg-chrome text-chrome-ink shadow-2xl [view-transition-name:tarja]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          {["bg-red-400/80", "bg-yellow-400/80", "bg-green-400/80"].map((c) => (
            <span key={c} className={`h-3 w-3 rounded-full ${c}`} />
          ))}
          <span className="ml-3 font-mono text-meta text-chrome-ink/40">~/caiomarianni</span>
        </div>
        <pre className="min-h-[300px] whitespace-pre-wrap p-6 font-mono text-[clamp(13px,1.6vw,16px)] leading-relaxed">
          {typed.split("\n").map((line, i) => (
            <span key={i} className={`block ${line.startsWith("✓") ? "text-green-400" : line.startsWith("$") ? "text-chrome-ink/60" : ""}`}>
              {line.replace(/(".*?"|\d{4})/g, "\u0000$1\u0000").split("\u0000").map((part, j) =>
                j % 2 ? (
                  <span key={j} className="text-accent">
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
              {"​"}
            </span>
          ))}
          <span className="inline-block h-[1.1em] w-[0.6ch] animate-pulse bg-accent align-middle" />
        </pre>
      </div>
    </div>
  );
}

/* ── 6. Tela dividida: a intro termina numa escolha ── */
type Side = "web" | "thumbs";

export function SplitScene() {
  const [chosen, setChosen] = useState<Side | null>(null);

  const choose = (side: Side | null) => {
    const apply = () => flushSync(() => setChosen(side));
    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
  };

  return (
    <div className="split relative flex h-full flex-col overflow-hidden md:flex-row">
      <header className="rise i1 pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-center gap-3 p-5 font-mono text-meta uppercase tracking-[0.3em] text-accent">
        <span className="h-6 w-6">
          <LogoMark />
        </span>
        Caio Marianni
      </header>

      {chosen !== "thumbs" && (
        <button
          type="button"
          onClick={() => choose(chosen ? null : "web")}
          className="split-half relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden bg-chrome p-8 text-chrome-ink [view-transition-name:half-web]"
        >
          <div className="tilt relative aspect-video w-[min(70%,420px)] rotate-[-4deg] overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/10 transition-transform duration-500">
            <Image src={WEB_SRC} alt="" fill sizes="420px" className="object-cover object-top" />
          </div>
          <span className="rise i2 font-makaio text-[clamp(36px,5vw,72px)] leading-none tracking-display">SITES</span>
          <span className="rise i3 font-mono text-meta uppercase tracking-[0.14em] text-chrome-ink/60">
            {chosen ? "abrindo /projects…" : "Sites & sistemas sob medida"}
          </span>
        </button>
      )}

      {chosen === null && <div className="split-seam pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-[3px] -translate-x-1/2 bg-accent md:block" />}

      {chosen !== "web" && (
        <button
          type="button"
          onClick={() => choose(chosen ? null : "thumbs")}
          className="split-half from-bottom grain-cream relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden p-8 text-ink [view-transition-name:half-thumbs]"
        >
          <div className="relative aspect-video w-[min(70%,420px)]">
            {["/thumbnail/1280/Agencia-Tbn1.avif", "/thumbnail/1280/BillGrumpy-1.avif", THUMB_SRC].map((src, i) => (
              <div
                key={src}
                className={`fan-${i + 1} absolute inset-0 overflow-hidden rounded-lg shadow-xl transition-transform duration-500 ${["rotate-[-7deg] -translate-x-[12%]", "rotate-[7deg] translate-x-[12%]", ""][i]}`}
              >
                <Image src={src} alt="" fill sizes="420px" className="object-cover" />
              </div>
            ))}
          </div>
          <span className="rise i2 font-makaio text-[clamp(36px,5vw,72px)] leading-none tracking-display">THUMBS</span>
          <span className="rise i3 font-mono text-meta uppercase tracking-[0.14em] text-ink/60">
            {chosen ? "abrindo /thumbnails…" : "Thumbnails que fazem clicar"}
          </span>
        </button>
      )}

      {chosen && (
        <button
          type="button"
          onClick={() => choose(null)}
          className="absolute bottom-24 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-ui font-bold text-accent-ink"
        >
          <ArrowLeft className="h-4 w-4" /> voltar
        </button>
      )}
      {!chosen && (
        <span className="rise i5 pointer-events-none absolute bottom-24 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1 font-mono text-meta uppercase tracking-[0.14em] text-accent">
          passe o mouse · clique <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}
