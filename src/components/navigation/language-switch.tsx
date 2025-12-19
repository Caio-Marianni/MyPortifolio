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
        text-on
        theme-transition-500
      `}
      title={locale === "pt" ? "Switch to English" : "Mudar para Português"}
    >
      <Globe size={20} className="glow" />

      {/* Badge com idioma atual */}
      <span
        className={`
          absolute -bottom-1 -right-1
          px-1.5 py-0.5
          text-[10px] font-bold uppercase
          text-off
          rounded-full
        `}
      >
        {locale}
      </span>
    </button>
  );
}
