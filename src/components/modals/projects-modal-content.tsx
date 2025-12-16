"use client";

import { useState } from "react";
import { ExternalLink, Github, ChevronDown, ChevronUp } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useAudioContext } from "@/contexts/audio-context";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  status: "em andamento" | "concluído" | "arquivado";
}

const programmingProjects: Project[] = [
  {
    id: "proj-001",
    title: "Portfolio Interativo",
    description:
      "Landing page com tema de quadro de investigação. Dual-mode para programação e design, animações CSS puras e sistema de modais navegáveis.",
    image: "/assets/images/projects/portfolio.png",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "#",
    repoUrl: "#",
    status: "em andamento",
  },
  {
    id: "proj-002",
    title: "Dashboard Analytics",
    description:
      "Painel administrativo com visualização de dados em tempo real, gráficos interativos e exportação de relatórios.",
    image: "/assets/images/projects/dashboard.png",
    tags: ["React", "Chart.js", "Node.js"],
    liveUrl: "#",
    repoUrl: "#",
    status: "concluído",
  },
  {
    id: "proj-003",
    title: "E-commerce Platform",
    description:
      "Plataforma completa de e-commerce com carrinho, checkout e integração com gateways de pagamento.",
    image: "/assets/images/projects/ecommerce.png",
    tags: ["Next.js", "Stripe", "Prisma"],
    liveUrl: "#",
    status: "concluído",
  },
];

const designProjects: Project[] = [
  {
    id: "des-001",
    title: "Campanha YouTube Gaming",
    description:
      "Série de thumbnails para canal de gaming com +500k inscritos. CTR médio de 12% nas peças criadas.",
    image: "/assets/images/projects/gaming-thumbs.png",
    tags: ["Photoshop", "Illustrator"],
    status: "concluído",
  },
  {
    id: "des-002",
    title: "Identidade Visual Startup",
    description:
      "Criação completa de identidade visual incluindo logo, paleta de cores, tipografia e materiais de marketing.",
    image: "/assets/images/projects/branding.png",
    tags: ["Illustrator", "Figma"],
    status: "concluído",
  },
  {
    id: "des-003",
    title: "Pack de Thumbnails Tech",
    description:
      "Templates customizáveis de thumbnails para nicho de tecnologia. Design moderno e alta conversão.",
    image: "/assets/images/projects/tech-thumbs.png",
    tags: ["Photoshop", "After Effects"],
    liveUrl: "#",
    status: "em andamento",
  },
];

export function ProjectsModalContent() {
  const { isUV } = useUVMode();
  const projects = isUV ? designProjects : programmingProjects;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-4">
        {projects.length} casos documentados
      </p>

      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { play } = useAudioContext();

  const handleToggle = () => {
    play("navbar");
    setIsExpanded(!isExpanded);
  };

  const statusColors = {
    "em andamento": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    concluído: "bg-green-500/20 text-green-400 border-green-500/30",
    arquivado: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <div
      className={`
        rounded-lg overflow-hidden
        bg-[var(--bg-primary)]
        border border-[var(--frame-color)]/20
        transition-all duration-300
      `}
    >
      {/* Header clicável */}
      <button
        onClick={handleToggle}
        className={`
          w-full flex items-center justify-between
          p-4
          hover:bg-[var(--frame-color)]/5
          transition-colors duration-200
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            {project.id.toUpperCase()}
          </span>
          <h3 className="font-semibold text-[var(--text-primary)]">
            {project.title}
          </h3>
          <span
            className={`
              px-2 py-0.5 text-xs rounded border
              ${statusColors[project.status]}
            `}
          >
            {project.status}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-[var(--text-secondary)]" />
        ) : (
          <ChevronDown size={20} className="text-[var(--text-secondary)]" />
        )}
      </button>

      {/* Conteúdo expandido */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="p-4 pt-0 space-y-4">
          {/* Imagem do projeto */}
          <div
            className={`
              relative w-full aspect-video
              rounded-lg overflow-hidden
              border border-[var(--frame-color)]/20
            `}
          >
            <OptimizedImage
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
            {/* Overlay estilo evidência */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs font-mono text-white">
              EVIDÊNCIA
            </div>
          </div>

          {/* Descrição */}
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`
                  px-2 py-0.5 text-xs rounded
                  bg-[var(--accent)]/20 text-[var(--accent)]
                  border border-[var(--accent)]/30
                `}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  inline-flex items-center gap-1.5
                  px-3 py-1.5 rounded-lg
                  bg-[var(--accent)] text-white
                  text-sm font-medium
                  hover:opacity-90
                  transition-opacity duration-200
                `}
              >
                <ExternalLink size={14} />
                Ver Projeto
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  inline-flex items-center gap-1.5
                  px-3 py-1.5 rounded-lg
                  bg-[var(--frame-color)]/20 text-[var(--text-primary)]
                  text-sm font-medium
                  hover:bg-[var(--frame-color)]/30
                  transition-colors duration-200
                  border border-[var(--frame-color)]/20
                `}
              >
                <Github size={14} />
                Código
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
