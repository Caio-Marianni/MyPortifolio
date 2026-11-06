"use client";

import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";
import { ArrowUpRight, Download, Users } from "lucide-react";
import { BrandIcon, CHANNELS, WHATSAPP_URL } from "@/components/contact/contact-channels";
import { LogoMark, Stars } from "@/components/ui/brand-marks";
import { LangSwitch } from "@/components/ui/switches";
import { FOCUS } from "@/components/ui/styles";
import { useLanguage } from "@/contexts/language-context";
import { useHappyClients, useRating } from "@/contexts/reviews-context";
import { ProjectShowcase, type ProjectReview } from "@/components/estilo-b/project-showcase";

/* Estilo B, a "tarja lateral": a faixa preta da marca vira a coluna da pessoa (foto, nome, nota,
   contato) e a área creme fica inteira para o trabalho. Abaixo de lg a tarja vira o topo da página. */

/* o contorno padrão é `ink`, que na tarja preta some — aqui o foco é creme */
const ON_CHROME_FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-chrome-ink";
/* Botão 3D em três camadas de sombra: um fio claro no topo (a luz batendo na quina), o lábio
   sólido — a lateral da tecla, sempre a própria cor da face escurecida — e uma sombra difusa de
   verdade no chão. No clique a tecla desce o lábio inteiro e a sombra encolhe junto.
   Sem pílula de propósito: é a peça que mais tem que parecer tecla. Cada variante só define
   `--face` e `--lip`; a mecânica é uma só. */
const PRESS_3D =
  "inline-flex min-h-[52px] select-none items-center justify-center gap-2 rounded-lg bg-[var(--face)] px-7 text-ui font-bold transition-[transform,box-shadow,filter] duration-150 hover:brightness-110 " +
  "[box-shadow:inset_0_1px_0_rgb(255_255_255/0.22),0_6px_0_0_var(--lip),0_14px_18px_-4px_rgb(0_0_0/0.6)] " +
  "active:translate-y-[6px] active:[box-shadow:inset_0_1px_0_rgb(255_255_255/0.22),0_0_0_0_var(--lip),0_3px_6px_-2px_rgb(0_0_0/0.6)]";
/* laranja; o lábio é o próprio laranja com preto, não outro tom de laranja */
const CONTACT_3D = `${PRESS_3D} text-accent-ink [--face:rgb(var(--accent))] [--lip:color-mix(in_srgb,rgb(var(--accent))_60%,black)]`;
/* creme: tecla clara sobre a tarja — grafite com lábio escuro sumia no preto e não lia como 3D */
const CV_3D = `${PRESS_3D} text-chrome [--face:rgb(var(--chrome-ink))] [--lip:color-mix(in_srgb,rgb(var(--chrome-ink))_55%,black)] ${ON_CHROME_FOCUS}`;
const ON_CHROME_LINK = "hover:text-chrome-ink hover:underline";
const ICON = "h-[1.1em] w-[1.1em]";
/* Na tarja os ícones vão cheios; os da página de contato seguem em traço (lá são marca d'água).
   GitHub e LinkedIn da simpleicons.org, envelope do Material Icons. */
