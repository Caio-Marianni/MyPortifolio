"use client";

import { useEffect, useState, type ComponentType } from "react";
import { RotateCcw, Snail } from "lucide-react";
import { ContadorScene, CorteScene, FatiasScene, LogoMascaraScene, ScrollScene, VarreduraScene } from "./faixa-variants";
import { AssinaturaScene, CodigoScene, FaixaScene, SplitScene, ThumbScene, TimelineScene } from "./intro-scenes";
import "./intros.css";

/* Bancada para comparar as intros: escolhe a cena, repete, liga a câmera lenta.
   Atalhos: 1–6 trocam a ideia, ← → a variação, R repete, S alterna a câmera lenta. */

type Scene = { title: string; note: string; Scene: ComponentType<{ k: number }> };

/* Cada ideia é um grupo; a 1 tem variações, que aparecem numa segunda linha da barra. */
const IDEAS: Scene[][] = [
  [
    { title: "a · Original", note: "Linha laranja risca, a tarja se parte e revela o creme. Só CSS.", Scene: FaixaScene },
    { title: "b · Persiana", note: "A faixa se parte em fatias: metade some dentro da tarja, metade sai pela direita.", Scene: FatiasScene },
    { title: "c · Corte", note: "A linha risca em diagonal e as duas metades se separam ao longo do corte.", Scene: CorteScene },
    { title: "d · Contador", note: "0→100 em Ricko com a barra laranja; no 100 a faixa sobe.", Scene: ContadorScene },
    { title: "e · Logo-máscara", note: "A marca aparece no centro e vira o buraco por onde o site surge.", Scene: LogoMascaraScene },
    { title: "f · Varredura", note: "A tarja entra pela direita carregando o nome e estaciona à esquerda, revelando o creme atrás dela.", Scene: VarreduraScene },
    { title: "g · No scroll", note: "Quem abre a faixa é a rolagem: role a página (Chrome/Edge/Safari).", Scene: ScrollScene },
  ],
  [{ title: "Assinatura", note: "O nome se desenha em traço e voa pro lugar (View Transitions).", Scene: AssinaturaScene }],
  [{ title: "Thumb se monta", note: "Camadas de edição: fundo, título, seta, círculo, e o quadro vira o card.", Scene: ThumbScene }],
  [{ title: "Timeline", note: "Playhead toca a página e o monitor vira o site em tela cheia.", Scene: TimelineScene }],
  [{ title: "Código", note: "Terminal digita o <Hero /> e ele vira a tarja.", Scene: CodigoScene }],
  [{ title: "Escolha dividida", note: "Duas metades se encontram; passe o mouse e clique num lado.", Scene: SplitScene }],
];
const IDEA_TITLES = ["Faixa partida", "Assinatura", "Thumb se monta", "Timeline", "Código", "Escolha dividida"];

const BAR_BUTTON = "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-meta font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent";

export function IntroLab() {
  const [idea, setIdea] = useState(0);
  const [variant, setVariant] = useState(0);
  const [run, setRun] = useState(0);
  const [slow, setSlow] = useState(false);
  const k = slow ? 4 : 1;
  const variants = IDEAS[idea];
  const { Scene, title, note } = variants[variant];

  const pick = (i: number, v = 0) => {
    setIdea(i);
    setVariant(v);
    setRun((r) => r + 1);
  };

  /* as view transitions são pseudo-elementos do <html>: a câmera lenta delas mora lá */
  useEffect(() => {
    document.documentElement.classList.toggle("intro-slow", slow);
    return () => document.documentElement.classList.remove("intro-slow");
  }, [slow]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= IDEAS.length) pick(n - 1);
      else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const step = e.key === "ArrowRight" ? 1 : -1;
        setVariant((v) => (v + step + IDEAS[idea].length) % IDEAS[idea].length);
        setRun((r) => r + 1);
      }
      else if (e.key === "r") setRun((r) => r + 1);
      else if (e.key === "s") setSlow((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idea]);

  return (
    <main data-page="intros" className={`theme-light relative h-[100dvh] overflow-hidden bg-chrome font-inter ${slow ? "slow" : ""}`}>
      {/* `key` remonta a cena: repetir é só nascer de novo */}
      <Scene key={`${idea}-${variant}-${run}-${k}`} k={k} />

      <nav className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-fit max-w-[calc(100vw-32px)] flex-col gap-2 rounded-2xl bg-black/85 p-2 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur [view-transition-name:lab-bar]">
        <div className="flex flex-wrap items-center gap-1">
          {IDEA_TITLES.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={i === idea}
              className={`${BAR_BUTTON} ${i === idea ? "bg-accent text-white" : "text-white/70 hover:bg-white/10"}`}
            >
              <span className="font-mono opacity-60">{i + 1}</span> {t}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />
          <button type="button" onClick={() => setRun((r) => r + 1)} className={`${BAR_BUTTON} text-white/80 hover:bg-white/10`}>
            <RotateCcw className="h-3.5 w-3.5" /> Repetir
          </button>
          <button
            type="button"
            onClick={() => setSlow((v) => !v)}
            aria-pressed={slow}
            className={`${BAR_BUTTON} ${slow ? "bg-white text-black" : "text-white/80 hover:bg-white/10"}`}
          >
            <Snail className="h-3.5 w-3.5" /> 4× lento
          </button>
        </div>
        {variants.length > 1 && (
          <div className="flex flex-wrap items-center gap-1 border-t border-white/10 pt-2">
            {variants.map((v, i) => (
              <button
                key={v.title}
                type="button"
                onClick={() => pick(idea, i)}
                aria-pressed={i === variant}
                className={`${BAR_BUTTON} h-8 ${i === variant ? "bg-white text-black" : "text-white/70 hover:bg-white/10"}`}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}
        <p className="px-3 pb-1 text-meta text-white/55">
          <strong className="text-white/85">{title}:</strong> {note} <span className="hidden font-mono md:inline">· atalhos 1–6, ← →, R, S</span>
        </p>
      </nav>
    </main>
  );
}
