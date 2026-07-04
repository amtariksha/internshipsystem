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

export const ONBOARDING_ROLES = ["STUDENT", "COLLEGE_ADMIN", "EMPLOYER"] as const;
export type OnboardingRole = (typeof ONBOARDING_ROLES)[number];

type OrgMode = "create" | "join";

interface OnboardingWizardProps {
  initialName: string;
  onComplete: (data: OnboardingData) => Promise<void>;
}

export interface OnboardingData {
  name: string;
  dateOfBirth: string;
  preferredLocale: string;
  role: OnboardingRole;
  organizationName: string | null;
  organizationInviteCode: string | null;
  guardianEmail: string | null;
  educationalStage: EducationalStage;
  fieldOfStudy: string | null;
  yearOfStudy: number | null;
  yearOfGraduation: number | null;
  backlogCount: number;
  employmentStatus: string | null;
}

/**
 * Steps:
 *   1. Basic info (name, DOB, locale)
 *   2. Role selection (Student / College Admin / Employer)
 *   3. Role-specific branch:
 *        - Student  → educational stage
 *        - Org roles → organization (create/join)
 *   4. Student only: academic details (skipped for PRE_COLLEGE)
 *
 * Under-18 students collect a guardian email on the educational-stage step.
 */
export function OnboardingWizard({ initialName, onComplete }: OnboardingWizardProps) {
  const t = useTranslations("onboarding");
  const tr = useTranslations("onboardingRoles");
  const td = useTranslations("domains");

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [name, setName] = useState(initialName);
  const [dob, setDob] = useState("");
  const [locale, setLocale] = useState("en");

  // Step 2 — role
  const [role, setRole] = useState<OnboardingRole | "">("");

  // Org roles
  const [orgMode, setOrgMode] = useState<OrgMode>("create");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationInviteCode, setOrganizationInviteCode] = useState("");

  // Student
  const [educationalStage, setEducationalStage] = useState<EducationalStage | "">("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState<number | "">("");
  const [yearOfGraduation, setYearOfGraduation] = useState<number | "">("");
  const [backlogCount, setBacklogCount] = useState(0);
  const [employmentStatus, setEmploymentStatus] = useState("");

  const age = useMemo(() => {
    if (!dob) return null;
    return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }, [dob]);

  const isMinor = age !== null && age < 18;

  const suggestedStage = useMemo(() => {
    if (age === null) return null;
    if (age < 18) return "PRE_COLLEGE";
    if (age <= 22) return "COLLEGE";
    return "GRADUATE";
  }, [age]);

  const isStudent = role === "STUDENT";
  const isOrgRole = role === "COLLEGE_ADMIN" || role === "EMPLOYER";

  // Total steps: org roles finish at step 3; students need academic details
  // unless PRE_COLLEGE (finish at step 3).
  const totalSteps = useMemo(() => {
    if (isOrgRole) return 3;
    if (isStudent && educationalStage && educationalStage !== "PRE_COLLEGE") return 4;
    return 3;
  }, [isOrgRole, isStudent, educationalStage]);

  const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  function canProceedStep1() {
    return name.trim().length > 0 && dob.length > 0;
  }

  function canProceedStep2() {
    return role !== "";
  }

  function canProceedStep3() {
    if (isOrgRole) {
      if (orgMode === "create") return organizationName.trim().length > 0;
      return organizationInviteCode.trim().length > 0;
    }
    // Student — educational stage
    if (educationalStage === "") return false;
    if (isMinor && !isEmailValid(guardianEmail)) return false;
    return true;
  }

  function canProceedStep4() {
    if (educationalStage === "COLLEGE") {
      return fieldOfStudy !== "" && yearOfStudy !== "";
    }
    if (educationalStage === "GRADUATE") {
      return fieldOfStudy !== "" && yearOfGraduation !== "" && employmentStatus !== "";
    }
    return true;
  }

  const isFinalStep = step === totalSteps;

  async function handleNext() {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      // Org roles finish here. Students continue to academic details unless PRE_COLLEGE.
      if (isOrgRole || educationalStage === "PRE_COLLEGE") {
        await submitData();
        return;
      }
      setStep(4);
      return;
    }

    if (step === 4) {
      await submitData();
    }
  }

  async function submitData() {
    setIsSubmitting(true);
    try {
      const resolvedRole = (role || "STUDENT") as OnboardingRole;
      const resolvedStage: EducationalStage = isStudent
        ? (educationalStage as EducationalStage)
        : "GRADUATE";
      await onComplete({
        name,
        dateOfBirth: dob,
        preferredLocale: locale,
        role: resolvedRole,
        organizationName:
          isOrgRole && orgMode === "create" && organizationName.trim()
            ? organizationName.trim()
            : null,
        organizationInviteCode:
          isOrgRole && orgMode === "join" && organizationInviteCode.trim()
            ? organizationInviteCode.trim().toUpperCase()
            : null,
        guardianEmail: isStudent && isMinor && guardianEmail.trim() ? guardianEmail.trim() : null,
        educationalStage: resolvedStage,
        fieldOfStudy: isStudent ? fieldOfStudy || null : null,
        yearOfStudy: isStudent && typeof yearOfStudy === "number" ? yearOfStudy : null,
        yearOfGraduation:
          isStudent && typeof yearOfGraduation === "number" ? yearOfGraduation : null,
        backlogCount: isStudent ? backlogCount : 0,
        employmentStatus: isStudent ? employmentStatus || null : null,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentYear = new Date().getFullYear();

  function stepTitle() {
    if (step === 1) return t("step1Title");
    if (step === 2) return tr("roleStepTitle");
    if (step === 3) return isOrgRole ? tr("orgStepTitle") : t("step2Title");
    return t("step3Title");
  }

  function stepDescription() {
    if (step === 1) return t("description");
    if (step === 2) return tr("roleStepDescription");
    if (step === 3) return isOrgRole ? tr("orgStepDescription") : t("step2Description");
    return t("step3Description");
  }

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
          <CardTitle>{stepTitle()}</CardTitle>
          <CardDescription>{stepDescription()}</CardDescription>
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

          {/* ── Step 2: Role ── */}
          {step === 2 && (
            <div className="space-y-2">
              <Label>{tr("roleLabel")}</Label>
              {ONBOARDING_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                    role === r
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium">
                    {r === "STUDENT" && tr("roleStudent")}
                    {r === "COLLEGE_ADMIN" && tr("roleCollege")}
                    {r === "EMPLOYER" && tr("roleEmployer")}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {r === "STUDENT" && tr("roleStudentDesc")}
                    {r === "COLLEGE_ADMIN" && tr("roleCollegeDesc")}
                    {r === "EMPLOYER" && tr("roleEmployerDesc")}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* ── Step 3 (org roles): Organization ── */}
          {step === 3 && isOrgRole && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrgMode("create")}
                  className={`flex-1 rounded-lg border p-2 text-sm transition-colors ${
                    orgMode === "create"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {tr("createOrg")}
                </button>
                <button
                  type="button"
                  onClick={() => setOrgMode("join")}
                  className={`flex-1 rounded-lg border p-2 text-sm transition-colors ${
                    orgMode === "join"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {tr("joinOrg")}
                </button>
              </div>

              {orgMode === "create" ? (
                <div className="space-y-2">
                  <Label htmlFor="orgName">{tr("orgName")}</Label>
                  <Input
                    id="orgName"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder={
                      role === "COLLEGE_ADMIN" ? tr("orgNameCollegeHint") : tr("orgNameEmployerHint")
                    }
                  />
                  <p className="text-xs text-muted-foreground">{tr("createOrgHint")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">{tr("inviteCode")}</Label>
                  <Input
                    id="inviteCode"
                    value={organizationInviteCode}
                    onChange={(e) => setOrganizationInviteCode(e.target.value.toUpperCase())}
                    placeholder="ABCD1234"
                    className="font-mono uppercase"
                  />
                  <p className="text-xs text-muted-foreground">{tr("joinOrgHint")}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3 (student): Educational Stage + guardian ── */}
          {step === 3 && isStudent && (
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

              {isMinor && (
                <div className="space-y-2">
                  <Label htmlFor="guardianEmail">{tr("guardianEmail")}</Label>
                  <Input
                    id="guardianEmail"
                    type="email"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    placeholder="parent@example.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground">{tr("guardianEmailHint")}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 4: Academic Details (students) ── */}
          {step === 4 && educationalStage === "COLLEGE" && (
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

          {step === 4 && educationalStage === "GRADUATE" && (
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
                (step === 3 && !canProceedStep3()) ||
                (step === 4 && !canProceedStep4())
              }
              className="flex-1"
            >
              {isSubmitting ? "..." : isFinalStep ? t("complete") : t("next")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
