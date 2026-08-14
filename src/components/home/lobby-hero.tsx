"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Send } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { thumbnails } from "@/data/thumbnails";

/* Vitrine = 3 primeiras entradas de data/thumbnails.ts. Reordene o array pra trocar. */
const THUMB_SHOTS = thumbnails.slice(0, 3).map((thumb) => thumb.image);
const WEB_SHOTS = ["/projects/cover/nogs2.jpg", "/projects/cover/ana2.jpg", "/projects/cover/schoolink.jpg"];

const SCREW_POSITIONS = ["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"];

/* Uma luz, vinda de cima: todo bevel é claro no topo e escuro embaixo. */
const PANEL = [
  "relative w-full max-w-[760px] overflow-hidden rounded [text-shadow:none]",
  "bg-[linear-gradient(180deg,#232328_0%,#1A1A1E_22%,#141418_100%)]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_-1px_0_rgba(0,0,0,0.8),0_2px_4px_rgba(0,0,0,0.8),0_24px_48px_-20px_rgba(0,0,0,1)]",
].join(" ");

const SCREW = [
  "absolute h-[9px] w-[9px] rounded-full",
  "bg-[radial-gradient(circle_at_38%_32%,#4E4E56,#202026_62%,#0E0E12)]",
  "shadow-[inset_0_-1px_1px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.06)]",
  "after:absolute after:inset-x-[1.5px] after:top-1/2 after:h-px after:-translate-y-1/2 after:rotate-[38deg] after:bg-black/75 after:content-['']",
].join(" ");

const LEGEND = "font-jetbrains-mono text-[9.5px] lowercase tracking-[0.24em] text-white/35";

/* Porta: tecla grande. Mesmo bevel das teclas pequenas, escala maior. */
const DOOR = [
  "group relative flex flex-col gap-3.5 rounded-sm p-4 text-left",
  "bg-[linear-gradient(180deg,#2A2A30_0%,#1C1C21_55%,#151519_100%)]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.7),0_1px_2px_rgba(0,0,0,0.9),0_6px_14px_-6px_rgba(0,0,0,0.8)]",
  "transition-[transform,box-shadow,background] duration-100 ease-out",
  "hover:bg-[linear-gradient(180deg,#303037_0%,#202026_55%,#17171B_100%)]",
  "active:translate-y-px active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.85),inset_0_-1px_0_rgba(255,255,255,0.05)]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--led)]",
].join(" ");

/* Poço recuado atrás das amostras: a prova fica embutida no painel, não colada. */
const WELL = "grid grid-cols-3 gap-[3px] rounded-[3px] bg-[#0A0A0C] p-[3px] shadow-[inset_0_2px_5px_rgba(0,0,0,0.95)]";

const FOOT_LINK = "inline-flex items-center gap-1.5 text-white/40 transition-colors hover:text-white/75 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/40";

interface DoorProps {
  href: string;
  led: string;
  label: string;
  stat: string;
  line: string;
  cta: string;
  shots: string[];
}

function Door({ href, led, label, stat, line, cta, shots }: DoorProps) {
  return (
    <Link href={href} className={DOOR} style={{ "--led": led } as React.CSSProperties}>
      <span className="flex items-center gap-2">
        <i className="h-1.5 w-1.5 rounded-full bg-[color:var(--led)] shadow-[0_0_5px_var(--led)] transition-shadow duration-150 group-hover:shadow-[0_0_5px_var(--led),0_0_16px_var(--led)]" aria-hidden />
        <span className="font-jetbrains-mono text-[9.5px] uppercase tracking-[0.2em] text-white/45">{label}</span>
      </span>

      <span className="block font-inter text-[26px] font-bold leading-none tracking-[-0.03em] text-white">{stat}</span>

      <div className={WELL} aria-hidden>
        {shots.map((shot) => (
          <span key={shot} className="relative block aspect-video overflow-hidden rounded-[2px] bg-[#141418]">
            <Image src={shot} alt="" fill sizes="120px" quality={45} className="object-cover opacity-70 transition-opacity duration-150 group-hover:opacity-100" />
          </span>
        ))}
      </div>

      <span className="flex items-end justify-between gap-3">
        <span className="font-jetbrains-mono text-[10px] leading-snug text-white/35">{line}</span>
        <span className="inline-flex shrink-0 items-center gap-1 font-jetbrains-mono text-[10px] lowercase tracking-[0.12em] text-[color:var(--led)]">
          {cta}
          <ArrowUpRight size={12} strokeWidth={2} className="transition-transform duration-150 group-hover:translate-x-px group-hover:-translate-y-px" aria-hidden />
        </span>
      </span>
    </Link>
  );
}

