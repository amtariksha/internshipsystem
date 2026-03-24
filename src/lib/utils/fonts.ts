import {
  Noto_Sans,
  Noto_Sans_Devanagari,
} from "next/font/google";

export const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const localeFontMap: Record<string, string> = {
  en: notoSans.variable,
  hi: notoSansDevanagari.variable,
};
