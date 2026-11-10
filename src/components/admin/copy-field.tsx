"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { BUTTON, FIELD, ICON_BUTTON } from "@/components/ui/styles";

/* Copiar não tem equivalente em HTML: é o pedaço de JavaScript do painel. */

function useCopy(value: string) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sem permissão de área de transferência (página fora de https, navegador antigo): o
         valor continua à vista para copiar na mão, e o botão não finge que copiou */
      setCopied(false);
    }
  };

  return [copied, copy] as const;
}

const ICON = "h-[1.1em] w-[1.1em]";

/** O link fica num campo de verdade, então mesmo que a API de área de transferência falhe dá pra
    selecionar e copiar na mão. */
export function CopyField({ value, className = "" }: { value: string; className?: string }) {
  const [copied, copy] = useCopy(value);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input readOnly value={value} onFocus={(e) => e.target.select()} className={`${FIELD} min-w-0 flex-1`} />
      <button type="button" onClick={copy} className={`shrink-0 ${BUTTON}`}>
        {copied ? "Copiado" : "Copiar"}
        {copied ? <Check className={ICON} strokeWidth={2.5} aria-hidden /> : <Copy className={ICON} strokeWidth={2.5} aria-hidden />}
      </button>
    </div>
  );
}

/** Botão de copiar ao lado de um valor que já está à vista (contato do cliente, campo de modelo).
    Sem `children` é só o ícone; com `children`, o próprio texto vira o botão. */
export function CopyButton({ value, label, className = ICON_BUTTON, children }: { value: string; label: string; className?: string; children?: ReactNode }) {
  const [copied, copy] = useCopy(value);

  return (
    <button type="button" onClick={copy} aria-label={children ? undefined : label} title={copied ? "Copiado" : label} className={className}>
      {children}
      {copied ? <Check className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden /> : !children && <Copy className="h-4 w-4" strokeWidth={2} aria-hidden />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copiado" : ""}
      </span>
    </button>
  );
}
