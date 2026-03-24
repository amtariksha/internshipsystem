import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/astro/kundli`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, dob, birthTime, latitude, longitude }),
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(error, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
