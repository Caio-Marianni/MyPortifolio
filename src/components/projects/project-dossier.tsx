"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { LogoMark, SHELL } from "@/components/capa/capa-page";
import { ReviewPhoto } from "@/components/reviews/review-photo";
import { Stars } from "@/components/ui/brand-marks";
import { useLanguage } from "@/contexts/language-context";
import { useInView } from "@/hooks/use-in-view";
import type { Project } from "@/data/projects";
import type { Review } from "@/data/reviews";

/** Par rótulo/valor da ficha, repetido uma dúzia de vezes entre a frente e as especificações.
    O corpo não fixa tamanho: herda do <dl> que o envolve, que é o que deixa a frente do card
    respirar mais que a lista técnica sem duas classes de tamanho brigando no mesmo elemento. */
function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[12px] text-[rgb(var(--card-ink)/0.35)]">{label}</dt>
      <dd className="mt-1.5 leading-snug text-[rgb(var(--card-ink)/0.7)]">{children}</dd>
    </div>
  );
}

/** Lista de linhas curtas com travessão, usada nos resultados e nas funcionalidades. */
function DashList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item} className="before:mr-2 before:text-[rgb(var(--card-ink)/0.35)] before:content-['—']">
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

/* Fonte do título: a do corpo, como no resto do site. O corpo desceu junto com a troca —
   a Inter é larga onde a mono era estreita, e no mesmo px o título de projeto longo estourava
   a coluna. */
const TITLE_FONT = "text-[clamp(22px,2.6vw,32px)] tracking-tight";

export interface ProjectDossierProps {
  project: Project;
  /** posição na lista: define de que lado a capa cai */
  index: number;
  /** avaliação que o painel amarrou a este projeto; a maioria das fichas não tem uma */
  review?: Review;
}

/** Ficha de dossiê: capa ocupando 35% da faixa e informação nos 65%, alternando de lado
    a cada projeto. A colocação é por col-start explícito, não por `order` — as duas colunas
    têm larguras diferentes, e `order` moveria o conteúdo sem mover a largura. */
