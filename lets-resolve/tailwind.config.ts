import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        ternary: 'var(--color-ternary)',
        buttons: 'var(--color-buttons)',
        typography: 'var(--color-typography)',
        shadow: 'var(--color-shadow)',
        header:'var(--color-header)',
        selected:'var(--color-selected)',
        separator:'var(--color-separator)'
      },
    },
  },
  plugins: [],
};
export default config;
