"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOMAINS } from "@/lib/utils/domain-constants";

export default function DomainStartPage() {
  const t = useTranslations("domainAssessment");
  const td = useTranslations("domains");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "en";

  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    if (!domain) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/domain/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.sessionId) {
          router.push(`/domain/session/${data.sessionId}`);
          return;
        }
        setError(data.error ?? "Failed to start");
        return;
      }

      // Store session data for the session page
      sessionStorage.setItem(
        `domain_session_${data.sessionId}`,
        JSON.stringify({
          sessionId: data.sessionId,
          domain,
          estimatedQuestions: data.estimatedQuestions,
          currentPosition: data.currentPosition,
          question: data.question,
        })
      );

      router.push(`/domain/session/${data.sessionId}`);
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select value={domain} onValueChange={(v) => v && setDomain(v)}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectDomain")} />
              </SelectTrigger>
              <SelectContent>
                {DOMAINS.map((d) => (
                  <SelectItem key={d.code} value={d.code}>
                    {td(d.code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleStart} disabled={!domain || isLoading} className="w-full">
            {isLoading ? "..." : t("startTest")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
