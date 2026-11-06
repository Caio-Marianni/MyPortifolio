/* Classes repetidas pelo site e pelo painel. Só o que aparece em mais de uma tela mora aqui.
   Um arquivo sem "use client" de propósito: constante exportada de módulo de cliente chega no
   componente de servidor como referência, não como texto, e o campo saía sem estilo nenhum.

   Cantos: botão e etiqueta são pílula; tudo que é superfície — card, campo, foto, menu, faixa —
   é quadrado, nos fios finos da grade. Nenhum `rounded-md` no meio do caminho. */

export const FOCUS = "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink";

/* Hairline embaixo do campo, como as divisórias da grade — nada de caixa.
   16px é piso, não degrau da escala: abaixo disso o Safari do iPhone dá zoom na página toda ao
   focar o campo, e o visitante fica com o layout torto e sem saber por quê. */
export const FIELD =
  "w-full border-b border-ink/25 bg-transparent py-2 text-[16px] text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none transition-colors";
export const LABEL = "block text-meta text-ink/60";

/* Botão é pílula — o gesto dos botões da capa —, nos dois tamanhos: `sm` no painel e nas ações
   de linha, `lg` nos CTAs das páginas. Tamanho e variante em mapas separados para que nenhuma
   combinação traga dois `px-` brigando na mesma string. */
const BUTTON_VARIANT = {
  outline: "border border-ink/25 hover:border-ink hover:bg-fill hover:text-fill-ink",
  solid: "border border-fill bg-fill text-fill-ink hover:opacity-80",
  /** o laranja: só o CTA que leva para fora (contato, ver projeto) */
  accent: "border border-accent bg-accent text-accent-ink hover:border-accent-hover hover:bg-accent-hover",
  danger: "border border-danger text-danger hover:bg-danger hover:text-surface",
};

const BUTTON_SIZE = {
  sm: "px-5 py-2.5 text-meta",
  lg: "px-7 py-3 text-ui",
};

export const button = (variant: keyof typeof BUTTON_VARIANT = "outline", size: keyof typeof BUTTON_SIZE = "sm") =>
  `inline-flex items-center justify-center gap-2 rounded-full transition-[color,background-color,border-color,opacity,gap] disabled:opacity-40 ${FOCUS} ${BUTTON_SIZE[size]} ${BUTTON_VARIANT[variant]}`;

/** contorno: ação secundária */
export const BUTTON = button();

/** ação principal da tela — uma por bloco */
export const BUTTON_SOLID = button("solid");

export const BUTTON_DANGER = button("danger");

/** bloco de conteúdo: lista, formulário, ficha */
export const CARD = "border border-ink/15 bg-surface-raised p-5 md:p-6";

/** título de bloco dentro de um CARD — a mesma voz dos rótulos da faixa preta */
export const CARD_TITLE = "text-meta font-semibold uppercase tracking-[0.06em] text-ink/70";

/** valor em coluna de tabela: dígitos da mesma largura pra somar de olho */
export const NUM = "tabular-nums";
