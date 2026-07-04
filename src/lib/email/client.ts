/**
 * Resend REST API email client.
 *
 * Uses the Resend HTTP API directly via `fetch` (no npm dependency).
 * FAIL-SAFE by design: this function NEVER throws. A failure to send an
 * email must never crash the calling flow (report generation, consent, etc.).
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "AEDHAS <noreply@aedhas.com>";

/** Guard so the "missing API key" error is logged only once per process. */
let missingKeyLogged = false;

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export interface SendEmailResult {
  ok: boolean;
  error?: string;
}

/**
 * Send a transactional email via Resend.
 *
 * @returns `{ ok: true }` on success, or `{ ok: false, error }` on any
 *   failure (missing config, network error, non-2xx response). Never throws.
 */
export async function sendEmail(
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (!missingKeyLogged) {
      // eslint-disable-next-line no-console
      console.error(
        "[email] RESEND_API_KEY not configured — email sending is disabled.",
      );
      missingKeyLogged = true;
    }
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const from = process.env.EMAIL_FROM ?? DEFAULT_FROM;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!response.ok) {
      const detail = await safeReadError(response);
      const error = `Resend API returned ${response.status}${
        detail ? `: ${detail}` : ""
      }`;
      // eslint-disable-next-line no-console
      console.error(`[email] ${error}`);
      return { ok: false, error };
    }

    return { ok: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error(`[email] Network error sending email: ${error}`);
    return { ok: false, error };
  }
}

/** Best-effort extraction of an error message from a failed Resend response. */
async function safeReadError(response: Response): Promise<string | undefined> {
  try {
    const text = await response.text();
    if (!text) return undefined;
    try {
      const parsed = JSON.parse(text) as { message?: string; error?: string };
      return parsed.message ?? parsed.error ?? text;
    } catch {
      return text;
    }
  } catch {
    return undefined;
  }
}
