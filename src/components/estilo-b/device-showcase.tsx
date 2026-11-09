import Image from "next/image";
import type { ReactNode, RefObject } from "react";
import type { ProjectVideo } from "@/hooks/use-project-video";

/* As molduras dos projetos em destaque, desenhadas em CSS em vez de assadas numa imagem: dentro
   delas vão as telas cruas do site (data/projects `screens`), e o desktop pode tocar um vídeo no
   hover. Mesma peça para todos os projetos, então a receita não varia de um para outro. */

/** Janela de navegador: barra com os três pontos e a tela em 16:10, a proporção da captura.
    O cinza claro mora só na barra e não há borda: qualquer borda, clara ou translúcida, vira um
    fio em volta da tela. A caixa é escura para o arredondamento de subpixel não abrir uma
    frestinha clara embaixo; o recorte arredondado e a sombra já desenham a janela. */
export function DesktopFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[10px] bg-chrome shadow-[0_18px_10px_-10px_rgb(0_0_0/0.4)]">
      <div className="flex h-[18px] items-center gap-[5px] bg-[#e9e6e1] px-2.5" aria-hidden>
        <span className="h-[6px] w-[6px] rounded-full bg-ink/20" />
        <span className="h-[6px] w-[6px] rounded-full bg-ink/20" />
        <span className="h-[6px] w-[6px] rounded-full bg-ink/20" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-chrome">{children}</div>
    </div>
  );
}

/** celular: moldura preta e a tela na proporção da captura (492×1065) */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[18px] bg-[#0d0d0d] p-[4px] shadow-[0_18px_10px_-10px_rgb(0_0_0/0.4)] ${className}`}>
      <div className="relative aspect-[492/1065] overflow-hidden rounded-[14px] bg-chrome">{children}</div>
    </div>
  );
}

/** Desktop com o celular por cima, no canto de baixo à direita. O vídeo, se houver, cobre a tela
    do desktop; quem decide quando ele toca é o card do projeto (`useProjectVideo`), aqui ele só
    entra e sai em fade. */
/* Quanto as telas ocupam em cada faixa, para o navegador baixar a versão certa: no xl a coluna do
   mockup trava em 580px; no lg empilha na folha (tela - tarja de 440 - padding de 112); no md são
   duas colunas; abaixo, a folha inteira. A janela é 93% da peça e o celular 24%. */
const DESKTOP_SIZES = "(min-width: 1280px) 540px, (min-width: 1024px) calc((100vw - 552px) * 0.93), (min-width: 768px) calc(46vw - 34px), calc(93vw - 37px)";
const PHONE_SIZES = "(min-width: 1280px) 140px, (min-width: 1024px) calc((100vw - 552px) * 0.24), (min-width: 768px) calc(12vw - 9px), calc(24vw - 10px)";

export function DeviceShowcase({
  desktop,
  mobile,
  video,
  videoRef,
  videoVisible,
  videoEvents,
}: {
  desktop: string;
  mobile: string;
  video?: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  videoVisible: boolean;
  videoEvents: ProjectVideo["videoEvents"];
}) {
  return (
    /* o respiro embaixo e à direita é onde o celular sai para fora do desktop */
    <div className="relative pb-[6%] pr-[7%]">
      <DesktopFrame>
        <Image src={desktop} alt="" fill sizes={DESKTOP_SIZES} className="object-cover object-top" />
        {video && (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            {...videoEvents}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ease-out ${videoVisible ? "opacity-100" : "opacity-0"}`}
          />
        )}
      </DesktopFrame>
      <PhoneFrame className="absolute bottom-0 right-0 w-[24%]">
        <Image src={mobile} alt="" fill sizes={PHONE_SIZES} className="object-cover object-top" />
      </PhoneFrame>
    </div>
  );
}
