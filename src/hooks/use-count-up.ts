import { useLayoutEffect, useRef } from "react";

/** Faz um número contar de 0 até `target` ao montar. Escreve direto no nó de texto do elemento,
    sem estado: são ~50 quadros, e cada um viraria uma renderização do componente inteiro.
    O HTML do servidor já sai com o valor final — sem JavaScript, ou com movimento reduzido no
    sistema, a pessoa vê a nota certa e nada anima. */
/** `delay` segura o 0.0 parado antes de contar — para a nota que aparece depois de uma intro. */
export function useCountUp<T extends HTMLElement>(target: number, decimals: number, duration = 800, delay = 0) {
  const ref = useRef<T>(null);

  /* layout effect: troca o valor final por "0.0" antes da primeira pintura, senão a nota
     piscava cheia e voltava a zero */
  useLayoutEffect(() => {
    const node = ref.current?.firstChild;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = performance.now() + delay;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - (1 - progress) ** 3;
      node.nodeValue = (target * eased).toFixed(decimals);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    node.nodeValue = (0).toFixed(decimals);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      node.nodeValue = target.toFixed(decimals);
    };
  }, [target, decimals, duration, delay]);

  return ref;
}
