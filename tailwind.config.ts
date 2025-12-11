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
        // Papers Please fonts
        pixel: ["var(--font-pixel)", "monospace"],
        document: ["var(--font-document)", "monospace"],
        stamp: ["var(--font-stamp)", "cursive"],
      },
      colors: {
        // Papers Please color palette
        passport: {
          beige: "#838166",
          tan: "#8f8e75",
          muted: "#9c9a85",
          light: "#c1c0b3",
          paper: "#f3f2f0",
        },
        stamp: {
          approved: "#2d5016",
          rejected: "#6f1615",
          pending: "#e26968",
          ink: "#801918",
        },
        office: {
          desk: "#4a4a3a",
          metal: "#6b7280",
          shadow: "#1f2937",
        },
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
        // Papers Please animations
        paperSlide: {
          "0%": { transform: "translateY(100%) rotate(2deg)", opacity: "0" },
          "100%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
        },
        stamp: {
          "0%": { transform: "scale(0) rotate(-15deg)", opacity: "0" },
          "50%": { transform: "scale(1.2) rotate(-15deg)", opacity: "0.8" },
          "100%": { transform: "scale(1) rotate(-15deg)", opacity: "1" },
        },
        documentPull: {
          "0%": { transform: "translateX(-100%)" },
          "60%": { transform: "translateX(2%)" },
          "100%": { transform: "translateX(0)" },
        },
        // Character idle animation
        idle: {
          "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
          "50%": { transform: "translateX(-50%) translateY(-4px)" },
        },
        // Fade in animation
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Blink animation
        blink: {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0)" },
        },
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        glitch: "glitch 1s linear infinite",
        // Papers Please animations
        "paper-slide-in": "paperSlide 0.8s ease-out",
        "paper-slide-out": "paperSlide 0.6s ease-in reverse",
        "stamp-approve": "stamp 0.5s ease-out",
        "document-pull": "documentPull 1s cubic-bezier(0.4, 0, 0.2, 1)",
        // Character & UI animations
        idle: "idle 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        blink: "blink 4s ease-in-out infinite",
      },
    },
  },
} satisfies Config;
