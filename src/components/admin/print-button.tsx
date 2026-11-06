"use client";

import { Printer } from "lucide-react";
import { BUTTON_SOLID } from "@/components/ui/styles";

/** `window.print()` não tem equivalente em HTML. No diálogo, "Salvar como PDF" gera o arquivo. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={`${BUTTON_SOLID}`}>
      Imprimir ou salvar PDF
      <Printer className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
