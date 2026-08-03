import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error("Missing required env var: NEXT_PUBLIC_SUPABASE_URL");
    }
    if (!serviceRoleKey) {
      throw new Error("Missing required env var: SUPABASE_SERVICE_ROLE_KEY");
    }

    // A malformed URL (missing protocol, stray whitespace, or a pasted
    // dashboard link instead of the project API URL) surfaces at request time
    // as an opaque "TypeError: fetch failed". Fail loudly here instead.
    const trimmedUrl = supabaseUrl.trim().replace(/\/+$/, "");
    let parsed: URL;
    try {
      parsed = new URL(trimmedUrl);
    } catch {
      throw new Error(
        `NEXT_PUBLIC_SUPABASE_URL is not a valid URL: "${supabaseUrl}". ` +
          `Expected something like https://<project-ref>.supabase.co`,
      );
    }
    if (parsed.protocol !== "https:") {
      throw new Error(
        `NEXT_PUBLIC_SUPABASE_URL must use https:// (got "${parsed.protocol}//")`,
      );
    }

    _supabase = createClient(trimmedUrl, serviceRoleKey.trim(), {
      auth: { persistSession: false },
    });
  }
  return _supabase;
}

/**
 * Node's fetch reports every network-layer failure as the same opaque
 * "TypeError: fetch failed"; the actionable part (ENOTFOUND, ECONNREFUSED,
 * certificate errors) lives on the nested `cause` chain. Unwrap it so logs and
 * error responses name the actual problem.
 */
export function describeDbError(err: unknown): string {
  const parts: string[] = [];
  let current: unknown = err;

  for (let depth = 0; current && depth < 5; depth += 1) {
    if (typeof current === "string") {
      parts.push(current);
      break;
    }
    if (typeof current !== "object") break;

    const asRecord = current as { message?: unknown; code?: unknown; cause?: unknown };
    if (typeof asRecord.message === "string" && asRecord.message) {
      const code = typeof asRecord.code === "string" ? ` [${asRecord.code}]` : "";
      parts.push(`${asRecord.message}${code}`);
    }
    if (!asRecord.cause) break;
    current = asRecord.cause;
  }

  return parts.length > 0 ? parts.join(" ← ") : String(err);
}
