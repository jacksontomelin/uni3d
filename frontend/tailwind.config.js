/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0f2d4a", 2: "#163d63" },
        azure: { DEFAULT: "#0284c7", dark: "#0369a1", light: "#38bdf8", soft: "#e0f2fe" },
        ink: "#1e293b",
        muted: "#64748b",
        line: "#e2e8f0",
        papel: "#f1f5f9",
        ok: "#16a34a",
        warn: "#d97706",
        danger: "#dc2626",
      },
      fontFamily: {
        sans: ["-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,45,74,.08), 0 1px 2px rgba(15,45,74,.06)",
        login: "0 20px 40px rgba(0,0,0,.25)",
      },
    },
  },
  plugins: [],
};
