"use client";

import Link from "next/link";
import { ViewTransition, type ReactNode, type SVGProps } from "react";
import { ArrowUpRight, Download, FileDown } from "lucide-react";
import { BrandIcon, CHANNELS, WHATSAPP_URL } from "@/components/contact/contact-channels";
import { BrandedMark, LogoMark, STAR } from "@/components/ui/brand-marks";
import { LangSwitch } from "@/components/ui/switches";
import { CONTACT_3D, CV_3D, DARK_3D, FOCUS, ON_CHROME_FOCUS } from "@/components/ui/styles";
import { useLanguage } from "@/contexts/language-context";
import { skipIntro } from "@/hooks/use-intro";
import { usePointerShift } from "@/hooks/use-pointer-shift";
import { useWhatsapp } from "@/hooks/use-whatsapp";

/* A tarja do site, compartilhada pela home e pelas avaliações: a faixa preta com o relevo,
   o cabeçalho (logo + PT/EN) e o contato no pé. O miolo e o fundo (retrato, marca) vêm de fora. */

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
    Icon: (props: SVGProps<SVGSVGElement>) => (
      <BrandIcon {...props} path="M12 0C12 6.627 17.373 12 24 12 17.373 12 12 17.373 12 24 12 17.373 6.627 12 0 12 6.627 12 12 6.627 12 0Z" />
    ),
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
export const WhatsAppIcon = CHANNELS.find((c) => c.href === WHATSAPP_URL)?.Icon ?? ArrowUpRight;

/** O fundo grande da tarja nas páginas sem retrato (avaliações, avaliar, 404): uma forma marcada a
    ferro — a estrela, por padrão. Inclinada e cortada pela borda direita, como o retrato cortado no
    topo da home: enquadramento, não ícone centralizado. Fica atrás do conteúdo como textura.
    Acompanha o cursor pela janela inteira: desliza até 14px e gira até 5° a mais, devagar
    (`duration-700`), como placa com relevo pegando luz de outro ângulo. Sem mouse, fica parada na
    pose de sempre (14°). `will-change-transform`: camada própria, para os filtros de queimado não
    serem recalculados a cada movimento. */
export function MarkBackdrop({ path = STAR }: { path?: string }) {
  const ref = usePointerShift<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className="absolute -right-[28%] top-[4%] -z-10 h-[58%] will-change-transform transition-transform duration-700 ease-out [transform:translate(calc(var(--px,0)*14px),calc(var(--py,0)*10px))_rotate(calc(14deg+var(--px,0)*5deg))] lg:-right-[34%] lg:top-[6%] lg:h-[62%]"
      aria-hidden
    >
      <BrandedMark path={path} className="h-full w-auto" />
    </span>
  );
}

/** a tarja: relevo atrás, cabeçalho em cima, contato no pé. `backdrop` entra entre a luz rasante e
    a vinheta (é onde mora o retrato da home); `homeHref` faz do logo o caminho de volta.
    `noContact` tira contato, CV e redes do pé: no convite de avaliação a página é uma tarefa só, e
    mandar o cliente para outro lugar no meio dela é o jeito mais fácil de não receber a avaliação. */
