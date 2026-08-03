"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "@/lib/i18n/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import type { OnboardingData } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
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

    // Surface server-side failures — the wizard catches this and shows the
    // message. Previously a non-OK response was ignored entirely, so the
    // button silently did nothing.
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      // The route returns `detail` for DB errors and `details` (zod flatten)
      // for validation failures — read both so field-level errors reach the UI.
      const fieldErrors = body?.details?.fieldErrors
        ? Object.entries(body.details.fieldErrors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
            .join("; ")
        : null;
      throw new Error(
        body?.detail || fieldErrors || body?.error || `Request failed (${response.status})`,
      );
    }

    // Clerk metadata is a convenience mirror of what we just persisted in the
    // database. If it fails, onboarding has still succeeded — never block the
    // redirect on it.
    try {
      await user?.update({
        unsafeMetadata: {
          onboarded: true,
          dateOfBirth: data.dateOfBirth,
          preferredLocale: data.preferredLocale,
          educationalStage: data.educationalStage,
          fieldOfStudy: data.fieldOfStudy,
        },
      });
    } catch (err) {
      console.error("[onboarding] Clerk metadata update failed (non-fatal):", err);
    }

    router.push("/dashboard");
  }

  // Clerk resolves `user` asynchronously; rendering before it loads would seed
  // the wizard with an empty name.
  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center p-4" />;
  }

  return (
    <OnboardingWizard
      initialName={user?.fullName ?? ""}
      onComplete={handleComplete}
    />
  );
}
