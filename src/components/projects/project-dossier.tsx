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
import type { LighthouseScores, Project } from "@/data/projects";
import type { Review } from "@/data/reviews";

/** Par rótulo/valor da ficha. O rótulo manda: maior e quase cheio; o conteúdo vem abaixo,
    menor e mais apagado — é o rótulo que o olho usa para achar o que procura. */
function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[14px] font-medium text-[rgb(var(--card-ink)/0.9)]">{label}</dt>
      <dd className="mt-2 text-[12px] leading-relaxed text-[rgb(var(--card-ink)/0.6)]">{children}</dd>
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

/** Bloco que abre e fecha animando a altura — usado nas especificações e no depoimento.
    Saiu do <details> nativo: o miolo que o navegador cria (::details-content) aceita um
    conjunto próprio de propriedades, e sem `display:grid` valendo ali a altura pulava em vez
    de crescer. Aqui a linha de grid vai de 0fr a 1fr — a única forma de ir até a altura do
    conteúdo sem saber o número de antemão, e igual em qualquer navegador.
    `visibility` entra na transição de propósito: fechado, o conteúdo continua no DOM mas sai
    do alcance do leitor de tela, e a própria propriedade segura a troca até o fim da animação. */
function Collapse({ id, open, children }: { id: string; open: boolean; children: ReactNode }) {
  return (
    <div
      id={id}
      className={`grid transition-[grid-template-rows,opacity,visibility] duration-[420ms] ease-in-out motion-reduce:transition-none ${
        open ?"visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
      }`}
    >
      {/* o recorte mora no item do grid, não no container: é ele que precisa poder encolher
          abaixo do próprio conteúdo, daí o `min-h-0` junto */}
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

/** Rosca com a média das notas do Lighthouse, preenchida na proporção da nota. Mede em `em`
    para acompanhar o título; o círculo tem circunferência 100 (`pathLength`), então a nota
    já é o tamanho do traço. O detalhe das três notas fica no tooltip e no leitor de tela. */
function ScoreDonut({ scores }: { scores: LighthouseScores }) {
  const { performance, accessibility, bestPractices } = scores;
  const average = Math.round((performance + accessibility + bestPractices) / 3);
  const detail = `Lighthouse ${average} — performance ${performance}, accessibility ${accessibility}, best practices ${bestPractices}`;

  return (
    <svg viewBox="0 0 36 36" className="h-[1.3em] w-[1.3em] shrink-0" role="img" aria-label={detail}>
      <title>{detail}</title>
      <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" className="stroke-[rgb(var(--card-ink)/0.12)]" />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        strokeWidth="3"
        pathLength={100}
        strokeDasharray={`${average} 100`}
        transform="rotate(-90 18 18)"
        className="stroke-accent"
      />
      <text x="18" y="18" textAnchor="middle" dominantBaseline="central" className="fill-current text-[11px] font-medium">
        {average}
      </text>
    </svg>
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

/** Ficha de dossiê: capa e informação dividindo a faixa ao meio, alternando de lado a cada
    projeto. A foto é a prova do trabalho, por isso a metade inteira e em cor desde o início. */
export function ProjectDossier({ project, index, review }: ProjectDossierProps) {
  const { t, language } = useLanguage();
  const [ref, centered] = useInView<HTMLElement>();
  const [specsOpen, setSpecsOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const specsId = `specs-${project.id}`;
  const reviewId = `review-${project.id}`;
  const pt = language === "pt";
  const { cover } = project;
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
      className={`scroll-mt-16 lg:border-t lg:border-[rgb(var(--card-ink)/0.14)] bg-[rgb(var(--card-paper))] text-[rgb(var(--card-ink))] ${palette}`}
    >
      <div
        /* piso de altura igual para todas as fichas: com as especificações fechadas o texto
           é que varia, e sem o mínimo cada card ficava de um tamanho */
        className={`${SHELL} group grid min-h-[520px] lg:min-h-[560px] lg:grid-cols-2`}
      >
        {/* A capa leva ao mesmo lugar que "Ver projeto". Fora da ordem de tabulação e do leitor
            de tela: é um segundo link para o mesmo destino, e o botão já cumpre esse papel. */}
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden
          className={`relative block min-h-[320px] overflow-hidden lg:row-start-1 lg:min-h-0 ${flipped ?"lg:col-start-1" : "lg:col-start-2"}`}
        >
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority={index === 0}
              /* o zoom do hover, disparado pela rolagem abaixo de lg — onde não há ponteiro
                 para produzir hover; acima disso quem manda é o cursor */
              className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${centered ?"max-lg:scale-[1.03]" : ""}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[repeating-linear-gradient(45deg,rgb(var(--card-ink)/0.05)_0_9px,transparent_9px_18px)] p-2 text-center text-[12px] text-[rgb(var(--card-ink)/0.4)]">
              {pt ? "capa pendente" : "cover pending"}
            </div>
          )}
        </a>

        <div
          className={`relative flex flex-col justify-center overflow-hidden px-6 py-11 md:px-8 lg:row-start-1 lg:px-[60px] lg:py-14 ${flipped ?"lg:col-start-2" : "lg:col-start-1"}`}
        >
          {/* A mesma marca de novo como textura de fundo, dessaturada e apagada — invertida sobre
              papel escuro, senão some. Quem manda é o papel, não o `flipped`: no tema escuro as
              duas fichas são escuras, então a ímpar também inverte. Medida em vw, e não no `em`
              do título, para não mudar de tamanho a cada troca de fonte lá em cima. */}
          <span
            className={`pointer-events-none absolute -left-[4%] top-[4%] h-[clamp(360px,44vw,580px)] w-[clamp(360px,44vw,580px)] opacity-[0.06] ${
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

            {project.lighthouse && <ScoreDonut scores={project.lighthouse} />}
          </h2>

          {/* A frente fala com quem contrata, não com quem programa: uma frase com a dor e o que
              foi construído. Todo o vocabulário técnico mora em Especificações, logo abaixo. */}
          <p className="relative mt-5 max-w-[56ch] text-[15px] leading-relaxed text-[rgb(var(--card-ink)/0.8)]">
            {project.summary[language]}
          </p>

          {/* some inteiro quando o projeto não tem número que sustente — melhor ausente que
              fraco, e o card fecha sem buraco */}
          {project.results && (
            <dl className="relative mt-6">
              <Field label={t("projects.results")}>
                <DashList items={project.results[language]} />
              </Field>
            </dl>
          )}

          {/* O rótulo fica no meio da divisória: a linha é do ::before e o chip a corta. */}
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

            <Collapse id={specsId} open={specsOpen}>
                <dl className="grid gap-6 pt-6 sm:grid-cols-2 sm:gap-x-8">
                  <Field label={t("projects.technologies")} className="sm:col-span-2">
                    <span className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-[rgb(var(--card-ink)/0.2)] px-2.5 py-[5px] text-[11.5px] leading-none"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </Field>

                  <Field label={t("projects.architecture")}>{project.devInfo.architecture[language]}</Field>
                  <Field label={t("projects.security")}>{project.devInfo.security[language]}</Field>

                  <Field label={t("projects.features")} className="sm:col-span-2">
                    <DashList items={project.features[language]} />
                  </Field>
                </dl>
            </Collapse>
          </div>

          {/* O depoimento divide a linha com o botão, um em cada ponta: fechado é só quem falou
              e a nota, que já dizem que o projeto foi aprovado; o texto abre embaixo, para quem
              quiser ler. O botão fica sempre à direita (`ml-auto`), com ou sem depoimento. É a
              mesma avaliação da página /reviews, amarrada a este projeto no convite. */}
          <div className="relative mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            {review && (
              <button
                type="button"
                onClick={() => setReviewOpen((v) => !v)}
                aria-expanded={reviewOpen}
                aria-controls={reviewId}
                className="group/review flex items-center gap-3 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
              >
                <ReviewPhoto review={review} className="h-9 w-9 bg-[rgb(var(--card-ink)/0.1)] text-[15px] text-[rgb(var(--card-ink)/0.55)]" />
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-[12.5px] leading-tight text-[rgb(var(--card-ink)/0.55)] transition-colors group-hover/review:text-[rgb(var(--card-ink))]">
                    {[review.name, review.company].filter(Boolean).join(" · ")}
                  </span>
                  <Stars count={review.rating} className="text-[11px] text-accent" />
                </span>
                <ChevronDown
                  className={`h-3 w-3 shrink-0 text-[rgb(var(--card-ink)/0.5)] transition-transform duration-300 ${reviewOpen ?"rotate-180" : ""}`}
                  strokeWidth={2.5}
                  aria-hidden
                />
              </button>
            )}

            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-2.5 bg-accent px-6 py-3 text-[12.5px] text-white transition-[gap] hover:gap-[18px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              {t("projects.viewProject")}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            </a>
          </div>

          {review && (
            <Collapse id={reviewId} open={reviewOpen}>
              <blockquote className="mt-5 border-l-2 border-accent pl-5 text-[13.5px] leading-relaxed text-[rgb(var(--card-ink)/0.7)]">
                &ldquo;{review.comment}&rdquo;
              </blockquote>
            </Collapse>
          )}
        </div>
      </div>
    </article>
  );
}
