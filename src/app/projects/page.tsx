"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, X } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  tags: string[];
  github: string;
  demo: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "Site portfolio minimalista com troca de tema e design moderno.",
    fullDescription:
      "Um site portfolio desenvolvido com foco em performance e experiência do usuário. Implementa troca de tema dinâmica, animações suaves e design responsivo. Construído seguindo as melhores práticas de desenvolvimento web moderno.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    github: "https://github.com/Caio-Marianni",
    demo: "#",
    image: "/thumbnail/F2.webp",
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: "Plataforma completa de e-commerce com carrinho e pagamentos.",
    fullDescription:
      "Plataforma de e-commerce completa com sistema de carrinho de compras, integração com gateway de pagamentos, gerenciamento de estoque e painel administrativo. Desenvolvida com arquitetura escalável e segura.",
    tags: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/Caio-Marianni",
    demo: "#",
    image: "/thumbnail/F3.webp",
  },
  {
    id: 3,
    title: "Task Management App",
    description: "Aplicativo de gerenciamento de tarefas com drag and drop.",
    fullDescription:
      "Aplicativo de gerenciamento de tarefas com interface intuitiva de drag and drop, categorização de tarefas, notificações em tempo real e sincronização na nuvem. Ideal para equipes e projetos pessoais.",
    tags: ["Vue.js", "Firebase", "Vuetify"],
    github: "https://github.com/Caio-Marianni",
    demo: "#",
    image: "/thumbnail/F4.webp",
  },
];

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative bg-white dark:bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Image Header */}
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.image})` }}
        />

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{project.title}</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">{project.fullDescription}</p>

          <div className="flex gap-4">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition-opacity"
            >
              <Github className="w-4 h-4" />
              Ver Código
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative h-64 rounded-md border border-white/10 group-hover:border-white overflow-hidden cursor-pointer group"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${project.image})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <PageContainer showThemeToggle={false}>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <PageHeader
        title="Projetos"
        description="Uma seleção dos meus trabalhos recentes. Cada projeto foi criado com atenção aos detalhes e foco na experiência do usuário."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </PageContainer>
  );
}
