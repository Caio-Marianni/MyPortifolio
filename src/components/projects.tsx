import { useState } from "react";
import ProjectsDisplay from "./projects-display";
import ProjectsFilter from "./projects-filter";
import ProjectsSelected from "./projects-selected";
import { useLanguage } from "./utils/LanguageProvider";
import { FaInstagram } from "react-icons/fa";
import { MdPets, MdSchool } from "react-icons/md";

type FilterType = "todos" | "landing" | "fullstack";

export interface Project {
  id: number;
  icon: React.ElementType;
  cover: string[];
  title: string;
  description: string;
  year: string;
  tagFilter: string;
  technologies: string[];
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    link: "https://portfolio-ana-carol.vercel.app",
    cover: ["/assets/images/thumbs/Alanzoka.jpg", "/assets/images/projects/anaCover.png"],
    title: "Landing page (Ana Carolina)",
    year: "2024",
    technologies: ["React", "Tailwind", "Next.js"],
    description: "projectDescriptionAna",
    icon: FaInstagram,
    tagFilter: "landing",
  },
  {
    id: 2,
    link: "https://freela-landing.com",
    cover: ["/assets/images/thumbs/Car.jpg", "/assets/images/thumbs/Car2.jpg"],
    title: "Landing page para freelancer",
    year: "2023",
    technologies: ["HTML", "CSS", "JS"],
    description: "Página pessoal com portfólio e formulário de contato.",
    tagFilter: "landing",
    icon: MdPets,
  },
  {
    id: 3,
    link: "https://dashboard-escola.com",
    cover: ["/assets/images/projects/anaCover.png"],
    title: "Dashboard para escola",
    year: "2024",
    technologies: ["React", "Node.js", "Prisma"],
    description: "Sistema interno para administração de escola.",
    icon: MdSchool,
    tagFilter: "fullstack",
  },
];

const filterLabels: Record<FilterType, string> = {
  todos: "Todos",
  landing: "Landingpages",
  fullstack: "FullStack",
};

export default function DisplayProjects() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>("todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="flex flex-col xl:flex-row">
      {/* Coluna da listagem dos projetos */}
      <div className="w-full xl:w-1/2 flex flex-col gap-1">
        <ProjectsFilter onFilterChange={setFilter} />

        {filter === "todos" ? (
          <>
            <ProjectsDisplay tag="landing" label="Landingpages" projects={projects} onProjectClick={setSelectedProject} />
            <ProjectsDisplay tag="fullstack" label="FullStack" projects={projects} onProjectClick={setSelectedProject} />
          </>
        ) : (
          <ProjectsDisplay tag={filter} label={filterLabels[filter]} projects={projects} onProjectClick={setSelectedProject} />
        )}
      </div>

      {/* Divider */}
      <hr className="h-px w-auto mt-4 xl:h-auto xl:w-px xl:mx-2 xl:mt-0 bg-white/10 border-none" />

      {/* Coluna da exibição detalhada */}
      {/* <div className="w-full xl:w-1/2 mt-2 p-4 border border-slate-700 rounded-sm  bg-gradient-to-b from-slate-700/40 to-transparent min-h-[500px]"> */}
      <div className="relative w-full auto rounded-sm">
        {selectedProject ? <ProjectsSelected {...selectedProject} /> : <p className="mt-4 font-tech text-white/20 text-center">{t("projectInfo")} :]</p>}
        {/* Background GLow effect */}
        <div className="absolute inset-0 rounded-xl bg-cyan-950/20 blur-sm -z-10" />
      </div>
    </div>
  );
}
