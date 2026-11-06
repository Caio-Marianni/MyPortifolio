/* Hairline embaixo do campo, como as divisórias da grade — nada de caixa. Um arquivo sem
   "use client" de propósito: constante exportada de módulo de cliente chega no componente de
   servidor como referência, não como texto, e o campo do painel saía sem estilo nenhum.
   16px é piso, não escolha de tipografia: abaixo disso o Safari do iPhone dá zoom na página
   toda ao focar o campo, e o visitante fica com o layout torto e sem saber por quê. */
export const FIELD =
  "w-full border-b border-ink/25 bg-transparent py-2 text-[16px] text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none transition-colors";
export const LABEL = "block text-[12.5px] text-ink/60";
