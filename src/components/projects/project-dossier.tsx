"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { LogoMark, SHELL } from "@/components/capa/capa-page";
import { useLanguage } from "@/contexts/language-context";
import { useInView } from "@/hooks/use-in-view";
import type { Project } from "@/data/projects";

/** Par rótulo/valor da ficha, repetido uma dúzia de vezes entre a frente e as especificações.
    O corpo não fixa tamanho: herda do <dl> que o envolve, que é o que deixa a frente do card
    respirar mais que a lista técnica sem duas classes de tamanho brigando no mesmo elemento. */
function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[rgb(var(--ink)/0.35)]">{label}</dt>
      <dd className="mt-1.5 leading-snug text-[rgb(var(--ink)/0.7)]">{children}</dd>
    </div>
  );
}

/** Lista de linhas curtas com travessão, usada nos resultados e nas funcionalidades. */
function DashList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item} className="before:mr-2 before:text-[rgb(var(--ink)/0.35)] before:content-['—']">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Marca do cliente, ou o nosso monograma quando o projeto não tem arquivo. Aparece duas
    vezes na ficha — na linha do título e de textura no fundo —, e a única diferença entre as
    duas é o tamanho pedido ao otimizador; o pai é quem manda na medida final. */
function ProjectMark({ logo, sizes }: { logo?: string; sizes: string }) {
  if (!logo) return <LogoMark />;
  return <Image src={logo} alt="" fill sizes={sizes} className="object-contain" />;
}

/* Fonte do título: descomente uma linha e comente a de cima para testar. O tamanho anda
   junto da família porque a Makaio é condensada e a Inter, larga — no mesmo px uma sobra e
   a outra estoura a coluna. */
const TITLE_FONT = "font-mono text-[clamp(24px,2.9vw,36px)] tracking-tight"; /* mono do sistema */

export interface ProjectDossierProps {
  project: Project;
  /** posição na lista: define de que lado a capa cai */
  index: number;
}

/** Ficha de dossiê: capa ocupando 35% da faixa e informação nos 65%, alternando de lado
    a cada projeto. A colocação é por col-start explícito, não por `order` — as duas colunas
    têm larguras diferentes, e `order` moveria o conteúdo sem mover a largura. */
