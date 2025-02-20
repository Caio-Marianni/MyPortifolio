"use client";

import { Card } from "@/components/ui/card";
import projects from "@/core/constants/projects";
import { Project } from "@/core/types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./utils/LanguageProvider";

// green: "bg-gradient-to-br from-neutral-500/10 to-orange-500/20 hover:from-emerald-500/20 hover:to-emerald-500/30 border-emerald-500/20",
// purple: "bg-gradient-to-br from-purple-500/10 to-purple-500/20 hover:from-purple-500/20 hover:to-purple-500/30 border-purple-500/20",
// blue: "bg-gradient-to-br from-blue-500/10 to-blue-500/20 hover:from-blue-500/20 hover:to-blue-500/30 border-blue-500/20",

export function ProjectsWebDev() {
  const { t } = useLanguage();

  return (
    <section
      id="projects"
      className="container flex justify-center gap-4 py-10 flex-wrap "
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {projects.map((project) => (
        <Card key={project.title} className="border w-[100%] lg:w-[49%] backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group bg-secondary">
          <div className="p-6">
            {/* Image */}
            <div className="relative h-48 w-full mb-6 rounded-xl overflow-hidden">
              <Link href={project.link}>
                <Image src={project.cover || "/placeholder.svg"} alt={t(project.title)} fill className="object-cover transition-transform group-hover:scale-105" />
              </Link>
            </div>
            {/* Content */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{t(project.title)}</h3>
                  <p className="text-sm text-muted-foreground">{project.type}</p>
                </div>
                <Link href={project.link}>
                  <ExternalLink className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t(project.description)}</p>

              {project.quote && <p className="text-sm italic text-muted-foreground mt-4 border-l-2 border-primary/50 pl-4">&quot;{t(project.quote)}&quot;</p>}

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
