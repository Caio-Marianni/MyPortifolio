"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useAudioContext } from "@/contexts/audio-context";

export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();
  const { play } = useAudioContext();

  const handleToggle = () => {
    play("click");
    setLocale(locale === "pt" ? "en" : "pt");
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative p-3 rounded-full
        text-[var(--text-secondary)]
        hover:text-[var(--text-primary)]
        hover:bg-[var(--bg-secondary)]
        transition-all duration-200
        hover:scale-110
        active:scale-95
        group
      `}
      title={locale === "pt" ? "Switch to English" : "Mudar para Português"}
    >
      <Globe size={20} />

      {/* Badge com idioma atual */}
      <span
        className={`
          absolute -bottom-1 -right-1
          px-1.5 py-0.5
          text-[10px] font-bold uppercase
          bg-[var(--accent)]
          text-white
          rounded-full
        `}
      >
        {locale}
      </span>

      {/* Tooltip */}
      <div
        className={`
          absolute top-full mt-2 left-1/2 -translate-x-1/2
          px-3 py-1.5 rounded-md
          bg-[var(--bg-primary)] text-[var(--text-primary)]
          text-xs whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
          border border-[var(--frame-color)]/20
          shadow-lg
          z-50
        `}
      >
        {locale === "pt" ? "English" : "Português"}
      </div>
    </button>
  );
}
