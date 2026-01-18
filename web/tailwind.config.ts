import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kimce: {
          50: "#eff5ff",
          100: "#dce8ff",
          200: "#b8d2ff",
          300: "#8bb4ff",
          400: "#5b8dff",
          500: "#2f6bff",
          600: "#1e4fe0",
          700: "#1c3cb5",
          800: "#1b3290",
          900: "#192b73"
        }
      },
      boxShadow: {
        soft: "0px 4px 18px rgba(15, 23, 42, 0.08)",
        float: "0px 18px 40px rgba(15, 23, 42, 0.12)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      }
    }
  },
  plugins: []
};

export default config;
