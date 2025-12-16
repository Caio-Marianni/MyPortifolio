"use client";

import { Briefcase, Calendar, MapPin } from "lucide-react";
import { useUVMode } from "@/contexts/uv-mode-context";

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  current?: boolean;
}

const programmingExperience: Experience[] = [
  {
    id: "exp-001",
    company: "Freelancer",
    role: "Desenvolvedor Front-end",
    period: "2022 - Presente",
    location: "Remoto",
    description: [
      "Desenvolvimento de aplicações web responsivas com React e Next.js",
      "Implementação de interfaces modernas com Tailwind CSS",
      "Integração com APIs RESTful e GraphQL",
      "Otimização de performance e SEO",
    ],
    current: true,
  },
  {
    id: "exp-002",
    company: "Projetos Pessoais",
    role: "Full Stack Developer",
    period: "2020 - 2022",
    location: "São Paulo, BR",
    description: [
      "Criação de projetos pessoais para aprendizado",
      "Experimentação com diferentes tecnologias e frameworks",
      "Contribuições para projetos open source",
    ],
  },
];

const designExperience: Experience[] = [
  {
    id: "des-exp-001",
    company: "Freelancer",
    role: "Designer Gráfico",
    period: "2021 - Presente",
    location: "Remoto",
    description: [
      "Criação de thumbnails para canais do YouTube",
      "Design de identidades visuais para marcas",
      "Produção de materiais de marketing digital",
      "Edição e manipulação de imagens",
    ],
    current: true,
  },
  {
    id: "des-exp-002",
    company: "Projetos Autorais",
    role: "Designer Visual",
    period: "2019 - 2021",
    location: "São Paulo, BR",
    description: [
      "Desenvolvimento de estilo visual próprio",
      "Experimentação com diferentes técnicas de design",
      "Criação de portfolio e presença online",
    ],
  },
];

export function ExperienceModalContent() {
  const { isUV } = useUVMode();
  const experiences = isUV ? designExperience : programmingExperience;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
        Histórico de Atividades Suspeitas
      </p>

      {/* Timeline */}
      <div className="relative">
        {/* Linha vertical da timeline */}
        <div
          className={`
            absolute left-[11px] top-2 bottom-2
            w-0.5 bg-[var(--frame-color)]/30
          `}
        />

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

function ExperienceCard({ experience, index }: ExperienceCardProps) {
  return (
    <div className="relative pl-8">
      {/* Marcador da timeline */}
      <div
        className={`
          absolute left-0 top-1
          w-6 h-6 rounded-full
          flex items-center justify-center
          ${
            experience.current
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-primary)] border-2 border-[var(--frame-color)]/50"
          }
        `}
      >
        <Briefcase size={12} />
      </div>

      {/* Card de experiência */}
      <div
        className={`
          p-4 rounded-lg
          bg-[var(--bg-primary)]
          border border-[var(--frame-color)]/20
          ${experience.current ? "border-[var(--accent)]/30" : ""}
        `}
      >
        {/* Status */}
        {experience.current && (
          <span
            className={`
              inline-block mb-2 px-2 py-0.5 text-xs rounded
              bg-[var(--accent)]/20 text-[var(--accent)]
              border border-[var(--accent)]/30
            `}
          >
            Em atividade
          </span>
        )}

        {/* Empresa e cargo */}
        <h3 className="font-semibold text-[var(--text-primary)]">
          {experience.role}
        </h3>
        <p className="text-[var(--accent)] font-medium">{experience.company}</p>

        {/* Período e localização */}
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {experience.period}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {experience.location}
          </span>
        </div>

        {/* Descrição */}
        <ul className="mt-3 space-y-1.5">
          {experience.description.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
            >
              <span className="text-[var(--accent)] mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
