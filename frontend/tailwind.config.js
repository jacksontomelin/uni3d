/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta VS Code Dark+
        vsbg: "#1e1e1e",        // editor background
        vsside: "#252526",      // sidebar
        vsact: "#333333",       // activity bar
        vstab: "#2d2d2d",       // tab bar
        vstabon: "#1e1e1e",     // active tab
        vsline: "#3e3e42",      // borders
        vsblue: "#007acc",      // accent (status bar / active)
        vscyan: "#4ec9b0",      // types
        vsyellow: "#dcdcaa",    // functions
        vspurple: "#c586c0",    // keywords
        vsorange: "#ce9178",    // strings
        vsgreen: "#6a9955",     // comments
        vsblue2: "#569cd6",     // keywords blue
        vstext: "#d4d4d4",      // default text
        vsdim: "#858585",       // dim / line numbers
        vssel: "#264f78",       // selection
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "Menlo", "monospace"],
        sans: ["-apple-system", "'Segoe UI'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
