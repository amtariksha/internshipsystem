import {
  Noto_Sans,
  Noto_Sans_Devanagari,
  Noto_Sans_Telugu,
  Noto_Sans_Tamil,
  Noto_Sans_Kannada,
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

export const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  variable: "--font-noto-telugu",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-noto-tamil",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const notoSansKannada = Noto_Sans_Kannada({
  subsets: ["kannada"],
  variable: "--font-noto-kannada",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const localeFontMap: Record<string, string> = {
  en: notoSans.variable,
  hi: notoSansDevanagari.variable,
  te: notoSansTelugu.variable,
  ta: notoSansTamil.variable,
  kn: notoSansKannada.variable,
};

export const allFontVariables = [
  notoSans.variable,
  notoSansDevanagari.variable,
  notoSansTelugu.variable,
  notoSansTamil.variable,
  notoSansKannada.variable,
].join(" ");
