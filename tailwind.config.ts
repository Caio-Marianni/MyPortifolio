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
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      /* A voz técnica do site é o `font-mono` que já vem no Tailwind — nada a declarar aqui.
         Só as três famílias que o repo carrega de fato. */
      fontFamily: {
        inter: ['"Inter"', "sans-serif"],
        makaio: ['"Makaio"', "sans-serif"],
        ricko: ['"Ricko"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