export function ProjectDossier({ project, index, review }: ProjectDossierProps) {
  const { t, language } = useLanguage();
  const [ref, centered] = useInView<HTMLElement>();
  const [specsOpen, setSpecsOpen] = useState(false);

  const specsId = `specs-${project.id}`;
  const pt = language === "pt";
  const cover = project.mockups[0];
  /* ímpares mostram informação à esquerda; pares invertem */
  const flipped = index % 2 === 1;
  /* A ficha toda é pintada por --card-ink/--card-paper. A ímpar é a página; a par troca as duas
     pelo par `card-flip`, que é quem sabe o que "alternar" significa em cada tema — inversão
     cheia no claro, degrau de superfície no escuro. O componente não decide isso: se a regra
     morasse aqui, o escuro só inverteria quais fichas ficam creme e a lista seguiria estourada.
     Nome próprio e não `--ink` global: redefinir `--ink` aqui apagaria a referência de que o
     outro lado precisa. */
  const palette = flipped
    ? "[--card-ink:var(--card-flip-ink)] [--card-paper:var(--card-flip-paper)]"
    : "[--card-ink:var(--ink)] [--card-paper:var(--surface)]";

  return (
    /* o fundo sangra até a viewport, o conteúdo para no SHELL: é a divisão das barras do topo,
       aplicada à faixa do dossiê. Sem ela, ou a faixa vira bloco recortado ou o texto se
       estica sozinho em tela larga.
       O `id` é o alvo do link que sai de cada avaliação; o `scroll-mt` desconta a navbar grudada
       no topo, senão o começo da ficha pararia embaixo dela. */
    <article
      ref={ref}
      id={`p${project.id}`}
      className={`scroll-mt-16 border-t border-[rgb(var(--card-ink)/0.14)] bg-[rgb(var(--card-paper))] text-[rgb(var(--card-ink))] ${palette}`}
    >
      <div
        /* piso de altura igual para todas as fichas: com as especificações fechadas o texto
           é que varia, e sem o mínimo cada card ficava de um tamanho */
        className={`${SHELL} group grid min-h-[560px] lg:min-h-[600px] ${flipped ?"lg:grid-cols-[35%_65%]" : "lg:grid-cols-[65%_35%]"}`}
      >
        <div
          className={`relative min-h-[320px] overflow-hidden lg:row-start-1 lg:min-h-0 ${flipped ?"lg:col-start-1" : "lg:col-start-2"}`}
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
              className={`object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:grayscale-0 ${centered ?"max-lg:scale-[1.03] max-lg:grayscale-0" : ""}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[repeating-linear-gradient(45deg,rgb(var(--card-ink)/0.05)_0_9px,transparent_9px_18px)] p-2 text-center text-[12px] text-[rgb(var(--card-ink)/0.4)]">
              {pt ? "capa pendente" : "cover pending"}
            </div>
          )}
        </div>

        <div
          className={`relative flex flex-col justify-center overflow-hidden px-6 py-11 md:px-8 lg:row-start-1 lg:px-[60px] lg:py-14 ${flipped ?"lg:col-start-2" : "lg:col-start-1"}`}
        >
          {/* A mesma marca de novo como textura de fundo, dessaturada e apagada — invertida sobre
              papel escuro, senão some. Quem manda é o papel, não o `flipped`: no tema escuro as
              duas fichas são escuras, então a ímpar também inverte. Medida em vw, e não no `em`
              do título, para não mudar de tamanho a cada troca de fonte lá em cima. */}
          <span
            className={`pointer-events-none absolute -left-[4%] top-[4%] h-[clamp(360px,44vw,580px)] w-[clamp(360px,44vw,580px)] opacity-[0.13] ${
              flipped ?"[filter:grayscale(1)_invert(1)]" : "[filter:grayscale(1)] dark:[filter:grayscale(1)_invert(1)]"
            }`}
            aria-hidden
          >
            <ProjectMark logo={project.logo} sizes="580px" />
          </span>

          {/* A marca abre a linha do título, aqui em cor cheia. Mede em `em` para acompanhar o
              corpo do h2 em qualquer largura; `shrink-0` porque quem cede espaço num título
              longo é o texto, não a logo. */}
          <h2 className={`relative flex items-center gap-[0.5em] leading-none ${TITLE_FONT}`}>
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
                  <span key={item} className="bg-[rgb(var(--card-ink)/0.07)] px-2.5 py-[5px] text-[11.5px] leading-none text-[rgb(var(--card-ink)/0.75)]">
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

          {/* A voz do cliente logo abaixo do que foi entregue, e só quando existe: é a mesma
              avaliação da página /reviews, amarrada a este projeto na hora de gerar o convite.
              Corta em cinco linhas porque a ficha tem altura mínima e um depoimento de 600
              caracteres empurraria as especificações pra fora do card. */}
          {review && (
            <figure className="relative mt-8 border-l-2 border-accent pl-5">
              {/* Quem falou vem antes do que foi dito, como no quadro de avaliações. Sem rótulo
                  em cima: a foto, o nome e as estrelas já dizem que ali embaixo é depoimento. */}
              <figcaption className="flex items-center gap-3">
                <ReviewPhoto review={review} className="h-9 w-9 bg-[rgb(var(--card-ink)/0.1)] text-[15px] text-[rgb(var(--card-ink)/0.55)]" />
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-[12.5px] leading-tight text-[rgb(var(--card-ink)/0.55)]">
                    {[review.name, review.company].filter(Boolean).join(" · ")}
                  </span>
                  <Stars count={review.rating} className="text-[11px] text-accent" />
                </span>
              </figcaption>

              <blockquote className="mt-3 line-clamp-5 text-[13.5px] leading-snug text-[rgb(var(--card-ink)/0.7)]">
                &ldquo;{review.comment}&rdquo;
              </blockquote>
            </figure>
          )}

          {/* Saiu do <details> nativo: o miolo que o navegador cria (::details-content) aceita
              um conjunto próprio de propriedades, e sem `display:grid` valendo ali a altura
              pulava em vez de crescer. Aqui quem anima é um elemento nosso, com o truque de
              linha de grid indo de 0fr a 1fr — a única forma de ir até a altura do conteúdo
              sem saber o número de antemão, e igual em qualquer navegador.
              O rótulo fica no meio da divisória: a linha é do ::before e o chip a corta. */}
          <div className="relative mt-8">
            <button
              type="button"
              onClick={() => setSpecsOpen((v) => !v)}
              aria-expanded={specsOpen}
              aria-controls={specsId}
              className="relative flex w-full justify-center before:absolute before:inset-x-0 before:top-1/2 before:border-t before:border-[rgb(var(--card-ink)/0.14)] focus-visible:outline-none"
            >
              {/* hover e foco pintam o chip, não a faixa inteira do botão */}
              <span className="relative flex items-center gap-2.5 bg-[rgb(var(--card-paper))] px-4 py-1 text-[12.5px] text-[rgb(var(--card-ink)/0.5)] transition-colors [button:focus-visible>&]:outline [button:focus-visible>&]:outline-1 [button:focus-visible>&]:outline-offset-4 [button:focus-visible>&]:outline-current [button:hover>&]:text-[rgb(var(--card-ink))]">
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-300 ${specsOpen ?"rotate-180" : ""}`}
                  strokeWidth={2.5}
                  aria-hidden
                />
                {t("projects.specs")}
              </span>
            </button>

            {/* `visibility` entra na transição de propósito: fechado, o conteúdo continua no
                DOM mas sai do alcance do leitor de tela, e a própria propriedade segura a
                troca até o fim da animação, sem precisar de timer. */}
            <div
              id={specsId}
              className={`grid transition-[grid-template-rows,opacity,visibility] duration-[420ms] ease-in-out motion-reduce:transition-none ${
                specsOpen ?"visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
              }`}
            >
              {/* o recorte mora no item do grid, não no container: é ele que precisa poder
                  encolher abaixo do próprio conteúdo, daí o `min-h-0` junto */}
              <div className="min-h-0 overflow-hidden">
                <dl className="grid gap-4 pt-6 text-[12.5px] sm:grid-cols-2 sm:gap-x-8">
                  <Field label={t("projects.technologies")} className="sm:col-span-2">
                    <span className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-[rgb(var(--card-ink)/0.2)] px-2.5 py-[5px] text-[12.5px]"
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
                    <span className="flex flex-wrap gap-x-3 gap-y-1 text-[12.5px]">
                      {project.devInfo.patterns.map((pattern) => (
                        <span key={pattern}>{pattern}</span>
                      ))}
                    </span>
                  </Field>

                  <Field label={t("projects.features")} className="sm:col-span-2">
                    <DashList items={project.features[language]} />
                  </Field>

                  <Field label="Lighthouse" className="sm:col-span-2">
                    <span className="whitespace-nowrap text-accent">
                      {project.lighthouse
                        ? `${project.lighthouse.performance}/${project.lighthouse.accessibility}/${project.lighthouse.bestPractices}`
                        : "—"}
                    </span>
                  </Field>
                </dl>
              </div>
            </div>
          </div>

          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-7 inline-flex items-center gap-2.5 self-start bg-accent px-6 py-3 text-[12.5px] text-white transition-[gap] hover:gap-[18px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            {t("projects.viewProject")}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
