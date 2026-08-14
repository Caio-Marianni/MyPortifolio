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
        unifraktur: ['"Unifraktur"', "serif"],
        /* fallback explícito: o arquivo do JetBrains ainda não está no repo (ver globals.css) */
        "jetbrains-mono": ['"JetBrainsMono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        "big-shoulders": ['"BigShoulders"', "sans-serif"],
        makaio: ['"Makaio"', "sans-serif"],
        ricko: ['"Ricko"', "sans-serif"],
        vacom: ['"Vacom"', "sans-serif"],
        vanta: ['"Vanta"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
