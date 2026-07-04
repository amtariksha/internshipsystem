import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { getSupabase } from "@/lib/db/supabase";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await checkRateLimit(`webhook:${ip}`, 100, 3600);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let evt: Awaited<ReturnType<typeof verifyWebhook>>;
  try {
    evt = await verifyWebhook(req);
  } catch (error) {
    console.error("Clerk webhook signature verification failed", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const sb = getSupabase();

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const data = evt.data;
    const rawDob = data.unsafe_metadata?.dateOfBirth;
    const dob =
      typeof rawDob === "string" || typeof rawDob === "number"
        ? new Date(rawDob)
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
