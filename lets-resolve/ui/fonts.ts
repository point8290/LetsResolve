import { Fraunces, Manrope } from "next/font/google";

// Display font for headings and the wordmark — a characterful serif that
// gives the brand some warmth instead of the generic-SaaS grotesk look.
export const titleFont = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Body/UI font — clean and highly legible for dense dashboard content.
export const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});
