/* Classes repetidas pelo site e pelo painel. Só o que aparece em mais de uma tela mora aqui.
   Um arquivo sem "use client" de propósito: constante exportada de módulo de cliente chega no
   componente de servidor como referência, não como texto, e o campo saía sem estilo nenhum.

   Cantos: botão e etiqueta são pílula; superfície — card, foto, menu, faixa — é quadrada. As
   exceções são as teclas (`rounded-lg`/`rounded-md`, têm que parecer tecla) e o poço do campo
   (`rounded-md`, o mesmo do formulário de avaliação). */

export const FOCUS = "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink";
/** linha de lista que é link inteira: o contorno vai por dentro, senão as vizinhas o cortam */
export const ROW_FOCUS = "focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-ink";

/* Cada campo é um poço da cor da folha dentro do card creme: dá para ver o que é editável sem que
   a moldura brigue com o resto. O mesmo do formulário de avaliação do site.
   16px é piso, não degrau da escala: abaixo disso o Safari do iPhone dá zoom na página toda ao
   focar o campo, e o visitante fica com o layout torto e sem saber por quê. */
export const FIELD =
  "w-full rounded-md border border-ink/10 bg-sheet px-3 py-2.5 text-[16px] text-ink placeholder:text-ink/35 transition-[border-color,box-shadow] focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/25";
/** rótulo em cima do campo, na voz dos rótulos da folha; a margem é o respiro até o poço */
export const LABEL = "mb-1.5 block text-meta font-semibold uppercase tracking-[0.06em] text-ink/60";

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

/* Botões do painel. Chapados, 36px de altura, cantos de 8px — os quatro do mesmo tamanho e
   formato, que só mudam de cor. A tecla 3D (lábio e sombra no chão) fica para o site: no painel,
   com dez botões na tela, ela pesava e cada clique afundava. Um fio claro em cima e uma sombra de
   1px dão o volume que basta; o clique só encolhe 2%. `button()`, acima, continua para o site. */
const PANEL_BUTTON =
  "inline-flex h-9 shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 text-ui font-semibold transition-[background-color,border-color,color,filter,transform] duration-100 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 " +
  FOCUS;

/** contorno: ação secundária (cancelar, abrir, editar) */
export const BUTTON = `${PANEL_BUTTON} border border-ink/15 bg-sheet text-ink shadow-[0_1px_2px_rgb(0_0_0/0.06)] hover:border-ink/30 hover:bg-ink/[0.04]`;

/** Ação principal do bloco — salvar, receber, gerar. O `fill`: grafite no claro, creme no escuro. */
export const BUTTON_SOLID = `${PANEL_BUTTON} bg-fill text-fill-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(0_0_0/0.25)] hover:bg-fill/85`;

/** Criar algo (novo cliente, novo documento): o mesmo botão em verde. Verde é só "adicionar". */
export const BUTTON_ADD = `${PANEL_BUTTON} bg-add text-add-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(0_0_0/0.25)] hover:brightness-110`;

/** Excluir de verdade (a segunda etapa, DeleteConfirm). */
export const BUTTON_DANGER = `${PANEL_BUTTON} border border-danger/40 bg-sheet text-danger hover:border-danger hover:bg-danger hover:text-surface`;

/* Ação de linha só com ícone — editar, excluir, desfazer, copiar: quadrado de 36px, discreto até o
   hover, para dez itens numa ficha não virarem vinte botões disputando o olho. Sempre com
   `aria-label` e `title` (IconLink, CopyButton). O de perigo só fica vermelho no hover. */
const ICON_BUTTON_BASE = `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink/50 transition-colors ${FOCUS}`;
export const ICON_BUTTON = `${ICON_BUTTON_BASE} hover:bg-ink/[0.07] hover:text-ink`;
export const ICON_BUTTON_DANGER = `${ICON_BUTTON_BASE} hover:bg-danger/10 hover:text-danger`;

/** Bloco de conteúdo: lista, formulário, ficha. O creme dos cards de avaliação sobre a folha, sem
    borda. Destaque é fio de 2px à esquerda: `border-l-2 border-accent` (aberto para edição) ou
    `border-danger` (pede ação). */
