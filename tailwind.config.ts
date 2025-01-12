import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        black: "#050a0e",
        white: "#fefefe",
        secondary: "#d0d0d0",
        gray: "#3a3d3f",

        hovered: "#242424",
        subtle: "#282828",
      },
    },
  },
  plugins: [],
} satisfies Config;
