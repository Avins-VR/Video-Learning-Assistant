/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0c12",
        glass: "rgba(255,255,255,0.04)",
        "glass-strong": "rgba(255,255,255,0.07)",
        "glass-hover": "rgba(255,255,255,0.10)",
        border: "rgba(255,255,255,0.09)",
        "border-strong": "rgba(255,255,255,0.18)",
        text: "#eef0f6",
        "text-dim": "#9aa1b5",
        "text-faint": "#6b7184",
        indigo: "#6e6bff",
        "indigo-dim": "#4a47b8",
        cyan: "#4fd1ff",
        sage: "#3ddc97",
        "sage-soft": "rgba(61,220,151,0.12)",
        amber: "#ffb454",
        "amber-soft": "rgba(255,180,84,0.12)",
        rose: "#ff6b81",
        "rose-soft": "rgba(255,107,129,0.12)",
        "indigo-soft": "rgba(110,107,255,0.14)",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        grad: "linear-gradient(135deg, #6e6bff, #4fd1ff)",
      },
      boxShadow: {
        sm2: "0 2px 10px rgba(0,0,0,0.25)",
        md2: "0 10px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(110,107,255,0.25), 0 8px 24px rgba(110,107,255,0.18)",
      },
      borderRadius: {
        ed: "16px",
        "ed-sm": "10px",
      },
    },
  },
  plugins: [],
};
