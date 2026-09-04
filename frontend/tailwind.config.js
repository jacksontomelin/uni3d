/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        graphite: { DEFAULT: "#0d1117", 900: "#0a0e14", 800: "#0d1117", 700: "#161b22", 600: "#1c2230", 500: "#2a3140" },
        edge: "#2a3140",
        mint: { DEFAULT: "#00e5a0", dark: "#00b37e", dim: "#0a3d2e", glow: "#00e5a0" },
        filament: "#ff6b35",
        ice: "#f0f3f6",
        fog: "#7d8590",
        fog2: "#4a525e",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      boxShadow: {
        panel: "0 0 0 1px #2a3140, 0 8px 24px rgba(0,0,0,.4)",
        glow: "0 0 24px rgba(0,229,160,.25)",
      },
    },
  },
  plugins: [],
};
