"use client";

import { memo } from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  current?: boolean;
}

interface ExperienceCardProps {
  experience: Experience;
  currentLabel: string;
}

export const ExperienceCard = memo(function ExperienceCard({
  experience,
  currentLabel,
}: ExperienceCardProps) {
  return (
    <div className="relative pl-8">
      <div
        className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
          experience.current
            ? "bg-[var(--accent)] text-white"
            : "bg-[var(--bg-primary)] border-2 border-[var(--frame-color)]/50"
        }`}
      >
        <Briefcase size={12} />
      </div>

      <div
        className={`p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--frame-color)]/20 ${
          experience.current ? "border-[var(--accent)]/30" : ""
        }`}
      >
        {experience.current && (
          <span className="inline-block mb-2 px-2 py-0.5 text-xs rounded bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30">
            {currentLabel}
          </span>
        )}

        <h3 className="font-semibold text-[var(--text-primary)]">
          {experience.role}
        </h3>
        <p className="text-[var(--accent)] font-medium">{experience.company}</p>

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
});
