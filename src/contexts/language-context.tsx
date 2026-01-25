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
    "hero.description.design": "No YouTube, a primeira impressão é o que importa. Crio thumbnails estratégicas desenhadas para interromper o scroll e maximizar sua taxa de cliques.",
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
    "contact.title": "Entre em Contato",
    "contact.subtitle": "Adoraria ouvir de você!",
    "contact.description": "Se você tem alguma dúvida ou apenas quer dizer oi, use o formulário de contato!",
    "contact.back": "Voltar",
    "contact.firstName": "Nome",
    "contact.lastName": "Sobrenome",
    "contact.email": "Email",
    "contact.emailPlaceholder": "seu@email.com",
    "contact.message": "Mensagem",
    "contact.messagePlaceholder": "Sua mensagem...",
    "contact.send": "Enviar mensagem",
    "contact.sending": "Enviando...",
    "contact.success": "Mensagem enviada com sucesso! Entrarei em contato em breve.",
    "contact.error": "Erro ao enviar mensagem. Tente novamente.",
    "thumbnails.title": "Thumbnails",
    "thumbnails.description": "Galeria de thumbnails criadas para vídeos do YouTube e outros projetos.",
    "thumbnails.back": "Voltar",
    "thumbnails.all": "Todos",
    "thumbnails.empty": "Nenhuma thumbnail encontrada nesta categoria.",
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
    "contact.title": "Get in Touch",
    "contact.subtitle": "I'd like to hear from you!",
    "contact.description": "If you have any inquiries or just want to say hi, please use the contact form!",
    "contact.back": "Back",
    "contact.firstName": "First Name",
    "contact.lastName": "Last Name",
    "contact.email": "Email",
    "contact.emailPlaceholder": "your@email.com",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Your message...",
    "contact.send": "Send message",
    "contact.sending": "Sending...",
    "contact.success": "Message sent successfully! I'll get back to you soon.",
    "contact.error": "Error sending message. Please try again.",
    "thumbnails.title": "Thumbnails",
    "thumbnails.description": "Gallery of thumbnails created for YouTube videos and other projects.",
    "thumbnails.back": "Back",
    "thumbnails.all": "All",
    "thumbnails.empty": "No thumbnails found in this category.",
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
