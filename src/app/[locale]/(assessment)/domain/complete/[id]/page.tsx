"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreData {
  composite_score: number;
  proficiency_level: string;
  mcq_score: number;
  ai_probe_score: number | null;
  questions_total: number;
  questions_correct: number;
}

export default function DomainCompletePage() {
  const t = useTranslations("domainAssessment");
  const tp = useTranslations("domainAssessment.proficiency");
  const ts = useTranslations("domainAssessment.scoreCard");
  const params = useParams();
  const sessionId = params.id as string;

  const [score, setScore] = useState<ScoreData | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function generateScore() {
      try {
        const res = await fetch("/api/domain/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (res.ok) {
          setScore(data);
        } else {
          setError(data.error ?? "Failed to generate score");
        }
      } catch {
        setError("Network error");
      } finally {
        setIsGenerating(false);
      }
    }

    generateScore();
  }, [sessionId]);

  const proficiencyColors: Record<string, string> = {
    EXPERT: "bg-green-500/20 text-green-400 border-green-500/30",
    ADVANCED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    INTERMEDIATE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    BEGINNER: "bg-muted text-muted-foreground",
  };

  if (isGenerating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">{t("complete.description")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t("complete.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {score && (
            <>
              <div className="text-center">
                <Badge className={`px-4 py-1 text-sm ${proficiencyColors[score.proficiency_level] ?? ""}`}>
                  {tp(score.proficiency_level as "EXPERT" | "ADVANCED" | "INTERMEDIATE" | "BEGINNER")}
                </Badge>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
                  <span className="text-sm text-muted-foreground">{ts("compositeScore")}</span>
                  <span className="text-2xl font-bold">{score.composite_score}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{ts("mcqAccuracy")}</span>
                  <span className="font-mono">{score.questions_correct}/{score.questions_total} ({score.mcq_score}%)</span>
                </div>
                {score.ai_probe_score !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{ts("aiProbeScore")}</span>
                    <span className="font-mono">{score.ai_probe_score}/100</span>
                  </div>
                )}
              </div>
            </>
          )}

          <Link href="/">
            <Button className="w-full">Back to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
