"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AiCollabScoreData {
  composite_score: number;
  proficiency_level: string;
  decomposition_score: number;
  first_principles_score: number;
  debugging_score: number;
  communication_score: number;
  efficiency_score: number;
  quality_score: number;
  iteration_score: number;
  creativity_score: number;
  ai_analysis?: {
    summary?: string;
    strengths?: string[];
    improvements?: string[];
  };
}

export default function AiCollabCompletePage() {
  const t = useTranslations("aiCollab");
  const td = useTranslations("aiCollab.dimensions");
  const params = useParams();
  const sessionId = params.id as string;

  const [score, setScore] = useState<AiCollabScoreData | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function generateScore() {
      try {
        const res = await fetch("/api/ai-collab/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (res.ok) {
          setScore(data);
        } else {
          setError(data.error ?? "Scoring failed");
        }
      } catch {
        setError("Network error");
      } finally {
        setIsGenerating(false);
      }
    }

    generateScore();
  }, [sessionId]);

  const dimensionEntries = score ? [
    { key: "decomposition", score: score.decomposition_score },
    { key: "firstPrinciples", score: score.first_principles_score },
    { key: "debugging", score: score.debugging_score },
    { key: "communication", score: score.communication_score },
    { key: "efficiency", score: score.efficiency_score },
    { key: "quality", score: score.quality_score },
    { key: "iteration", score: score.iteration_score },
    { key: "creativity", score: score.creativity_score },
  ] : [];

  if (isGenerating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">{t("generating")}</p>
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
            <Link href="/"><Button className="mt-4">Back to Dashboard</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("completeTitle")}</h1>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
          <span className="text-sm text-muted-foreground">Composite Score</span>
          <span className="text-2xl font-bold">{score?.composite_score ?? 0}</span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
        {score && (
          <div className="mt-2">
            <Badge>{score.proficiency_level}</Badge>
          </div>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>AI Collaboration Dimensions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {dimensionEntries.map((dim) => (
            <div key={dim.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{td(dim.key as "decomposition")}</span>
                <span className="font-mono">{dim.score.toFixed(1)}/5</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${(dim.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {score?.ai_analysis?.summary && (
        <Card>
          <CardHeader><CardTitle>Analysis</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">{score.ai_analysis.summary}</p>
            {score.ai_analysis.strengths && score.ai_analysis.strengths.length > 0 && (
              <div>
                <p className="text-xs font-medium text-green-400 mb-1">Strengths</p>
                <ul className="space-y-1">
                  {score.ai_analysis.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground">+ {s}</li>
                  ))}
                </ul>
              </div>
            )}
            {score.ai_analysis.improvements && score.ai_analysis.improvements.length > 0 && (
              <div>
                <p className="text-xs font-medium text-yellow-400 mb-1">Areas for Improvement</p>
                <ul className="space-y-1">
                  {score.ai_analysis.improvements.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground">&#8599; {s}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Link href="/">
        <Button className="w-full">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
