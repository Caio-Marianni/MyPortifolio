import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        roboto: ['"Roboto"', "sans-serif"],
        inter: ['"Inter"', "sans-serif"],
        rye: ['"Rye"', "cursive"],
        "kumar-one": ['"KumarOne"', "cursive"],
        "tulpen-one": ['"TulpenOne"', "cursive"],
        silkscreen: ['"Silkscreen"', "monospace"],
        "comforter-brush": ['"ComforterBrush"', "cursive"],
        monocraft: ['"Monocraft"', "monospace"],
        "jetbrains-mono": ['"JetBrainsMono"', "monospace"],
        "jetbrains-mono-nl": ['"JetBrainsMonoNL"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
