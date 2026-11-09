import { useCallback, useEffect, useRef, useState } from "react";

/** Faixa que rola de lado com setas: diz se ela está no começo ou no fim (para mostrar só a seta
    que leva a algum lugar) e rola uma tela por vez — o `scroll-snap` da faixa acerta a parada.
    O estado só muda quando atravessa uma borda: o React descarta o `setState` com o mesmo valor,
    então rolar não renderiza o componente a cada quadro. */
export function useScrollStrip<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    /* 2px de folga: o snap e o zoom do navegador deixam o scrollLeft fracionado perto da borda */
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    /* a largura muda com a janela e com as imagens chegando */
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const scroll = useCallback((direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: smooth ? "smooth" : "auto" });
  }, []);

  return { ref, atStart, atEnd, onScroll: measure, scroll };
}
