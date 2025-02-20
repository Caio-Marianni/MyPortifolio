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
    title: "First of all, choose your path_",
    // Thumbnails
    aboutText1Thumbs:
      "Hello, I am a UI and UX design professional, entering the YouTube area, I am focused on creating thumbnails that attract attention with striking colors, contrasts and lighting, as well as creating thumbnails that are different from the others when possible.",
    aboutText2Thumbs: "I currently make thumbnails for some channels with different themes and styles, so far there have been",
    aboutTextSpanThumbs: " +1000 thumbnails ",
    extra: "already made, let's chat and discover the best style for your channel.",
    portfolioThumbs: "Thumbnails",
    heroTitleThumbs: "Gain more prominence and improve channel performance!",
    heroSubtitleThumbs: "Integrating creativity and design expertise to develop thumbnails and designs that capture user attention and elevate your channel presence.",
    // WebDev
    aboutText1WebDev:
      "Hello, I'm what they call FullStack. I'm a professional in the Ui/UX and programming area. On the frontend, I always try to develop a minimalist, easy-to-understand and pleasant interface. Going to the backend, I always try to use good programming practices, with clean code, componentization and comments.",
    aboutText2WebDev: "In short, I always aim to deliver impeccable work that is easily accessible and pleasing to the user. So far I have done ",
    aboutTextSpanWebDev: "+50 projects",
    portfolioWebDev: "Projects",
    heroTitleWebDev: "Helping you create and implement your ideas!",
    heroSubtitleWebDev: "Combining design and development expertise to deliver impactful and intuitive solutions.",
    // generics
    space: ".",
    about: "About Me",
    clientReviews: "Client reviews",
    certifications: "Certifications",
    contact: "contact me",
    viewWork: "view work",
    allRightsReserved: "allRightsReserved",
    // Projects WebDev
    projectTitleInventory: "Inventory management",
    projectDescriptionInventory: "Dashboard for maintaining and administering a company (access to products/expenses/orders/etc.). Login page with access levels",
    projectQuoteInventory: "",
    projectTitleTravel: "Travel agency",
    projectDescriptionTravel: "Travel agency website, containing trips/about me and ways to get in touch",
    projectQuoteTravel: "",
    projectTitleFlux: "Artist website",
    projectDescriptionFlux: "Site made to promote projects and music by DJ/producer flux zone. Data manipulation with a strong artistic touch for the website.",
    projectQuoteFlux: "",
  },
  pt: {
    // Home page
    title: "Antes de tudo, escolha seu caminho_",
    // Thumbnails
    aboutText1Thumbs:
      "Olá, sou profissional de UI e UX design, entrando na área de YouTube, estou focado em criar miniaturas que chamem a atenção com cores, contrastes e iluminação marcantes, além de criar miniaturas diferentes das demais quando possível.",
    aboutText2Thumbs: "Atualmente faço miniaturas para alguns canais com temas e estilos diferentes, até o momento já foram feitas.",
    aboutTextSpanThumbs: " +1000 thumbnails ",
    extra: "vamos bater um papo e descobrir o melhor estilo para seu canal.",
    portfolioThumbs: "Thumbnails",
    heroTitleThumbs: "Ganhe mais destaque e melhore o desempenho do canal!",
    heroSubtitleThumbs: "Integrando criatividade e experiência em design para desenvolver thumbnails e designs que captem a atenção do usuário e elevem a presença do seu canal.",
    // WebDev
    aboutText1WebDev:
      "Olá, sou o que chamam de FullStack. Sou profissional na área de Ui/UX e programação. No frontend procuro sempre desenvolver uma interface minimalista, de fácil entendimento e agradável. Indo para o backend procuro sempre utilizar boas práticas de programação, com código limpo, componentização e comentários.",
    aboutText2WebDev: "Resumindo, busco sempre entregar um trabalho impecável, de fácil acesso e que agrade ao usuário. Até agora fiz ",
    aboutTextSpanWebDev: "+50 projetos",
    portfolioWebDev: "Projetos",
    heroTitleWebDev: "Ajudando você a criar e implementar sua ideias!",
    heroSubtitleWebDev: "Combinando expertise em design e desenvolvimento para entregar soluções impactantes e intuitivas.",
    // generics
    space: ".",
    about: "Sobre mim",
    clientReviews: "Avaliaçao dos clientes",
    certifications: "Certificados",
    contact: "entre em contato",
    viewWork: "ver trabalhos",
    allRightsReserved: "todosDireirosReservados",
    // Projects WebDev
    projectTitleInventory: "Gerenciamento de estoque",
    projectDescriptionInventory: "Dashboard para manutenção e administração de uma empresa (acesso a produtos/despesas/pedidos/etc.).Página de login com níveis de acesso",
    projectQuoteInventory: "",
    projectTitleTravel: "Agência de viagens",
    projectDescriptionTravel: "Site de uma agência de viagens, contendo viagens/sobre mim e formas de entrar em contato",
    projectQuoteTravel: "",
    projectTitleFlux: "Site do artista",
    projectDescriptionFlux: "Site criado para divulgar projetos e músicas de DJ/produtor flux zone. Manipulação de dados com forte toque artístico para o site.",
    projectQuoteFlux: "",
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
