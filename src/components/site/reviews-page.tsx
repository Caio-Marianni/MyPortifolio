"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, PenLine, X } from "lucide-react";
import { RATING_FONT, Stars } from "@/components/ui/brand-marks";
import { CARD_TITLE, CONTACT_3D, FOCUS, ON_CHROME_FOCUS, rise, SHEET_COUNT, SHEET_HEADER, SHEET_TITLE, toggleKey } from "@/components/ui/styles";
import { ReviewPhoto, ReviewShots } from "@/components/reviews/review-photo";
import { Quote } from "@/components/site/quote";
import { MarkBackdrop, SheetFooter, Tarja, TarjaSheet } from "@/components/site/tarja";
import { ReviewForm } from "@/components/reviews/review-form";
import { useCountUp } from "@/hooks/use-count-up";
import { useKeyClick } from "@/hooks/use-key-click";
import { TRACKS, TRACK_LABEL, formatMonth, type Review, type ReviewSummary, type Track } from "@/data/reviews";
import { useLanguage } from "@/contexts/language-context";

/* As avaliações no site: a tarja deixa de ser a coluna da pessoa e vira o placar — média geral
   grande, as duas trilhas e o filtro —, e a folha branca fica inteira para o que foi dito.
   Abre com a avaliação que mais diz, em corpo grande, como o projeto em destaque da home. */

type Filter = Track | "all";


/* sempre há mais de uma avaliação publicada, então o rótulo é só o plural */
const reviewsWord = (pt: boolean) => (pt ? "avaliações" : "reviews");

/** o que o quadro precisa de cada projeto citado: nome e capa, resolvidos no servidor */
export type ReviewProject = {
  title: string;
  /** marca do cliente, pequena ao lado do nome da empresa no card */
  logo?: string;
  cover?: string;
  coverFocus?: string;
};

function ReviewCard({ review, project, tag }: { review: Review; project?: ReviewProject; tag?: string }) {
  const { language } = useLanguage();
  const pt = language === "pt";

  /* O trabalho elogiado, num rodapé de borda a borda (a prop `footer` do Quote, fora do padding):
     - texto à esquerda sobre preto sólido, sempre legível;
     - a capa nos 75% da direita, em cor e só levemente escurecida; a máscara dissolve no preto
       apenas na ponta esquerda, onde fica o texto;
     - recorte no `coverFocus` do projeto (logo, título do hero), aproximada 1.6x; o `sizes`
       já pede a imagem nesse tamanho, senão a ampliação borrava;
     - no hover a imagem clareia por inteiro. É o único movimento dela: sem zoom.
     Sem capa (projeto secundário), a hachura diagonal da tarja no lugar. */
  const footer = project && review.project !== null && (
    <Link
      href={`/#p${review.project}`}
      className={`group relative flex items-center gap-3 overflow-hidden bg-chrome px-4 py-5 text-chrome-ink ${FOCUS}`}
    >
      {project.cover ? (
        <span className="absolute inset-y-0 right-0 w-[75%] [mask-image:linear-gradient(to_left,black_70%,transparent)]" aria-hidden>
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="(min-width: 768px) 45vw, 112vw"
            /* valor que vem do dado do projeto: não dá para virar classe do Tailwind */
            style={{ objectPosition: project.coverFocus }}
            className="scale-[1.6] object-cover brightness-[0.85] transition-[filter] duration-500 group-hover:brightness-100 motion-reduce:transition-none"
          />
        </span>
      ) : (
        <span className="absolute inset-0 bg-[repeating-linear-gradient(-52deg,rgb(var(--chrome-ink)/0.06)_0_1px,transparent_1px_7px)]" aria-hidden />
      )}
      <span className="relative flex min-w-0 flex-1 flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-chrome-ink/60">{pt ? "Projeto" : "Project"}</span>
        <span className="truncate text-ui font-semibold">{project.title}</span>
      </span>
      <ArrowUpRight
        className="relative h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-px group-hover:text-accent"
        strokeWidth={2.5}
        aria-hidden
      />
    </Link>
  );

  return (
    <Quote
      review={review}
      language={language}
      withStars
      collapsible
      tag={tag}
      footer={footer}
      companyMark={project?.logo && <Image src={project.logo} alt="" width={14} height={14} className="h-3.5 w-3.5 shrink-0 object-contain" />}
      avatar={<ReviewPhoto review={review} className="h-12 w-12 bg-ink/[0.07] text-[18px] text-ink/60" />}
      /* Fio laranja na borda só quando o card leva a algum lugar: sem projeto, não há o que clicar.
         Pseudo-elemento por cima do card, não `border-l`: a borda ocupava 2px e o rodapé preto
         começava depois dela, deixando um fio creme no canto. */
      /* No hover o card sobe 2px e ganha sombra, em todos. Sobe por `top`, não por `transform`:
         transform passava o card para uma camada da GPU — o texto borrava durante a subida, e a
         capa do rodapé (que tem filtro, logo camada própria) subia fora de compasso com o resto.
         `top` num elemento `relative` não mexe no layout e repinta o card inteiro de uma vez.
         O fio laranja só quando leva a algum lugar: sem projeto, não há o que clicar. */
      className={`relative top-0 transition-[top,box-shadow] duration-200 hover:-top-0.5 hover:shadow-[0_14px_28px_-16px_rgb(0_0_0/0.45)] motion-reduce:hover:top-0 ${
        project
          ? "before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-0.5 before:bg-accent before:opacity-0 before:transition-opacity hover:before:opacity-100"
          : ""
      }`}
    >
      <ReviewShots review={review} label={pt ? "Foto do projeto" : "Project photo"} compact />
    </Quote>
  );
}

