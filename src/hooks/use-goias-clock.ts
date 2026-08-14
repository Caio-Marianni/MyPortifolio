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
    const interval = setInterval(() => setClock(getTimeInGoias()), 1000);
    return () => clearInterval(interval);
  }, []);

  return clock;
}
