/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#1c1917",
          light: "#44403c",
          dark: "#0c0a09",
          accent: "#d4af37",
          "accent-hover": "#b8860b",
          gold: {
            light: "#f5d061",
            DEFAULT: "#d4af37",
            dark: "#b8860b",
            deep: "#8b6914",
          },
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#fafaf9",
          dark: "#1c1917",
          "dark-elevated": "#292524",
        },
        borderc: {
          DEFAULT: "#e7e5e4",
          dark: "#44403c",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(28, 25, 23, 0.06), 0 4px 12px rgba(28, 25, 23, 0.04)",
        "card-hover": "0 4px 16px rgba(28, 25, 23, 0.08)",
        nav: "0 2px 12px rgba(28, 25, 23, 0.08)",
      },
    },
  },
  plugins: [],
};
