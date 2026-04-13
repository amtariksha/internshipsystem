"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AssessmentCompletePage() {
  const t = useTranslations("assessment.complete");
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [isGenerating, setIsGenerating] = useState(true);
  const [reportSlug, setReportSlug] = useState<string | null>(null);

  useEffect(() => {
    async function generateReport() {
      try {
        const res = await fetch("/api/assessment/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (res.ok) {
          const data = await res.json();
          setReportSlug(data.reportSlug);
        }
      } finally {
        setIsGenerating(false);
      }
    }

    generateReport();
  }, [sessionId]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="space-y-4">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">{t("generating")}</p>
            </div>
          ) : reportSlug ? (
            <Button
              onClick={() => router.push(`/reports/${reportSlug}`)}
              className="w-full"
            >
              {t("viewReport")}
            </Button>
          ) : (
            <p className="text-sm text-destructive">
              Report generation failed. Please try again later.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
