"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, Gauge, Plus, Star } from "lucide-react";
import { DeviceShowcase } from "@/components/site/device-showcase";
import { FeaturedQuote } from "@/components/site/featured-quote";
import { LogoMark, RATING_FONT } from "@/components/ui/brand-marks";
import { CARD_TITLE, CV_3D, FOCUS, rise, SHEET_COUNT, SHEET_HEADER, SHEET_TITLE } from "@/components/ui/styles";
import { HOME_FEATURED, HOME_INDEX, projects, screens, sideProjects, type Project } from "@/data/projects";
import type { Review } from "@/data/reviews";
import { useProjectVideo } from "@/hooks/use-project-video";

/* A coluna de projetos do site, no formato "híbrido": os projetos em destaque com o site nas
   molduras, uma frase e a avaliação do cliente inteira, e os outros num índice compacto, com a
   avaliação recolhida atrás de um botão. */

type Language = "pt" | "en";

/* a escolha e a ordem moram em data/projects.ts (HOME_FEATURED, HOME_INDEX) */
const byId = (id: number) => projects.find((p) => p.id === id);
const featured = HOME_FEATURED.map(byId).filter((p) => p !== undefined);
const indexed = HOME_INDEX.map(byId).filter((p) => p !== undefined);
/* Quantos secundários cada "Ver mais" carrega. Vão para o fim do índice, na mesma linha dos
   outros, com o monograma no lugar da capa. */
const PAGE = 6;
/* número declarado, não contado, como o das thumbnails: a home só mostra parte do que já foi feito */
const MADE = 20;

/** O que uma linha do índice usa: o projeto principal inteiro ou o secundário, que não tem capa nem nota. */
type IndexProject = Pick<Project, "id" | "title" | "summary" | "demo"> & Partial<Pick<Project, "cover" | "tile" | "lighthouse">>;

/* Entrada pela rolagem, sem JavaScript (`animation-timeline: view()`). Só longhands: o atalho
   `animation` zeraria o timeline. Onde não há suporte (Firefox) a duração fica em 0s e o card já
   aparece no lugar. Fica fora do primeiro destaque: ele sobe com a intro, e na dobra do celular
   ficava a meio caminho (meio transparente) — o Lighthouse lia isso como contraste baixo. */
const SCROLL_RISE =
  "[animation-fill-mode:both] [animation-name:rise] [animation-range:entry_10%_cover_30%] [animation-timeline:view()] [animation-timing-function:ease-out] motion-reduce:[animation-name:none]";

/** a nota Lighthouse do card é a menor das três: "100" só quando as três são 100 */
const lighthouse = (project: IndexProject) => (project.lighthouse ? Math.min(...Object.values(project.lighthouse)) : null);
/** as três notas no tooltip: o número do card é só a menor delas */
const lighthouseDetail = ({ lighthouse: l }: IndexProject) =>
  l ? `Lighthouse — performance ${l.performance}, accessibility ${l.accessibility}, best practices ${l.bestPractices}` : undefined;