export const CARD = "bg-paper p-5 md:p-6";

/** título de bloco dentro de um CARD — a mesma voz dos rótulos da faixa preta */
export const CARD_TITLE = "text-meta font-semibold uppercase tracking-[0.06em] text-ink/70";

/** valor em coluna de tabela: dígitos da mesma largura pra somar de olho */
export const NUM = "tabular-nums";

/* Entrada em cascata das listas: cada item sobe 60ms depois do anterior; do oitavo em diante
   entram juntos. Classes inteiras porque o Tailwind lê o código-fonte. */
const STAGGER = [
  "[animation-delay:0ms]",
  "[animation-delay:60ms]",
  "[animation-delay:120ms]",
  "[animation-delay:180ms]",
  "[animation-delay:240ms]",
  "[animation-delay:300ms]",
  "[animation-delay:360ms]",
  "[animation-delay:420ms]",
];
export const rise = (i: number) => `animate-rise motion-reduce:animate-none ${STAGGER[Math.min(i, STAGGER.length - 1)]}`;

/* Lista em forma de tabela do painel (clientes, relatórios): um cartão de canto arredondado com
   fio fino. As linhas são da cor da folha (branco no claro); o cabeçalho e o rodapé (total) são o
   creme dos cards, com um fio entre eles e as linhas — dois tons, então nada se mistura. Rótulos
   pequenos em caixa alta, na fonte do texto. As colunas vêm de quem usa. */
export const TABLE = "overflow-hidden rounded-xl border border-ink/10 bg-sheet shadow-[0_1px_3px_rgb(0_0_0/0.05)]";
export const TABLE_HEAD = "border-b border-ink/10 bg-paper px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/55";
export const TABLE_FOOT = "border-t border-ink/10 bg-paper px-5 py-3 text-ui";

/** Item dentro de um bloco da ficha (plano, projeto, conta): um cartão na cor da folha sobre o
    creme do bloco, para cada item se separar do vizinho; ganha sombra no hover. `scroll-mt-24`:
    é a âncora para onde as actions voltam, e ela para com folga abaixo do topo da tela. */
export const ITEM_CARD =
  "scroll-mt-24 rounded-lg border border-ink/10 bg-sheet p-4 transition-shadow hover:shadow-[0_10px_24px_-14px_rgb(0_0_0/0.35)] md:p-5";

/** Uma opção dentro de um menu suspenso (Dropdown): o filtro das listas, o "⋯" da ficha. */
export const MENU_ITEM = `flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-ui hover:bg-ink/[0.05] ${FOCUS}`;

/** O item que a última ação mexeu (`?feito=`): acende em laranja e apaga. */
export const flash = (on: boolean) => (on ? "animate-flash motion-reduce:animate-none" : "");

/* ——— Tarja (a faixa preta do site) e a folha branca ao lado ——— */

/* o contorno padrão é `ink`, que na tarja preta some — aqui o foco é creme */
export const ON_CHROME_FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-chrome-ink";
export const ON_CHROME_LINK = "hover:text-chrome-ink hover:underline";

/* Botão 3D em três camadas de sombra: um fio claro no topo (a luz batendo na quina), o lábio
   sólido — a lateral da tecla, sempre a própria cor da face escurecida — e uma sombra difusa de
   verdade no chão. No clique a tecla desce o lábio inteiro e a sombra encolhe junto.
   Sem pílula de propósito: é a peça que mais tem que parecer tecla. Cada variante só define
   `--face` e `--lip`; a mecânica é uma só. `--drop` troca só a sombra do chão e `--hover` o filtro
   do hover, para a variante que pede outro. */
