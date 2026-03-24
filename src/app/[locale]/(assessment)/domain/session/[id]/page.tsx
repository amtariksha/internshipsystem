"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DomainMcqCard } from "@/components/domain/domain-mcq-card";
import { DomainProbeInput } from "@/components/domain/domain-probe-input";
import { DomainProgress } from "@/components/domain/domain-progress";

interface QuestionData {
  id: string;
  text: string;
  subdomain: string | null;
  difficulty: number;
  options: { position: number; text: string }[];
  timeGuideSeconds: number;
}

export default function DomainSessionPage() {
  const t = useTranslations("domainAssessment");
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [estimatedRange, setEstimatedRange] = useState("8-15");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [probeMode, setProbeMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [probeQuestionId, setProbeQuestionId] = useState("");
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({ show: false, isCorrect: false });

  // Load initial question from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(`domain_session_${sessionId}`);
    if (stored) {
      const data = JSON.parse(stored);
      setQuestion(data.question);
      setCurrentPosition(data.currentPosition);
      setEstimatedRange(data.estimatedQuestions);
      sessionStorage.removeItem(`domain_session_${sessionId}`);
    }
  }, [sessionId]);

  const resetTimer = useCallback(() => {
    setStartedAt(new Date().toISOString());
  }, []);

  async function handleMcqSubmit(selectedPosition: number) {
    if (!question) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/domain/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: question.id,
          selectedOption: selectedPosition,
          startedAt,
          completedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      // Show brief feedback
      if (data.isCorrect !== undefined) {
        setFeedback({ show: true, isCorrect: data.isCorrect });
        await new Promise((resolve) => setTimeout(resolve, 800));
        setFeedback({ show: false, isCorrect: false });
      }

      if (data.complete) {
        router.push(`/domain/complete/${sessionId}`);
        return;
      }

      if (data.needsProbe) {
        setProbeMode(true);
        setAiPrompt(data.aiPrompt);
        setProbeQuestionId(data.questionId);
        resetTimer();
      } else {
        setQuestion(data.question);
        setCurrentPosition(data.currentPosition);
        setProbeMode(false);
        resetTimer();
      }
    } catch {
      // Network error — retry
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProbeSubmit(freeText: string) {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/domain/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: probeQuestionId,
          freeText,
          startedAt,
          completedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (data.complete) {
        router.push(`/domain/complete/${sessionId}`);
        return;
      }

      setQuestion(data.question);
      setCurrentPosition(data.currentPosition);
      setProbeMode(false);
      resetTimer();
    } catch {
      // Network error
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!question && !probeMode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{t("submitting")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <DomainProgress
        currentPosition={currentPosition}
        estimatedRange={estimatedRange}
        difficulty={question?.difficulty ?? 3}
        questionLabel={t("questionOf", { current: currentPosition })}
        difficultyLabel={t("difficulty", { level: question?.difficulty ?? 3 })}
      />

      {feedback.show && (
        <div className={`rounded-lg p-2 text-center text-sm font-medium ${
          feedback.isCorrect ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
        }`}>
          {feedback.isCorrect ? "Correct!" : "Incorrect"}
        </div>
      )}

      <Card>
        <CardHeader />
        <CardContent>
          {probeMode ? (
            <DomainProbeInput
              aiPrompt={aiPrompt}
              onSubmit={handleProbeSubmit}
              isSubmitting={isSubmitting}
              instruction={t("aiProbeInstruction")}
              submitLabel={t("submitting")}
            />
          ) : question ? (
            <DomainMcqCard
              questionText={question.text}
              options={question.options}
              difficulty={question.difficulty}
              subdomain={question.subdomain}
              onSubmit={handleMcqSubmit}
              isSubmitting={isSubmitting}
              submitLabel={t("submitting")}
              difficultyLabel={t("difficulty", { level: question.difficulty })}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
