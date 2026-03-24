"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCALE_LABELS } from "@/lib/utils/constants";
import { DOMAINS, EDUCATIONAL_STAGES, EMPLOYMENT_STATUSES } from "@/lib/utils/domain-constants";
import type { EducationalStage } from "@/lib/utils/domain-constants";

interface OnboardingWizardProps {
  initialName: string;
  onComplete: (data: OnboardingData) => Promise<void>;
}

export interface OnboardingData {
  name: string;
  dateOfBirth: string;
  preferredLocale: string;
  educationalStage: EducationalStage;
  fieldOfStudy: string | null;
  yearOfStudy: number | null;
  yearOfGraduation: number | null;
  backlogCount: number;
  employmentStatus: string | null;
}

export function OnboardingWizard({ initialName, onComplete }: OnboardingWizardProps) {
  const t = useTranslations("onboarding");
  const td = useTranslations("domains");

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [name, setName] = useState(initialName);
  const [dob, setDob] = useState("");
  const [locale, setLocale] = useState("en");

  // Step 2
  const [educationalStage, setEducationalStage] = useState<EducationalStage | "">("");

  // Step 3
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState<number | "">("");
  const [yearOfGraduation, setYearOfGraduation] = useState<number | "">("");
  const [backlogCount, setBacklogCount] = useState(0);
  const [employmentStatus, setEmploymentStatus] = useState("");

  const suggestedStage = useMemo(() => {
    if (!dob) return null;
    const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) return "PRE_COLLEGE";
    if (age <= 22) return "COLLEGE";
    return "GRADUATE";
  }, [dob]);

  const totalSteps = educationalStage === "PRE_COLLEGE" ? 2 : 3;

  function canProceedStep1() {
    return name.trim().length > 0 && dob.length > 0;
  }

  function canProceedStep2() {
    return educationalStage !== "";
  }

  function canProceedStep3() {
    if (educationalStage === "COLLEGE") {
      return fieldOfStudy !== "" && yearOfStudy !== "";
    }
    if (educationalStage === "GRADUATE") {
      return fieldOfStudy !== "" && yearOfGraduation !== "" && employmentStatus !== "";
    }
    return true;
  }

  async function handleNext() {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2 && educationalStage === "PRE_COLLEGE") {
      await submitData();
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      await submitData();
    }
  }

  async function submitData() {
    setIsSubmitting(true);
    try {
      await onComplete({
        name,
        dateOfBirth: dob,
        preferredLocale: locale,
        educationalStage: educationalStage as EducationalStage,
        fieldOfStudy: fieldOfStudy || null,
        yearOfStudy: typeof yearOfStudy === "number" ? yearOfStudy : null,
        yearOfGraduation: typeof yearOfGraduation === "number" ? yearOfGraduation : null,
        backlogCount,
        employmentStatus: employmentStatus || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i + 1 <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <CardTitle>
            {step === 1 && t("step1Title")}
            {step === 2 && t("step2Title")}
            {step === 3 && t("step3Title")}
          </CardTitle>
          <CardDescription>
            {step === 1 && t("description")}
            {step === 2 && t("step2Description")}
            {step === 3 && t("step3Description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* ── Step 1: Basic Info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("nameLabel")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">{t("dobLabel")}</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  min="1990-01-01"
                  required
                />
                <p className="text-xs text-muted-foreground">{t("dobHelp")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locale">{t("languageLabel")}</Label>
                <Select value={locale} onValueChange={(v) => v && setLocale(v)}>
                  <SelectTrigger id="locale">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LOCALE_LABELS).map(([code, label]) => (
                      <SelectItem key={code} value={code}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* ── Step 2: Educational Stage ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("educationalStageLabel")}</Label>
                {EDUCATIONAL_STAGES.map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setEducationalStage(stage)}
                    className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                      educationalStage === stage
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium">{t(`stage.${stage}`)}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {t(`stageDesc.${stage}`)}
                    </span>
                    {suggestedStage === stage && (
                      <span className="mt-1 inline-block rounded bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {t("suggested")}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Academic Details ── */}
          {step === 3 && educationalStage === "COLLEGE" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("yearOfStudyLabel")}</Label>
                <Select
                  value={yearOfStudy === "" ? "" : String(yearOfStudy)}
                  onValueChange={(v) => setYearOfStudy(Number(v))}
                >
                  <SelectTrigger><SelectValue placeholder={t("selectYear")} /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {t("yearN", { n: y })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("fieldOfStudyLabel")}</Label>
                <Select value={fieldOfStudy} onValueChange={(v) => v && setFieldOfStudy(v)}>
                  <SelectTrigger><SelectValue placeholder={t("selectField")} /></SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (
                      <SelectItem key={d.code} value={d.code}>
                        {td(d.code)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backlogs">{t("backlogCountLabel")}</Label>
                <Input
                  id="backlogs"
                  type="number"
                  min={0}
                  max={20}
                  value={backlogCount}
                  onChange={(e) => setBacklogCount(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">{t("backlogHelp")}</p>
              </div>
            </div>
          )}

          {step === 3 && educationalStage === "GRADUATE" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("yearOfGraduationLabel")}</Label>
                <Select
                  value={yearOfGraduation === "" ? "" : String(yearOfGraduation)}
                  onValueChange={(v) => setYearOfGraduation(Number(v))}
                >
                  <SelectTrigger><SelectValue placeholder={t("selectYear")} /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => currentYear - i).map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("fieldOfStudyLabel")}</Label>
                <Select value={fieldOfStudy} onValueChange={(v) => v && setFieldOfStudy(v)}>
                  <SelectTrigger><SelectValue placeholder={t("selectField")} /></SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (
                      <SelectItem key={d.code} value={d.code}>
                        {td(d.code)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backlogs">{t("backlogCountLabel")}</Label>
                <Input
                  id="backlogs"
                  type="number"
                  min={0}
                  max={20}
                  value={backlogCount}
                  onChange={(e) => setBacklogCount(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">{t("backlogHelp")}</p>
              </div>

              <div className="space-y-2">
                <Label>{t("employmentStatusLabel")}</Label>
                <Select value={employmentStatus} onValueChange={(v) => v && setEmploymentStatus(v)}>
                  <SelectTrigger><SelectValue placeholder={t("selectStatus")} /></SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`employment.${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* ── Navigation Buttons ── */}
          <div className="mt-6 flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isSubmitting} className="flex-1">
                {t("back")}
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (step === 1 && !canProceedStep1()) ||
                (step === 2 && !canProceedStep2()) ||
                (step === 3 && !canProceedStep3())
              }
              className="flex-1"
            >
              {isSubmitting
                ? "..."
                : step === totalSteps || (step === 2 && educationalStage === "PRE_COLLEGE")
                  ? t("complete")
                  : t("next")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
