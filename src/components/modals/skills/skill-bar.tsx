"use client";

import { memo } from "react";

interface Skill {
  name: string;
  level: number;
  description?: string;
}

interface SkillBarProps {
  skill: Skill;
  getLevelLabel: (level: number) => string;
}

export const SkillBar = memo(function SkillBar({
  skill,
  getLevelLabel,
}: SkillBarProps) {
  return (
    <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--frame-color)]/20">
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

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              level <= skill.level
                ? "bg-[var(--accent)]"
                : "bg-[var(--frame-color)]/20"
            }`}
          />
        ))}
      </div>

      <div className="mt-1 text-right">
        <span className="text-xs text-[var(--text-secondary)]">
          {getLevelLabel(skill.level)}
        </span>
      </div>
    </div>
  );
});
