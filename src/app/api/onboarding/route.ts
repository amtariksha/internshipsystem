import { randomUUID } from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/db/supabase";
import { sendGuardianConsentEmail } from "@/lib/email";

const onboardingSchema = z.object({
  name: z.string().trim().min(1),
  dateOfBirth: z.string().min(1),
  preferredLocale: z.string().default("en"),
  email: z.string().optional().default(""),
  role: z.enum(["STUDENT", "COLLEGE_ADMIN", "EMPLOYER"]).default("STUDENT"),
  organizationName: z.string().trim().min(1).max(200).nullish(),
  organizationInviteCode: z.string().trim().min(1).max(64).nullish(),
  guardianEmail: z.string().email().nullish(),
  educationalStage: z.enum(["PRE_COLLEGE", "COLLEGE", "GRADUATE"]),
  fieldOfStudy: z.string().nullish(),
  yearOfStudy: z.number().int().nullish(),
  yearOfGraduation: z.number().int().nullish(),
  backlogCount: z.number().int().min(0).default(0),
  employmentStatus: z.string().nullish(),
});

/** Organization type is derived from the caller's role. */
const ORG_TYPE_BY_ROLE: Record<"COLLEGE_ADMIN" | "EMPLOYER", "COLLEGE" | "EMPLOYER"> = {
  COLLEGE_ADMIN: "COLLEGE",
  EMPLOYER: "EMPLOYER",
};

function resolveOrigin(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host) return `${proto}://${host}`;

  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = await req.json();
  const parsed = onboardingSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const {
    name,
    dateOfBirth,
    preferredLocale,
    email,
    role,
    organizationName,
    organizationInviteCode,
    guardianEmail,
    educationalStage,
    fieldOfStudy = null,
    yearOfStudy = null,
    yearOfGraduation = null,
    backlogCount,
    employmentStatus = null,
  } = parsed.data;

  const dob = new Date(dateOfBirth);
  const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const ageVerified = age >= 15 && age <= 35;
  const isMinor = age < 18;

  const sb = getSupabase();

  // Step 1: Upsert basic user info
  await sb.rpc("upsert_user_from_clerk", {
    p_clerk_id: clerkId,
    p_email: email,
    p_name: name,
    p_dob: dob.toISOString().split("T")[0],
    p_age: age,
    p_locale: preferredLocale,
    p_age_verified: ageVerified,
  });

  // Step 2: Update educational profile
  await sb.rpc("update_user_education", {
    p_clerk_id: clerkId,
    p_educational_stage: educationalStage,
    p_field_of_study: fieldOfStudy,
    p_year_of_study: yearOfStudy,
    p_year_of_graduation: yearOfGraduation,
    p_backlog_count: backlogCount,
    p_employment_status: employmentStatus,
  });

  // Step 3: Resolve organization for org roles.
  let organizationId: string | null = null;

  if (role === "COLLEGE_ADMIN" || role === "EMPLOYER") {
    const orgType = ORG_TYPE_BY_ROLE[role];

    if (organizationName) {
      const inviteCode = randomUUID().slice(0, 8).toUpperCase();
      const newOrgId = randomUUID();
      const { data: org, error: orgError } = await sb
        .from("organizations")
        .insert({
          id: newOrgId,
          name: organizationName,
          type: orgType,
          invite_code: inviteCode,
        })
        .select("id")
        .single();

      if (orgError || !org) {
        return NextResponse.json(
          { error: "Failed to create organization" },
          { status: 500 },
        );
      }
      organizationId = org.id as string;
    } else if (organizationInviteCode) {
      const { data: org } = await sb
        .from("organizations")
        .select("id, type")
        .eq("invite_code", organizationInviteCode.toUpperCase())
        .maybeSingle();

      if (!org || org.type !== orgType) {
        return NextResponse.json(
          { error: "Invalid organization invite code" },
          { status: 400 },
        );
      }
      organizationId = org.id as string;
    } else {
      return NextResponse.json(
        { error: "Organization name or invite code is required" },
        { status: 400 },
      );
    }
  }

  // Step 4: Guardian consent for under-18 students.
  let guardianConsentToken: string | null = null;
  const consentGuardianEmail =
    role === "STUDENT" && isMinor && guardianEmail ? guardianEmail : null;
  if (consentGuardianEmail) {
    guardianConsentToken = randomUUID();
  }

  // Step 5: Persist role + organization + guardian fields.
  const { error: updateError } = await sb
    .from("users")
    .update({
      role,
      organization_id: organizationId,
      guardian_email: consentGuardianEmail,
      guardian_consent_token: guardianConsentToken,
    })
    .eq("clerk_id", clerkId);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 },
    );
  }

  // Step 6: Dispatch guardian consent email (fail-safe — never blocks response).
  if (consentGuardianEmail && guardianConsentToken) {
    const origin = resolveOrigin(req);
    const consentUrl = `${origin}/en/consent/verify?token=${guardianConsentToken}`;
    await sendGuardianConsentEmail({
      to: consentGuardianEmail,
      studentName: name,
      consentUrl,
      locale: preferredLocale,
    });
  }

  return NextResponse.json({ success: true });
}
