"use client";

import { PrinterIcon } from "@phosphor-icons/react/ssr";
import { BUTTON_SOLID } from "@/components/ui/styles";

/** `window.print()` não tem equivalente em HTML. No diálogo, "Salvar como PDF" gera o arquivo. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={`${BUTTON_SOLID}`}>
      Imprimir ou salvar PDF
      <PrinterIcon className="h-[1.1em] w-[1.1em]" aria-hidden weight="bold" />
    </button>
  );
}
