import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    dateOfBirth,
    preferredLocale = "en",
    educationalStage,
    fieldOfStudy = null,
    yearOfStudy = null,
    yearOfGraduation = null,
    backlogCount = 0,
    employmentStatus = null,
  } = body;

  if (!name || !dateOfBirth || !educationalStage) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const dob = new Date(dateOfBirth);
  const age = Math.floor(
    (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  const ageVerified = age >= 15 && age <= 35;

  const sb = getSupabase();

  // Step 1: Upsert basic user info
  await sb.rpc("upsert_user_from_clerk", {
    p_clerk_id: clerkId,
    p_email: body.email ?? "",
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

  return NextResponse.json({ success: true });
}