const FILLED: Record<string, string> = {
  "E-mail": "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  GitHub:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

/* o WhatsApp é o botão laranja (o ícone dele vai no botão); os outros canais viram a fileira da tarja */
const SOCIALS = [
  ...CHANNELS.filter((c) => c.href !== WHATSAPP_URL).map((c) => {
    const path = FILLED[c.label];
    return path ? { ...c, Icon: (props: SVGProps<SVGSVGElement>) => <BrandIcon {...props} path={path} /> } : c;
  }),
  {
    label: "Contra",
    href: "https://contra.com/caio_marianni_amv4lse6/work",
    /* a estrela de quatro pontas côncavas do logo deles */
    Icon: (props: SVGProps<SVGSVGElement>) => <BrandIcon {...props} path="M12 0C12 6.627 17.373 12 24 12 17.373 12 12 17.373 12 24 12 17.373 6.627 12 0 12 6.627 12 12 6.627 12 0Z" />,
  },
  {
    label: "Wellfound",
    href: "https://wellfound.com/u/caio-marianni-de-morais",
    /* simpleicons.org */
    Icon: (props: SVGProps<SVGSVGElement>) => (
      <BrandIcon
        {...props}
        path="M23.998 8.128c.063-1.379-1.612-2.376-2.795-1.664-1.23.598-1.322 2.52-.156 3.234 1.2.862 2.995-.09 2.951-1.57zm0 7.748c.063-1.38-1.612-2.377-2.795-1.665-1.23.598-1.322 2.52-.156 3.234 1.2.863 2.995-.09 2.951-1.57zm-20.5 1.762L0 6.364h3.257l2.066 8.106 2.245-8.106h3.267l2.244 8.106 2.065-8.106h3.257l-3.54 11.274H11.39c-.73-2.713-1.46-5.426-2.188-8.14l-2.233 8.14H3.5z"
      />
    ),
  },
];
const WhatsAppIcon = CHANNELS.find((c) => c.href === WHATSAPP_URL)?.Icon ?? ArrowUpRight;

const MONOGRAM = "M105 1L211 139L213 1L500 379L446 378L255 130L255 197L392 380L339 378L148 130L147 195L158 210L289 380L238 380L235 377L42 130L42 373L126 266L153 302L0 499L0 2L105 139Z";

/** O monograma marcado a ferro na tarja, como couro queimado: a forma cheia, não o contorno.
    Quatro passadas da mesma forma, do fundo para a frente: o chamuscado em volta (marrom-escuro,
    borrado e irregular), a quina de baixo pegando luz (é o que faz a marca parecer afundada), o
    queimado marrom e o carvão no miolo — a mesma forma encolhida por `feMorphology`, então a borda
    fica mais clara que o centro, como ferro que esquentou mais no meio.
    O `feTurbulence` + `feDisplacementMap` é o que tira o traço de régua e deixa a borda comida. */
function BrandedMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-40 -40 580 580" className={className} aria-hidden>
      <defs>
        <filter id="estilo-b-burn-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" />
        </filter>
        <filter id="estilo-b-burn-core" x="-10%" y="-10%" width="120%" height="120%">
          <feMorphology operator="erode" radius="6" result="core" />
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="core" in2="noise" scale="10" result="rough" />
          <feGaussianBlur in="rough" stdDeviation="2.5" />
        </filter>
        <filter id="estilo-b-burn-scorch" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" result="warped" />
          <feGaussianBlur in="warped" stdDeviation="10" />
        </filter>
      </defs>
      {/* tudo mais escuro que a tarja, só um pouco quente: é textura, não segundo protagonista —
          o laranja da tarja fica com o monograma pequeno e o botão de contato */}
      <path d={MONOGRAM} fill="#2b170c" stroke="#2b170c" strokeWidth={24} strokeLinejoin="round" opacity={0.55} filter="url(#estilo-b-burn-scorch)" />
      <g filter="url(#estilo-b-burn-rough)">
        <path d={MONOGRAM} fill="rgb(var(--chrome-ink))" opacity={0.06} transform="translate(0 2.5)" />
        <path d={MONOGRAM} fill="#0b0705" />
      </g>
      <path d={MONOGRAM} fill="#000" opacity={0.7} filter="url(#estilo-b-burn-core)" />
    </svg>
  );
}

