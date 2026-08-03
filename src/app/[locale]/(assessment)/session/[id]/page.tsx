"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAbandoning, setIsAbandoning] = useState(false);

  const timer = useTimer(question?.timeGuideSeconds ?? 90);

  // Hydrate from sessionStorage when arriving from the start page, otherwise
  // resume from the server. Without the server fallback a refresh, a new tab,
  // or opening the session URL directly left `question` null forever and the
  // page showed "Loading assessment" indefinitely.
  useEffect(() => {
    let cancelled = false;

    function applyState(data: {
      question: QuestionData | null;
      currentPosition: number;
      totalQuestions: number;
    }) {
      setQuestion(data.question);
      setCurrentPosition(data.currentPosition);
      setTotalQuestions(data.totalQuestions);
      setQuestionStartTime(new Date().toISOString());
    }

    const cached = sessionStorage.getItem(`assessment-${sessionId}`);
    if (cached) {
      try {
        applyState(JSON.parse(cached));
        sessionStorage.removeItem(`assessment-${sessionId}`);
        return;
      } catch {
        // Corrupt cache — fall through to the server.
        sessionStorage.removeItem(`assessment-${sessionId}`);
      }
    }

    (async () => {
      try {
        const res = await fetch(`/api/assessment/session/${sessionId}`);
        if (cancelled) return;

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setLoadError(body.error || t("loadFailed"));
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        if (data.complete) {
          router.push(`/complete/${sessionId}`);
          return;
        }
        applyState(data);
      } catch {
        if (!cancelled) setLoadError(t("loadFailed"));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, router, t]);

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

        const data = await res.json().catch(() => ({}));

        // Without this, a 429/400/409 fell through and set `question` to
        // undefined, dumping the user back to a permanent loading screen
        // mid-assessment with their answer lost.
        if (!res.ok) {
          console.error("[assessment] respond failed", { status: res.status, data });
          setSubmitError(data.error || t("submitFailed"));
          return;
        }

        if (data.complete) {
          router.push(`/complete/${sessionId}`);
          return;
        }

        if (!data.question) {
          setSubmitError(t("submitFailed"));
          return;
        }

        setSubmitError(null);
        setQuestion(data.question);
        setCurrentPosition(data.currentPosition);
        setQuestionStartTime(new Date().toISOString());
        setLastSelectedOption(payload.selectedOption ?? null);
      } catch (error) {
        console.error("Failed to submit response:", error);
        setSubmitError(t("submitFailed"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [question, sessionId, questionStartTime, getDeltas, router, lastSelectedOption, t]
  );

  async function abandonSession() {
    setIsAbandoning(true);
    try {
      await fetch(`/api/assessment/session/${sessionId}`, { method: "DELETE" });
    } catch (err) {
      console.error("[assessment] abandon failed", err);
    } finally {
      // Navigate regardless: if the abandon failed the start page surfaces the
      // 409, which is still better than being stranded on this screen.
      setIsAbandoning(false);
      router.push("/start");
    }
  }

  if (loadError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p role="alert" className="text-sm text-destructive">
          {loadError}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t("retry")}
          </Button>
          {/* Escape hatch: /api/assessment/start refuses with 409 while any
              IN_PROGRESS session exists, so without this a session the user
              cannot load locks them out of the assessment entirely. */}
          <Button variant="outline" onClick={abandonSession} disabled={isAbandoning}>
            {isAbandoning ? t("startingOver") : t("startOver")}
          </Button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
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

      {submitError && (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {submitError}
        </p>
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
          placeholder={t("freeTextPlaceholder")}
          pasteBlockedMessage={t("pasteBlocked")}
        />
      )}
    </div>
  );
}
