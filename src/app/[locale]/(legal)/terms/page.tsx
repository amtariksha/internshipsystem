import { useTranslations } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  const t = useTranslations("legal");

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">{t("termsTitle")}</h1>
      <p className="mt-2 text-muted-foreground">{t("termsDescription")}</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>{t("termsContent")}</p>
      </div>
    </section>
  );
}
