"use client";

import { Card } from "@/components/ui/card";
import projects from "@/core/constants/projects";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./utils/LanguageProvider";

export function ProjectsWebDev() {
  const { t } = useLanguage();

  return (
    <section id="projects" className="container flex justify-center gap-4 py-10 flex-wrap ">
      {projects.map((project) => (
        <Card key={project.title} className="border w-[100%] lg:w-[49%] backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group bg-secondary">
          <div className="p-6">
            {/* Image */}
            <div className="relative h-48 w-full mb-6 rounded-xl overflow-hidden">
              <Link href={project.link} className="relative block h-full w-full">
                <Image src={project.cover || "/placeholder.svg"} alt={t(project.title as keyof typeof t)} fill sizes="(max-width: 768px) 100vw, 49vw" priority className="relative object-cover transition-transform  group-hover:scale-105" />
              </Link>
            </div>
            {/* Content */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{t(project.title as keyof typeof t)}</h3>
                  <p className="text-sm text-muted-foreground">{project.type}</p>
                </div>
                <Link href={project.link}>
                  <ExternalLink className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t(project.description as keyof typeof t)}</p>

              {project.quote && <p className="text-sm italic text-muted-foreground mt-4 border-l-2 border-primary/50 pl-4">&quot;{t(project.quote as keyof typeof t)}&quot;</p>}

              <div className="flex gap-2 mt-6">
                {project.technologies.map((techs, index) => (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {techs}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
