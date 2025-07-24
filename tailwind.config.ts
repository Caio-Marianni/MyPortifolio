import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        neon: ["Neon", "sans-serif"],
        tech: ["Tech", "sans-serif"],
        numberL: ["numberL", "sans-serif"],
        numberM: ["NumberM", "sans-serif"],
      },
      keyframes: {
        glitch: {
          "2%, 64%": { transform: "translate(2px, 0) skew(0deg)" },
          "4%, 60%": { transform: "translate(-2px, 0) skew(0deg)" },
          "62%": { transform: "translate(0, 0) skew(5deg)" },
        },
        float: {
          "0%, 100%": { transform: "translate(60px, -40px)" },
          "25%": { transform: "translate(110px, -20px)" },
          "50%": { transform: "translate(40px, -80px)" },
          "75%": { transform: "translate(110px, -80px)" },
        },
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        glitch: "glitch 1s linear infinite",
      },
    },
  },
} satisfies Config;
