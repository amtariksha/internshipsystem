"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiCollabStartPage() {
  const t = useTranslations("aiCollab");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "en";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai-collab/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.sessionId) {
          router.push(`/ai-collab/session/${data.sessionId}`);
          return;
        }
        setError(data.error ?? "Failed to start");
        return;
      }

      sessionStorage.setItem(
        `ai_collab_${data.sessionId}`,
        JSON.stringify(data)
      );

      router.push(`/ai-collab/session/${data.sessionId}`);
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm space-y-2">
            <p>You will be given a real-world problem to solve with the help of an AI assistant.</p>
            <p>We evaluate <strong>how</strong> you work with AI — your prompts, debugging, iteration, and problem-solving approach.</p>
            <p>There is a time limit. Work efficiently but thoughtfully.</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleStart} disabled={isLoading} className="w-full">
            {isLoading ? "..." : t("startChallenge")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