export function EstiloB({ reviews }: { reviews: Record<number, ProjectReview> }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const rating = useRating();
  const happy = useHappyClients();

  const whatsapp = `${WHATSAPP_URL}?text=${encodeURIComponent(pt ? "Oi Caio, vim pelo seu site." : "Hi Caio, I found you through your website.")}`;
  const contactLabel = pt ? "fale comigo" : "get in touch";

  return (
    <main data-page="estilo-b" className="theme-light flex min-h-screen flex-col bg-chrome font-inter text-ink lg:flex-row">
      {/* ── a tarja ── */}
      <aside className="relative isolate z-10 flex shrink-0 shadow-[0_10px_24px_rgba(0,0,0,0.25)] lg:shadow-[12px_0_28px_rgba(0,0,0,0.22)] flex-col gap-6 overflow-hidden bg-chrome px-5 py-6 text-chrome-ink lg:sticky lg:top-0 lg:h-screen lg:w-[440px] lg:gap-7 lg:px-12 lg:py-10">
        {/* Relevo da tarja, do fundo para a frente: hachura fina na diagonal do monograma (a placa
            gravada), luz rasante vindo do canto de baixo, o retrato, vinheta escurecendo as bordas,
            grão e a quina iluminada de 1px. Tudo atrás do conteúdo pelo `-z-10` + `isolate` da tarja. */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(-52deg,rgb(var(--chrome-ink)/0.018)_0_1px,transparent_1px_7px)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(110%_60%_at_0%_100%,rgb(var(--chrome-ink)/0.13),transparent_70%)]"
          aria-hidden
        />
        {/* Retrato recortado (public/portrait-cutout.webp, fundo removido da image.webp) com o
            monograma marcado a ferro atrás. Hierarquia: rosto, depois nome, e a marca como textura.
            - a marca fica centrada atrás da cabeça, menor, com as pontas aparecendo dos dois lados;
            - a foto encosta no topo; a sombra do cabeçalho segura o logo e o PT/EN sobre o cabelo;
            - o peito desce até o nome, que fica por cima da camiseta: rosto e nome numa peça só;
            - uma luz só, de contorno, vinda da esquerda — nada de halo em volta.
            Opaco e escurecido por `brightness`, não por opacidade: assim cobre o logo de verdade. */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[60%] lg:h-[54%]" aria-hidden>
          <BrandedMark className="absolute left-[48%] top-[6%] h-[92%] w-auto -translate-x-1/2" />
          {/* Caixa na proporção da foto (5:4): o tamanho sai da largura, então o corpo aparece até o
              degradê. Encosta no topo da tarja: a foto original corta o cabelo reto, e na borda o
              corte vira enquadramento. A máscara só apaga o fim da camiseta, curta, para o corpo
              aparecer inteiro. */}
          <div className="absolute -left-[3%] top-0 aspect-[5/4] w-[125%] [mask-image:linear-gradient(to_bottom,black_86%,transparent)]">
            <Image
              src="/portrait-cutout.webp"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 550px, 125vw"
              className="object-cover brightness-[0.85] drop-shadow-[-3px_-1px_5px_rgba(237,231,222,0.07)]"
            />
          </div>
        </div>
        {/* sombra no topo: o seletor de idioma cai em cima do cabelo e precisa de fundo escuro */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-chrome/85 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 shadow-[inset_0_0_160px_rgb(0_0_0/0.85)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/assets/images/noise.webp')] opacity-[0.14] mix-blend-screen" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 shadow-[inset_0_-1px_0_rgb(var(--chrome-ink)/0.14)] lg:shadow-[inset_-1px_0_0_rgb(var(--chrome-ink)/0.14),inset_0_1px_0_rgb(var(--chrome-ink)/0.06)]"
          aria-hidden
        />

        <div className="flex items-center justify-between text-meta">
          <span className="h-8 w-8">
            <LogoMark />
          </span>
          <LangSwitch />
        </div>

        <div className="mt-56 lg:mt-auto">
          <h1 className="font-makaio text-[clamp(48px,20vw,112px)] font-black uppercase leading-[0.95] tracking-display">
            Caio
            <br />
            Marianni
          </h1>
          {rating && (
            <p className="mt-4 text-ui">
              <Link href="/reviews" className={`inline-flex items-center gap-1.5 text-chrome-ink ${ON_CHROME_LINK}`}>
                <strong>{rating.value}</strong>
                <Stars count={rating.stars} className="text-accent" />
                {happy > 0 && (
                  <span className="ml-1.5 inline-flex items-center gap-1.5 text-chrome-ink/70">
                    <Users className="h-[1.15em] w-[1.15em]" strokeWidth={2} aria-hidden />
                    {happy} {pt ? (happy === 1 ? "cliente feliz" : "clientes felizes") : happy === 1 ? "happy client" : "happy clients"}
                  </span>
                )}
              </Link>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3.5 border-t border-chrome-ink/15 pt-5">
          <div className="flex items-center gap-3 pb-3 max-lg:pb-0">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${CONTACT_3D} ${ON_CHROME_FOCUS} flex-1 whitespace-nowrap max-lg:hidden`}>
              {contactLabel}
              <WhatsAppIcon className={ICON} aria-hidden />
            </a>
            {/* um arquivo só, no idioma em que a pessoa já está lendo */}
            <a href={`/cv/caio-marianni-${language}.pdf`} download className={CV_3D}>
              CV
              <Download className={ICON} strokeWidth={2.5} aria-hidden />
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <nav aria-label={pt ? "Redes" : "Profiles"} className="-mx-2.5 flex items-center justify-between">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-chrome-ink/70 transition-colors hover:bg-chrome-ink/10 hover:text-chrome-ink ${ON_CHROME_FOCUS}`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                </a>
              ))}
            </nav>
            <span className="text-center font-mono text-meta tracking-[0.06em] text-chrome-ink/55">
              {pt ? "Brasil-GO · remoto · desde 2022" : "Brazil-GO · remote · since 2022"}
            </span>
          </div>
        </div>
      </aside>

      {/* ── o trabalho ── */}
      {/* folha branca por trás da tarja: é a tarja que faz sombra nela, para baixo no celular e para a direita no desktop */}
      <div className="flex min-w-0 flex-1 flex-col bg-white px-5 py-6 lg:px-14 lg:py-10">
        <ProjectShowcase reviews={reviews} language={language} />

        {/* no celular o contato fica preso no pé da tela enquanto a coluna de trabalho está visível */}
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={`${CONTACT_3D} ${FOCUS} sticky bottom-6 mt-8 w-full lg:hidden`}
        >
          {contactLabel}
          <WhatsAppIcon className={ICON} aria-hidden />
        </a>
      </div>
    </main>
  );
}
