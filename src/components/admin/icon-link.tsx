import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ICON_BUTTON, ICON_BUTTON_DANGER } from "@/components/ui/styles";

/** Ação de linha só com ícone (editar, excluir, desfazer): o nome vai no `aria-label` e no
    `title`, que é a dica do mouse. `scroll={false}`: a ação abre no lugar do item, então a tela
    fica onde está em vez de voltar pro topo. */
export function IconLink({ href, label, icon: Icon, danger = false }: { href: string; label: string; icon: LucideIcon; danger?: boolean }) {
  return (
    <Link href={href} scroll={false} aria-label={label} title={label} className={danger ? ICON_BUTTON_DANGER : ICON_BUTTON}>
      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
    </Link>
  );
}
