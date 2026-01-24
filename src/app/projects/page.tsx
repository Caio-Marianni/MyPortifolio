"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, X, ChevronLeft, ChevronRight, ImageIcon, CheckCircle2, Code2 } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { useLanguage } from "@/contexts/language-context";

interface Project {
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

const projects: Project[] = [
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

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative bg-white dark:bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header with Title and Close */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">{project.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Carousel */}
        <div className="relative bg-gray-100 dark:bg-gray-800 aspect-video">
          {project.images.length > 0 ? (
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${project.images[currentImageIndex]})` }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Navigation Arrows */}
          {project.images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {project.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {project.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentImageIndex ? "bg-gray-800 dark:bg-white" : "bg-gray-400 dark:bg-gray-600"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">{project.fullDescription}</p>

          {/* Technologies */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">{t("projects.technologies")}</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">{t("projects.features")}</h3>
            <ul className="space-y-2">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-gray-500 dark:text-gray-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              <Code2 className="w-4 h-4" />
              {t("projects.sourceCode")}
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition-opacity text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              {t("projects.viewProject")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      {/* Image Placeholder */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {project.images.length > 0 ? (
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${project.images[0]})` }} />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="1" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="1" />
                <line x1="29" y1="29" x2="71" y2="71" stroke="currentColor" strokeWidth="1" />
                <line x1="71" y1="29" x2="29" y2="71" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-1">{project.title}</h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && <span className="text-xs px-2 py-1 text-blue-600 dark:text-blue-400">+{project.tags.length - 4}</span>}
        </div>

        {/* View Details Button */}
        <button
          onClick={onClick}
          className="w-full py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          {t("projects.viewDetails")}
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { t } = useLanguage();

  return (
    <PageContainer>
      <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        {t("projects.back")}
      </Link>

      <PageHeader title={t("projects.title")} description={t("projects.description")} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
        ))}
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </PageContainer>
  );
}
