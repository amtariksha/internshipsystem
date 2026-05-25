"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-auto border-t border-border py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
        <div className="mb-3 flex items-center justify-center gap-4">
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            {t("privacy")}
          </Link>
          <span aria-hidden="true">&middot;</span>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            {t("terms")}
          </Link>
        </div>
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
