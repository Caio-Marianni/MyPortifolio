"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

/** Avança de fase nos instantes dados (ms desde o início). Cada troca passa pela View Transitions
    API quando existe, então um elemento com o mesmo `view-transition-name` nas duas fases voa
    sozinho de uma posição para a outra. `k` multiplica os tempos (câmera lenta). */
export function usePhases(times: number[], k = 1): number {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase(times.length);
      return;
    }
    const timers = times.map((t, i) =>
      setTimeout(() => {
        const next = () => flushSync(() => setPhase(i + 1));
        if (document.startViewTransition) document.startViewTransition(next);
        else next();
      }, t * k),
    );
    return () => timers.forEach(clearTimeout);
    // a linha do tempo é fixa por cena; quem troca de cena remonta o componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);

  return phase;
}
