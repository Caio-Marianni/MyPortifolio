"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRightIcon, ArrowUUpLeftIcon, CheckIcon, CircleNotchIcon, FilePlusIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react/ssr";

/* O ícone vem pelo nome: componente de servidor não passa função (o componente do ícone) para
   componente de cliente, só dado. */
const ICONS = { check: CheckIcon, plus: PlusIcon, trash: TrashIcon, file: FilePlusIcon, next: ArrowRightIcon, undo: ArrowUUpLeftIcon };

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
      {pending ? <CircleNotchIcon className="h-4 w-4 animate-spin" aria-hidden weight="bold" /> : Icon && <Icon className="h-4 w-4" aria-hidden weight="bold" />}
      {children}
    </button>
  );
}
