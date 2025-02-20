import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(-45deg, #133034, #1e3a45, #2b5b66, #1e3a45)',
      },
      backgroundSize: {
        '400': '400% 400%',
      },
      keyframes: {
        glitch: {
          "2%, 64%": { transform: "translate(2px, 0) skew(0deg)" },
          "4%, 60%": { transform: "translate(-2px, 0) skew(0deg)" },
          "62%": { transform: "translate(0, 0) skew(5deg)" },
        },
        glitchTop: {
          "2%, 64%": { transform: "translate(2px, -2px)" },
          "4%, 60%": { transform: "translate(-2px, 2px)" },
          "62%": { transform: "translate(10px, -1px) skew(-10deg)" },
        },
        glitchBottom: {
          "2%, 64%": { transform: "translate(-2px, 0)" },
          "4%, 60%": { transform: "translate(-2px, 0)" },
          "62%": { transform: "translate(-20px, 5px) skew(2deg)" },
        },
        float: {
          '0%, 100%': { transform: 'translate(60px, -40px)' },
          '25%': { transform: 'translate(110px, -20px)' },
          '50%': { transform: 'translate(40px, -80px)' },
          '75%': { transform: 'translate(110px, -80px)' },
        },
      },
      animation: {
        float: 'float 10s ease-in-out infinite',
        glitch: "glitch 1s linear infinite",
        glitchTop: "glitchTop 1s linear infinite",
        glitchBottom: "glitchBottom 1.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
