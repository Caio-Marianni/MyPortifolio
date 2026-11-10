"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Check, FilePlus2, Loader2, Plus, Trash2 } from "lucide-react";

/* O ícone vem pelo nome: componente de servidor não passa função (o componente do ícone) para
   componente de cliente, só dado. */
const ICONS = { check: Check, plus: Plus, trash: Trash2, file: FilePlus2 };

/** Botão de enviar que mostra o trabalho: enquanto a action roda, o ícone vira um círculo
    girando e o botão para de aceitar clique — um "Recebi" clicado duas vezes gravaria dois meses.
    Não usa `disabled`: o botão desabilitado fica apagado (`disabled:opacity-40` dos estilos) e
    parece quebrado; aqui ele continua aceso, só ocupado. O Enter num campo também passa pelo
    clique do botão, então a mesma trava cobre os dois. */
export function SubmitButton({ className, icon, children }: { className: string; icon?: keyof typeof ICONS; children: ReactNode }) {
  const { pending } = useFormStatus();
  const Icon = icon && ICONS[icon];

  return (
    <button
      type="submit"
      aria-disabled={pending || undefined}
      aria-busy={pending || undefined}
      onClick={(event) => {
        if (pending) event.preventDefault();
      }}
      className={`${className} ${pending ? "cursor-progress" : ""}`}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} aria-hidden /> : Icon && <Icon className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
      {children}
    </button>
  );
}
