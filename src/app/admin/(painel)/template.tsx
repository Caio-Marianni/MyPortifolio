import { ViewTransition, type ReactNode } from "react";

/* O template remonta a cada troca de tela (o layout não), então é aqui que a tela antiga sai e a
   nova sobe, com as mesmas classes da folha do site (".sheet-*" em globals.css). O menu fica
   parado porque mora no layout. */
export default function PainelTemplate({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="sheet-in" exit="sheet-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
