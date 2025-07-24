"use client";

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
    // Titles
    aboutMeH1: "About Me",
    aboutMeSub: "Discover a little more about me and my work.",
    curriculumH1: "Curriculum",
    contactH1: "Get in touch",
    socialH1: "Social media",
    techH1: "technologies",
    projectH1: "Projects Created",
    projectSub: "Explore my projects and see how I can help you.",
    projectInfo: "Select a project to see more details",
    seeProjectH1: "See project",
    footerInfoH1: "They say that no one has managed to reach the 1500 likes mark, what will happen when someone does?",
    encoder: "Encoder",
    // Projects
    projectDescriptionAna: "Landing page for marketing, social media and content creation freelancers. With about me, services, portfolio of work carried out and ways to get in touch.",
  },
  pt: {
    // Home page
    // Titles
    aboutMeH1: "Sobre Mim",
    aboutMeSub: "Descubra um pouco mais sobre mim e meu trabalho.",
    curriculumH1: "Currículo",
    contactH1: "Entre em contato",
    socialH1: "Redes sociais",
    techH1: "tecnologias",
    projectH1: "Projetos Criados",
    projectSub: "Explore meus projetos e veja como posso ajudar você.",
    projectInfo: "Selecione um projeto para ver mais detalhes",
    seeProjectH1: "Ver projeto",
    footerInfoH1: "Dizem quen ninguem conseguiu chegar a marca de 1500 likes, oque sera que acontece quando alguem chegar?",
    encoder: "Codificador",
    // Projects WebDev
    projectDescriptionAna:
      "Landing page para uma freelancer de marketing, social media e criação de conteúdo. Com sobre mim, servicos,  portfólio de trabalhos realizados e maneiras de entrar em contato.",
  },
};

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(undefined);

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language | null;
    if (storedLang && (storedLang === "en" || storedLang === "pt")) {
      setLanguage(storedLang);
    }
    setMounted(true);
  }, []);

  // Evita renderizar até que o cliente esteja montado
  if (!mounted) {
    return null;
  }

  const t = (key: TranslationKeys) => {
    return translations[language][key] || key;
  };

  return <LanguageProviderContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageProviderContext.Provider>;
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
