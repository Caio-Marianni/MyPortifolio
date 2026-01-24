"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "pt" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    "hero.title": "Desenvolvendo ideias que clickam",
    "hero.description.code": "Desenvolvo soluções focadas em escalabilidade, segurança e experiência do usuário: do front ao back-end.",
    "hero.description.design": "No YouTube, a primeira impressão é oque importa. Crio thumbnails estratégicas desenhadas para interromper o scroll e maximizar sua taxa de cliques.",
    "status.location": "Brasil-GO",
    "status.stats": "+20 Projetos",
    "status.clients": "2 Clientes felizes",
    "status.diploma": "Diploma",
    "status.contacts": "Contactos",
    "status.projects": "Projetos",
    "status.thumbnails": "Thumbnails",
    "social.title": "Links sociais",
    "projects.title": "Meus Projetos",
    "projects.description": "Uma coleção dos meus trabalhos em desenvolvimento web e design.",
    "projects.back": "Voltar",
    "projects.viewDetails": "Ver detalhes",
    "projects.technologies": "Tecnologias",
    "projects.features": "Funcionalidades",
    "projects.sourceCode": "Código fonte",
    "projects.viewProject": "Ver projeto",
  },
  en: {
    "hero.title": "Developing ideas that click",
    "hero.description.code": "I develop solutions focused on scalability, security and user experience: from front to back-end.",
    "hero.description.design": "On YouTube, first impression is what matters. I create strategic thumbnails designed to stop the scroll and maximize your click-through rate.",
    "status.location": "Brazil-GO",
    "status.stats": "+20 Projects",
    "status.clients": "2 Happy clients",
    "status.diploma": "Diploma",
    "status.contacts": "Contact",
    "status.projects": "Projects",
    "status.thumbnails": "Thumbnails",
    "social.title": "Social links",
    "projects.title": "My Projects",
    "projects.description": "A collection of my work in web development and design.",
    "projects.back": "Back",
    "projects.viewDetails": "View details",
    "projects.technologies": "Technologies",
    "projects.features": "Features",
    "projects.sourceCode": "Source code",
    "projects.viewProject": "View project",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language);
      document.documentElement.setAttribute("lang", language);
    }
  }, [language, mounted]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "pt" ? "en" : "pt"));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (!mounted) {
    return null;
  }

  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
