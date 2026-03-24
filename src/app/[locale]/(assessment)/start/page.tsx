"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { ConsentForm } from "@/components/assessment/consent-form";

export default function AssessmentStartPage() {
  const t = useTranslations("assessment.start");
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleBegin() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/assessment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, weightProfile: "STARTUP_FOUNDER" }),
      });

      if (res.status === 409) {
        const data = await res.json();
        router.push(`/assessment/session/${data.sessionId}`);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to start assessment");
        return;
      }

      const data = await res.json();
      // Store session data in sessionStorage for the assessment page
      sessionStorage.setItem(
        `assessment-${data.sessionId}`,
        JSON.stringify(data)
      );
      router.push(`/assessment/session/${data.sessionId}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <ConsentForm
        title={t("title")}
        description={t("description")}
        consent={t("consent")}
        rules={{
          title: t("rules.title"),
          items: [
            t("rules.noBackNav"),
            t("rules.noTimeLimit"),
            t("rules.honest"),
            t("rules.noCopying"),
          ],
        }}
        languageNote={t("languageNote")}
        beginLabel={t("begin")}
        onBegin={handleBegin}
        isLoading={isLoading}
      />
    </div>
  );
}