/* Avaliação só com a nota: sem texto não há o que ler, então vira uma linha baixa — rosto, nome,
   estrelas e o projeto, se tiver. Juntas no fim da lista, não espalhadas entre os depoimentos. */
function StarOnlyRow({ review, project, tag, className = "" }: { review: Review; project?: ReviewProject; tag?: string; className?: string }) {
  const { language } = useLanguage();
  const pt = language === "pt";

  return (
    <li className={`flex items-center gap-3 bg-paper px-3 py-2.5 ${className}`}>
      <ReviewPhoto review={review} className="h-8 w-8 bg-ink/[0.07] text-[13px] text-ink/60" />
      <span className="flex min-w-0 flex-1 flex-col">
        {/* estrelas na linha do nome, como nos cards com comentário */}
        <span className="flex items-center justify-between gap-3">
          <span className="truncate text-meta font-semibold text-ink">{review.name}</span>
          <Stars count={review.rating} className="shrink-0 text-[11px] text-accent" />
        </span>
        <span className="flex min-w-0 items-center gap-x-1.5 text-[11px] text-ink/65">
          {project && review.project !== null ? (
            <Link href={`/#p${review.project}`} className={`truncate hover:text-accent ${FOCUS}`}>
              {project.title} <span aria-hidden>↗</span>
            </Link>
          ) : (
            <span className="whitespace-nowrap">{formatMonth(review.month, language)}</span>
          )}
          {tag && <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-ink/65">· {tag}</span>}
        </span>
      </span>
    </li>
  );
}

export function ReviewsPage({
  reviews,
  summary,
  projects,
}: {
  reviews: Review[];
  summary: ReviewSummary;
  /** projetos citados, resolvidos no servidor — o porquê está em app/reviews/page.tsx */
  projects: Record<number, ReviewProject>;
}) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const [filter, setFilter] = useState<Filter>("all");

  const visible = filter === "all" ? reviews : reviews.filter((r) => r.track === filter);
  /* com foto anexada continua card: as miniaturas precisam do espaço */
  const starOnly = (r: Review) => !r.comment.trim() && !r.shots;
  const written = visible.filter((r) => !starOnly(r));
  const ratedOnly = visible.filter(starOnly);
  const projectOf = (r: Review) => (r.project !== null ? projects[r.project] : undefined);
  /* a etiqueta de trilha só diz algo quando as duas estão misturadas na lista */
  const tagOf = (r: Review) => (filter === "all" ? TRACK_LABEL[r.track] : undefined);
  /* filtro de alternar: apertar a trilha ligada solta e volta para todas */
  const keyClick = useKeyClick();
  const toggle = (track: Track) => {
    keyClick();
    setFilter((current) => (current === track ? "all" : track));
  };
  const score = useCountUp<HTMLSpanElement>(summary.overall.avg, 1);
  /* rostos de quem mandou foto, empilhados ao lado da contagem — no máximo quatro cabem na coluna */
  const faces = reviews.filter((r) => r.photo).slice(0, 4);
  /* o formulário aberto num <dialog> nativo: foco preso, Esc fecha e o fundo escurece sem código */
  const formDialog = useRef<HTMLDialogElement>(null);

  return (
    <main data-page="reviews" className="theme-light flex min-h-screen flex-col bg-chrome font-inter text-ink lg:flex-row">
      <Tarja homeHref="/" backdrop={<MarkBackdrop />}>
        <div className="mt-40 flex flex-col gap-6 lg:mt-auto">
          {/* A nota vem primeiro e preenche a largura: número à esquerda, estrelas encostando na
              borda direita. Tudo medido em `em` do mesmo corpo — "4.9" na Ricko tem ~1.02em, as
              cinco estrelas a 0.14em dão 0.84em, mais o vão mínimo de 0.06em (`gap`, para o número
              nunca encostar no "X avaliações") e a folga: ~2.01em no total. O corpo sai da
              largura útil (tela menos o px-5 dos dois lados) dividida por isso; no desktop a tarja
              tem 344px úteis, daí os 171px. `justify-between` absorve a sobra do arredondamento. */}
          {/* Do sm ao lg a tarja é o topo da página em largura cheia e o corpo bate no teto de 240px:
              esticar até a borda deixava um buraco entre número e estrelas. Lá tudo encosta à esquerda. */}
          <p className="flex items-end justify-between text-[min(calc((100vw-40px)/2.01),240px)] sm:justify-start sm:gap-[0.12em] lg:justify-between lg:gap-0 lg:text-[171px]">
            {/* conta de 0.0 até a nota ao abrir; as estrelas enchem junto */}
            <span ref={score} className={`${RATING_FONT} font-bold leading-[0.8] tracking-[-0.04em] tabular-nums`}>
              {summary.overall.avg.toFixed(1)}
            </span>
            <span className="flex flex-col items-start gap-[0.04em] pb-[0.03em]">
              <span className="ml-1 flex items-center gap-1.5 text-meta text-chrome-ink/55">
                <span className="flex -space-x-1.5" aria-hidden>
                  {faces.map((review) => (
                    <ReviewPhoto key={review.id} review={review} className="h-5 w-5 ring-2 ring-chrome" />
                  ))}
                </span>
                {summary.overall.count} {reviewsWord(pt)}
              </span>
              <Stars count={Math.round(summary.overall.avg)} shine reveal className="text-[0.14em] text-accent" />
            </span>
          </p>

          {/* título e filtro de trilha na mesma linha; a tecla ligada fica laranja e afundada */}
          <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-6 lg:justify-between lg:gap-3">
            {/* Na Ricko, a mesma fonte da nota logo acima, e na mesma linha das teclas, sempre.
                Medido no arquivo da fonte: "AVALIAÇÕES" ocupa 4.47em, e as duas teclas com o vão
                ~186px. O corpo é o que sobra da largura útil dividido por 4.47, com teto de 32px
                (os 344px úteis do desktop). */}
            <h1 className={`${RATING_FONT} whitespace-nowrap text-[min(32px,calc((100vw-40px-186px)/4.47))] font-bold uppercase leading-none lg:text-[32px]`}>
              {pt ? "Avaliações" : "Reviews"}
            </h1>
            <div role="group" aria-label={pt ? "Filtrar por trilha" : "Filter by track"} className="flex shrink-0 gap-2 pb-1">
              {TRACKS.map((track) => (
                <button
                  key={track}
                  type="button"
                  onClick={() => toggle(track)}
                  aria-pressed={filter === track}
                  title={`★ ${summary[track].avg.toFixed(1)} · ${summary[track].count} ${reviewsWord(pt)}`}
                  className={toggleKey(filter === track)}
                >
                  {TRACK_LABEL[track]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Tarja>

      {/* Quem já foi cliente e não recebeu convite avalia aqui mesmo, pelo formulário aberto: a
          avaliação entra pendente e só vai ao ar depois que você aprova no painel. É o fechamento da
          página, no rodapé escuro que a folha revela, como o "Tem um projeto em mente?" da home: quem
          leu até o fim é quem tem algo a dizer. Aqui o botão fica também no celular — é outro pedido,
          não o contato da barra presa no pé. */}
      <TarjaSheet
        footer={
          <SheetFooter
            id="avaliar"
            title={pt ? "Trabalhou comigo?" : "Worked with me?"}
            text={pt ? "Conta como foi. Leva um minuto, e entra aqui assim que eu conferir." : "Tell me how it went. Takes a minute, and it shows up here once I check it."}
          >
            <button type="button" onClick={() => formDialog.current?.showModal()} className={`${CONTACT_3D} ${ON_CHROME_FOCUS} mt-2`}>
              {pt ? "Deixar avaliação" : "Leave a review"}
              <PenLine className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
            </button>
            {/* quem já avaliou, ao pé do botão: o pedido chega com prova de que outros responderam */}
            {faces.length > 0 && (
              <span className="flex items-center gap-2 text-meta text-chrome-ink/55">
                <span className="flex -space-x-1.5" aria-hidden>
                  {faces.map((review) => (
                    <ReviewPhoto key={review.id} review={review} className="h-6 w-6 ring-2 ring-chrome" />
                  ))}
                </span>
                {pt ? `${summary.overall.count} clientes já avaliaram` : `${summary.overall.count} clients already did`}
              </span>
            )}
          </SheetFooter>
        }
      >
        <section aria-labelledby="avaliacoes" className="flex flex-col">
          <div className={SHEET_HEADER}>
            <h2 id="avaliacoes" className={SHEET_TITLE}>
              {pt ? "O que os clientes disseram" : "What clients said"}
            </h2>
            {/* o filtro troca a lista sem mexer no foco: é esta contagem que o leitor de tela anuncia */}
            <span className={SHEET_COUNT} aria-live="polite">
              {filter !== "all" && `${TRACK_LABEL[filter]} · `}
              {visible.length} {reviewsWord(pt)}
            </span>
          </div>

          {/* `key={filter}`: trocar o filtro remonta a lista, e a animação de entrada roda de novo
              em cascata — os cards da trilha escolhida sobem um por um. */}
          <div key={filter}>
            {/* Colunas de CSS, não grade: comentário longo ao lado de um curto deixava buraco na
              linha. Aqui cada card ocupa só a altura que tem, e todos têm o mesmo peso. */}
            <div className="gap-4 pt-6 md:columns-2">
              {written.map((review, i) => (
                <div key={review.id} className={`mb-4 break-inside-avoid ${rise(i)}`}>
                  <ReviewCard review={review} project={projectOf(review)} tag={tagOf(review)} />
                </div>
              ))}
            </div>

            {/* nem toda trilha tem avaliação só com nota: sem nenhuma, o título também não aparece */}
            {ratedOnly.length > 0 && (
              <>
                <h3 className={`${CARD_TITLE} mb-3 mt-6`}>{pt ? "Também avaliaram" : "Also rated"}</h3>
                {/* colunas pela largura de cada linha (mín. 260px), não por breakpoint: em 3 colunas fixas
                    a linha ficava estreita demais e o mês quebrava em dois */}
                <ul className="grid gap-2 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                  {ratedOnly.map((review, i) => (
                    <StarOnlyRow key={review.id} review={review} project={projectOf(review)} tag={tagOf(review)} className={rise(written.length + i)} />
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Clique no fundo fecha: o próprio <dialog> é o alvo só quando o clique cai fora do painel.
              `m-auto` devolve a centralização do navegador, que o reset do Tailwind zera.
              Ao abrir, sobe com fade (o mesmo `rise` das listas) e o fundo escurece junto. Fechar é
              instantâneo: animar a saída de um <dialog> pede @starting-style, que nem todo navegador tem. */}
          <dialog
            ref={formDialog}
            aria-label={pt ? "Deixar avaliação" : "Leave a review"}
            onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
            className="m-auto max-h-[92dvh] w-[calc(100%-24px)] max-w-[600px] overflow-y-auto rounded-2xl bg-white p-0 text-ink shadow-[0_24px_60px_-12px_rgb(0_0_0/0.5)] backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-rise open:backdrop:animate-fade-in motion-reduce:open:animate-none motion-reduce:open:backdrop:animate-none"
          >
            <div className="flex flex-col gap-5 p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h2 className={`${RATING_FONT} text-[28px] font-bold uppercase leading-none`}>{pt ? "Sua avaliação" : "Your review"}</h2>
                <button
                  type="button"
                  onClick={() => formDialog.current?.close()}
                  aria-label={pt ? "Fechar" : "Close"}
                  className={`-mr-2 -mt-2 flex h-10 w-10 items-center justify-center rounded-lg text-ink/60 transition-colors hover:bg-ink/[0.06] hover:text-ink ${FOCUS}`}
                >
                  <X className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                </button>
              </div>
              <ReviewForm name="" company="" track="web" project={null} projectTitle={null} />
            </div>
          </dialog>
        </section>
      </TarjaSheet>
    </main>
  );
}
