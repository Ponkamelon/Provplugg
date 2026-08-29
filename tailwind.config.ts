import type { Config } from "tailwindcss";

// Design tokens for ProvPlugget — se app/globals.css för CSS-variablerna.
// Känsla: ungdomlig, äventyrlig, lätt rebellisk kustkänsla. "Vi fixar det."
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: "#F4EBD6", // bakgrund — torr sand
          deep: "#E3D3AC", // kant/divider — våt sand
        },
        navy: "#163449", // primärtext — natthav
        ocean: {
          DEFAULT: "#1E7291", // primära knappar/länkar
          dark: "#124F63",
        },
        turquoise: "#6FC2B4", // sekundär accent — bleknad turkos
        seafoam: "#E4F1EA", // ljusa kort/ytor
        coral: {
          DEFAULT: "#FF7A59", // call-to-action / highlight
          dark: "#E0603F",
        },
        sun: "#F4B942", // framgång, stjärnor, highlights
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "1.25rem",
      },
      boxShadow: {
        card: "0 4px 0 0 rgba(22, 52, 73, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
