import { useEffect } from "react";
import { INTRO_KEY } from "@/components/site/intro-key";

/* Intro da home do site: toca uma vez por sessão do navegador e qualquer clique, tecla,
   toque ou rolagem durante ela abre a capa na hora.

   O "já vi" é o atributo `data-intro="off"` no <html>, que o CSS lê para esconder a capa e
   tirar o atraso do conteúdo. Ele entra por dois lados:
   - no carregamento, pelo themeScript de app/layout.tsx, ANTES da primeira pintura —
     marcar só aqui no React deixaria a capa piscar até o JavaScript chegar;
   - aqui, quando a intro termina ou é pulada; fica valendo também na navegação interna de
     volta para a home, que não recarrega a página nem roda o script de novo. */

/** duração da intro inteira: a capa termina de abrir em 1270ms (tailwind.config, "faixa-open") */
const INTRO_MS = 1300;
const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

/** Marca a intro como vista: esconde a capa e tira o atraso do conteúdo. Também chamada pelo logo
    da tarja ao voltar para a home pela navegação interna — o script inline da página não roda de
    novo, e a capa abrindo brigaria com a transição de página. */
export function skipIntro() {
  document.documentElement.dataset.intro = "off";
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* sessionStorage bloqueado (aba anônima de alguns navegadores): a intro só volta a tocar */
  }
}

export function useIntro() {
  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro === "off") return;

    const finish = () => {
      skipIntro();
      stop();
    };
    const stop = () => {
      clearTimeout(timer);
      SKIP_EVENTS.forEach((type) => window.removeEventListener(type, finish));
    };

    const timer = setTimeout(finish, INTRO_MS);
    SKIP_EVENTS.forEach((type) => window.addEventListener(type, finish, { passive: true }));
    return stop;
  }, []);
}
