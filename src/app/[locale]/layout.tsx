import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { allFontVariables } from "@/lib/utils/fonts";
import { routing, type Locale } from "@/lib/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://aedhas.com";

const localeNames: Record<string, string> = {
  en: "en_IN",
  hi: "hi_IN",
  te: "te_IN",
  ta: "ta_IN",
  kn: "kn_IN",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const title = messages.common?.tagline
    ? `AEDHAS — ${messages.common.tagline}`
    : "AEDHAS — AI-Powered Assessment Platform";
  const description =
    messages.landing?.hero?.subtitle ||
    "Discover your entrepreneurial DNA with AI-powered personality assessment across 12 scientifically-grounded dimensions.";

  const alternates: Record<string, string> = {};
  for (const loc of routing.locales) {
    alternates[loc] = `${BASE_URL}/${loc}`;
  }

  return {
    title: {
      default: title,
      template: "%s | AEDHAS",
    },
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      siteName: "AEDHAS",
      locale: localeNames[locale] || "en_IN",
      type: "website",
      url: `${BASE_URL}/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${allFontVariables} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
