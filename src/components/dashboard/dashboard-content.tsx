"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STAGE_MODULES } from "@/lib/utils/domain-constants";
import type { EducationalStage } from "@/lib/utils/domain-constants";

interface DashboardContentProps {
  userName: string;
  educationalStage: EducationalStage | null;
  fieldOfStudy: string | null;
  onboardingComplete: boolean;
}

export function DashboardContent({
  userName,
  educationalStage,
  fieldOfStudy,
  onboardingComplete,
}: DashboardContentProps) {
  const t = useTranslations("dashboard");

  if (!onboardingComplete || !educationalStage) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">{t("welcome", { name: userName })}</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("completeOnboarding")}</p>
            <Link href="/onboarding">
              <Button size="sm" className="mt-4">Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableModules = STAGE_MODULES[educationalStage];

  const moduleCards: {
    module: string;
    title: string;
    description: string;
    href: string;
    buttonLabel: string;
    variant: "default" | "outline";
    badge?: string;
  }[] = [];

  if (availableModules.includes("behavioral_assessment" as never)) {
    moduleCards.push({
      module: "behavioral_assessment",
      title: t("behavioral"),
      description: t("behavioralDesc"),
      href: "/start",
      buttonLabel: t("takeFirst"),
      variant: "default",
    });
  }

  if (availableModules.includes("domain_knowledge" as never)) {
    moduleCards.push({
      module: "domain_knowledge",
      title: t("domainKnowledge"),
      description: t("domainDesc"),
      href: "/domain/start",
      buttonLabel: t("domainKnowledge"),
      variant: "outline",
      badge: educationalStage === "GRADUATE" ? t("recommended") : t("optional"),
    });
  }

  if (availableModules.includes("ai_collaboration" as never)) {
    moduleCards.push({
      module: "ai_collaboration",
      title: t("aiCollaboration"),
      description: t("aiCollabDesc"),
      href: "/ai-collab/start",
      buttonLabel: t("aiCollaboration"),
      variant: "outline",
      badge: t("recommended"),
    });
  }

  // AstroCareer is always available
  if (availableModules.includes("astro_career" as never)) {
    moduleCards.push({
      module: "astro_career",
      title: t("astroCareer"),
      description: t("astroDesc"),
      href: "/astro/quick",
      buttonLabel: t("astroCareer"),
      variant: "outline",
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("welcome", { name: userName })}</h1>
        {educationalStage === "PRE_COLLEGE" && (
          <p className="mt-2 text-sm text-muted-foreground">{t("preCollegeNote")}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moduleCards.map((card) => (
          <Card key={card.module}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{card.title}</CardTitle>
                {card.badge && (
                  <Badge variant={card.badge === t("recommended") ? "default" : "secondary"} className="text-[10px]">
                    {card.badge}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={card.href}>
                <Button size="sm" variant={card.variant} className="w-full">
                  {card.buttonLabel}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("recentAssessments")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t("noAssessments")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
