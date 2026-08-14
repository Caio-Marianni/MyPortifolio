"use client";

import { CapaPage } from "@/components/capa/capa-page";
import { useLanguage } from "@/contexts/language-context";
import { projects } from "@/data/projects";

export default function CapaProjectsPage() {
  const { t, language } = useLanguage();
  const pt = language === "pt";

  return (
    <CapaPage
      wordmark={t("status.projects")}
      script="Web"
      descriptor={t("lobby.web.line")}
      stats={[`${projects.length} ${pt ? "publicados" : "published"}`, t("lobby.web.stat")]}
    >
      {/* Fio de 1px entre as células: gap-px sobre fundo escuro, sem borda por card. */}
      <div className="grid gap-px border border-[#101010]/15 bg-[#101010]/15 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          /* ponytail: célula neutra de propósito — cada projeto ganha tratamento próprio depois.
             O que vale aqui é a grade e a hierarquia; a arte de cada um entra por cima. */
          <article key={project.id} className="flex min-h-[15rem] flex-col bg-[#F1ECE5] p-6 md:p-7">
            <span className="font-jetbrains-mono text-[10px] tracking-[0.18em] text-[#101010]/40">
              {String(i + 1).padStart(2, "0")}
            </span>

            <h2 className="mt-4 font-makaio text-[26px] font-black uppercase tracking-wider md:text-[30px]">
              {project.title}
            </h2>

            <p className="mt-3 text-[13px] leading-[1.5] text-[#101010]/60">{project.description[language]}</p>

            <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-6 font-jetbrains-mono text-[10px] uppercase tracking-[0.14em] text-[#101010]/45">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </CapaPage>
  );
}
