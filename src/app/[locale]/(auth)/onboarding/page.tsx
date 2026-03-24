"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "@/lib/i18n/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import type { OnboardingData } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  async function handleComplete(data: OnboardingData) {
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
      }),
    });

    if (response.ok) {
      await user?.update({
        unsafeMetadata: {
          onboarded: true,
          dateOfBirth: data.dateOfBirth,
          preferredLocale: data.preferredLocale,
          educationalStage: data.educationalStage,
          fieldOfStudy: data.fieldOfStudy,
        },
      });
      router.push("/");
    }
  }

  return (
    <OnboardingWizard
      initialName={user?.fullName ?? ""}
      onComplete={handleComplete}
    />
  );
}
