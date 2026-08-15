"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { LogoMark, SHELL } from "@/components/capa/capa-page";
import { useLanguage } from "@/contexts/language-context";
import { useInView } from "@/hooks/use-in-view";
import type { Project } from "@/data/projects";

/** Hostname do link do projeto, ou "" se a URL não for válida.
    O dado é editado à mão em data/projects.ts — sem o try, um typo derruba a página inteira. */
function hostOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export interface ProjectDossierProps {
  project: Project;
  /** posição na lista: define o código exibido e de que lado a capa cai */
  index: number;
}

/** Ficha de dossiê: capa ocupando 35% da faixa e informação nos 65%, alternando de lado
    a cada projeto. A colocação é por col-start explícito, não por `order` — as duas colunas
    têm larguras diferentes, e `order` moveria o conteúdo sem mover a largura. */
export function ProjectDossier({ project, index }: ProjectDossierProps) {
  const { t, language } = useLanguage();
  const [logoFailed, setLogoFailed] = useState(false);
  const [ref, centered] = useInView<HTMLElement>();

  const pt = language === "pt";
  const host = hostOf(project.demo);
  const cover = project.mockups[0];
  const code = String(index + 1).padStart(2, "0");
  /* ímpares mostram informação à esquerda; pares invertem */
  const flipped = index % 2 === 1;
  /* a ficha toda é pintada por --ink/--paper: alternar as duas variáveis inverte o cartão.
     São canais RGB soltos porque o Tailwind 3 não aplica opacidade sobre var() de cor pronta. */
  const palette = flipped
    ? "[--ink:241_236_229] [--paper:16_16_16]"
    : "[--ink:16_16_16] [--paper:241_236_229]";

  return (
    /* o fundo sangra até a viewport, o conteúdo para no SHELL: é a divisão das barras do topo,
       aplicada à faixa do dossiê. Sem ela, ou a faixa vira bloco recortado ou o texto se
       estica sozinho em tela larga. */
    <article ref={ref} className={`border-t border-[rgb(var(--ink)/0.14)] bg-[rgb(var(--paper))] text-[rgb(var(--ink))] ${palette}`}>
      <div
        className={`${SHELL} group grid lg:min-h-[460px] ${flipped ? "lg:grid-cols-[35%_65%]" : "lg:grid-cols-[65%_35%]"}`}
      >
        <div
          className={`relative min-h-[320px] overflow-hidden lg:row-start-1 lg:min-h-0 ${flipped ? "lg:col-start-1" : "lg:col-start-2"}`}
        >
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              priority={index === 0}
              /* o mesmo realce do hover, disparado pela rolagem — só abaixo de lg, que é onde
                 não há ponteiro para produzir hover; acima disso quem manda é o cursor. */
              className={`object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:grayscale-0 ${centered ? "max-lg:scale-[1.03] max-lg:grayscale-0" : ""}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[repeating-linear-gradient(45deg,rgb(var(--ink)/0.05)_0_9px,transparent_9px_18px)] p-2 text-center font-jetbrains-mono text-[9px] uppercase tracking-[0.2em] text-[rgb(var(--ink)/0.4)]">
              {pt ? "capa pendente" : "cover pending"}
            </div>
          )}
        </div>

        <div
          className={`relative flex flex-col justify-center overflow-hidden px-6 py-11 md:px-8 lg:row-start-1 lg:px-[60px] lg:py-14 ${flipped ? "lg:col-start-2" : "lg:col-start-1"}`}
        >
          {/* número em contorno: textura de fundo, não informação — o código legível está no timbre */}
          <span
            className="pointer-events-none absolute -right-[0.04em] -top-[0.28em] font-makaio text-[210px] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgb(var(--ink)/0.13)]"
            aria-hidden
          >
            {code}
          </span>

          {/* timbre: marca do cliente quando o favicon existe, nosso monograma quando não */}
          <span className="relative mb-5 flex items-center gap-3">
            {host && !logoFailed ? (
              /* <img> em vez de next/image: ícone de 26px vindo da nossa própria rota,
                 não há o que otimizar e evita configurar remotePatterns. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/favicon?domain=${host}`}
                alt=""
                onError={() => setLogoFailed(true)}
                className="h-[26px] w-[26px] shrink-0 rounded-[3px] bg-white object-contain p-[3px]"
              />
            ) : (
              <span className="h-[22px] w-[22px] shrink-0">
                <LogoMark />
              </span>
            )}

            <span className="font-jetbrains-mono text-[9.5px] uppercase tracking-[0.22em] text-[rgb(var(--ink)/0.45)]">
              {pt ? "Projeto" : "Project"} {code}
              {host && ` · ${host}`}
            </span>
          </span>

          <h2 className="relative font-makaio text-[clamp(34px,4.4vw,52px)] font-black uppercase leading-none tracking-wider">
            {project.title}
          </h2>

          <p className="relative mt-4 max-w-[70ch] text-[13.5px] leading-[1.6] text-[rgb(var(--ink)/0.6)]">
            {project.description[language]}
          </p>

          <div className="relative mt-6 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border border-[rgb(var(--ink)/0.2)] px-2.5 py-[5px] font-jetbrains-mono text-[9.5px] uppercase tracking-[0.14em] text-[rgb(var(--ink)/0.7)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* a coluna maior é preenchida com dado real; o resto fica para a página de detalhe */}
          <dl className="relative mt-7 grid gap-4 border-t border-[rgb(var(--ink)/0.14)] pt-5 sm:grid-cols-[1.5fr_1fr_auto] sm:gap-x-8">
            <div>
              <dt className="font-jetbrains-mono text-[9px] uppercase tracking-[0.2em] text-[rgb(var(--ink)/0.35)]">{t("projects.architecture")}</dt>
              <dd className="mt-1.5 text-[12.5px] leading-snug text-[rgb(var(--ink)/0.7)]">{project.devInfo.architecture[language]}</dd>
            </div>

            <div>
              <dt className="font-jetbrains-mono text-[9px] uppercase tracking-[0.2em] text-[rgb(var(--ink)/0.35)]">{t("projects.deploy")}</dt>
              <dd className="mt-1.5 text-[12.5px] leading-snug text-[rgb(var(--ink)/0.7)]">{project.devInfo.deploy[language]}</dd>
            </div>

            <div>
              <dt className="font-jetbrains-mono text-[9px] uppercase tracking-[0.2em] text-[rgb(var(--ink)/0.35)]">Lighthouse</dt>
              <dd className="mt-1.5 whitespace-nowrap font-jetbrains-mono text-[12.5px] tracking-[0.12em] text-[#FF5500]">
                {project.lighthouse
                  ? `${project.lighthouse.performance}/${project.lighthouse.accessibility}/${project.lighthouse.bestPractices}`
                  : "—"}
              </dd>
            </div>
          </dl>

          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-7 inline-flex items-center gap-2.5 self-start bg-[#FF5500] px-6 py-3 font-jetbrains-mono text-[10px] uppercase tracking-[0.18em] text-white transition-[gap] hover:gap-[18px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            {t("projects.viewProject")}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
