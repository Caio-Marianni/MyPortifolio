"use client";

import { memo } from "react";
import { SkillBar } from "./skill-bar";

interface Skill {
  name: string;
  level: number;
  description?: string;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

interface SkillCategoryCardProps {
  category: SkillCategory;
  getLevelLabel: (level: number) => string;
}

export const SkillCategoryCard = memo(function SkillCategoryCard({
  category,
  getLevelLabel,
}: SkillCategoryCardProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
        {category.name}
      </h3>

      <div className="grid gap-2">
        {category.skills.map((skill) => (
          <SkillBar key={skill.name} skill={skill} getLevelLabel={getLevelLabel} />
        ))}
      </div>
    </div>
  );
});
