import { useEffect, useRef } from "react";

/** Publica a posição do cursor na janela como `--px` e `--py` (de -1 a 1, centro = 0) no
    elemento, para o CSS dele mover-se junto. Variável CSS em vez de estado: o movimento não
    renderiza o React de novo, e um quadro por vez (`requestAnimationFrame`) basta.
    Só com mouse de verdade e sem movimento reduzido no sistema — no toque não há cursor. */
export function usePointerShift<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--px", ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty("--py", ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
