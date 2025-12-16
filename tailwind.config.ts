import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        board: {
          bg: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          frame: "var(--frame-color)",
          point: "var(--point-color)",
          line: "var(--line-color)",
          accent: "var(--accent)",
        },
      },
      animation: {
        "point-pulse": "point-pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-out": "fade-out 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.15s ease-out",
        "modal-in": "modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "modal-out": "modal-out 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "uv-glow": "uv-glow 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        "point-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 var(--point-glow)",
            transform: "scale(1)",
          },
          "50%": {
            boxShadow: "0 0 20px 10px var(--point-glow)",
            transform: "scale(1.1)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scale-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.9)" },
        },
        "modal-in": {
          "0%": { opacity: "0", transform: "translateY(60px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "modal-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(40px)" },
        },
        "uv-glow": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.3" },
          "50%": { transform: "scale(1.4)", opacity: "0.1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