export function ProjectDossier({ project, index }: ProjectDossierProps) {
  const { t, language } = useLanguage();
  const [ref, centered] = useInView<HTMLElement>();

  const pt = language === "pt";
  const cover = project.mockups[0];
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
        /* piso de altura igual para todas as fichas: com as especificações fechadas o texto
           é que varia, e sem o mínimo cada card ficava de um tamanho */
        className={`${SHELL} group grid min-h-[560px] lg:min-h-[600px] ${flipped ? "lg:grid-cols-[35%_65%]" : "lg:grid-cols-[65%_35%]"}`}
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
            <div className="flex h-full items-center justify-center bg-[repeating-linear-gradient(45deg,rgb(var(--ink)/0.05)_0_9px,transparent_9px_18px)] p-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[rgb(var(--ink)/0.4)]">
              {pt ? "capa pendente" : "cover pending"}
            </div>
          )}
        </div>

        <div
          className={`relative flex flex-col justify-center overflow-hidden px-6 py-11 md:px-8 lg:row-start-1 lg:px-[60px] lg:py-14 ${flipped ? "lg:col-start-2" : "lg:col-start-1"}`}
        >
          {/* A mesma marca de novo como textura de fundo, dessaturada e apagada — invertida no
              cartão preto senão some. Medida em vw, e não no `em` do título, para não mudar de
              tamanho a cada troca de fonte lá em cima. */}
          <span
            className={`pointer-events-none absolute -left-[4%] top-[4%] h-[clamp(360px,44vw,580px)] w-[clamp(360px,44vw,580px)] opacity-[0.13] ${flipped ? "[filter:grayscale(1)_invert(1)]" : "[filter:grayscale(1)]"}`}
            aria-hidden
          >
            <ProjectMark logo={project.logo} sizes="580px" />
          </span>

          {/* A marca abre a linha do título, aqui em cor cheia. Mede em `em` para acompanhar o
              corpo do h2 em qualquer largura; `shrink-0` porque quem cede espaço num título
              longo é o texto, não a logo. */}
          <h2 className={`relative flex items-center gap-[0.5em] uppercase leading-none tracking-wider ${TITLE_FONT}`}>
            <span className="relative h-[1.15em] w-[1.15em] shrink-0" aria-hidden>
              <ProjectMark logo={project.logo} sizes="60px" />
            </span>

            {project.title}
          </h2>

          {/* A frente fala com quem contrata, não com quem programa: qual era a dor, o que foi
              construído e o que o cliente recebeu, em palavras de leigo. Todo o vocabulário
              técnico mora em Especificações, logo abaixo. */}
          <dl className="relative mt-6 grid gap-5 text-[13.5px] sm:grid-cols-2 sm:gap-x-8">
            <Field label={t("projects.problem")}>{project.problem[language]}</Field>
            <Field label={t("projects.solution")}>{project.solution[language]}</Field>

            <Field label={t("projects.delivers")} className="sm:col-span-2">
              {/* chip cheio, sem o mono em caixa alta das tags: é o mesmo dado que o público
                  leigo lê, então não pode soar como especificação de máquina */}
              <span className="flex flex-wrap gap-1.5">
                {project.delivers[language].map((item) => (
                  <span key={item} className="bg-[rgb(var(--ink)/0.07)] px-2.5 py-[5px] text-[11.5px] leading-none text-[rgb(var(--ink)/0.75)]">
                    {item}
                  </span>
                ))}
              </span>
            </Field>

            {/* some inteiro quando o projeto não tem número que sustente — melhor ausente
                que fraco, e o card fecha sem buraco */}
            {project.results && (
              <Field label={t("projects.results")} className="sm:col-span-2">
                <DashList items={project.results[language]} />
              </Field>
            )}
          </dl>

          {/* Todo o dado técnico entra num <details> nativo: abre e fecha sem estado nem
              listener, e já vem com teclado e leitor de tela resolvidos. O rótulo fica no meio
              da divisória — a linha é desenhada pelo ::before e o fundo do chip a corta. */}
          <details className="group relative mt-8">
            <summary className="relative flex cursor-pointer list-none justify-center before:absolute before:inset-x-0 before:top-1/2 before:border-t before:border-[rgb(var(--ink)/0.14)] focus-visible:outline-none [&::-webkit-details-marker]:hidden">
              {/* hover e foco pintam o chip, não a faixa inteira do summary — daí os
                  seletores de pai em vez de `group-`, que pegaria o conteúdo aberto junto */}
              <span className="relative flex items-center gap-2.5 bg-[rgb(var(--paper))] px-4 py-1 font-mono text-[9.5px] uppercase tracking-[0.2em] text-[rgb(var(--ink)/0.5)] transition-colors [summary:focus-visible>&]:outline [summary:focus-visible>&]:outline-1 [summary:focus-visible>&]:outline-offset-4 [summary:focus-visible>&]:outline-current [summary:hover>&]:text-[rgb(var(--ink))]">
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-open:rotate-180" strokeWidth={2.5} aria-hidden />
                {t("projects.specs")}
              </span>
            </summary>

            <dl className="grid gap-4 pt-6 text-[12.5px] sm:grid-cols-2 sm:gap-x-8">
              <Field label={t("projects.technologies")} className="sm:col-span-2">
                <span className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[rgb(var(--ink)/0.2)] px-2.5 py-[5px] font-mono text-[9.5px] uppercase tracking-[0.14em]"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </Field>

              <Field label={t("projects.architecture")}>{project.devInfo.architecture[language]}</Field>
              <Field label={t("projects.deploy")}>{project.devInfo.deploy[language]}</Field>
              <Field label={t("projects.security")}>{project.devInfo.security[language]}</Field>

              <Field label={t("projects.patterns")}>
                <span className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.1em]">
                  {project.devInfo.patterns.map((pattern) => (
                    <span key={pattern}>{pattern}</span>
                  ))}
                </span>
              </Field>

              <Field label={t("projects.features")} className="sm:col-span-2">
                <DashList items={project.features[language]} />
              </Field>

              <Field label="Lighthouse" className="sm:col-span-2">
                <span className="whitespace-nowrap font-mono tracking-[0.12em] text-[#FF5500]">
                  {project.lighthouse
                    ? `${project.lighthouse.performance}/${project.lighthouse.accessibility}/${project.lighthouse.bestPractices}`
                    : "—"}
                </span>
              </Field>
            </dl>
          </details>

          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-7 inline-flex items-center gap-2.5 self-start bg-[#FF5500] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition-[gap] hover:gap-[18px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            {t("projects.viewProject")}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
