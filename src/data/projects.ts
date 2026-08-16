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
  /** a dor do cliente antes do projeto, em uma frase e sem jargão */
  problem: { pt: string; en: string };
  /** o que foi construído para resolvê-la, na mesma língua do problema */
  solution: { pt: string; en: string };
  /** o que o cliente recebeu, em palavras de leigo: "site", "painel de edição"… */
  delivers: { pt: string[]; en: string[] };
  /** só entra quando houver número real medido — projeto sem resultado forte omite o campo
      e o card fecha sem buraco, em vez de exibir uma linha fraca */
  results?: { pt: string[]; en: string[] };
  tags: string[];
  features: { pt: string[]; en: string[] };
  devInfo: DevInfo;
  /** marca do cliente, usada de fundo atrás do título — cai no nosso monograma quando falta */
  logo?: string;
  mockups: string[];
  github: string | null;
  demo: string;
  lighthouse?: LighthouseScores;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "GoPack",
    problem: {
      pt: "A linha de embalagens não tinha catálogo online: toda consulta de produto e todo pedido de orçamento passava por atendimento manual, um a um.",
      en: "The packaging line had no online catalog: every product question and every quote request went through manual, one-by-one service.",
    },
    solution: {
      pt: "Catálogo filtrável por categoria com formulário de orçamento, e um painel onde a própria equipe cadastra produto e preço sem depender de programador.",
      en: "A category-filtered catalog with a quote form, plus an admin panel where the team adds products and prices without needing a developer.",
    },
    delivers: {
      pt: ["Site", "Catálogo de produtos", "Orçamento online", "Painel de edição", "Funciona no celular"],
      en: ["Website", "Product catalog", "Online quotes", "Admin panel", "Works on mobile"],
    },
    /* Único resultado que o repositório sustenta hoje. Trocar pelos números do cliente
       quando houver — pedidos por mês, tempo de resposta, o que for medido de fato. */
    results: {
      pt: ["Nota máxima do Google (100/100) em performance, acessibilidade e boas práticas"],
      en: ["Top Google score (100/100) for performance, accessibility and best practices"],
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
    logo: "/projects/icon/gopack.svg",
    mockups: [],
    github: null,
    demo: "https://www.gopack.com.br",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
  {
    id: 2,
    title: "Ana Carolina",
    problem: {
      pt: "O trabalho vivia espalhado no Instagram e em pastas de arquivo: não havia um endereço próprio para mandar a um cliente, e cada projeto novo dependia de refazer post.",
      en: "The work lived scattered across Instagram and file folders: there was no address of her own to send a client, and each new project meant redoing a post.",
    },
    solution: {
      pt: "Site com galeria de projetos e depoimentos, tudo editável por um painel — publica trabalho novo sozinha, em português e inglês, sem tocar em código.",
      en: "A site with a project gallery and testimonials, all editable from a panel — she publishes new work herself, in Portuguese and English, without touching code.",
    },
    delivers: {
      pt: ["Site", "Galeria de projetos", "Vídeos", "Depoimentos de clientes", "Painel de edição", "Português e inglês"],
      en: ["Website", "Project gallery", "Videos", "Client testimonials", "Admin panel", "Portuguese and English"],
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
    logo: "/projects/icon/ana.svg",
    mockups: ["/projects/cover/ana2.webp"],
    github: null,
    demo: "https://portfolio-ana-carol.vercel.app",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
  {
    id: 3,
    title: "Schoolink",
    problem: {
      pt: "Escola pequena controla nota, presença e comunicado em papel e planilha solta — o responsável só descobre como está o aluno quando o bimestre já fechou.",
      en: "Small schools track grades, attendance and announcements on paper and loose spreadsheets — guardians only learn how the student is doing once the term has closed.",
    },
    solution: {
      pt: "Plataforma com acesso separado para aluno, responsável, professor e diretor: o que o professor lança uma vez aparece na hora para quem tem direito de ver.",
      en: "A platform with separate access for student, guardian, teacher and principal: what the teacher records once shows up immediately for whoever is allowed to see it.",
    },
    delivers: {
      pt: ["Acesso por perfil", "Notas e frequência", "Envio de atividades", "Boletim para imprimir", "Comunicados", "Funciona no celular"],
      en: ["Access by profile", "Grades and attendance", "Activity submissions", "Printable report card", "Announcements", "Works on mobile"],
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
    mockups: ["/projects/cover/schoolink.webp"],
    github: null,
    demo: "https://schoolink-mp0taoipf-caiomariannis-projects.vercel.app",
  },
  {
    id: 4,
    title: "Caio Nogueira",
    problem: {
      pt: "Cardápio impresso encarece a cada drink novo e nunca acompanha o que tem de fato disponível na noite — e reimprimir por causa de um item é prejuízo certo.",
      en: "A printed menu costs more with every new drink and never matches what is actually available that night — reprinting over a single item is money burned.",
    },
    solution: {
      pt: "Cardápio digital que o cliente abre pelo QR Code na mesa, com painel para o bartender trocar drink, preço e foto na hora, direto do celular.",
      en: "A digital menu the guest opens from a QR code at the table, with a panel where the bartender swaps drink, price and photo on the spot, straight from the phone.",
    },
    delivers: {
      pt: ["Cardápio por QR Code", "Painel de edição", "Foto pela câmera", "Filtro por categoria", "Funciona no celular"],
      en: ["QR code menu", "Admin panel", "Photo from the camera", "Category filter", "Works on mobile"],
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
    logo: "/projects/icon/losdrinks.png",
    mockups: ["/projects/cover/nogs2.webp"],
    github: null,
    demo: "https://caionogueira.vercel.app",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
];
