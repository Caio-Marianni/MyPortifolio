import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
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
