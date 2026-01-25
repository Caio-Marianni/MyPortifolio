export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  tags: string[];
  features: string[];
  images: string[];
  github: string;
  demo: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Plataforma completa de e-commerce com carrinho e pagamentos.",
    fullDescription:
      "Uma plataforma de e-commerce moderna e responsiva, com funcionalidades completas de catálogo de produtos, carrinho de compras, sistema de pagamentos integrado e painel administrativo para gestão de pedidos e estoque.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "Stripe"],
    features: ["Catálogo de produtos com filtros", "Carrinho de compras persistente", "Integração com Stripe para pagamentos", "Painel administrativo completo"],
    images: ["/thumbnail/F2.webp", "/thumbnail/F3.webp"],
    github: "https://github.com/Caio-Marianni",
    demo: "#",
  },
  {
    id: 2,
    title: "Task Manager App",
    description: "Aplicativo de gerenciamento de tarefas com drag and drop.",
    fullDescription:
      "Um aplicativo moderno de gerenciamento de tarefas com interface intuitiva de drag and drop, categorização por projetos, notificações em tempo real e sincronização na nuvem para acesso em múltiplos dispositivos.",
    tags: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    features: ["Interface drag and drop intuitiva", "Categorização por projetos e tags", "Notificações em tempo real", "Sincronização na nuvem"],
    images: ["/thumbnail/F3.webp", "/thumbnail/F4.webp"],
    github: "https://github.com/Caio-Marianni",
    demo: "#",
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "Site portfolio minimalista com troca de tema e design moderno.",
    fullDescription:
      "Um site portfolio desenvolvido com foco em performance e experiência do usuário. Implementa troca de tema dinâmica, animações suaves e design responsivo. Construído seguindo as melhores práticas de desenvolvimento web moderno.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    features: ["Troca de tema dinâmica", "Animações suaves e performáticas", "Design totalmente responsivo", "SEO otimizado"],
    images: ["/thumbnail/F4.webp", "/thumbnail/F2.webp"],
    github: "https://github.com/Caio-Marianni",
    demo: "#",
  },
];
