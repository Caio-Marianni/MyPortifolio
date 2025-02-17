"use client"

import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "pt";

type LanguageProviderProps = {
  children: React.ReactNode;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeys) => string;
};

type TranslationKeys = keyof (typeof translations)["en"];

const translations = {
  en: {
    // Home page
    title: "First of all, choose your path_",
    // Thumbnails
    aboutText1Thumbs: "",
    aboutText2Thumbs: "",
    portfolioThumbs: "Thumbnails",
    heroTitleThumbs: "Explore our incredible Thumbnails!",
    heroSubtitleThumbs: "The best designs for visual engagement.",
    // WebDev
    aboutText1WebDev: "",
    aboutText2WebDev: "",
    portfolioWebDev: "Projects",
    heroTitleWebDev: "We turn your ideas into Websites!",
    heroSubtitleWebDev: "Modern and effective digital solutions.",
    // generics
    about: "About Me",
    clientReviews: "Client reviews",
    certifications: "Certifications",
    contact: "contact me",
    viewWork: "view work",
    allRightsReserved: "allRightsReserved",
  },
  pt: {
    // Home page
    title: "Antes de tudo, escolha seu caminho_",
    // Thumbnails
    aboutText1Thumbs: "",
    aboutText2Thumbs: "",
    portfolioThumbs: "Thumbnails",
    heroTitleThumbs: "Explore nossos Thumbnails incríveis!",
    heroSubtitleThumbs: "Os melhores designs para engajamento visual.",
    // WebDev
    aboutText1WebDev: "",
    aboutText2WebDev: "",
    portfolioWebDev: "Projetos",
    heroTitleWebDev: "Transformamos suas ideias em Websites!",
    heroSubtitleWebDev: "Soluções digitais modernas e eficazes.",
    // generics
    about: "About",
    clientReviews: "Avaliaçao dos clientes",
    certifications: "Certificados",
    contact: "entre em contato",
    viewWork: "ver trabalhos",
    allRightsReserved: "todosDireirosReservados",
  },
};

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(undefined);

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("en");

  // Ao montar, verifica se já existe idioma salvo
  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language | null;
    if (storedLang && (storedLang === "en" || storedLang === "pt")) {
      setLanguage(storedLang);
    }
  }, []);

  // Sempre que o idioma mudar, salva no localStorage
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: TranslationKeys) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageProviderContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};