export function Tarja({ backdrop, homeHref, noContact, children }: { backdrop?: ReactNode; homeHref?: string; noContact?: boolean; children: ReactNode }) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const whatsapp = useWhatsapp();

  return (
    /* Transição entre home e avaliações: a tarja é o mesmo elemento nas duas (`name`), então fica
       parada e só o que muda dentro dela (retrato ↔ estrela, nome ↔ placar) faz crossfade. Logo,
       PT/EN e contatos são iguais nos dois lados e o crossfade deles não aparece.
       `default="none"`: sem isso ela animaria em qualquer transição da página. */
    <ViewTransition name="tarja" share="tarja" default="none">
      <aside className="relative isolate z-10 flex shrink-0 flex-col gap-6 overflow-hidden bg-chrome px-5 py-6 text-chrome-ink max-lg:pb-12 shadow-[0_10px_24px_rgba(0,0,0,0.25)] lg:sticky lg:top-0 lg:h-screen lg:w-[440px] lg:gap-7 lg:px-12 lg:py-10 lg:shadow-[12px_0_28px_rgba(0,0,0,0.22)]">
        {/* Relevo da tarja, do fundo para a frente: hachura fina na diagonal do monograma (a placa
          gravada), luz rasante vindo do canto de baixo, o fundo de cada página, vinheta escurecendo
          as bordas, grão e a quina iluminada de 1px. Tudo atrás do conteúdo pelo `-z-10` + `isolate`. */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(-52deg,rgb(var(--chrome-ink)/0.018)_0_1px,transparent_1px_7px)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(110%_60%_at_0%_100%,rgb(var(--chrome-ink)/0.13),transparent_70%)]"
          aria-hidden
        />
        {backdrop}
        {/* sombra no topo: o seletor de idioma cai em cima do cabelo e precisa de fundo escuro */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-chrome/85 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 shadow-[inset_0_0_160px_rgb(0_0_0/0.85)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/assets/images/noise.webp')] opacity-[0.14] mix-blend-screen" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 shadow-[inset_0_-1px_0_rgb(var(--chrome-ink)/0.14)] lg:shadow-[inset_-1px_0_0_rgb(var(--chrome-ink)/0.14),inset_0_1px_0_rgb(var(--chrome-ink)/0.06)]"
          aria-hidden
        />

        <div className="flex items-center justify-between text-meta">
          {homeHref ? (
            <Link href={homeHref} onClick={skipIntro} aria-label={pt ? "Início" : "Home"} className={`h-8 w-8 ${ON_CHROME_FOCUS}`}>
              <LogoMark />
            </Link>
          ) : (
            <span className="h-8 w-8">
              <LogoMark />
            </span>
          )}
          <LangSwitch />
        </div>

        {children}

        {!noContact && (
        <div className="flex flex-col gap-3.5 border-t border-chrome-ink/15 pt-5">
          {/* no celular os dois botões descem para a barra presa no pé da folha (TarjaSheet) */}
          <div className="flex items-center gap-3 pb-3 max-lg:hidden">
            <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className={`${CONTACT_3D} ${ON_CHROME_FOCUS} flex-1 whitespace-nowrap`}>
              {whatsapp.label}
              <WhatsAppIcon className={ICON} aria-hidden />
            </a>
            {/* um arquivo só, no idioma em que a pessoa já está lendo */}
            <a href={`/cv/caio-marianni-${language}.pdf`} download className={`${CV_3D} ${ON_CHROME_FOCUS}`}>
              CV
              <Download className={ICON} strokeWidth={2.5} aria-hidden />
            </a>
          </div>
          <div className="flex flex-col gap-3">
            {/* Na coluna do desktop os ícones preenchem a largura. Com a tarja no topo: no celular ficam
              centrados, no meio da tela; do sm ao lg, largura cheia, iam ficar soltos de ponta a
              ponta, então se juntam à esquerda, alinhados ao nome. */}
            <nav aria-label={pt ? "Redes" : "Profiles"} className="-mx-2.5 flex items-center justify-center gap-1 sm:justify-start lg:justify-between lg:gap-0">
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
            <span className="text-center font-mono text-meta tracking-[0.06em] text-chrome-ink/55 sm:text-left lg:text-center">
              {pt ? "Brasil-GO · desde 2022" : "Brazil-GO · since 2022"}
            </span>
          </div>
        </div>
        )}
      </aside>
    </ViewTransition>
  );
}

/** O rodapé escuro que a folha revela no fim da rolagem (prop `footer` da TarjaSheet): a hachura e
    o grão da tarja, um brilho laranja subindo do pé e o conteúdo centrado. Fechamento de página —
    quem chegou ao fim é quem está mais perto de agir. O título vai em `title`, na Makaio. */
export function SheetFooter({ id, title, text, children }: { id: string; title: string; text: string; children?: ReactNode }) {
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden px-6 py-20 text-chrome-ink lg:px-14 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(-52deg,rgb(var(--chrome-ink)/0.025)_0_1px,transparent_1px_7px)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_100%,rgb(var(--accent)/0.16),transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/assets/images/noise.webp')] opacity-[0.14] mix-blend-screen" aria-hidden />
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 id={id} className="font-makaio text-[clamp(34px,5vw,64px)] font-black uppercase leading-[0.95] tracking-display">
          {title}
        </h2>
        <p className="max-w-[44ch] text-body text-chrome-ink/70">{text}</p>
        {children}
      </div>
    </section>
  );
}

