/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Theme tokens (CSS variables) — lets us switch themes without rewriting everything
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        surface2: "rgb(var(--surface2) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",

        // Brand (red)
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          hover: "rgb(var(--brandHover) / <alpha-value>)",
          soft: "rgb(var(--brandSoft) / <alpha-value>)",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgb(0 0 0 / 0.25)",
      },
    },
  },
  plugins: [],
};
