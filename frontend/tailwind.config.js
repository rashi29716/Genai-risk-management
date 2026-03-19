/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(214 32% 91%)",
        input: "hsl(214 32% 91%)",
        ring: "hsl(215 20% 65%)",
        background: "hsl(222 47% 11%)",
        foreground: "hsl(210 40% 98%)",
        primary: {
          DEFAULT: "hsl(217 91% 60%)",
          foreground: "hsl(210 40% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(217 32% 17%)",
          foreground: "hsl(210 40% 98%)",
        },
      },
    },
  },
  plugins: [],
};

