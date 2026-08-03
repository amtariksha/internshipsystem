import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { resolveInternalBaseUrl, internalFetchHeaders } from "@/lib/utils/base-url";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, dob, birthTime, latitude, longitude } = body;

  if (!name || !dob || !birthTime || latitude == null || longitude == null) {
    return NextResponse.json(
      { error: "name, dob, birthTime, latitude, and longitude are required" },
      { status: 400 }
    );
  }

  if (typeof latitude !== "number" || Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
    return NextResponse.json(
      { error: "latitude must be a number between -90 and 90" },
      { status: 400 }
    );
  }

  if (
    typeof longitude !== "number" ||
    Number.isNaN(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return NextResponse.json(
      { error: "longitude must be a number between -180 and 180" },
      { status: 400 }
    );
  }

  // Must be the host this request arrived on — VERCEL_URL is the
  // per-deployment hostname and is gated by Vercel Deployment Protection,
  // which answers 401 before the Python function ever runs.
  const baseUrl = resolveInternalBaseUrl(req);

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/astro/kundli`, {
      method: "POST",
      headers: internalFetchHeaders(),
      body: JSON.stringify({ name, dob, birthTime, latitude, longitude }),
    });
  } catch (err) {
    console.error("[astro/full] kundli function unreachable", { baseUrl, err });
    return NextResponse.json(
      { error: "Astrology service is unavailable. Please try again." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const raw = await res.text();
    console.error("[astro/full] kundli function failed", {
      baseUrl,
      status: res.status,
      body: raw.slice(0, 300),
    });
    // Never pass an upstream 401 through — the caller is already authenticated,
    // so it means the function is unreachable, not a signed-out user.
    return NextResponse.json(
      { error: "Astrology service is unavailable. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json(await res.json());
}
