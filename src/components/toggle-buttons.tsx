"use client";

import { useLanguage } from "@/contexts/language-context";

export function ToggleButtons() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="fixed right-6 bottom-auto top-4 md:right-6 z-[100] flex rounded-full overflow-hidden backdrop-blur-lg bg-neutral-400/30 dark:bg-[#31A8FF]/10 border-t border-t-white/30 dark:border-[#31A8FF]/30 shadow-sm shadow-white/30 dark:shadow-[#31A8FF]/20">
      <button
        onClick={toggleLanguage}
        className="flex-1 flex items-center justify-center py-2 px-3 text-sm font-mono font-bold transition-all duration-300 text-white/80 dark:text-cyan-300 hover:bg-neutral-500/30 dark:hover:bg-[#31A8FF]/20"
        aria-label="Toggle language"
      >
        {language.toUpperCase()}
      </button>
    </div>
  );
}
