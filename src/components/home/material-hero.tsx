"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { FolderGit2, Home, Image as ImageIcon, Send, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface PanelKey {
  href: string;
  cap: string;
  labelKey: string;
  icon: LucideIcon;
}

const PANEL_KEYS: PanelKey[] = [
  { href: "/", cap: "home", labelKey: "status.home", icon: Home },
  { href: "/projects", cap: "work", labelKey: "status.projects", icon: FolderGit2 },
  { href: "/thumbnails", cap: "thumbs", labelKey: "status.thumbnails", icon: ImageIcon },
  { href: "/contact", cap: "contact", labelKey: "status.contacts", icon: Send },
];

const SCREW_POSITIONS = ["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"];

/* Uma luz, vinda de cima: todo bevel é claro no topo e escuro embaixo. */
const PANEL = [
  "relative w-full max-w-[680px] overflow-hidden rounded [text-shadow:none]",
  "[--led:#FF3B30] [--led-soft:rgba(255,59,48,0.45)]",
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

/* Poço recuado: sombra interna forte no topo lê como profundidade. */
const DISPLAY = [
  "rounded-sm bg-[#0A0A0C] px-3.5 py-2.5",
  "shadow-[inset_0_2px_4px_rgba(0,0,0,0.95),inset_0_-1px_0_rgba(255,255,255,0.05)]",
].join(" ");

const WELL = "grid grid-cols-4 gap-[3px] rounded-[3px] bg-[#0A0A0C] p-[3px] shadow-[inset_0_2px_5px_rgba(0,0,0,0.95)]";

const KEY = [
  "flex flex-col items-center gap-1.5 rounded-sm px-1.5 pb-3 pt-4 text-white/80",
  "bg-[linear-gradient(180deg,#2A2A30_0%,#1C1C21_55%,#151519_100%)]",
  // bevel de 1px + sombra de contato curta: é isso que assenta a tecla no painel
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.7),0_1px_2px_rgba(0,0,0,0.9),0_4px_8px_-3px_rgba(0,0,0,0.7)]",
  "transition-[transform,box-shadow,background,color] duration-75 ease-out",
  "hover:bg-[linear-gradient(180deg,#303037_0%,#202026_55%,#17171B_100%)] hover:text-white",
  "active:translate-y-px active:bg-[linear-gradient(180deg,#17171B_0%,#1C1C21_100%)]",
  "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.85),inset_0_-1px_0_rgba(255,255,255,0.05)]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--led)]",
].join(" ");

const LED_ON = "bg-[color:var(--led)] shadow-[0_0_5px_var(--led),0_0_14px_var(--led-soft)]";
const LED_OFF = "bg-[#3A1512] shadow-[inset_0_0_2px_rgba(0,0,0,0.9)]";

export const MaterialHero = memo(function MaterialHero() {
  const { t, language } = useLanguage();
  const [activeKey, setActiveKey] = useState<number | null>(null);

  const tagline = "fullstack · design · thumbmaker";
  const readout = activeKey === null ? tagline : t(PANEL_KEYS[activeKey].labelKey);

  return (
    <section className={PANEL} aria-label="Caio Marianni">
      {SCREW_POSITIONS.map((position) => (
        <span key={position} className={`${SCREW} ${position}`} aria-hidden />
      ))}

      {/* Grão do anodizado */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/assets/images/noise.webp')] bg-repeat opacity-40 mix-blend-overlay" aria-hidden />

      <div className="relative z-10 p-7 sm:p-9">
        {/* Legenda serigrafada + LEDs */}
        <div className="mb-7 flex items-center justify-between">
          <span className={LEGEND}>caio marianni</span>
          <span className="flex gap-[7px]" aria-hidden>
            {PANEL_KEYS.map((key, index) => (
              <i
                key={key.cap}
                className={`h-1.5 w-1.5 rounded-full transition-[background,box-shadow] duration-150 ${activeKey === index ? LED_ON : LED_OFF}`}
              />
            ))}
          </span>
        </div>

        <h1 className="mb-4 font-inter text-[34px] font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl">
          {language === "pt" ? (
            <>
              Desenvolvendo
              <br />
              ideias que <span className="text-[color:var(--led)]">clickam</span>
            </>
          ) : (
            <>
              Developing
              <br />
              ideas that <span className="text-[color:var(--led)]">click</span>
            </>
          )}
        </h1>

        <div className="mb-7 max-w-[46ch] font-inter text-[15px] leading-relaxed text-white/60">
          {/* Light = código · Dark = design, mesma regra do hero atual */}
          <p className="block dark:hidden">{t("hero.description.code")}</p>
          <p className="hidden dark:block">{t("hero.description.design")}</p>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className={DISPLAY}>
            <span
              className="font-jetbrains-mono text-[13px] lowercase tracking-[0.28em] text-[color:var(--led)] [text-shadow:0_0_8px_var(--led-soft)]"
              aria-live="polite"
            >
              {readout}
            </span>
          </div>

          <nav className={WELL} aria-label={language === "pt" ? "Navegação" : "Navigation"}>
            {PANEL_KEYS.map((key, index) => {
              const Icon = key.icon;
              return (
                <Link
                  key={key.cap}
                  href={key.href}
                  className={KEY}
                  onMouseEnter={() => setActiveKey(index)}
                  onMouseLeave={() => setActiveKey(null)}
                  onFocus={() => setActiveKey(index)}
                  onBlur={() => setActiveKey(null)}
                >
                  <Icon size={17} strokeWidth={1.6} aria-hidden />
                  <span className="font-jetbrains-mono text-[8.5px] uppercase tracking-[0.18em] text-white/40">{key.cap}</span>
                  <span className="sr-only">{t(key.labelKey)}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <p className={`${LEGEND} mt-5 text-right`}>{language === "pt" ? "goiás br · uma fonte de luz" : "goiás br · one light source"}</p>
      </div>
    </section>
  );
});
