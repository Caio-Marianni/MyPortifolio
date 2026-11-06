/* Classes repetidas pelas telas do painel. Só o que aparece em mais de uma tela mora aqui. */

const FOCUS = "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink";

export const BUTTON = `rounded-full border border-ink/25 px-4 py-2 text-[12.5px] transition-colors hover:border-ink hover:bg-fill hover:text-fill-ink disabled:opacity-40 ${FOCUS}`;

/** ação principal da tela — uma por bloco */
export const BUTTON_SOLID = `rounded-full bg-fill px-4 py-2 text-[12.5px] text-fill-ink transition-opacity hover:opacity-80 disabled:opacity-40 ${FOCUS}`;

export const BUTTON_DANGER = `${BUTTON} border-danger text-danger hover:border-danger hover:bg-danger hover:text-surface`;

/** bloco de conteúdo: lista, formulário, ficha */
export const CARD = "border border-ink/15 bg-surface-raised p-5 md:p-6";

/** título de bloco dentro de um CARD */
export const CARD_TITLE = "text-[13px] font-semibold uppercase tracking-[0.06em] text-ink/70";

/** valor em coluna de tabela: dígitos da mesma largura pra somar de olho */
export const NUM = "tabular-nums";
