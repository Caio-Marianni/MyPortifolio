"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/* Único pedaço de JavaScript do painel: copiar não tem equivalente em HTML. O link fica num
   campo de verdade, então mesmo que a API de área de transferência falhe — navegador antigo,
   página fora de https — dá pra selecionar e copiar na mão. */
export function CopyField({ value, className = "" }: { value: string; className?: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* sem permissão de área de transferência: seleciona pro usuário copiar no teclado */
      setCopiado(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        readOnly
        value={value}
        onFocus={(e) => e.target.select()}
        className="min-w-0 flex-1 border-b border-[#101010]/25 bg-transparent py-2 font-mono text-[11px] text-[#101010]/70 focus:border-[#101010] focus:outline-none"
      />
      <button
        type="button"
        onClick={copiar}
        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#101010]/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-[#101010] hover:bg-[#101010] hover:text-[#F1ECE5] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#101010]"
      >
        {copiado ? "Copiado" : "Copiar"}
        {copiado ? (
          <Check className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
        ) : (
          <Copy className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
        )}
      </button>
    </div>
  );
}
