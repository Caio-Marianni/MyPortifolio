"use client";

import { useState } from "react";
import { ProposalSlide, Stars, type ProposalContent } from "@/components/proposal/proposal-slide";
import { ProposalStack } from "@/components/proposal/proposal-stack";
import { CvPanel } from "@/components/proposal/cv-panel";
import { LangSwitch, LogoMark } from "@/components/capa/capa-page";
import { useLanguage } from "@/contexts/language-context";
import { useGoiasClock } from "@/hooks/use-goias-clock";

type Track = "web" | "thumbs";

/* Tudo em `em`: cada composição define o corpo do slot e a pill acompanha, sem duplicar estilo. */
const PILL_BASE = "rounded-full px-[1.6em] py-[0.7em] uppercase tracking-[0.16em] transition-colors";

/* Comparação de fontes: uma linha descomentada por título, o resto fica de reserva.
   Toda classe citada aqui (mesmo comentada) sai no CSS — o Tailwind lê o arquivo cru. */
// const SCRIPT_FONT = "font-comforter-brush";
// const SCRIPT_FONT = "font-kumar-one";
// const SCRIPT_FONT = "font-tulpen-one";
// const SCRIPT_FONT = "font-makaio";
const SCRIPT_FONT = "font-ricko";
// const SCRIPT_FONT = "font-vacom";
// const SCRIPT_FONT = "font-vanta";

// const WORDMARK_FONT = "font-inter";
// const WORDMARK_FONT = "font-rye";
// const WORDMARK_FONT = "font-kumar-one";
// const WORDMARK_FONT = "font-tulpen-one";
// const WORDMARK_FONT = "font-comforter-brush";
// const WORDMARK_FONT = "font-unifraktur";
const WORDMARK_FONT = "font-makaio";
// const WORDMARK_FONT = "font-ricko";
// const WORDMARK_FONT = "font-vacom";

// const DESCRIPTOR_FONT = "font-inter";
// const DESCRIPTOR_FONT = "font-tulpen-one";
const DESCRIPTOR_FONT = "font-jetbrains-mono";
// const DESCRIPTOR_FONT = "font-big-shoulders";
// const DESCRIPTOR_FONT = "font-ricko";
// const DESCRIPTOR_FONT = "font-vacom";

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
      stats: [`44 ${pt ? "thumbnails feitas" : "thumbnails made"}`, `— ${pt ? "canais" : "channels"}`],
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
    // image: "/noise.webp",
    imagePosition: "18% center",
    tab: <LogoMark />,
    /* cor por opacidade em cima de currentColor — serve no creme do 16:9 e no preto do mobile */
    corner: <LangSwitch />,
    wordmark: "Caio",
    script: "Fullstack",
    descriptor: "Marianni",
    scriptFont: SCRIPT_FONT,
    wordmarkFont: WORDMARK_FONT,
    descriptorFont: DESCRIPTOR_FONT,
    registered: true,
    rail: {
      innerTop: [t("status.location")],
      innerBottom: [since],
      outerTop: [clock ? `${clock.time} ${clock.period}` : "--:--"],
      outerBottom: [cvButton],
      rating,
    },
    columns: [
      { stats: active.stats, link: active.link },
      {
        stats: [<Stars key="rating" count={active.rating} className="text-[#101010]/60" />, t("status.clients")],
        link: { href: "/contact", label: t("lobby.contact") },
      },
    ],
    children: (
      <div className="inline-flex rounded-full border border-[#101010]/20 p-[0.3em]" role="group">
        {(Object.keys(tracks) as Track[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTrack(key)}
            aria-pressed={track === key}
            className={`${PILL_BASE} ${track === key ? "bg-[#101010] font-semibold text-[#F1ECE5]" : "text-[#101010]/50 hover:text-[#101010]"}`}
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
    <main className="flex min-h-screen items-start justify-center bg-[#F1ECE5] lg:items-center lg:overflow-hidden lg:p-6">
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
