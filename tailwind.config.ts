import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'courier': ['Courier Prime', 'monospace'],
        'special': ['Special Elite', 'cursive'],
        'bebas': ['Bebas Neue', 'sans-serif'],
      },
      colors: {
        on: "var(--on)",
        off: "var(--off)",
        muted: "var(--muted)",
        glow: "var(--glow)",
        color:{
          white: "var(--color-white)",
          black: "var(--color-black)",
        },
        gradient:{
          start: "var(--gradient-start)",
          end: "var(--gradient-end)",
        },
        bg: {
          dark: "var(--bg-dark)",
          light: "var(--bg-light)",
          board: "var(--bg-board)",
        },
        file: {
          bg: "var(--file-bg)",
          border: "var(--file-border)",
          closeIcon: "var(--file-close-icon)",
          closeBg: "var(--file-close-icon-invert)",
        },
        text: {
          dark: "var(--text-dark)",
          light: "var(--text-light)",
          muted: "var(--text-muted)",
          accent: "var(--text-accent)",
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "uv-glow": "uv-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "uv-glow": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
