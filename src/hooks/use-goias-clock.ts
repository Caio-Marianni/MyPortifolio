"use client";

import { useEffect, useState } from "react";

export interface Clock {
  time: string;
  period: string;
}

function getTimeInGoias(): Clock {
  const formatted = new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const [time, period] = formatted.split(" ");
  return { time, period };
}

/* null até montar: o horário do servidor não bate com o do cliente e quebra a hidratação. */
export function useGoiasClock(): Clock | null {
  const [clock, setClock] = useState<Clock | null>(null);

  useEffect(() => {
    setClock(getTimeInGoias());
    /* devolve o mesmo objeto enquanto o minuto não vira: sem isso a home inteira re-renderizava a cada segundo */
    const interval = setInterval(() => {
      const next = getTimeInGoias();
      setClock((prev) => (prev?.time === next.time && prev.period === next.period ? prev : next));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return clock;
}
