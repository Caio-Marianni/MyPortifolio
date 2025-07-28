"use client";
import { useState } from "react";
import { IoAccessibilitySharp } from "react-icons/io5";
import { PiSpeakerHighFill } from "react-icons/pi";
import { PiSpeakerSimpleXFill } from "react-icons/pi";
import { useTheme } from "next-themes";
import { LiaToggleOffSolid, LiaToggleOnSolid } from "react-icons/lia";
import { useLanguage } from "./utils/LanguageProvider";
import { useScore } from "./utils/LikeContext";

export default function VerticalMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  // Language function
  const toggleLanguage = () => {
    setLanguage(language === "pt" ? "en" : "pt");
  };

  // Sound function
  const { muted, toggleMute } = useScore();
  if (typeof window !== "undefined") {
    const audioElements = document.getElementsByTagName("audio");
    for (const audio of audioElements) {
      audio.muted = muted;
    }
  }

  return (
    <div className="fixed top-12 pt-2 right-2 md:right-6 z-50 flex flex-col items-center w-auto">
      {/* Botão flutuante redondo */}
      <button
        className="w-12 h-12 bg-[#1a1a1a9a] border backdrop-blur-sm border-[#5C6370] drop-shadow-[0_0_10px_rgba(0,_204,_255,_0.1)] rounded-full flex items-center justify-center shadow-lg hover:border-[#00bfff] transition z-10"
        onClick={() => setOpen(!open)}
        aria-label="Fechar modal"
        title="Fechar modal"
      >
        <IoAccessibilitySharp className="text-white w-5 h-5" />
      </button>

      {/* Barra vertical com transição Tailwind */}
      <div
        className={`-mt-8 pt-10 translate-y-0 flex flex-col gap-3 items-center bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-2 transition-all duration-700 overflow-hidden ${
          open ? "max-h-[500px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Theme toggle */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-md bg-[#2A2A2A] border border-[#5C6370] hover:border-[#00bfff] hover:bg-[#0F0F0F] transition"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Effect modal"
          title="Tirar effects"
        >
          {theme === "light" ? <LiaToggleOffSolid className="w-5 h-5 text-[#00bfff]" /> : <LiaToggleOnSolid className="w-5 h-5 text-[#00bfff]" />}
        </button>
        {/* Language toggle */}
        <button
          className="w-10 h-10 flex items-center justify-center text-xs font-medium text-[#00bfff] rounded-md bg-[#2A2A2A] border border-[#5C6370] hover:border-[#00bfff] hover:bg-[#0F0F0F] transition"
          onClick={toggleLanguage}
          aria-label="Language modal"
          title="Alterar Language"
        >
          {language.toUpperCase()}
        </button>
        {/* Sound toggle */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-md bg-[#2A2A2A] border border-[#5C6370] hover:border-[#00bfff] hover:bg-[#0F0F0F] transition"
          onClick={toggleMute}
          aria-label="Sound modal"
          title="Alterar Sound"
        >
          {muted ? <PiSpeakerSimpleXFill className="w-5 h-5 text-[#00bfff]" /> : <PiSpeakerHighFill className="w-5 h-5 text-[#00bfff]" />}
        </button>
      </div>
    </div>
  );
}
