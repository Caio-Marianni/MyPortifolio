"use client";

import { useState } from "react";
import { FOCUS } from "@/components/ui/styles";

/* ponytail: "longo" pelo número de caracteres, não medindo a altura renderizada. Perto de 6
   linhas na coluna do card; trocar por medição (scrollHeight) se o corte errar muito. */
const LONG_COMMENT = 280;

/** Comentário de avaliação que, se longo, abre fechado em `clamp` linhas com "ler mais".
    `clamp` é a classe inteira (`line-clamp-5`) porque o Tailwind lê o código-fonte. */
export function ClampedQuote({
  text,
  language,
  clamp,
  className,
}: {
  text: string;
  language: "pt" | "en";
  /** sem `clamp`, o comentário vai sempre inteiro */
  clamp?: "line-clamp-5" | "line-clamp-6";
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const pt = language === "pt";
  const long = !!clamp && text.length > LONG_COMMENT;

  return (
    <div className="flex flex-col items-start gap-1.5">
      <blockquote className={`${className} ${long && !open ? clamp : ""}`}>{text}</blockquote>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`text-meta font-semibold text-ink/70 underline-offset-4 hover:text-ink hover:underline ${FOCUS}`}
        >
          {open ? (pt ? "ler menos" : "show less") : pt ? "ler mais" : "read more"}
        </button>
      )}
    </div>
  );
}
