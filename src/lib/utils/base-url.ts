/**
 * Base URL for server-to-server calls into our own Vercel functions
 * (the Next.js astro routes proxy to the Python functions under /api/astro/*).
 *
 * `VERCEL_URL` must NOT be used for this: it is the *deployment-specific*
 * hostname (e.g. project-abc123-team.vercel.app), which is covered by Vercel
 * Deployment Protection. A server-side fetch to it is answered by Vercel's SSO
 * layer with 401 {"error":{"message":"Protected deployment"}} and never reaches
 * the function. The host the request actually arrived on (aedhas.com) is the
 * one guaranteed to be reachable, so prefer that.
 */

export function resolveInternalBaseUrl(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  // The host this request came in on — by definition reachable and not
  // behind deployment protection for the caller.
  const forwardedHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (forwardedHost) {
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    return `${proto}://${forwardedHost}`;
  }

  // Stable production alias, unlike the per-deployment VERCEL_URL.
  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionUrl) return `https://${productionUrl}`;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

/**
 * Headers for an internal function call. When the target is protected (preview
 * deployments), `VERCEL_AUTOMATION_BYPASS_SECRET` lets a server-side caller
 * through; it is a no-op when unset.
 */
export function internalFetchHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (bypass) {
    headers["x-vercel-protection-bypass"] = bypass;
    headers["x-vercel-set-bypass-cookie"] = "false";
  }
  return headers;
}
