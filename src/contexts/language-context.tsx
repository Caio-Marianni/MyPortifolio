"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "@/data/translations";

export type { Language } from "@/data/translations";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCALE = { pt: "pt-BR", en: "en-US" } as const;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");
  const [mounted, setMounted] = useState(false);

  /* Nada de segurar a árvore até montar: o provider envolve o site inteiro, então um
     `return null` aqui deixava todas as páginas sem HTML no servidor — sem LCP e sem
     conteúdo para o robô que não executa JS. O servidor entrega PT, que é o `lang` do
     documento e o idioma da maioria; quem tem EN salvo vê a troca no primeiro frame. */
  useEffect(() => {
    const saved = localStorage.getItem("language");
    /* validação em vez de cast: o valor vem do storage, que qualquer um edita */
    if (saved === "pt" || saved === "en") setLanguage(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("language", language);
    document.documentElement.lang = LOCALE[language];
  }, [language, mounted]);

  /* Sem o memo, `value` é objeto novo a cada render e toda a árvore re-renderiza a cada
     tecla digitada no formulário de contato. */
  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      toggleLanguage: () => setLanguage((prev) => (prev === "pt" ? "en" : "pt")),
      t: (key) => translations[language][key],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
