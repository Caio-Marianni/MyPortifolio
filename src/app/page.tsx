"use client";

import { useState } from "react";
import { ProposalSlide, Stars, type ProposalContent } from "@/components/proposal/proposal-slide";
import { ProposalStack } from "@/components/proposal/proposal-stack";
import { CvPanel } from "@/components/proposal/cv-panel";
import { LangSwitch, LogoMark } from "@/components/capa/capa-page";
import { useLanguage } from "@/contexts/language-context";
import { useGoiasClock } from "@/hooks/use-goias-clock";

type Track = "web" | "thumbs";

/* Tudo em `em`: cada composição define o corpo do slot e a pill acompanha, sem duplicar estilo.
   Peso e tracking são os dos CTAs logo abaixo — a pill governa aquele bloco, então lê como
   parte dele e não como um controle vindo de outro sistema. */
const PILL_BASE = "rounded-full px-[1.6em] py-[0.75em] font-bold uppercase tracking-[0.06em] transition-colors";

const SCRIPT_FONT = "font-makaio";
const WORDMARK_FONT = "font-makaio";
const DESCRIPTOR_FONT = "font-jetbrains-mono";

export default function Home() {
  const { t, language } = useLanguage();
  const clock = useGoiasClock();
  const [track, setTrack] = useState<Track>("web");
  const [cvOpen, setCvOpen] = useState(false);
  const pt = language === "pt";

  /* ponytail: "—" marca número que ainda não existe em lugar nenhum do repo — em andamento e canais.
     Trocar pelos reais; o resto sai de data/ e das traduções. */
  const tracks = {
    web: {
      label: t("lobby.web.label"),
      stats: [t("status.stats"), `— ${pt ? "em andamento" : "in progress"}`],
      rating: 5,
      link: { href: "/projects", label: t("lobby.web.cta") },
    },
    thumbs: {
      label: t("status.thumbnails"),
      stats: [ `— ${pt ? "canais" : "channels"}`, `44 ${pt ? "thumbnails feitas" : "thumbnails made"}`],
      rating: 5,
      link: { href: "/thumbnails", label: t("lobby.thumbs.cta") },
    },
  } satisfies Record<Track, { label: string; stats: string[]; rating: number; link: { href: string; label: string } }>;

  const active = tracks[track];

  const cvButton = (
    <button
      key="cv"
      type="button"
      onClick={() => setCvOpen((v) => !v)}
      aria-expanded={cvOpen}
      className="whitespace-nowrap uppercase tracking-[0.18em] transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60"
    >
      {/* latim, então serve nos dois idiomas sem tradução */}
      Curric. Vitae
    </button>
  );
  const since = pt ? "Desde 2022" : "Since 2022";
  /* versão curta só pra faixa do mobile; o rail do 16:9 tem espaço pra data inteira */
  const sinceShort = pt ? "Desde '22" : "Since '22";
  const rating = { value: "5.0", stars: 5 };

  const content: ProposalContent = {
    priority: true,
    image: "/image.jpg",
    imagePosition: "18% center",
    tab: <LogoMark />,
    /* cor por opacidade em cima de currentColor — serve no creme do 16:9 e no preto do mobile */
    corner: <LangSwitch />,
    wordmark: "Caio",
    /* Duas peças independentes, na diagonal e por trás do CAIO: `top` em `em` do corpo da própria
       palavra, `left` em % da largura do CAIO, `rotate` em graus e `scale` em fração do corpo dele
       (0.47 é o padrão). Cada peça gira em torno do próprio `top`/`left`, que é o pé da diagonal —
       mexer nos dois arrasta a palavra inteira sem mudar a inclinação. */
    script: [
      { text: "Dev Fs +", top: "0.28em", left: "-5%", rotate: -30 },
      { text: "Design", top: "0.24em", left: "63%", rotate: -30 },
    ],
    descriptor: "Marianni",
    scriptFont: SCRIPT_FONT,
    wordmarkFont: WORDMARK_FONT,
    descriptorFont: DESCRIPTOR_FONT,
    /* ponytail: termos que valem nos dois idiomas, então nada de tradução. Copy pra ajustar à vontade —
       só evitar o que já aparece na faixa de cima (local, "desde", nota). */
    strip: "Fullstack - Design",
    rail: {
      innerTop: [clock ? `${clock.time} ${clock.period}` : "--:--"],
      innerBottom: [since],
      outerTop: [t("status.location")],
      outerBottom: [cvButton],
      rating,
    },
    columns: [
      { stats: active.stats, link: active.link },
      {
        stats: [<Stars key="rating" count={active.rating} className="text-[#101010]/60" />, t("status.clients")],
        /* contorno: o CTA cheio fica com a track que a pill governa, contato acompanha */
        link: { href: "/contact", label: t("lobby.contact"), variant: "outline" as const },
      },
    ],
    children: (
      /* Controle, não CTA: trilho escavado (sombra interna + fio de luz embaixo) com o chip creme
         correndo por dentro — o oposto dos botões cheio/contorno logo abaixo, que é o que
         confundia os três. */
      <div
        /* #E1DDD6 é o creme com os mesmos 7% de preto que a versão translúcida rendia — mesma cor
           de antes, só que chapada, senão o grão do fundo atravessa o trilho e a escavação some. */
        className="relative inline-flex rounded-full bg-[#E1DDD6] p-[0.3em] shadow-[inset_0_1px_2px_rgba(16,16,16,0.16),inset_0_-1px_0_rgba(255,255,255,0.5)]"
        role="group"
      >
        {/* Chip único que desliza em vez de reaparecer no outro botão. Os rótulos são flex-1, então
            a distância entre as duas posições é exatamente a largura dele — 100% de translate,
            sem medir nada em JS. O gradiente claro no topo dá o volume que a sombra sozinha não dá.
            ponytail: a conta só fecha com duas opções; uma terceira track pede width/translate por índice. */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-y-[0.3em] left-[0.3em] w-[calc(50%_-_0.3em)] rounded-full bg-gradient-to-b from-white to-[#F1ECE5] shadow-[0_1px_2px_rgba(16,16,16,0.14)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
            track === "thumbs" ? "translate-x-full" : "translate-x-0"
          }`}
        />

        {(Object.keys(tracks) as Track[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTrack(key)}
            aria-pressed={track === key}
            className={`relative ${PILL_BASE} ${track === key ? "text-[#101010]" : "text-[#101010]/45 hover:text-[#101010]"}`}
          >
            {tracks[key].label}
          </button>
        ))}
      </div>
    ),
  };

  const cvLabels = { title: pt ? "Currículo" : "Resume", pt: "Português", en: pt ? "Inglês" : "English" };
  const closeCv = () => setCvOpen(false);

  return (
    /* creme de borda a borda nas duas composições; lg:overflow-hidden segura a aba da logo,
       que sangra até a borda da viewport e senão criaria rolagem horizontal. */
    <main data-page="home" className="grain-cream flex min-h-screen items-start justify-center lg:items-center lg:overflow-hidden lg:p-6">
      {/* pilha do mobile — faixa enxuta: só CV, nota e "desde".
          Local, hora e diploma seguem no rail do 16:9. */}
      <div className="w-full lg:hidden">
        <ProposalStack
          {...content}
          rail={{ outerBottom: [cvButton], innerBottom: [sinceShort], rating }}
          overlay={<CvPanel open={cvOpen} onClose={closeCv} labels={cvLabels} variant="sheet" />}
        />
      </div>

      {/* 16:9 limitado pelos dois eixos: sempre o maior slide que cabe inteiro na viewport */}
      <div className="hidden lg:block lg:w-[min(92vw,163vh)]">
        <ProposalSlide {...content} overlay={<CvPanel open={cvOpen} onClose={closeCv} labels={cvLabels} variant="rail" />} />
      </div>
    </main>
  );
}
