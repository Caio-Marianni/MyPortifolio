"use client";

import { useUVMode } from "@/contexts/uv-mode-context";

interface SkillCategory {
  name: string;
  skills: Skill[];
}

interface Skill {
  name: string;
  level: number; // 1-5
  description?: string;
}

const programmingSkills: SkillCategory[] = [
  {
    name: "Front-end",
    skills: [
      { name: "React", level: 5, description: "Hooks, Context, Performance" },
      { name: "Next.js", level: 4, description: "App Router, SSR, API Routes" },
      { name: "TypeScript", level: 4, description: "Types, Generics, Utility Types" },
      { name: "Tailwind CSS", level: 5, description: "Customização, Responsive" },
      { name: "HTML/CSS", level: 5, description: "Semântico, Acessível" },
    ],
  },
  {
    name: "Back-end",
    skills: [
      { name: "Node.js", level: 3, description: "Express, APIs REST" },
      { name: "PostgreSQL", level: 3, description: "Queries, Joins" },
      { name: "Prisma", level: 3, description: "ORM, Migrations" },
    ],
  },
  {
    name: "Ferramentas",
    skills: [
      { name: "Git", level: 4, description: "Branches, PRs, Workflow" },
      { name: "VS Code", level: 5, description: "Extensions, Shortcuts" },
      { name: "Figma", level: 3, description: "UI, Prototyping" },
    ],
  },
];

const designSkills: SkillCategory[] = [
  {
    name: "Design Gráfico",
    skills: [
      { name: "Photoshop", level: 5, description: "Manipulação, Composição" },
      { name: "Illustrator", level: 4, description: "Vetores, Logo" },
      { name: "Figma", level: 4, description: "UI/UX, Protótipos" },
    ],
  },
  {
    name: "Motion & Video",
    skills: [
      { name: "After Effects", level: 3, description: "Animações, Motion" },
      { name: "Premiere Pro", level: 3, description: "Edição básica" },
    ],
  },
  {
    name: "Especialidades",
    skills: [
      { name: "Thumbnails", level: 5, description: "YouTube, Twitch" },
      { name: "Identidade Visual", level: 4, description: "Branding" },
      { name: "Social Media", level: 4, description: "Posts, Stories" },
    ],
  },
];

export function SkillsModalContent() {
  const { isUV } = useUVMode();
  const skillCategories = isUV ? designSkills : programmingSkills;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
        Arsenal do Suspeito
      </p>

      <div className="space-y-6">
        {skillCategories.map((category) => (
          <SkillCategoryCard key={category.name} category={category} />
        ))}
      </div>
    </div>
  );
}

interface SkillCategoryCardProps {
  category: SkillCategory;
}

function SkillCategoryCard({ category }: SkillCategoryCardProps) {
  return (
    <div className="space-y-3">
      <h3
        className={`
          text-sm font-semibold text-[var(--accent)]
          uppercase tracking-wider
          flex items-center gap-2
        `}
      >
        <span
          className={`
            w-2 h-2 rounded-full
            bg-[var(--accent)]
          `}
        />
        {category.name}
      </h3>

      <div className="grid gap-2">
        {category.skills.map((skill) => (
          <SkillBar key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
}

interface SkillBarProps {
  skill: Skill;
}

function SkillBar({ skill }: SkillBarProps) {
  return (
    <div
      className={`
        p-3 rounded-lg
        bg-[var(--bg-primary)]
        border border-[var(--frame-color)]/20
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-[var(--text-primary)]">
          {skill.name}
        </span>
        {skill.description && (
          <span className="text-xs text-[var(--text-secondary)]">
            {skill.description}
          </span>
        )}
      </div>

      {/* Barra de nível */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`
              h-1.5 flex-1 rounded-full
              transition-colors duration-300
              ${
                level <= skill.level
                  ? "bg-[var(--accent)]"
                  : "bg-[var(--frame-color)]/20"
              }
            `}
          />
        ))}
      </div>

      {/* Indicador de nível */}
      <div className="mt-1 text-right">
        <span className="text-xs text-[var(--text-secondary)]">
          {getLevelLabel(skill.level)}
        </span>
      </div>
    </div>
  );
}

function getLevelLabel(level: number): string {
  const labels: Record<number, string> = {
    1: "Iniciante",
    2: "Básico",
    3: "Intermediário",
    4: "Avançado",
    5: "Expert",
  };
  return labels[level] || "N/A";
}
