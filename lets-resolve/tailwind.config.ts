import type { Config } from "tailwindcss";

// Every custom color below is a "R G B" triplet CSS variable (see
// globals.css/themes/*.css) wrapped in rgb(... / <alpha-value>) so Tailwind's
// opacity modifiers (e.g. `ring-accent/15`) work against them.
function withOpacity(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: withOpacity("--color-primary"),
        secondary: withOpacity("--color-secondary"),
        ternary: withOpacity("--color-ternary"),
        buttons: withOpacity("--color-buttons"),
        "buttons-hover": withOpacity("--color-buttons-hover"),
        typography: withOpacity("--color-typography"),
        muted: withOpacity("--color-muted"),
        shadow: withOpacity("--color-shadow"),
        header: withOpacity("--color-header"),
        selected: withOpacity("--color-selected"),
        separator: withOpacity("--color-separator"),
        accent: withOpacity("--color-accent"),
        "accent-soft": withOpacity("--color-accent-soft"),
        danger: withOpacity("--color-danger"),
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 15, 12, 0.04), 0 10px 28px -14px rgba(15, 15, 12, 0.18)",
        "card-hover":
          "0 2px 4px rgba(15, 15, 12, 0.06), 0 16px 36px -14px rgba(15, 15, 12, 0.22)",
        pop: "0 8px 30px -8px rgba(15, 15, 12, 0.35)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
