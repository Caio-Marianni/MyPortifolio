"use client";

import { useEffect, useRef, useState } from "react";

/** `true` enquanto o elemento cruza a faixa central da viewport — o gatilho de hover onde
    não existe `:hover`: a peça no meio da tela é a que está sendo "apontada".

    A medida é por `rootMargin`, não por `threshold`: threshold mede quanto do alvo aparece,
    e um cartão mais alto que a tela nunca chega a ter 70% de si mesmo visível. Encolher a
    raiz a uma faixa fina resolve para qualquer altura de peça, e é estreita o bastante para
    que só um cartão a cruze de cada vez. */
export function useInView<T extends HTMLElement>(rootMargin = "-45% 0px -45% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inView] as const;
}