const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function Cover({ src, sizes, className }: { src?: string; sizes: string; className: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden bg-chrome ${className}`}>
      {src ? (
        <Image
          src={src}
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

/** As insígnias ao lado do título, iguais no destaque e no índice — só o corpo muda, por
    `className`. Subordinadas ao título por tamanho e cor: número apagado e só os ícones em cor.
    Sem Lighthouse nem avaliação, não renderiza nada. */
function Badges({ project, review, language, className }: { project: IndexProject; review?: Review; language: Language; className: string }) {
  const score = lighthouse(project);
  if (score === null && !review) return null;

  return (
    <span className={`flex items-center gap-[0.75em] text-ink/65 tabular-nums ${className}`}>
      {score !== null && (
        /* o verde é o do próprio Lighthouse para nota boa: lê como "medido", não como enfeite */
        <span className="flex items-center gap-1" title={lighthouseDetail(project)}>
          {score}
          <Gauge className="h-[0.8em] w-[0.8em] text-[#0CCE6B]" strokeWidth={2.75} aria-hidden />
          <span className="sr-only"> Lighthouse</span>
        </span>
      )}
      {review && (
        <span className="flex items-center gap-1">
          {review.rating.toFixed(1)}
          {/* SVG e não o caractere ★: o glifo segue a linha de base da fonte e sobrava para
              baixo do número; o ícone centra pela caixa, igual ao do Lighthouse */}
          <Star className="h-[0.8em] w-[0.8em] fill-current text-accent" strokeWidth={0} aria-hidden />
          <span className="sr-only">{language === "pt" ? " de 5 na avaliação do cliente" : " out of 5 in the client's review"}</span>
        </span>
      )}
    </span>
  );
}

function Featured({ project, review, language, first }: { project: Project; review?: Review; language: Language; first: boolean }) {
  const pt = language === "pt";
  const screen = screens(project);
  /* o card inteiro comanda o vídeo: hover com mouse, meio da tela no celular */
  const { cardRef, videoRef, visible, cardEvents, videoEvents } = useProjectVideo();

  return (
    /* Site sempre à esquerda, de propósito: é uma lista para comparar, então título e botões
       ficam no mesmo lugar em todos e o olho desce reto. O zigue-zague foi testado e saiu.
       Duas colunas iguais no tablet (folha inteira) e de novo no xl; no lg a tarja come a largura e
       a folha fica estreita demais, então empilha. No xl o mockup é metade da folha (menos meio
       vão) até travar em 580px; dali em diante a folha esticada só alarga a coluna do texto. */
    /* Sobe ao entrar na tela, pela rolagem e sem JavaScript (`animation-timeline: view()`). Só
       longhands: o atalho `animation` zeraria o timeline. Onde não há suporte (Firefox) a duração
       fica em 0s e o card já aparece no lugar. O que já está na tela ao abrir chega pronto. */
    /* `id`: as avaliações apontam para /#p<id>, e o navegador desce até o projeto */
    <article
      ref={cardRef}
      id={`p${project.id}`}
      {...cardEvents}
      className={`grid scroll-mt-6 gap-6 pt-6 ${first ? "" : SCROLL_RISE} md:grid-cols-2 md:gap-8 lg:grid-cols-1 lg:gap-6 xl:grid-cols-[minmax(0,min(calc(50%_-_16px),580px))_minmax(0,1fr)] xl:gap-8`}
    >
      {/* a moldura também abre o site; fora do Tab porque o "Ver o site" logo abaixo já é o mesmo link */}
      <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`group block self-start ${FOCUS}`} tabIndex={-1} aria-hidden>
        {screen ? (
          <DeviceShowcase
            desktop={screen.desktop}
            mobile={screen.mobile}
            video={project.video}
            videoRef={videoRef}
            videoVisible={visible}
            videoEvents={videoEvents}
          />
        ) : (
          <Cover src={project.cover} sizes="(min-width: 1280px) 580px, (min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full" />
        )}
      </a>

      <div className="flex flex-col gap-3.5">
        {/* O título sozinho, e ao lado só o que é número: o Lighthouse e a nota de quem contratou,
            os dois no mesmo formato, número e ícone depois. Tipo de cliente e ficha técnica ficam
            de fora: quem contrata decide pelo site e pela avaliação.
            Nome e notas na fonte do placar da página de avaliações (Ricko), no peso natural dela:
            ela tem um peso só, e `font-bold` virava negrito sintetizado pelo navegador. */}
        <h3 className={`${RATING_FONT} flex flex-wrap items-baseline gap-x-3 gap-y-1.5 text-[34px] font-normal leading-none sm:text-[40px]`}>
          {project.title}
          <Badges project={project} review={review} language={language} className="text-[22px]" />
        </h3>

        {/* teto de ~65 caracteres: na tela de 2560 a coluna de texto passa de 1300px */}
        <p className="max-w-[65ch] text-body leading-snug text-ink/85">{project.summary[language]}</p>

        {review && <FeaturedQuote review={review} projectTitle={project.title} language={language} />}

        {/* uma ação só, abrir o site. A tecla do CV, com a sombra do chão mais curta (a dela foi feita para a tarja preta) e um
            fio de borda: creme sobre o branco da folha precisa de um contorno para não se perder. */}
        <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`${CV_3D} ${FOCUS} mt-2 self-start border border-ink/15 [--drop:0_12px_16px_-6px_rgb(0_0_0/0.32)]`}>
          {pt ? "Ver o site" : "Visit site"}
          <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
        </a>
      </div>
    </article>
  );
}

/* Mesma linguagem do destaque em escala menor: título em Ricko com as insígnias ao lado, sem
   numeração, rótulo de tipo de cliente nem etiqueta de "em desenvolvimento". A nota já está ao
   lado do título, então a avaliação abre por um link de texto, no mesmo card dos destaques. */
function IndexRow({ project, review, language, className = "" }: { project: IndexProject; review?: Review; language: Language; className?: string }) {
  const [open, setOpen] = useState(false);
  const pt = language === "pt";

  return (
    <li id={`p${project.id}`} className={`scroll-mt-6 border-b border-ink/15 ${className}`}>
      <div className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-3.5 py-3.5 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:gap-5">
        {/* na linha pequena um mockup vira mancha: vai a logo sobre a cor do projeto */}
        <Cover src={project.tile ?? project.cover} sizes="112px" className="h-[60px] w-[84px] sm:h-[70px] sm:w-[112px]" />
        <span className="flex min-w-0 flex-col gap-1.5">
          <span className={`${RATING_FONT} flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[22px] leading-none`}>
            {project.title}
            <Badges project={project} review={review} language={language} className="text-[16px]" />
          </span>
          <span className="line-clamp-2 text-meta leading-snug text-ink/70 sm:text-ui">{project.summary[language]}</span>
        </span>
        <span className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 pl-[98px] sm:col-span-1 sm:flex-col sm:items-end sm:gap-1.5 sm:pl-0">
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="py-1 -my-1 text-meta font-semibold hover:text-accent">
            {host(project.demo)} ↗
          </a>
          {review && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={`py-1 -my-1 inline-flex items-center gap-1 text-meta font-semibold text-ink/70 transition-colors hover:text-ink ${FOCUS}`}
            >
              {open ? (pt ? "Fechar avaliação" : "Hide review") : pt ? "Ler avaliação" : "Read review"}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2.5} aria-hidden />
            </button>
          )}
        </span>
      </div>
      {review && (
        /* Abre deslizando: a linha da grade vai de 0fr a 1fr, então a altura anima até a do conteúdo
           sem medir nada em JS. Fechada, a citação continua no DOM, mas `inert` a tira do Tab e do
           leitor de tela. Alinhada ao texto da linha, não à logo. */
        <div
          inert={!open}
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <div className="pb-5 sm:pl-[132px]">
              <FeaturedQuote review={review} projectTitle={project.title} language={language} />
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

export function ProjectShowcase({ reviews, language }: { reviews: Record<number, Review>; language: Language }) {
  const pt = language === "pt";
  const [shown, setShown] = useState(0);
  const [target, setTarget] = useState<string | null>(null);

  /* As avaliações linkam /#p<id>. Se o id é de um secundário, carrega até ele e desce — sem isso o
     navegador pararia num item que ainda não existe na página. */
  useEffect(() => {
    const at = sideProjects.findIndex((p) => `#p${p.id}` === window.location.hash);
    if (at < 0) return;
    setShown(Math.ceil((at + 1) / PAGE) * PAGE);
    setTarget(window.location.hash.slice(1));
  }, []);
  useEffect(() => {
    if (target) document.getElementById(target)?.scrollIntoView();
  }, [target]);

  return (
    <section aria-labelledby="projetos" className="flex w-full flex-col">
      <div className={SHEET_HEADER}>
        <h2 id="projetos" className={SHEET_TITLE}>
          {pt ? "Projetos selecionados" : "Selected projects"}
        </h2>
        <span className={SHEET_COUNT}>{pt ? `+${MADE} projetos feitos` : `${MADE}+ projects made`}</span>
      </div>

      {/* fio entre os destaques: sem ele o segundo parece continuação do primeiro */}
      <div className="flex flex-col gap-6 divide-y divide-ink/15">
        {featured.map((project, i) => (
          <Featured key={project.id} project={project} review={reviews[project.id]} language={language} first={i === 0} />
        ))}
      </div>

      <h3 className={`${CARD_TITLE} mt-8`}>{pt ? "Mais projetos" : "More projects"}</h3>
      <ul>
        {indexed.map((project) => (
          <IndexRow key={project.id} project={project} review={reviews[project.id]} language={language} />
        ))}
        {/* os que chegam pelo "Ver mais" sobem em cascata, cada um um pouco depois do anterior */}
        {sideProjects.slice(0, shown).map((project, i) => (
          <IndexRow
            key={project.id}
            project={project}
            review={reviews[project.id]}
            language={language}
            className={rise(i % PAGE)}
          />
        ))}
      </ul>
      {/* quem chegou ao fim da lista é quem mais quer ver o resto: carrega aqui mesmo, sem trocar de página */}
      {shown < sideProjects.length && (
        <button
          type="button"
          onClick={() => setShown((n) => n + PAGE)}
          className={`group mt-5 inline-flex items-center gap-1.5 self-start py-1 text-ui font-semibold hover:text-accent ${FOCUS}`}
        >
          <Plus className="h-4 w-4 text-accent transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none" strokeWidth={2.75} aria-hidden />
          {pt ? "Ver mais projetos" : "See more projects"}
        </button>
      )}
    </section>
  );
}
