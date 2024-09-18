/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dateFont: ["Six Caps", "sans-serif"],
      },
      animation: {
        move: "move 2s ease-in-out infinite",
      },
      keyframes: {
        move: {
          "0%": {
            opacity: "0",
            transform: "translateY(100%)",
          },
          "80%": {
            opacity: "1",
            transform: "translateY(-80%)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-120%)",
          },
        },
      },
    },
    colors: {
      none: "rgba(0, 0, 0, 0.0)",
      tranparent: "rgba(0, 0, 0, 0.5)",
      borderColor: "#7d7d7d",
      // 60% color
      containerColor: "#151515",
      containerColorDarker: "#a5a5a5",
      containerColorSecondary: "#262626",
      // 30% color
      cThirtyOff: "#FAF9F6",
      // 10% color
      LittleDetail: "#e65d1e",
      LittleDetailAction: "#ff5404",
    },
  },
  plugins: [],
};
