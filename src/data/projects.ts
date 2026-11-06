/** notas do Lighthouse (desktop), de 0 a 100 — copiadas à mão do PageSpeed Insights */
export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
}

export interface DevInfo {
  /** arquitetura e onde roda, numa linha só */
  architecture: { pt: string; en: string };
  security: { pt: string; en: string };
}

export interface Project {
  id: number;
  title: string;
  /** dor e solução numa frase só, sem jargão — é o que quem contrata lê no card */
  summary: { pt: string; en: string };
  /** o tipo de negócio do cliente ("Bar", "Brechó") — quem visita se reconhece por aqui */
  client?: { pt: string; en: string };
  /** o estudo de caso curto do projeto em destaque: o que doía antes e o que foi feito.
      `results` fecha o trio quando existir número medido. */
  problem?: { pt: string; en: string };
  solution?: { pt: string; en: string };
  /** só entra quando houver número real medido — projeto sem resultado forte omite o campo
      e o card fecha sem buraco, em vez de exibir uma linha fraca */
  results?: { pt: string[]; en: string[] };
  tags: string[];
  /** 3 destaques técnicos que o card não mostra — o que já está no resumo não se repete aqui */
  features: { pt: string[]; en: string[] };
  devInfo: DevInfo;
  /** marca do cliente, usada de fundo atrás do título — cai no nosso monograma quando falta */
  logo?: string;
  /** versão da marca só para o fundo, quando a logo inteira é horizontal demais e some na
      caixa quadrada — sem ela o fundo usa `logo` */
  backgroundMark?: string;
  /** foto única do projeto; sem ela a ficha mostra "capa pendente" */
  cover?: string;
  demo: string;
  /** sem nota medida, o card simplesmente não mostra a rosca */
  lighthouse?: LighthouseScores;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "GoPack",
    summary: {
      pt: "Catálogo online de embalagens com orçamento pelo site e um painel onde a própria equipe cadastra produto e preço — sem atendimento manual a cada consulta.",
      en: "An online packaging catalog with quotes through the site and a panel where the team manages products and prices itself — no more one-by-one manual service.",
    },
    client: { pt: "Distribuidora", en: "Distributor" },
    problem: {
      pt: "Toda consulta de preço passava por atendimento manual.",
      en: "Every price inquiry went through manual service.",
    },
    solution: {
      pt: "Catálogo com orçamento pelo site e painel para a equipe cadastrar produto e preço.",
      en: "A catalog with quotes through the site and a panel where the team manages products and prices.",
    },
    tags: ["Next.js 15", "Node.js", "PostgreSQL", "TypeScript", "Docker"],
    features: {
      pt: [
        "REST API Node.js com autenticação JWT e controle por papéis (Admin/Employee)",
        "Upload de imagens via Cloudinary",
        "API em container Docker atrás de Nginx, separada do frontend",
      ],
      en: [
        "Node.js REST API with JWT authentication and role-based access (Admin/Employee)",
        "Image upload via Cloudinary",
        "API in a Docker container behind Nginx, separate from the frontend",
      ],
    },
    devInfo: {
      architecture: {
        pt: "Frontend SSG no Cloudflare Pages, desacoplado de uma REST API Node.js no servidor da própria empresa (Docker + Nginx)",
        en: "SSG frontend on Cloudflare Pages, decoupled from a Node.js REST API on the company's own server (Docker + Nginx)",
      },
      security: {
        pt: "JWT com papéis Admin/Employee, CORS configurado e validação de entrada",
        en: "JWT with Admin/Employee roles, configured CORS and input validation",
      },
    },
    logo: "/projects/icon/gopack.svg",
    cover: "/projects/cover/gopack.webp",
    demo: "https://www.gopack.com.br",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
  {
    id: 5,
    title: "A Fila Anda",
    summary: {
      pt: "Brechó de luxo com catálogo de joias e bolsas autenticadas, carrinho e atendimento pelo WhatsApp. Dona publica cada peça nova sozinha através de um painel administrativo.",
      en: "A luxury secondhand shop with a catalog of authenticated jewelry and bags, a cart and WhatsApp service. The owner publishes each new item herself through an admin panel.",
    },
    client: { pt: "Brechó", en: "Secondhand shop" },
    problem: {
      pt: "Cada peça nova dependia de alguém para publicar.",
      en: "Every new item depended on someone else to publish it.",
    },
    solution: {
      pt: "Catálogo com carrinho que fecha pelo WhatsApp e painel para a dona publicar sozinha.",
      en: "A catalog with a cart that checks out on WhatsApp and a panel where the owner publishes on her own.",
    },
    tags: ["Astro", "Sanity CMS", "Cloudflare Pages"],
    features: {
      pt: [
        "Catálogo e conteúdo editados pelo Sanity CMS, mas com painel próprio personalizado.",
        "Carrinho com fechamento do pedido pelo WhatsApp",
      ],
      en: [
        "Catalog and content edited through Sanity CMS",
        "Cart with checkout handed off to WhatsApp",
      ],
    },
    devInfo: {
      architecture: {
        pt: "Site estático em Astro com conteúdo vindo do Db, publicado no Cloudflare Pages",
        en: "Static Astro site with content from Db, deployed on Cloudflare Pages",
      },
      security: {
          pt: "Site estático, sem servidor próprio exposto, edição restrita ao painel personalizado no site",
          en: "Static site with no exposed server of its own, editing restricted to the custom admin panel",
      },
    },
    demo: "https://desapegoafilaanda.pages.dev",
  },
  {
    id: 4,
    title: "Los Drinks",
    summary: {
      pt: "Cardápio digital por QR Code/Link (tendo filtros e ordenação). Bartender atualiza o cardápio pelo celular através de uma área administrativa (nome, foto, ingredientes etc).",
      en: "Digital menu via QR code or link (featuring filters and sorting options). The bartender updates the menu from their pc or phone via an admin panel (name, photo, ingredients, etc.).",
    },
    client: { pt: "Bar", en: "Bar" },
    problem: {
      pt: "Cada drink novo dependia de reimprimir o cardápio.",
      en: "Every new drink meant reprinting the menu.",
    },
    solution: {
      pt: "Cardápio por QR Code com filtros, e um painel em que o próprio bartender edita nome, foto e ingredientes pelo celular.",
      en: "A QR code menu with filters, and a panel where the bartender edits name, photo and ingredients from their phone.",
    },
    tags: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL", "Vercel"],
    features: {
      pt: [
        "Painel com CRUD de drinks refletido no cardápio em tempo real",
        "Cardápio estático com revalidação incremental (ISR)",
      ],
      en: [
        "Dashboard with drink CRUD functionality reflected on the menu in real time",
        "Static menu with Incremental Static Regeneration (ISR)",
      ],
    },
    devInfo: {
      architecture: {
        pt: "Next.js full-stack com API Routes integradas, na Vercel com Vercel Postgres (serverless)",
        en: "Full-stack Next.js with integrated API Routes, on Vercel with Vercel Postgres (serverless)",
      },
      security: {
        pt: "Autenticação no painel, validação e recorte de uploads no servidor",
        en: "Panel authentication, server-side upload validation and cropping",
      },
    },
    logo: "/projects/icon/losdrinks.svg",
    cover: "/projects/cover/nogs3.webp",
    demo: "https://caionogueira.vercel.app",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
  {
    id: 7,
    title: "Método USD",
    summary: {
      pt: "Página de vendas de um curso para designers que querem atender clientes pagando em dólar, levando direto ao checkout da Kiwify, onde o pagamento é feito por Pix ou cartão.",
      en: "A sales page for a course that teaches designers to land clients who pay in dollars, sending visitors straight to a Kiwify checkout that takes Pix or card.",
    },
    client: { pt: "Curso online", en: "Online course" },
    problem: {
      pt: "O curso precisava de uma página que levasse direto à compra.",
      en: "The course needed a page that led straight to the purchase.",
    },
    solution: {
      pt: "Página de vendas leve, com dor, módulos, depoimentos e FAQ, e checkout por Pix ou cartão na Kiwify.",
      en: "A lightweight sales page with pain points, modules, testimonials and FAQ, and Pix or card checkout on Kiwify.",
    },
    tags: ["HTML", "CSS", "JavaScript", "Cloudflare"],
    features: {
      pt: [
        "HTML, CSS e JS puros, sem framework, com fontes locais pré-carregadas",
        "Checkout e garantia de 7 dias delegados à Kiwify, sem pagamento no próprio site",
        "Copy em seções de dor, módulos, depoimentos e FAQ em acordeão",
      ],
      en: [
        "Plain HTML, CSS and JS with no framework, plus preloaded self-hosted fonts",
        "Checkout and 7-day guarantee handled by Kiwify, with no payments on the site itself",
        "Copy split into pain points, modules, testimonials and an accordion FAQ",
      ],
    },
    devInfo: {
      architecture: {
        pt: "Site estático de página única servido pela Cloudflare",
        en: "Static single-page site served through Cloudflare",
      },
      security: {
        pt: "Sem servidor nem dados de pagamento no site; cabeçalhos nosniff e referrer-policy",
        en: "No server or payment data on the site; nosniff and referrer-policy headers",
      },
    },
    logo: "/projects/icon/usd-logo.webp",
    backgroundMark: "/projects/icon/usd-mark.webp",
    cover: "/projects/cover/usd-cover-3.webp",
    demo: "https://metodousd.com.br",
  },
  /* Lumière — estúdio de gravação. Fica comentado até ter capa, link e texto revisado; o id 6
     já é dele, e não deve ser reaproveitado: as avaliações no banco apontam para o projeto
     pelo id.
  {
    id: 6,
    title: "Lumière",
    summary: {
      pt: "",
      en: "",
    },
    tags: [],
    features: {
      pt: [],
      en: [],
    },
    devInfo: {
      architecture: { pt: "", en: "" },
      security: { pt: "", en: "" },
    },
    logo: "/projects/icon/lumiere.svg",
    cover: "/projects/cover/lumiere.webp",
    demo: "",
  },
  */
];

/** Projeto secundário: sem capa, sem ficha técnica — só o bastante pra uma linha na lista de
    "mais projetos". Os ids vêm do mesmo espaço de `projects` e também não se reaproveitam. */
export interface SideProject {
  id: number;
  title: string;
  summary: { pt: string; en: string };
  tags: string[];
  demo: string;
}

export const sideProjects: SideProject[] = [
  {
    id: 2,
    title: "Ana Carolina",
    summary: {
      pt: "Portfólio próprio com galeria de projetos e depoimentos, que ela mesma atualiza em português e inglês — em vez do trabalho espalhado pelo Instagram.",
      en: "Her own portfolio with a project gallery and testimonials that she updates herself in Portuguese and English — instead of work scattered across Instagram.",
    },
    tags: ["Next.js 14", "TypeScript", "Framer Motion", "Drizzle ORM", "Vercel Blob"],
    demo: "https://portfolio-ana-carol.vercel.app",
  },
];

/** Principais e secundários juntos, para quem só precisa do par id/título: convite, rota e
    painel de avaliações. Uma avaliação pode ser de qualquer um dos dois. */
export const allProjects: { id: number; title: string }[] = [...projects, ...sideProjects];
