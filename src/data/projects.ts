export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  tags: string[];
  features: string[];
  mockups: string[];
  github: string | null;
  demo: string;
  lighthouse?: LighthouseScores;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "GoPack",
    description:
      "Plataforma full-stack com site institucional, catálogo de produtos e painel administrativo para uma empresa de embalagens flexíveis.",
    fullDescription:
      "Plataforma completa desenvolvida para a Gopack Embalagens Flexíveis, com site institucional de geração estática e SEO otimizado no frontend, e uma REST API desacoplada no backend com autenticação JWT e controle de roles (Admin/Employee). Inclui CRUD de produtos, categorias e orçamentos, upload de imagens via Cloudinary e deploy em VPS com Docker.",
    tags: ["Next.js 15", "Node.js", "PostgreSQL", "TypeScript", "Docker"],
    features: [
      "Catálogo de produtos com filtro por categoria",
      "Formulário de orçamento com toggle unidades/kg",
      "REST API com autenticação JWT e controle de roles",
      "Upload de imagens via Cloudinary",
      "Arquitetura full-stack desacoplada com deploy Docker",
    ],
    mockups: [],
    github: null,
    demo: "https://www.gopack.com.br",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
  {
    id: 2,
    title: "Ana Carolina",
    description:
      "Portfólio para designer com painel administrativo completo — conteúdo atualizado sem redeploy.",
    fullDescription:
      "Site de portfólio para designer e social media manager com painel admin que permite atualizar projetos e depoimentos sem redeploy. Destaques: grid bento com modal para imagens e vídeos (click-to-play), upload com conversão automática para WebP via Sharp, star rating para avaliações e alternância de idioma PT/EN com geração estática e revalidação a cada hora.",
    tags: ["Next.js 14", "TypeScript", "Framer Motion", "Drizzle ORM", "Vercel Blob"],
    features: [
      "Grid bento de projetos com modal de imagens e vídeos",
      "Upload com conversão automática para WebP (server-side)",
      "Painel admin com CRUD, toggle de visibilidade e aprovação de avaliações",
      "Alternância de idioma PT/EN com geração estática",
      "Depoimentos dinâmicos com star rating interativo",
    ],
    mockups: ["/projects/cover/ana2.jpg", "/projects/cover/ana2.jpg"],
    github: null,
    demo: "https://portfolio-ana-carol.vercel.app",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
  {
    id: 3,
    title: "Caio Nogueira",
    description:
      "Cardápio digital para bartender profissional com painel administrativo e performance 100/100 no Lighthouse.",
    fullDescription:
      "Aplicação de cardápio digital para bartender profissional com painel admin completo para gestão de drinks em tempo real. Destaque para o upload com recorte proporcional e conversão automática para WebP, animações de entrada com IntersectionObserver e stagger por coluna, e QR Code integrado para acesso direto via câmera. Performance 100/100 em todas as métricas do Lighthouse no desktop.",
    tags: ["Next.js 15", "TypeScript", "Tailwind CSS 4", "PostgreSQL", "Vercel"],
    features: [
      "Cardápio público com filtro por categoria e toggle grade/lista",
      "Upload com captura por câmera, recorte e conversão para WebP",
      "Painel admin com CRUD completo de drinks em tempo real",
      "QR Code integrado para acesso direto via câmera",
      "Performance 100/100 no Google Lighthouse (desktop)",
    ],
    mockups: ["/projects/cover/nogs2.jpg"],
    github: null,
    demo: "https://caionogueira.vercel.app",
    lighthouse: { performance: 100, accessibility: 100, bestPractices: 100 },
  },
];
