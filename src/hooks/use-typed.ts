"use client";

import { useEffect, useState } from "react";

/** Digita `text` um caractere por vez, `msPerChar` por caractere. */
export function useTyped(text: string, msPerChar: number): string {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    const id = setInterval(() => setCount((c) => (c >= text.length ? c : c + 1)), msPerChar);
    return () => clearInterval(id);
  }, [text, msPerChar]);

  return text.slice(0, count);
}