/** A folha branca ao lado da tarja; no celular o contato fica preso no pé da tela.
    `footer`: rodapé escuro revelado pela folha. Ele fica preso ao pé da tela (sticky) o tempo todo,
    por baixo da folha, que está numa camada acima; no fim da rolagem a folha sobe e o descobre,
    como uma cortina. A folha ganha cantos arredondados e sombra embaixo para ler como peça por cima.
    Tem que caber na altura da tela, senão a parte de cima dele nunca aparece.
    `noContact`: sem a barra de contato do celular, pelo mesmo motivo da tarja. */
export function TarjaSheet({ children, footer, noContact }: { children: ReactNode; footer?: ReactNode; noContact?: boolean }) {
  const { language } = useLanguage();
  const whatsapp = useWhatsapp();

  return (
    /* é a tarja que faz sombra nela, para baixo no celular e para a direita no desktop */
    /* Na troca de página a folha antiga some rápido e a nova sobe, enquanto a tarja fica parada.
       Classes em globals.css (".sheet-*"). */
    <ViewTransition enter="sheet-in" exit="sheet-out" default="none">
      <div className="flex min-w-0 flex-1 flex-col">
        {/* No celular a folha sobe 24px sobre a tarja, com os cantos de cima arredondados (o pb-12 da
          tarja deixa a folga): na primeira tela ela já aparece como uma peça por cima, convidando a
          rolar, e repete o gesto do rodapé revelado. Lá ela precisa ficar acima da tarja (z-[15]).
          z-[5] no desktop: acima do rodapé (z-0) e abaixo da tarja (z-10), que faz sombra na folha.
          `overflow-clip` e não `hidden`: recorta a barra do celular no canto arredondado sem virar
          contêiner de rolagem — com `hidden` a barra sticky parava de grudar. */}
        <div
          className={`relative z-[5] flex flex-1 flex-col bg-white px-5 py-6 max-lg:z-[15] max-lg:-mt-6 max-lg:rounded-t-[28px] lg:px-14 lg:py-10 ${
            footer ? "overflow-clip rounded-b-[28px] shadow-[0_28px_40px_-16px_rgb(0_0_0/0.55)] lg:pb-16" : ""
          }`}
        >
          {children}
          {/* Contato e CV dividem a barra; o CV vira só o ícone para o contato continuar sendo o botão
          principal. Barra de verdade, não botões soltos: fundo translúcido com blur e fio no topo,
          de borda a borda (as margens negativas desfazem o padding da folha) e com folga para a
          área segura do iPhone. O conteúdo passa por baixo da barra, não por baixo dos botões. */}
          {!noContact && (
          <div className="sticky bottom-0 -mx-5 -mb-6 mt-8 flex gap-3 border-t border-ink/10 bg-white/85 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
            <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className={`${CONTACT_3D} ${FOCUS} flex-1`}>
              {whatsapp.label}
              <WhatsAppIcon className={ICON} aria-hidden />
            </a>
            <a
              href={`/cv/caio-marianni-${language}.pdf`}
              download
              aria-label={language === "pt" ? "Baixar CV" : "Download CV"}
              title="CV"
              className={`${DARK_3D} ${FOCUS} w-[52px] shrink-0 !px-0`}
            >
              <FileDown className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            </a>
          </div>
          )}
        </div>
        {footer && <div className="sticky bottom-0 z-0">{footer}</div>}
      </div>
    </ViewTransition>
  );
}
