"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { RATING_FONT, Stars } from "@/components/ui/brand-marks";
import { CAROUSEL_ARROW, CONTACT_3D, FOCUS, ON_CHROME_FOCUS, ON_CHROME_LINK, SHEET_COUNT, SHEET_HEADER, SHEET_TITLE, toggleKey } from "@/components/ui/styles";
import { MarkBackdrop, SheetFooter, Tarja, TarjaSheet, WhatsAppIcon } from "@/components/site/tarja";
import { useLanguage } from "@/contexts/language-context";
import { useRating } from "@/contexts/reviews-context";
import { NICHES, thumbLoader, thumbnails, type Thumbnail } from "@/data/thumbnails";
import { useKeyClick } from "@/hooks/use-key-click";
import { useWhatsapp } from "@/hooks/use-whatsapp";
import { THUMB_BAR, THUMB_TILE } from "@/components/site/thumb-strip";

/* A galeria de thumbnails no site, no molde das avaliações: a tarja vira o painel da trilha
   (título, quantas já foram feitas, a nota de quem contratou e os nichos como teclas de filtro) e a
   folha branca fica inteira para as peças. Clicar abre a peça grande por cima da página. */

/* o ícone do YouTube — retângulo arredondado com o play vazado —, marcado a ferro no lugar da
   estrela das avaliações */
const PLAY = "M95 85H405A95 95 0 0 1 500 180V320A95 95 0 0 1 405 415H95A95 95 0 0 1 0 320V180A95 95 0 0 1 95 85ZM200 165L345 250L200 335Z";
/* número declarado, não contado — o mesmo da faixa da home: a galeria é só uma amostra */
const MADE = 300;

/* seta do visor: círculo branco por cima da peça, como as da faixa da home */

const label = (thumb: Thumbnail) => thumb.tags.join(" · ");