export const LobbyHero = memo(function LobbyHero() {
  const { t, language } = useLanguage();

  return (
    <section className={PANEL} aria-label="Caio Marianni">
      {SCREW_POSITIONS.map((position) => (
        <span key={position} className={`${SCREW} ${position}`} aria-hidden />
      ))}

      {/* Monograma gravado: fica ATRÁS do grão, então o ruído passa por cima e ele lê como etching, não decalque. */}
      <div className="pointer-events-none absolute -right-24 -top-20 h-[460px] w-[460px] -scale-x-100 bg-[url('/Logo-outline.svg')] bg-contain bg-no-repeat opacity-[0.07]" aria-hidden />

      {/* Grão do anodizado */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/assets/images/noise.webp')] bg-repeat opacity-40 mix-blend-overlay" aria-hidden />

      <div className="relative z-10 p-7 sm:p-9">
        {/* Identidade: rosto em escala de avatar, colado no nome — nunca retrato dominante. */}
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Troque por: <Image src="/assets/images/caio.webp" alt="Caio Marianni" width={44} height={44} className="h-11 w-11 rounded-full object-cover shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2px_6px_rgba(0,0,0,0.9)]" /> */}
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#33333A_0%,#1E1E23_100%)] font-inter text-[13px] font-bold tracking-tight text-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2px_6px_rgba(0,0,0,0.9)]"
              aria-hidden
            >
              CM
            </span>
            <span className="flex flex-col">
              <span className="font-inter text-[13px] font-semibold leading-tight tracking-tight text-white/80">Caio Marianni</span>
              <span className={LEGEND}>fullstack · thumbmaker</span>
            </span>
          </div>
          {/* unoptimized: o optimizer do Next recusa SVG sem dangerouslyAllowSVG (400). */}
          <Image src="/Logo-outline.svg" width={28} height={28} alt="" unoptimized className="h-7 w-7 shrink-0 opacity-80" />
        </div>

        <h1 className="mb-3 font-inter text-[32px] font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-[42px]">
          {language === "pt" ? (
            <>
              Desenvolvendo ideias
              <br />
              que <span className="text-[#FF6B1A]">clickam</span>
            </>
          ) : (
            <>
              Developing ideas
              <br />
              that <span className="text-[#FF6B1A]">click</span>
            </>
          )}
        </h1>

        {/* Liga as duas frentes numa sequência causal, em vez de listar dois serviços soltos. */}
        <p className="mb-7 max-w-[52ch] font-inter text-[15px] leading-relaxed text-white/55">{t("lobby.sub")}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Door
            href="/thumbnails"
            led="#FF6B1A"
            label={t("status.thumbnails")}
            stat={t("lobby.thumbs.stat")}
            line={t("lobby.thumbs.line")}
            cta={t("lobby.thumbs.cta")}
            shots={THUMB_SHOTS}
          />
          <Door
            href="/projects"
            led="#31A8FF"
            label={t("lobby.web.label")}
            stat={t("lobby.web.stat")}
            line={t("lobby.web.line")}
            cta={t("lobby.web.cta")}
            shots={WEB_SHOTS}
          />
        </div>

        <div className={`${LEGEND} mt-5 flex items-center justify-between gap-4`}>
          <Link href="/contact" className={FOOT_LINK}>
            <Send size={11} strokeWidth={1.8} aria-hidden />
            {t("lobby.contact")}
          </Link>
          <span className="text-right">{language === "pt" ? "uma fonte de luz" : "one light source"}</span>
        </div>
      </div>
    </section>
  );
});
