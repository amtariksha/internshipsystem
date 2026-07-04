"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { SjtCard } from "@/components/assessment/sjt-card";
import { FreeTextInput } from "@/components/assessment/free-text-input";
import { ProgressBar } from "@/components/assessment/progress-bar";
import { TimerDisplay } from "@/components/assessment/timer-display";
import { useAntiCheat } from "@/hooks/use-anti-cheat";
import { useTimer } from "@/hooks/use-timer";

interface QuestionData {
  id: string;
  type: "SJT" | "AI_FOLLOWUP" | "RAPID_FIRE";
  scenario?: string;
  prompt?: string;
  options?: { position: number; text: string }[];
  aiPrompt?: string;
  dimensionName: string;
  timeGuideSeconds: number;
}

export default function AssessmentSessionPage() {
  const t = useTranslations("assessment.session");
  const tRapid = useTranslations("rapidFire");
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const { getDeltas } = useAntiCheat();

  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<string>(
    new Date().toISOString()
  );
  const [lastSelectedOption, setLastSelectedOption] = useState<number | null>(null);

  const timer = useTimer(question?.timeGuideSeconds ?? 90);

  // Load initial state from sessionStorage or fetch
  useEffect(() => {
    const cached = sessionStorage.getItem(`assessment-${sessionId}`);
    if (cached) {
      const data = JSON.parse(cached);
      setQuestion(data.question);
      setCurrentPosition(data.currentPosition);
      setTotalQuestions(data.totalQuestions);
      sessionStorage.removeItem(`assessment-${sessionId}`);
    }
    setQuestionStartTime(new Date().toISOString());
  }, [sessionId]);

  const submitResponse = useCallback(
    async (payload: {
      selectedOption?: number;
      freeText?: string;
    }) => {
      if (!question) return;
      setIsSubmitting(true);

      const antiCheatDeltas = getDeltas();

      try {
        const res = await fetch("/api/assessment/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            sessionQuestionId: question.id,
            selectedOption: payload.selectedOption ?? lastSelectedOption,
            freeText: payload.freeText,
            startedAt: questionStartTime,
            completedAt: new Date().toISOString(),
            tabSwitchDelta: antiCheatDeltas.tabSwitchCount,
            copyPasteDelta: antiCheatDeltas.copyPasteCount,
          }),
        });

        const data = await res.json();

        if (data.complete) {
          router.push(`/complete/${sessionId}`);
          return;
        }

        setQuestion(data.question);
        setCurrentPosition(data.currentPosition);
        setQuestionStartTime(new Date().toISOString());
        setLastSelectedOption(payload.selectedOption ?? null);
      } catch (error) {
        console.error("Failed to submit response:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [question, sessionId, questionStartTime, getDeltas, router, lastSelectedOption]
  );

  if (!question) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading assessment...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header with progress and timer */}
      <div className="flex items-center justify-between">
        <ProgressBar
          current={currentPosition}
          total={totalQuestions}
          label={t("questionOf", {
            current: currentPosition,
            total: totalQuestions,
          })}
        />
        <TimerDisplay
          elapsed={timer.elapsed}
          guideSecs={timer.guideSecs}
          isOverTime={timer.isOverTime}
        />
      </div>

      {/* Rapid-fire anti-cheat banner: a prominent gut-response prompt with a
          live 20-second countdown. Speed is the signal we care about here. */}
      {question.type === "RAPID_FIRE" && (
        <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 text-center">
          <p className="text-sm font-semibold text-primary">{tRapid("label")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {tRapid("instruction")}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-primary">
            {tRapid("secondsLeft", {
              seconds: Math.max(0, question.timeGuideSeconds - timer.elapsed),
            })}
          </p>
        </div>
      )}

      {/* Question. SJT and RAPID_FIRE are both option-based (RAPID_FIRE clones an
          SJT's content) and render through SjtCard. AI_FOLLOWUP is free-text. */}
      {(question.type === "SJT" || question.type === "RAPID_FIRE") && question.options ? (
        <SjtCard
          scenario={question.scenario ?? ""}
          prompt={question.prompt ?? ""}
          options={question.options}
          onSubmit={(pos, freeText) => {
            setLastSelectedOption(pos);
            submitResponse({ selectedOption: pos, freeText });
          }}
          isSubmitting={isSubmitting}
          sjtInstruction={t("sjtInstruction")}
          noneLabel={t("noneOfAbove")}
          nonePlaceholder={t("nonePlaceholder")}
        />
      ) : (
        <FreeTextInput
          aiPrompt={question.aiPrompt ?? ""}
          onSubmit={(text) => submitResponse({ freeText: text })}
          isSubmitting={isSubmitting}
          freeTextInstruction={t("freeTextInstruction")}
        />
      )}
    </div>
  );
}
