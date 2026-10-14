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
  /** só entra quando houver número real medido — projeto sem resultado forte omite o campo
      e o card fecha sem buraco, em vez de exibir uma linha fraca */
  results?: { pt: string[]; en: string[] };
  tags: string[];
  /** 3 destaques técnicos que o card não mostra — o que já está no resumo não se repete aqui */
  features: { pt: string[]; en: string[] };
  devInfo: DevInfo;
  /** marca do cliente, usada de fundo atrás do título — cai no nosso monograma quando falta */
  logo?: string;
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
        pt: "Frontend SSG na Vercel, desacoplado de uma REST API Node.js em VPS (Docker + Nginx)",
        en: "SSG frontend on Vercel, decoupled from a Node.js REST API on a VPS (Docker + Nginx)",
      },
      security: {
        pt: "JWT com papéis Admin/Employee, CORS configurado e validação de entrada",
        en: "JWT with Admin/Employee roles, configured CORS and input validation",
      },
    },
    logo: "/projects/icon/gopack.svg",
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
  {
    id: 2,
    title: "Ana Carolina",
    summary: {
      pt: "Portfólio próprio com galeria de projetos e depoimentos, que ela mesma atualiza em português e inglês — em vez do trabalho espalhado pelo Instagram.",
      en: "Her own portfolio with a project gallery and testimonials that she updates herself in Portuguese and English — instead of work scattered across Instagram.",
    },
    tags: ["Next.js 14", "TypeScript", "Framer Motion", "Drizzle ORM", "Vercel Blob"],
    features: {
      pt: [
        "Upload com conversão automática para WebP no servidor (Sharp)",
        "Painel com CRUD, controle de visibilidade e aprovação de avaliações",
        "PT/EN com geração estática das duas versões",
      ],
      en: [
        "Upload with automatic server-side WebP conversion (Sharp)",
        "Panel with CRUD, visibility control and review approval",
        "PT/EN with both versions statically generated",
      ],
    },
    devInfo: {
      architecture: {
        pt: "Next.js com ISR (revalidação a cada hora) e API Routes internas, na Vercel; imagens no Vercel Blob",
        en: "Next.js with ISR (hourly revalidation) and internal API Routes on Vercel; images on Vercel Blob",
      },
      security: {
        pt: "Autenticação no painel, sanitização e conversão de uploads no servidor",
        en: "Panel authentication, server-side upload sanitization and conversion",
      },
    },
    logo: "/projects/icon/ana.svg",
    cover: "/projects/cover/ana2.webp",
    demo: "https://portfolio-ana-carol.vercel.app",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
];
