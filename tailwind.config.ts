import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      /* Os canais RGB moram no globals.css, em `:root` e `.dark`; aqui só o nome do papel.
         `<alpha-value>` é o que faz `text-ink/45` e `border-chrome-ink/10` existirem — sem ele
         cada opacidade do site (e são dezenas) viraria uma variável nova. Por isso token
         nomeado em vez de `bg-[var(--ink)]` solto no arbitrário. */
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-raised": "rgb(var(--surface-raised) / <alpha-value>)",
        "surface-sunken": "rgb(var(--surface-sunken) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        /* A tarja preta da navbar/rail: elemento de identidade, não "o modo escuro".
           Nos dois temas ela é mais escura que a página. */
        chrome: "rgb(var(--chrome) / <alpha-value>)",
        "chrome-ink": "rgb(var(--chrome-ink) / <alpha-value>)",
        /* Botão sólido invertido: escuro sobre creme no claro, creme sobre escuro no escuro. */
        fill: "rgb(var(--fill) / <alpha-value>)",
        "fill-ink": "rgb(var(--fill-ink) / <alpha-value>)",
        "fill-lip": "rgb(var(--fill-lip) / <alpha-value>)",
        "surface-hover": "rgb(var(--surface-hover) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-hover": "rgb(var(--accent-hover) / <alpha-value>)",
        /* texto sobre o laranja: branco no claro, quase-preto no escuro, onde o laranja sobe */
        "accent-ink": "rgb(var(--accent-ink) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        /* Par da ficha do dossiê. Não mora no :root: cada ficha o define no próprio article,
           apontando para a página ou para o par `card-flip` — ver project-dossier.tsx. */
        "card-ink": "rgb(var(--card-ink) / <alpha-value>)",
        "card-paper": "rgb(var(--card-paper) / <alpha-value>)",
      },
      /* Três degraus de corpo e nada entre eles: meta (rótulos, legendas, faixas), ui (menus,
         botões, linhas de lista) e body (texto corrido). Títulos ficam no `clamp` de cada peça.
         Campo de formulário é 16px fixo no FIELD — piso do Safari, não degrau da escala. */
      fontSize: {
        meta: "12px",
        ui: "13.5px",
        body: "15px",
      },
      /* Uma abertura só para a Makaio em caixa alta, em qualquer título do site e do painel. */
      letterSpacing: {
        display: "0.08em",
      },
      /* A voz técnica do site é o `font-mono` que já vem no Tailwind — nada a declarar aqui.
         Só as três famílias que o repo carrega de fato. */
      /* Brilho das estrelas da nota: parado quase o tempo todo, um lampejo curto e volta.
         O `drop-shadow` em `em` acompanha o tamanho da estrela. */
      keyframes: {
        "star-shine": {
          "0%, 70%, 100%": { filter: "brightness(1)" },
          "78%": { filter: "brightness(1.55) drop-shadow(0 0 0.3em rgb(var(--accent) / 0.75))" },
        },
        /* estrelas da nota enchendo da esquerda para a direita (Stars `reveal`); o fim é o recorte da nota */
        "star-fill": {
          from: { clipPath: "inset(0 100% 0 0)" },
          to: { clipPath: "var(--fill-end)" },
        },
        /* sobe um pouco e aparece: cards de avaliação ao trocar o filtro, conteúdo da home no fim da
           intro, linhas do "Ver mais" e janelas (<dialog>) ao abrir */
        rise: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "none" },
        },
        /* o fundo escuro atrás de uma janela (<dialog>) aparecendo junto com ela */
        "fade-in": { from: { opacity: "0" } },
        /* intro "faixa partida": a linha laranja risca a borda da tarja de cima
           para baixo e some; a capa preta sai para a direita (desktop) ou para baixo (celular) */
        "faixa-draw": { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
        "fade-out": { to: { opacity: "0" } },
        "faixa-open-x": { to: { transform: "translateX(101%)" } },
        "faixa-open-y": { to: { transform: "translateY(101%)" } },
      },
      animation: {
        "star-shine": "star-shine 4.5s ease-in-out infinite",
        /* 800ms e ease-out cúbico: a mesma conta do use-count-up, então a cor anda junto com o número */
        "star-fill": "star-fill 800ms cubic-bezier(0.33, 1, 0.68, 1) both",
        /* `both`: o card fica invisível durante o próprio atraso, senão piscava antes de entrar */
        rise: "rise 450ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
        "fade-in": "fade-in 300ms ease-out both",
        /* tempos da intro: linha em 0–450ms, capa abre de 520ms a 1270ms, conteúdo sobe a partir de 950ms */
        "faixa-line": "faixa-draw 450ms cubic-bezier(0.7, 0, 0.2, 1) both, fade-out 300ms linear 1000ms forwards",
        "faixa-open-x": "faixa-open-x 750ms cubic-bezier(0.7, 0, 0.2, 1) 520ms forwards",
        "faixa-open-y": "faixa-open-y 750ms cubic-bezier(0.7, 0, 0.2, 1) 520ms forwards",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        makaio: ["var(--font-makaio)", "sans-serif"],
        ricko: ["var(--font-ricko)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
