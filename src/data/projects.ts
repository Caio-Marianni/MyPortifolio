export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
}

export interface DevInfo {
  architecture: { pt: string; en: string };
  security: { pt: string; en: string };
  deploy: { pt: string; en: string };
  patterns: string[];
}

export interface Project {
  id: number;
  title: string;
  description: { pt: string; en: string };
  fullDescription: { pt: string; en: string };
  tags: string[];
  features: { pt: string[]; en: string[] };
  devInfo: DevInfo;
  mockups: string[];
  github: string | null;
  demo: string;
  lighthouse?: LighthouseScores;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "GoPack",
    description: {
      pt: "Plataforma full-stack com site institucional, catálogo de produtos e painel administrativo para uma empresa de embalagens flexíveis.",
      en: "Full-stack platform with institutional website, product catalog and admin panel for a flexible packaging company.",
    },
    fullDescription: {
      pt: "Plataforma completa desenvolvida para a Gopack Embalagens Flexíveis, com site institucional de geração estática e SEO otimizado no frontend, e uma REST API desacoplada no backend com autenticação JWT e controle de roles (Admin/Employee). Inclui CRUD de produtos, categorias e orçamentos, upload de imagens via Cloudinary e deploy em VPS com Docker.",
      en: "Complete platform built for Gopack Embalagens Flexíveis, featuring a statically generated frontend with optimized SEO and a decoupled REST API backend with JWT authentication and role-based access control (Admin/Employee). Includes CRUD for products, categories and quotes, image upload via Cloudinary, and VPS deployment with Docker.",
    },
    tags: ["Next.js 15", "Node.js", "PostgreSQL", "TypeScript", "Docker"],
    features: {
      pt: [
        "Catálogo de produtos com filtro por categoria",
        "Formulário de orçamento com toggle unidades/kg",
        "REST API com autenticação JWT e controle de roles",
        "Upload de imagens via Cloudinary",
        "Arquitetura full-stack desacoplada com deploy Docker",
      ],
      en: [
        "Product catalog with category filter",
        "Quote form with units/kg toggle",
        "REST API with JWT authentication and role-based access control",
        "Image upload via Cloudinary",
        "Decoupled full-stack architecture with Docker deployment",
      ],
    },
    devInfo: {
      architecture: {
        pt: "Frontend SSG desacoplado de uma REST API Node.js independente",
        en: "Decoupled SSG frontend with an independent Node.js REST API",
      },
      security: {
        pt: "JWT com roles Admin/Employee, CORS configurado, validação de inputs",
        en: "JWT with Admin/Employee roles, configured CORS, input validation",
      },
      deploy: {
        pt: "Vercel (SSG) · VPS com Docker + Nginx (API)",
        en: "Vercel (SSG) · VPS with Docker + Nginx (API)",
      },
      patterns: ["Repository Pattern", "MVC", "RBAC", "Decoupled Architecture"],
    },
    mockups: [],
    github: null,
    demo: "https://www.gopack.com.br",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
  {
    id: 2,
    title: "Ana Carolina",
    description: {
      pt: "Portfólio para designer com painel administrativo completo — conteúdo atualizado sem redeploy.",
      en: "Portfolio for a designer with a full admin panel — content updated without redeployment.",
    },
    fullDescription: {
      pt: "Site de portfólio para designer e social media manager com painel admin que permite atualizar projetos e depoimentos sem redeploy. Destaques: grid bento com modal para imagens e vídeos (click-to-play), upload com conversão automática para WebP via Sharp, star rating para avaliações e alternância de idioma PT/EN com geração estática e revalidação a cada hora.",
      en: "Portfolio site for a designer and social media manager with an admin panel for updating projects and testimonials without redeploying. Highlights: bento grid with modal for images and videos (click-to-play), upload with automatic WebP conversion via Sharp, star rating for reviews, and PT/EN language switching with static generation and hourly revalidation.",
    },
    tags: ["Next.js 14", "TypeScript", "Framer Motion", "Drizzle ORM", "Vercel Blob"],
    features: {
      pt: [
        "Grid bento de projetos com modal de imagens e vídeos",
        "Upload com conversão automática para WebP (server-side)",
        "Painel admin com CRUD, toggle de visibilidade e aprovação de avaliações",
        "Alternância de idioma PT/EN com geração estática",
        "Depoimentos dinâmicos com star rating interativo",
      ],
      en: [
        "Bento grid of projects with image and video modals",
        "Upload with automatic WebP conversion (server-side)",
        "Admin panel with CRUD, visibility toggle and review approval",
        "PT/EN language switching with static generation",
        "Dynamic testimonials with interactive star rating",
      ],
    },
    devInfo: {
      architecture: {
        pt: "Next.js com ISR (revalidação por hora) + API Routes internas",
        en: "Next.js with ISR (hourly revalidation) + internal API Routes",
      },
      security: {
        pt: "Autenticação no admin, sanitização e conversão server-side de uploads",
        en: "Admin auth, server-side upload sanitization and conversion",
      },
      deploy: {
        pt: "Vercel (SSG + ISR) · Vercel Blob para armazenamento de imagens",
        en: "Vercel (SSG + ISR) · Vercel Blob for image storage",
      },
      patterns: ["ISR", "Server Actions", "Sharp Pipeline", "Drizzle ORM"],
    },
    mockups: ["/projects/cover/ana2.jpg", "/projects/cover/ana2.jpg"],
    github: null,
    demo: "https://portfolio-ana-carol.vercel.app",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
  {
    id: 3,
    title: "Schoolink",
    description: {
      pt: "Plataforma web de gestão escolar com perfis de aluno, responsável, professor e diretor — desenvolvida como TCC.",
      en: "Web-based school management platform with student, guardian, teacher and principal profiles — developed as a final year thesis.",
    },
    fullDescription: {
      pt: "Sistema web completo para gestão escolar desenvolvido como Trabalho de Conclusão de Curso. Cobre lançamento de notas e frequência, atividades com envio de arquivos, boletim exportável e comunicados institucionais. Suporta múltiplas instituições com temas próprios e autenticação stateless com controle de acesso por papel (RBAC).",
      en: "Complete web system for school management developed as a Final Year Project. Covers grade and attendance tracking, file-upload activities, exportable report cards and institutional announcements. Supports multiple institutions with custom themes and stateless authentication with role-based access control (RBAC).",
    },
    tags: ["Next.js 15", "Node.js", "PostgreSQL", "Prisma", "Redux Toolkit"],
    features: {
      pt: [
        "Gestão de turmas, disciplinas, alunos e professores",
        "Lançamento de notas e controle de frequência com relatórios",
        "Atividades escolares com envio de arquivos e marcação de conclusão",
        "Boletim exportável com cabeçalho da instituição",
        "Autenticação JWT com RBAC e suporte a múltiplas instituições",
      ],
      en: [
        "Management of classes, subjects, students and teachers",
        "Grade recording and attendance tracking with reports",
        "School activities with file submission and completion marking",
        "Exportable report card with institution header",
        "JWT authentication with RBAC and multi-institution support",
      ],
    },
    devInfo: {
      architecture: {
        pt: "Next.js 15 (frontend) + REST API Node.js desacoplada + PostgreSQL",
        en: "Next.js 15 (frontend) + decoupled Node.js REST API + PostgreSQL",
      },
      security: {
        pt: "JWT stateless + RBAC com 4 papéis: aluno, responsável, professor, diretor",
        en: "Stateless JWT + RBAC with 4 roles: student, guardian, teacher, principal",
      },
      deploy: {
        pt: "Frontend na Vercel · API Node.js em servidor dedicado",
        en: "Frontend on Vercel · Node.js API on dedicated server",
      },
      patterns: ["RBAC", "Redux Toolkit", "Prisma ORM", "Clean Architecture"],
    },
    mockups: ["/projects/cover/schoolink.jpg"],
    github: null,
    demo: "https://schoolink-mp0taoipf-caiomariannis-projects.vercel.app",
  },
  {
    id: 4,
    title: "Caio Nogueira",
    description: {
      pt: "Cardápio digital para bartender profissional com painel administrativo e performance 100/100 no Lighthouse.",
      en: "Digital menu for a professional bartender with an admin panel and 100/100 Lighthouse score.",
    },
    fullDescription: {
      pt: "Aplicação de cardápio digital para bartender profissional com painel admin completo para gestão de drinks em tempo real. Destaque para o upload com recorte proporcional e conversão automática para WebP, animações de entrada com IntersectionObserver e stagger por coluna, e QR Code integrado para acesso direto via câmera. Performance 100/100 em todas as métricas do Lighthouse no desktop.",
      en: "Digital menu application for a professional bartender with a complete admin panel for real-time drink management. Highlights: upload with proportional cropping and automatic WebP conversion, entrance animations with IntersectionObserver and column stagger, and integrated QR Code for direct camera access. 100/100 performance on all Lighthouse metrics on desktop.",
    },
    tags: ["Next.js 15", "TypeScript", "Tailwind CSS 4", "PostgreSQL", "Vercel"],
    features: {
      pt: [
        "Cardápio público com filtro por categoria e toggle grade/lista",
        "Upload com captura por câmera, recorte e conversão para WebP",
        "Painel admin com CRUD completo de drinks em tempo real",
        "QR Code integrado para acesso direto via câmera",
        "Performance 100/100 no Google Lighthouse (desktop)",
      ],
      en: [
        "Public menu with category filter and grid/list toggle",
        "Upload with camera capture, cropping and WebP conversion",
        "Admin panel with full real-time CRUD for drinks",
        "Integrated QR Code for direct camera access",
        "100/100 performance on Google Lighthouse (desktop)",
      ],
    },
    devInfo: {
      architecture: {
        pt: "Next.js full-stack com API Routes integradas + Vercel Postgres",
        en: "Full-stack Next.js with integrated API Routes + Vercel Postgres",
      },
      security: {
        pt: "Autenticação no painel admin, validação e recorte server-side de uploads",
        en: "Admin panel authentication, server-side upload validation and cropping",
      },
      deploy: {
        pt: "Vercel (SSG) · Vercel Postgres (serverless)",
        en: "Vercel (SSG) · Vercel Postgres (serverless)",
      },
      patterns: ["ISR", "Server Actions", "WebP Pipeline", "IntersectionObserver"],
    },
    mockups: ["/projects/cover/nogs2.jpg"],
    github: null,
    demo: "https://caionogueira.vercel.app",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
];
