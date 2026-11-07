"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { LogoMark } from "@/components/ui/brand-marks";
import { Quote, type QuoteReview } from "@/components/estilo-b/quote";
import { FOCUS } from "@/components/ui/styles";
import { projects, type Project } from "@/data/projects";

/* A coluna de projetos do Estilo B, no formato "híbrido": um projeto em destaque contado como
   estudo de caso (problema → solução → resultado, com a avaliação do cliente inteira) e os
   outros num índice compacto, com a avaliação recolhida atrás de um botão. */

export type ProjectReview = QuoteReview;
type Language = "pt" | "en";

/* ponytail: escolha à mão enquanto o Estilo B é proposta. Quando virar a home, o destaque e a
   ordem passam a morar em data/projects.ts. */
const FEATURED_ID = 4;
const INDEX_IDS = [1, 7, 5];
const byId = (id: number) => projects.find((p) => p.id === id);
const featured = byId(FEATURED_ID);
const indexed = INDEX_IDS.map(byId).filter((p) => p !== undefined);

const LABEL = "text-meta font-semibold uppercase tracking-[0.06em] text-ink/70";
const TERM = "font-mono text-[11px] uppercase tracking-[0.08em] text-ink/60";

/** a nota Lighthouse do card é a menor das três: "100" só quando as três são 100 */
const lighthouse = (project: Project) => (project.lighthouse ? Math.min(...Object.values(project.lighthouse)) : null);
const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function Cover({ project, sizes, className }: { project: Pick<Project, "cover">; sizes: string; className: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden bg-chrome ${className}`}>
      {project.cover ? (
        <Image
          src={project.cover}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />
      ) : (
        /* sem capa: o nosso monograma sobre a tarja, no lugar das listras de "pendente" */
        <span className="flex h-full items-center justify-center p-[22%]">
          <span className="aspect-square h-full">
            <LogoMark />
          </span>
        </span>
      )}
    </span>
  );
}

function Featured({ project, review, language }: { project: Project; review?: ProjectReview; language: Language }) {
  const pt = language === "pt";
  const score = lighthouse(project);
  const rows = [
    project.problem && { term: pt ? "Problema" : "Problem", text: project.problem[language] },
    project.solution && { term: pt ? "Solução" : "Solution", text: project.solution[language] },
    project.results && { term: pt ? "Resultado" : "Result", text: project.results[language][0], strong: true },
  ].filter((row) => row !== undefined);

  return (
    <article className="grid gap-5 pt-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:gap-8">
      <Link href={`/projects#p${project.id}`} className={`group block ${FOCUS}`} tabIndex={-1} aria-hidden>
        <Cover project={project} sizes="(min-width: 1280px) 420px, 100vw" className="aspect-[4/3] w-full xl:aspect-auto xl:h-[340px]" />
      </Link>

      <div className="flex flex-col gap-3.5">
        <p className="flex flex-wrap items-center gap-2.5 font-mono text-meta text-ink/60">
          {project.client && <span>{project.client[language]}</span>}
          {score !== null && (
            <span className="rounded-full border border-accent/50 px-2 py-0.5 text-[11px] leading-none text-accent">Lighthouse {score}</span>
          )}
        </p>
        <h3 className="text-[28px] font-bold leading-none tracking-[-0.01em] sm:text-[34px]">{project.title}</h3>

        {rows.length > 0 ? (
          <dl className="flex flex-col gap-2.5 text-[14px] leading-snug">
            {rows.map((row) => (
              <div key={row.term} className="flex flex-col gap-0.5 sm:grid sm:grid-cols-[82px_minmax(0,1fr)] sm:gap-2.5">
                <dt className={`${TERM} sm:pt-[3px]`}>{row.term}</dt>
                <dd className={"strong" in row ? "font-semibold text-accent" : ""}>{row.text}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-[14px] leading-snug text-ink/75">{project.summary[language]}</p>
        )}

        {review && <Quote review={review} language={language} withStars />}

        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-ink/25 px-5 text-ui font-bold transition-colors hover:border-ink hover:bg-ink hover:text-white ${FOCUS}`}
          >
            {pt ? "Ver o site" : "Visit site"}
            <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          </a>
          <Link href={`/projects#p${project.id}`} className="text-ui font-semibold hover:text-accent">
            {pt ? "Ficha completa →" : "Full case →"}
          </Link>
        </div>
      </div>
    </article>
  );
}

function IndexRow({ project, review, number, language }: { project: Project; review?: ProjectReview; number: number; language: Language }) {
  const [open, setOpen] = useState(false);
  const pt = language === "pt";
  const score = lighthouse(project);
  const meta = [project.client?.[language], score !== null && `Lighthouse ${score}`].filter(Boolean).join(" · ");

  return (
    <li className="border-b border-ink/15">
      <div className="group grid grid-cols-[84px_minmax(0,1fr)] items-center gap-3.5 py-3.5 sm:grid-cols-[32px_112px_minmax(0,1fr)_auto] sm:gap-5">
        <span className="hidden font-mono text-meta text-ink/60 sm:block">{String(number).padStart(2, "0")}</span>
        <Cover project={project} sizes="112px" className="h-[60px] w-[84px] sm:h-[70px] sm:w-[112px]" />
        <span className="flex min-w-0 flex-col gap-1">
          <Link href={`/projects#p${project.id}`} className="text-body font-semibold transition-colors hover:text-accent sm:text-[18px]">
            {project.title}
          </Link>
          <span className="line-clamp-2 text-meta leading-snug text-ink/70 sm:text-ui">{project.summary[language]}</span>
          {meta && <span className="font-mono text-[11px] text-ink/60 sm:hidden">{meta}</span>}
        </span>
        <span className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 pl-[98px] sm:col-span-1 sm:flex-col sm:items-end sm:gap-1.5 sm:pl-0">
          {meta && <span className="hidden font-mono text-[11px] text-ink/60 sm:block">{meta}</span>}
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-meta font-semibold hover:text-accent">
            {host(project.demo)} ↗
          </a>
          {review && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-ink/20 px-3 text-meta font-semibold transition-colors hover:border-ink ${FOCUS}`}
            >
              <span className="text-accent">★ {review.rating.toFixed(1)}</span>
              {pt ? "Avaliação" : "Review"}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2.5} aria-hidden />
            </button>
          )}
        </span>
      </div>
      {review && open && (
        <div className="pb-4 sm:pl-[52px]">
          <Quote review={review} language={language} />
        </div>
      )}
    </li>
  );
}

export function ProjectShowcase({ reviews, language }: { reviews: Record<number, ProjectReview>; language: Language }) {
  const pt = language === "pt";

  return (
    <section aria-labelledby="estilo-b-projetos" className="flex flex-col">
      <div className="flex flex-col gap-2 border-b border-ink/15 pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h2 id="estilo-b-projetos" className={LABEL}>
          {pt ? "Projetos selecionados" : "Selected projects"}
        </h2>
        <span className="flex flex-wrap gap-x-5 gap-y-1 text-ui font-semibold sm:justify-end">
          <Link href="/thumbnails" className="whitespace-nowrap text-ink/60 hover:text-accent">
            Thumbnails
          </Link>
          <Link href="/projects" className="whitespace-nowrap hover:text-accent">
            {pt ? "Todos os projetos (+20) →" : "All projects (20+) →"}
          </Link>
        </span>
      </div>

      {featured && <Featured project={featured} review={reviews[featured.id]} language={language} />}

      <h3 className={`${LABEL} mt-8`}>{pt ? "Mais projetos" : "More projects"}</h3>
      <ul>
        {indexed.map((project, i) => (
          <IndexRow key={project.id} project={project} review={reviews[project.id]} number={i + 2} language={language} />
        ))}
      </ul>
    </section>
  );
}
