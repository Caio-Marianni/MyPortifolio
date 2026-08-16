export type Language = "pt" | "en";

/* PT é a fonte da verdade: as chaves daqui viram o tipo `TranslationKey`, então uma chave
   órfã ou um typo em `t("...")` quebram o build em vez de aparecerem como texto cru na tela.
   `en` é tipado contra as chaves do `pt`, logo esquecer uma tradução também não compila. */
const pt = {
  "status.location": "Brasil-GO",
  "status.stats": "+20 Projetos",
  "status.clients": "2 Clientes felizes",
  "status.projects": "Projetos",
  "status.thumbnails": "Thumbnails",

  "lobby.thumbs.stat": "44 entregues",
  "lobby.thumbs.line": "Capas para YouTube · CTR",
  "lobby.thumbs.cta": "ver galeria",
  /* abreviado: no toggle do mobile as duas pills dividem 360px e "Web Development" quebrava */
  "lobby.web.label": "Web Dev",
  "lobby.web.stat": "4 em produção",
  "lobby.web.line": "Fullstack · Next.js · Node",
  "lobby.web.cta": "ver projetos",
  "lobby.contact": "fale comigo",

  "projects.back": "Voltar",
  "projects.viewProject": "Ver projeto",
  "projects.architecture": "Arquitetura",
  "projects.deploy": "Deploy",
  "projects.specs": "Especificações",
  "projects.problem": "O problema",
  "projects.solution": "A solução",
  "projects.delivers": "O que foi entregue",
  "projects.results": "Resultados",
  /* Rótulos dos campos de `Project` que ainda não são renderizados (technologies,
     sourceCode). Ficam porque os dados ficam — ver data/projects.ts. */
  "projects.technologies": "Tecnologias",
  "projects.features": "Funcionalidades",
  "projects.sourceCode": "Código fonte",
  "projects.security": "Segurança",
  "projects.patterns": "Padrões",

  "contact.title": "Entre em Contato",
  "contact.subtitle": "Adoraria ouvir de você!",
  "contact.whereToFind": "Onde me achar",
  "contact.firstName": "Nome",
  "contact.lastName": "Sobrenome",
  "contact.email": "Email",
  "contact.emailPlaceholder": "seu@email.com",
  "contact.message": "Mensagem",
  "contact.messagePlaceholder": "Sua mensagem...",
  "contact.send": "Enviar mensagem",
} as const;

export type TranslationKey = keyof typeof pt;

const en: Record<TranslationKey, string> = {
  "status.location": "Brazil-GO",
  "status.stats": "+20 Projects",
  "status.clients": "2 Happy clients",
  "status.projects": "Projects",
  "status.thumbnails": "Thumbnails",

  "lobby.thumbs.stat": "44 delivered",
  "lobby.thumbs.line": "YouTube covers · CTR",
  "lobby.thumbs.cta": "view gallery",
  "lobby.web.label": "Web Dev",
  "lobby.web.stat": "4 in production",
  "lobby.web.line": "Fullstack · Next.js · Node",
  "lobby.web.cta": "view projects",
  "lobby.contact": "get in touch",

  "projects.back": "Back",
  "projects.viewProject": "View project",
  "projects.architecture": "Architecture",
  "projects.deploy": "Deploy",
  "projects.specs": "Specifications",
  "projects.problem": "The problem",
  "projects.solution": "The solution",
  "projects.delivers": "What was delivered",
  "projects.results": "Results",
  "projects.technologies": "Technologies",
  "projects.features": "Features",
  "projects.sourceCode": "Source code",
  "projects.security": "Security",
  "projects.patterns": "Patterns",

  "contact.title": "Get in Touch",
  "contact.subtitle": "I'd like to hear from you!",
  "contact.whereToFind": "Where to find me",
  "contact.firstName": "First Name",
  "contact.lastName": "Last Name",
  "contact.email": "Email",
  "contact.emailPlaceholder": "your@email.com",
  "contact.message": "Message",
  "contact.messagePlaceholder": "Your message...",
  "contact.send": "Send message",
};

export const translations: Record<Language, Record<TranslationKey, string>> = { pt, en };