const PRESS_3D =
  "inline-flex min-h-[52px] select-none items-center justify-center gap-2 rounded-lg bg-[var(--face)] px-7 text-ui font-bold transition-[transform,box-shadow,filter,background-color] duration-150 hover:[filter:var(--hover,brightness(1.1))] " +
  "[box-shadow:inset_0_1px_0_rgb(255_255_255/0.22),0_6px_0_0_var(--lip),var(--drop,0_14px_18px_-4px_rgb(0_0_0/0.6))] " +
  "active:translate-y-[6px] active:[box-shadow:inset_0_1px_0_rgb(255_255_255/0.22),0_0_0_0_var(--lip),0_3px_6px_-2px_rgb(0_0_0/0.6)]";
/* laranja; o lábio é o próprio laranja com preto, não outro tom de laranja */
export const CONTACT_3D = `${PRESS_3D} text-accent-ink [--face:rgb(var(--accent))] [--lip:color-mix(in_srgb,rgb(var(--accent))_60%,black)]`;
/* Creme: o CV da tarja e o "Ver o site" dos destaques, a mesma tecla nos dois. Na tarja,
   grafite com lábio escuro sumia no preto; na folha branca é o lábio escuro que desenha a tecla. */
export const CV_3D = `${PRESS_3D} text-chrome [--face:rgb(var(--chrome-ink))] [--lip:color-mix(in_srgb,rgb(var(--chrome-ink))_55%,black)]`;
/* a mesma tecla em grafite, para a folha branca (CV da barra do celular) */
export const DARK_3D = `${PRESS_3D} text-chrome-ink [--face:rgb(var(--chrome))] [--lip:black]`;

/* Tecla pequena de alternar (o filtro de trilha da tarja): a mesma mecânica em escala menor.
   Solta é creme, como o CV; ligada fica laranja, como o contato, e meio afundada — o lábio desce
   pela metade, então dá para ver de longe qual está apertada. `focus`: o contorno creme é o da
   tarja; na folha (filtros do painel) quem chama passa o FOCUS. */
const TOGGLE_BASE =
  "inline-flex min-h-[34px] select-none items-center gap-1.5 rounded-md bg-[var(--face)] px-3 text-meta font-bold transition-[transform,box-shadow,filter] duration-150 hover:brightness-110 active:translate-y-[4px] active:[box-shadow:inset_0_1px_0_rgb(255_255_255/0.22),0_0_0_0_var(--lip),0_2px_4px_-2px_rgb(0_0_0/0.6)]";
const TOGGLE_OFF =
  "text-chrome [--face:rgb(var(--chrome-ink))] [--lip:color-mix(in_srgb,rgb(var(--chrome-ink))_55%,black)] [box-shadow:inset_0_1px_0_rgb(255_255_255/0.22),0_4px_0_0_var(--lip),0_9px_12px_-3px_rgb(0_0_0/0.6)]";
const TOGGLE_ON =
  "translate-y-[2px] text-accent-ink [--face:rgb(var(--accent))] [--lip:color-mix(in_srgb,rgb(var(--accent))_60%,black)] [box-shadow:inset_0_1px_0_rgb(255_255_255/0.22),0_2px_0_0_var(--lip),0_5px_8px_-3px_rgb(0_0_0/0.6)]";
export const toggleKey = (on: boolean, focus = ON_CHROME_FOCUS) => `${TOGGLE_BASE} ${on ? TOGGLE_ON : TOGGLE_OFF} ${focus}`;

/* Cabeçalho de seção da folha: título à esquerda, número à direita e o fio embaixo de borda a borda
   da folha — as margens negativas desfazem o padding dela (px-5 / lg:px-14) e o padding devolve o
   alinhamento do texto. Toda seção da folha usa este, para o fio nunca parar antes da borda. */
export const SHEET_HEADER =
  "-mx-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink/15 px-5 pb-3 lg:-mx-14 lg:px-14";
export const SHEET_TITLE = "text-ui font-bold uppercase tracking-[0.06em] text-ink";
export const SHEET_COUNT = "font-mono text-meta text-ink/60";

/* Seta redonda branca dos carrosséis de thumbnails; a posição vertical e o contorno de foco vêm
   de quem usa, porque mudam com o fundo (escuro na página de thumbnails, branco na home). */
export const CAROUSEL_ARROW =
  "absolute flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_16px_-4px_rgb(0_0_0/0.4)] transition-[opacity,transform] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
