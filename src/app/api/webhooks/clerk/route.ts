import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const sb = getSupabase();

  const { type, data } = body;

  if (type === "user.created" || type === "user.updated") {
    const dob = data.unsafe_metadata?.dateOfBirth
      ? new Date(data.unsafe_metadata.dateOfBirth)
      : new Date("2000-01-01");

    const age = Math.floor(
      (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    const name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "User";
    const email = data.email_addresses?.[0]?.email_address ?? "";
    const preferredLocale = (data.unsafe_metadata?.preferredLocale as string) ?? "en";
    const ageVerified = age >= 15 && age <= 25;

    await sb.rpc("upsert_user_from_clerk", {
      p_clerk_id: data.id,
      p_email: email,
      p_name: name,
      p_dob: dob.toISOString().split("T")[0],
      p_age: age,
      p_locale: preferredLocale,
      p_age_verified: ageVerified,
    });
  }

  return NextResponse.json({ received: true });
}
