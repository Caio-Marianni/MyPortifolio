// components/ProjectsDisplay.tsx
import React from "react";
import TechContainerXs from "./ui/tech-containerXs";
import { Project } from "../../core/types";


interface Props {
  tag: string;
  label: string;
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function ProjectsDisplay({ tag, label, projects, onProjectClick }: Props) {
  const filtered = tag === "todos" ? projects : projects.filter((project) => project.tagFilter === tag);

  const count = filtered.length;
  if (count === 0) return null;

  return (
    <>
      {/* title Tag */}
      <div className="flex items-center">
        <h1 className="flex-1 text-white font-bold text-sm bg-[#0b5697] px-2 py-1 rounded-sm">{label}</h1>
        {/* Border Effect */}
        <div className="relative w-7">
          {/* Left */}
          <div
            className="absolute -translate-y-[14px] h-[28px] w-4 text-white text-sm font-tech -translate-x-1 bg-[#0b5697]"
            style={{
              clipPath: "polygon(0 0, 100% 0%, 70% 100%, 0% 100%)",
            }}
          />
          {/* Right */}
          <div
            className="absolute -translate-y-[14px] translate-x-3 h-[28px] w-4 text-white text-sm font-tech shadow-[inset_7px_0px_4px_0px_rgba(0,_255,_255,_0.2)]"
            style={{
              clipPath: "polygon(30% 0, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>
        <div className="text-white text-sm font-tech py-1 px-2 shadow-[inset_-6px_0px_4px_0px_rgba(0,_255,_255,_0.2)]">
          <p className="-translate-x-2">x{count}</p>
        </div>
      </div>

      {/* Projects list */}
      <div className="flex flex-col gap-0.5">
        {filtered.map((project, index) => {
          const Icon = project.icon;
          return (
            <div
              key={index}
              className="flex gap-0.5 h-9 items-center hover:shadow-[inset_0px_0px_20px_0px_rgba(0,_255,_255,_0.5)] cursor-pointer hover:opacity-90 transition"
              onClick={() => onProjectClick(project)}
            >
              {/* Empty Container */}
              <div className="h-8">
                <TechContainerXs>
                  <div className="px-2" />
                </TechContainerXs>
              </div>

              {/* Icon personalizado do projeto */}
              <div className="h-8">
                <TechContainerXs>
                  <div className="border-2 border-blue-900 rounded-sm text-white">
                    <Icon size={24} />
                  </div>
                </TechContainerXs>
              </div>

              {/* Texto */}
              <div className="flex-1 h-8">
                <TechContainerXs>
                  <p className="text-xs text-[#9A9A9A]">{project.title}</p>
                </TechContainerXs>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
