import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSupabase } from "@/lib/db/supabase";

export const metadata: Metadata = {
  title: "Guardian Consent",
};

interface ConsentVerifyPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}

type ConsentOutcome = "success" | "invalid";

/**
 * Public guardian-consent verification landing page (DPDP Act 2023).
 *
 * The guardian is NOT a logged-in user — this route is whitelisted in
 * src/proxy.ts, so there is no Clerk auth here. The onboarding flow emails the
 * guardian a link containing a one-time token stored on users.guardian_consent_token.
 * Visiting the link records consent (sets guardian_consent_at, clears the token)
 * and renders a localized confirmation. A missing/invalid/already-used token
 * yields a localized "invalid or expired" message.
 */
export default async function ConsentVerifyPage({
  params,
  searchParams,
}: ConsentVerifyPageProps) {
  const { locale } = await params;
  const { token: rawToken } = await searchParams;
  const t = await getTranslations({ locale, namespace: "consent" });

  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  const outcome = await recordGuardianConsent(token);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16">
      <div className="rounded-xl border border-border p-8 text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>

        {outcome === "success" ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm leading-relaxed">{t("success")}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("withdrawInfo")}
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {t("invalid")}
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * Look up the user by guardian_consent_token and, if found, stamp
 * guardian_consent_at = now() and clear the (single-use) token. Returns the
 * outcome to render. Any missing token, no match, or DB error resolves to
 * "invalid" — the guardian is never shown internal error detail.
 */
async function recordGuardianConsent(
  token: string | undefined
): Promise<ConsentOutcome> {
  if (!token || token.trim().length === 0) return "invalid";

  try {
    const sb = getSupabase();

    const { data: user, error: lookupErr } = await sb
      .from("users")
      .select("id")
      .eq("guardian_consent_token", token)
      .maybeSingle();

    if (lookupErr || !user) return "invalid";

    const { error: updateErr } = await sb
      .from("users")
      .update({
        guardian_consent_at: new Date().toISOString(),
        guardian_consent_token: null,
      })
      .eq("id", user.id);

    if (updateErr) return "invalid";

    return "success";
  } catch (err) {
    console.error("[consent/verify] failed to record guardian consent", err);
    return "invalid";
  }
}