export function ThumbnailsPage() {
  const { language } = useLanguage();
  const pt = language === "pt";
  const rating = useRating("thumbs");
  const whatsapp = useWhatsapp();
  const keyClick = useKeyClick();
  const [niche, setNiche] = useState<string | null>(null);
  /* posição da peça aberta dentro da lista filtrada; `null` com o visor fechado */
  const [open, setOpen] = useState<number | null>(null);
  const viewer = useRef<HTMLDialogElement>(null);

  const visible = niche ? thumbnails.filter((t) => t.tags[0] === niche) : thumbnails;
  const current = open !== null ? visible[open] : null;

  /* filtro de alternar, como o das avaliações: apertar o nicho ligado solta e volta para todas */
  const toggle = (key: string) => {
    keyClick();
    setNiche((v) => (v === key ? null : key));
  };
  const show = (i: number) => {
    setOpen(i);
    viewer.current?.showModal();
  };
  /* dá a volta nas pontas: depois da última vem a primeira */
  const step = (delta: number) => setOpen((i) => (i === null ? i : (i + delta + visible.length) % visible.length));

  return (
    <main data-page="thumbnails" className="theme-light flex min-h-screen flex-col bg-chrome font-inter text-ink lg:flex-row">
      <Tarja homeHref="/" backdrop={<MarkBackdrop path={PLAY} />}>
        <div className="mt-40 flex flex-col gap-5 lg:mt-auto">
          <div className="flex flex-col gap-2">
            <h1 className={`${RATING_FONT} text-[clamp(44px,13vw,56px)] font-bold uppercase leading-[0.9]`}>Thumbnails</h1>
            <p className="font-mono text-meta tracking-[0.06em] text-chrome-ink/60">
              {pt ? `+${MADE} feitas · ${NICHES.length} nichos` : `${MADE}+ made · ${NICHES.length} niches`}
            </p>
          </div>

          {rating && (
            <Link href="/reviews" className={`-my-1 inline-flex items-center gap-1.5 self-start py-1 text-ui text-chrome-ink ${ON_CHROME_LINK}`}>
              <strong>{rating.value}</strong>
              <Stars count={rating.stars} className="text-accent" />
              <span className="ml-1 text-chrome-ink/70">{pt ? "nas avaliações de thumbnails" : "in thumbnail reviews"}</span>
            </Link>
          )}

          <div role="group" aria-label={pt ? "Filtrar por nicho" : "Filter by niche"} className="flex flex-wrap gap-2.5 pb-1">
            {NICHES.map((key) => (
              <button key={key} type="button" onClick={() => toggle(key)} aria-pressed={niche === key} className={`${toggleKey(niche === key)} grow justify-center`}>
                {key}
              </button>
            ))}
          </div>
        </div>
      </Tarja>

      <TarjaSheet
        footer={
          /* no celular o botão fica de fora, como na home: a barra presa no pé da folha já é o WhatsApp */
          <SheetFooter
            id="thumbs-cta"
            title={pt ? "Precisa de thumbnails?" : "Need thumbnails?"}
            text={pt ? "Me manda o canal e o próximo vídeo pelo WhatsApp e eu volto com a proposta." : "Send me the channel and the next video on WhatsApp and I'll come back with a proposal."}
          >
            <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className={`${CONTACT_3D} ${ON_CHROME_FOCUS} mt-2 max-lg:hidden`}>
              {whatsapp.label}
              <WhatsAppIcon className="h-[1.1em] w-[1.1em]" aria-hidden />
            </a>
          </SheetFooter>
        }
      >
        <section aria-labelledby="galeria" className="flex flex-col">
          <div className={SHEET_HEADER}>
            <h2 id="galeria" className={SHEET_TITLE}>
              {niche ?? (pt ? "Galeria" : "Gallery")}
            </h2>
            {/* o filtro troca a grade sem mexer no foco: é esta contagem que o leitor de tela anuncia */}
            <span className={SHEET_COUNT} aria-live="polite">
              {visible.length} thumbnails
            </span>
          </div>

          {/* `key={niche}`: trocar o filtro remonta a grade e as peças sobem de novo */}
          <ul key={niche ?? "all"} className="grid gap-3 pt-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((thumb, i) => (
              <li key={thumb.id} className="animate-rise motion-reduce:animate-none">
                <button type="button" onClick={() => show(i)} aria-label={pt ? `Ampliar: ${label(thumb)}` : `Enlarge: ${label(thumb)}`} className={`group block w-full ${FOCUS}`}>
                  <span className={`${THUMB_TILE} bg-chrome`}>
                    <Image
                      src={thumb.image}
                      loader={thumbLoader}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 30vw, (min-width: 1024px) calc((100vw - 440px) / 2), (min-width: 640px) 50vw, 100vw"
                      priority={i < 3}
                      className="object-cover"
                    />
                    <span className={THUMB_BAR} aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* O visor: <dialog> nativo — foco preso, Esc fecha, fundo escurecido sem código. Clique fora
            da peça fecha; setas do teclado passam. */}
        <dialog
          ref={viewer}
          aria-label={current ? label(current) : "Thumbnail"}
          onClose={() => setOpen(null)}
          onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
          className="m-auto w-[calc(100%-24px)] max-w-[1280px] overflow-visible bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
        >
          {current && (
            <figure className="flex flex-col gap-3">
              <div className="relative">
                <span className="relative block aspect-video overflow-hidden rounded-xl bg-chrome shadow-[0_24px_60px_-12px_rgb(0_0_0/0.6)]">
                  <Image src={current.image} loader={thumbLoader} alt={label(current)} fill sizes="(min-width: 1304px) 1280px, 100vw" className="object-cover" />
                </span>
                {visible.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label={pt ? "Anterior" : "Previous"} className={`${CAROUSEL_ARROW} top-1/2 focus-visible:outline-white left-2 sm:-left-5`}>
                      <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label={pt ? "Próxima" : "Next"} className={`${CAROUSEL_ARROW} top-1/2 focus-visible:outline-white right-2 sm:-right-5`}>
                      <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                    </button>
                  </>
                )}
              </div>
              <figcaption className="flex items-center justify-between gap-4 text-meta text-white/70">
                <span className="font-mono">
                  {(open ?? 0) + 1} / {visible.length}
                </span>
                <span className="truncate">{label(current)}</span>
                <button
                  type="button"
                  onClick={() => viewer.current?.close()}
                  aria-label={pt ? "Fechar" : "Close"}
                  className="-mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <X className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                </button>
              </figcaption>
            </figure>
          )}
        </dialog>
      </TarjaSheet>
    </main>
  );
}
