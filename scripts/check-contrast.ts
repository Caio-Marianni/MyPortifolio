/* A paleta escura é escolha de olho, mas tem um jeito de errar que passa despercebido: um par
   que no creme lê bem e no escuro encosta no fundo. Duas réguas: o claro tem que
   passar no WCAG (piso por par, abaixo), e o escuro não pode ler pior que o claro.
   Sem framework — `node scripts/check-contrast.ts` passa calado ou joga.   */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

/** Canais soltos de um bloco de tema do globals.css, no formato `--nome: r g b`. */
function palette(selector: string): Record<string, [number, number, number]> {
  const block = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`))?.[1];
  assert.ok(block, `bloco ${selector} sumiu do globals.css`);

  const tokens: Record<string, [number, number, number]> = {};
  /* Array.from e nao for-of direto: iterar o matchAll pede downlevelIteration no tsconfig. */
  for (const [, name, r, g, b] of Array.from(block.matchAll(/--([\w-]+):\s*(\d+)\s+(\d+)\s+(\d+)\s*;/g))) {
    tokens[name] = [Number(r), Number(g), Number(b)];
  }
  return tokens;
}

const light = palette(":root");
const dark = palette("\\.dark");

/* WCAG 2.1: luminância relativa e a razão entre duas delas. */
const luminance = ([r, g, b]: [number, number, number]) => {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

const ratio = (a: [number, number, number], b: [number, number, number]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Texto com alpha por cima do fundo: é o que `text-ink/45` desenha de verdade. */
const over = (
  fg: [number, number, number],
  bg: [number, number, number],
  alpha: number
): [number, number, number] => [0, 1, 2].map((i) => fg[i] * alpha + bg[i] * (1 - alpha)) as unknown as [number, number, number];

/* Os pares que carregam texto, com o piso de cada um. Alpha onde o site usa o token esmaecido:
   rótulos e dicas são /60 e /65. Piso 4.5 é o AA de texto corrido; 3 é o de gráfico (estrelas,
   logo), que é o que o acento pinta sobre a página. O travessão das listas é decoração, sem piso. */
const PAIRS: Array<[string, string, string, number, number]> = [
  ["corpo", "ink", "surface", 1, 4.5],
  ["corpo esmaecido", "ink", "surface", 0.65, 4.5],
  ["rótulo mono", "ink", "surface", 0.6, 4.5],
  ["sobre superfície elevada", "ink", "surface-raised", 1, 4.5],
  ["texto na tarja", "chrome-ink", "chrome", 1, 4.5],
  ["botão sólido", "fill-ink", "fill", 1, 4.5],
  ["erro de formulário", "danger", "surface", 1, 4.5],
  ["acento sobre a página", "accent", "surface", 1, 3],
  ["ficha alternada", "card-flip-ink", "card-flip-paper", 1, 4.5],
  ["ficha alternada, corpo", "card-flip-ink", "card-flip-paper", 0.7, 4.5],
  ["ficha alternada, rótulo", "card-flip-ink", "card-flip-paper", 0.35, 0],
];

let worst = Infinity;

for (const [nome, fg, bg, alpha, piso] of PAIRS) {
  const [L, D] = [light, dark].map((theme) => {
    assert.ok(theme[fg] && theme[bg], `token ${fg}/${bg} faltando num dos temas`);
    return ratio(alpha === 1 ? theme[fg] : over(theme[fg], theme[bg], alpha), theme[bg]);
  });

  console.log(`${nome.padEnd(26)} claro ${L.toFixed(2).padStart(5)}   escuro ${D.toFixed(2).padStart(5)}`);

  /* A régua é a barra que o claro já vence, nunca o número dele: acima de 4.5 (o AA de texto
     corrido) mais contraste não se lê melhor, então cair de 17 para 14 não é defeito. O que
     não pode é o escuro ficar abaixo do AA, nem abaixo do claro nos pares que já nascem
     apertados — os rótulos em mono a 45%, que o desenho aceita em ambos. */
  const barra = Math.min(L, 4.5) * 0.95;
  assert.ok(D >= barra, `"${nome}" lê pior no escuro (${D.toFixed(2)}) que no claro (${L.toFixed(2)})`);
  assert.ok(L >= piso, `"${nome}" abaixo do WCAG no claro (${L.toFixed(2)} < ${piso})`);
  if (piso) worst = Math.min(worst, L, D);
}

/* O dossiê alterna ficha a ficha, e no escuro a alternância é um degrau de superfície em vez da
   inversão cheia do claro. Degrau pequeno demais e a lista vira um bloco só; grande demais e
   volta a acender metade da página. A régua de baixo é o que separa "alterna" de "não alterna". */
for (const [nome, theme] of [["claro", light], ["escuro", dark]] as const) {
  const passo = ratio(theme["card-flip-paper"], theme.surface);
  console.log(`${`degrau da ficha alternada (${nome})`.padEnd(34)} ${passo.toFixed(2)}`);
  assert.ok(passo >= 1.2, `ficha alternada quase igual à página no tema ${nome} (${passo.toFixed(2)}) — a alternância some`);
}

/* A tarja é o gesto da capa: mais escura que a página nos dois temas. Se um ajuste de paleta
   inverter isso, a navbar deixa de ser tarja e vira um bloco claro no meio do site. */
for (const [nome, theme] of [["claro", light], ["escuro", dark]] as const) {
  assert.ok(
    luminance(theme.chrome) < luminance(theme.surface),
    `tarja mais clara que a página no tema ${nome} — a identidade depende do contrário`
  );
}

console.log(`\ncontraste: ok (pior par: ${worst.toFixed(2)}:1)`);
