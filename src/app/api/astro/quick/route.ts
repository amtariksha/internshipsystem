import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { resolveInternalBaseUrl, internalFetchHeaders } from "@/lib/utils/base-url";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, dob } = body;
  const system = body.system === "pythagorean" ? "pythagorean" : "chaldean";

  if (!name || !dob) {
    return NextResponse.json({ error: "name and dob are required" }, { status: 400 });
  }

  // Call the Python serverless function. The base URL must be the host this
  // request arrived on — VERCEL_URL is the per-deployment hostname and is
  // gated by Vercel Deployment Protection, which answers 401 before the
  // function ever runs.
  const baseUrl = resolveInternalBaseUrl(req);

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/astro/numerology`, {
      method: "POST",
      headers: internalFetchHeaders(),
      body: JSON.stringify({ name, dob, system }),
    });
  } catch (err) {
    console.error("[astro/quick] numerology function unreachable", { baseUrl, err });
    return NextResponse.json(
      { error: "Astrology service is unavailable. Please try again." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const raw = await res.text();
    console.error("[astro/quick] numerology function failed", {
      baseUrl,
      status: res.status,
      body: raw.slice(0, 300),
    });
    // Never pass an upstream 401 through as our own status: the caller is
    // already authenticated at this point, so a 401 from the internal call
    // means the function is unreachable (deployment protection), not a
    // signed-out user. Passing it through made the UI show a bogus
    // "please sign in" to users who were signed in.
    return NextResponse.json(
      { error: "Astrology service is unavailable. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json(await res.json());
}
