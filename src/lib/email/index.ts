/**
 * Public entry point for the email/notifications library.
 *
 * Other modules should import the convenience wrappers below from
 * `@/lib/email` rather than reaching into `client` or `templates` directly.
 */

import { sendEmail } from "./client";
import type { SendEmailResult } from "./client";
import { guardianConsentEmail, reportReadyEmail } from "./templates";

export { sendEmail } from "./client";
export type { SendEmailParams, SendEmailResult } from "./client";
export {
  reportReadyEmail,
  guardianConsentEmail,
} from "./templates";
export type {
  EmailContent,
  ReportReadyParams,
  GuardianConsentParams,
} from "./templates";

export interface SendReportReadyEmailArgs {
  to: string;
  name: string;
  reportUrl: string;
  locale: string;
}

/**
 * Build the report-ready template and send it. Never throws — see `sendEmail`.
 */
export async function sendReportReadyEmail(
  args: SendReportReadyEmailArgs,
): Promise<SendEmailResult> {
  const { subject, html } = reportReadyEmail({
    name: args.name,
    reportUrl: args.reportUrl,
    locale: args.locale,
  });
  return sendEmail({ to: args.to, subject, html });
}

export interface SendGuardianConsentEmailArgs {
  to: string;
  studentName: string;
  consentUrl: string;
  locale: string;
}

/**
 * Build the guardian-consent template and send it. Never throws — see `sendEmail`.
 */
export async function sendGuardianConsentEmail(
  args: SendGuardianConsentEmailArgs,
): Promise<SendEmailResult> {
  const { subject, html } = guardianConsentEmail({
    studentName: args.studentName,
    consentUrl: args.consentUrl,
    locale: args.locale,
  });
  return sendEmail({ to: args.to, subject, html });
}
