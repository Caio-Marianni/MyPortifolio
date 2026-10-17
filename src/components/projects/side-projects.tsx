"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { SHELL } from "@/components/capa/capa-page";
import { Collapse } from "@/components/projects/project-dossier";
import { useLanguage } from "@/contexts/language-context";
import type { SideProject } from "@/data/projects";

/* Projetos secundários: fechados por padrão, abaixo das fichas. Sem capa e sem
   especificações — título, uma frase, as tecnologias e o link, uma linha por projeto. */
export function SideProjects({ projects }: { projects: SideProject[] }) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);

  /* O quadro de avaliações linka /projects#p<id>. Se o id é de um secundário, a lista abre
     sozinha — fechada, o navegador pararia num item escondido. */
  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target || !projects.some((project) => `#p${project.id}` === window.location.hash)) return;
    setOpen(true);
    target.scrollIntoView();
  }, [projects]);

  if (!projects.length) return null;

  return (
    <section className="bg-surface text-ink">
      <div className={`${SHELL} px-6 py-12 md:px-8 lg:px-[60px]`}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="side-projects"
          /* mesmo desenho do "Especificações" da ficha: o rótulo no meio de uma divisória */
          className="relative flex w-full justify-center before:absolute before:inset-x-0 before:top-1/2 before:border-t before:border-ink/15 focus-visible:outline-none"
        >
          <span className="relative flex items-center gap-2.5 bg-surface px-4 py-1 text-[12.5px] text-ink/65 transition-colors [button:focus-visible>&]:outline [button:focus-visible>&]:outline-1 [button:focus-visible>&]:outline-offset-4 [button:focus-visible>&]:outline-current [button:hover>&]:text-ink">
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              strokeWidth={2.5}
              aria-hidden
            />
            {t("projects.more")} ({projects.length})
          </span>
        </button>

        <Collapse id="side-projects" open={open}>
          <ul className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
            {projects.map((project) => (
              <li key={project.id} id={`p${project.id}`} className="scroll-mt-16">
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-2 py-5 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current md:grid-cols-[200px_1fr_auto] md:items-baseline md:gap-8"
                >
                  <span className="text-[17px] tracking-tight">{project.title}</span>

                  <span className="flex flex-col gap-2">
                    <span className="max-w-[64ch] text-[14px] leading-relaxed text-ink/70">
                      {project.summary[language]}
                    </span>
                    <span className="text-[11.5px] text-ink/60">{project.tags.join(" · ")}</span>
                  </span>

                  <ArrowUpRight
                    className="hidden h-4 w-4 text-ink/60 transition-colors group-hover:text-accent md:block"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </Collapse>
      </div>
    </section>
  );
}
