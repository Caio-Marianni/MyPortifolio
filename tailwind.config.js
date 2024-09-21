/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "#000000",
      none: "rgba(0, 0, 0, 0.0)",
      tranparent: "rgba(0, 0, 0, 0.5)",
      borderColor: "#7d7d7d",
      // 60% color
      containerColor: "#0f0f0f",
      containerColorDarker: "#0a0a0a",
      containerColorSecondary: "#1f1f1f",
      cardColor: "#1f1f1f",
      cardColorSec: "rgba(26, 26, 26, 0.25)",
      cardColorShadow: "#282828",
      // 10% color
      LittleDetail: "#cc4100",
      LittleDetailAction: "#ff5404",
    },
  },
  plugins: [],
};
