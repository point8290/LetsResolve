import { Cambo } from "next/font/google";
import { Josefin_Sans } from "next/font/google";

export const bodyFont = Cambo({
  subsets: ["latin"],
  weight: ["400"],
});

export const titleFont = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});
