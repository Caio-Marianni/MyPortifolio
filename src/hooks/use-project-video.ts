"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { useInView } from "@/hooks/use-in-view";

/** Devolve o vídeo ao estado vazio: sem quadro ele fica transparente e a tela capturada de baixo
    volta a aparecer, em vez de congelar no quadro em que parou. */
const reset = (video: HTMLVideoElement | null) => {
  if (!video) return;
  video.pause();
  video.load();
};

/** O vídeo de um projeto em destaque. Toca com o mouse em cima do card inteiro; onde não existe
    hover (celular), toca quando o card cruza o meio da tela — o mesmo gatilho do `useInView`.
    Vai com `preload="none"`: só baixa quando alguém de fato chega no card.

    Entra e sai em fade: o vídeo só fica visível no `playing` (primeiro quadro na tela, nunca um
    retângulo preto carregando) e, ao parar, primeiro some e só no fim da transição volta ao
    estado vazio. `wanted` cobre quem sai antes do vídeo começar: ele chega tocando e é descartado.
    Quem pede menos movimento nunca vê o vídeo. */
export function useProjectVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cardRef, centered] = useInView<HTMLElement>();
  const [visible, setVisible] = useState(false);
  const wanted = useRef(false);
  const shown = useRef(false);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    wanted.current = true;
    /* voltou durante o fade de saída: o vídeo ainda está tocando, basta reaparecer */
    if (!video.paused) {
      shown.current = true;
      setVisible(true);
      return;
    }
    video.play().catch(() => {
      /* sair antes de começar a tocar rejeita o play(); a tela capturada segue no lugar */
    });
  }, []);

  const stop = useCallback(() => {
    wanted.current = false;
    if (shown.current) {
      shown.current = false;
      setVisible(false); /* o reset vem no fim do fade, em onTransitionEnd */
    } else {
      reset(videoRef.current);
    }
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    if (centered) play();
    else stop();
  }, [centered, play, stop]);

  /* só mouse: no toque o pointerenter dispara no próprio toque e brigaria com o gatilho de rolagem */
  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") play();
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "mouse") stop();
  };

  const onPlaying = () => {
    if (!wanted.current) return reset(videoRef.current);
    shown.current = true;
    setVisible(true);
  };
  const onTransitionEnd = () => {
    if (!shown.current) reset(videoRef.current);
  };

  return { cardRef, videoRef, visible, cardEvents: { onPointerEnter, onPointerLeave }, videoEvents: { onPlaying, onTransitionEnd } };
}

export type ProjectVideo = ReturnType<typeof useProjectVideo>;
