"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

const projects = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "Site portfolio minimalista com troca de tema e design moderno.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    github: "https://github.com/Caio-Marianni",
    demo: "#",
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: "Plataforma completa de e-commerce com carrinho e pagamentos.",
    tags: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/Caio-Marianni",
    demo: "#",
  },
  {
    id: 3,
    title: "Task Management App",
    description: "Aplicativo de gerenciamento de tarefas com drag and drop.",
    tags: ["Vue.js", "Firebase", "Vuetify"],
    github: "https://github.com/Caio-Marianni",
    demo: "#",
  },
];

export default function ProjectsPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 group"
          >
            <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"
              >
                <Github className="w-4 h-4" />
                Código
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
