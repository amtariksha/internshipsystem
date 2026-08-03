import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

/**
 * Place lookup for the AstroCareer birth-place field.
 *
 * Open-Meteo alone is not sufficient for the Indian market: it only matches the
 * official spelling of a place, so colloquial/older names return nothing at all
 * (e.g. "Kalburgi" → 0 results, while "Kalaburagi" resolves). Nominatim (OSM)
 * handles those variants and has far better rural coverage, so it runs as a
 * fallback whenever Open-Meteo comes back empty.
 *
 * This is proxied server-side rather than called from the browser so we can set
 * the User-Agent Nominatim's usage policy requires, avoid CORS entirely, and
 * rate-limit the upstream calls.
 */

const OPEN_METEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const RESULT_LIMIT = 8;

export interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

interface OpenMeteoResult {
  id?: number;
  name?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  admin1?: string;
}

interface NominatimResult {
  place_id?: number;
  display_name?: string;
  lat?: string;
  lon?: string;
}

async function searchOpenMeteo(query: string): Promise<GeocodeResult[]> {
  const url = `${OPEN_METEO_URL}?name=${encodeURIComponent(
    query,
  )}&count=${RESULT_LIMIT}&language=en&format=json`;

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return [];

  const data: { results?: OpenMeteoResult[] } = await res.json();
  if (!Array.isArray(data.results)) return [];

  return data.results.flatMap((r) => {
    if (typeof r.latitude !== "number" || typeof r.longitude !== "number" || !r.name) {
      return [];
    }
    return [
      {
        id: r.id ?? Math.round(r.latitude * 1e6 + r.longitude),
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        country: r.country,
        admin1: r.admin1,
      },
    ];
  });
}

async function searchNominatim(query: string): Promise<GeocodeResult[]> {
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(
    query,
  )}&format=json&limit=${RESULT_LIMIT}&accept-language=en`;

  const res = await fetch(url, {
    // Nominatim's usage policy requires an identifying User-Agent.
    headers: { "User-Agent": "AEDHAS/1.0 (https://aedhas.com)" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return [];

  const data: NominatimResult[] = await res.json();
  if (!Array.isArray(data)) return [];

  return data.flatMap((r) => {
    const latitude = Number(r.lat);
    const longitude = Number(r.lon);
    if (!r.display_name || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return [];
    }
    // display_name is "Place, Taluk, District, State, PIN, Country" — keep the
    // leading place name and surface the state/country separately so the UI
    // renders the same shape it gets from Open-Meteo. Numeric-only segments are
    // postal codes and would otherwise be shown in place of the state.
    const parts = r.display_name
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p && !/^\d+$/.test(p));
    return [
      {
        id: r.place_id ?? Math.round(latitude * 1e6 + longitude),
        name: parts[0] ?? r.display_name,
        latitude,
        longitude,
        country: parts.length > 1 ? parts[parts.length - 1] : undefined,
        admin1: parts.length > 2 ? parts[parts.length - 2] : undefined,
      },
    ];
  });
}

export async function GET(req: Request) {
  const query = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(`geocode:${ip}`, 30, 60);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const primary = await searchOpenMeteo(query);
    if (primary.length > 0) {
      return NextResponse.json({ results: primary, source: "open-meteo" });
    }

    // Open-Meteo found nothing — most likely a colloquial spelling or a small
    // rural settlement it does not index.
    const fallback = await searchNominatim(query);
    return NextResponse.json({ results: fallback, source: "nominatim" });
  } catch (err) {
    console.error("[geocode] lookup failed", { query, err });
    return NextResponse.json({ error: "Geocoding failed", results: [] }, { status: 502 });
  }
}
