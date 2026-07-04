/**
 * Localized, inline-styled HTML email templates.
 *
 * Templates are pure functions returning `{ subject, html }`. Supported
 * locales are `en` and `hi`; `te`, `ta`, and `kn` fall back to `en` until
 * translations are added. All HTML is self-contained (inline styles, no
 * external assets) and mobile-friendly.
 */

export interface EmailContent {
  subject: string;
  html: string;
}

export interface ReportReadyParams {
  name: string;
  reportUrl: string;
  locale: string;
}

export interface GuardianConsentParams {
  studentName: string;
  consentUrl: string;
  locale: string;
}

/** Locales that have their own translations. Everything else falls back to en. */
type TranslatedLocale = "en" | "hi";

function resolveLocale(locale: string): TranslatedLocale {
  return locale === "hi" ? "hi" : "en";
}

/** Escape user-supplied text for safe interpolation into HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Encode a URL for safe use in an href attribute. */
function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

const BRAND = "AEDHAS";
const COLOR_BG = "#f4f5f7";
const COLOR_CARD = "#ffffff";
const COLOR_TEXT = "#1f2933";
const COLOR_MUTED = "#52606d";
const COLOR_PRIMARY = "#2f5bea";
const COLOR_BORDER = "#e4e7eb";

interface LayoutParams {
  heading: string;
  bodyHtml: string;
  buttonLabel: string;
  buttonUrl: string;
  footerHtml: string;
}

/** Shared responsive shell used by every template. */
function layout({
  heading,
  bodyHtml,
  buttonLabel,
  buttonUrl,
  footerHtml,
}: LayoutParams): string {
  const safeUrl = escapeAttr(buttonUrl);
  return `<!-- ${BRAND} email -->
<div style="margin:0;padding:0;background-color:${COLOR_BG};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLOR_BG};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:${COLOR_CARD};border:1px solid ${COLOR_BORDER};border-radius:12px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <tr>
            <td style="padding:24px 28px 8px 28px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:${COLOR_PRIMARY};letter-spacing:0.5px;">${BRAND}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0 28px;">
              <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;color:${COLOR_TEXT};">${heading}</h1>
              <div style="font-size:15px;line-height:1.6;color:${COLOR_MUTED};">${bodyHtml}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background-color:${COLOR_PRIMARY};">
                    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">${buttonLabel}</a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0 0;font-size:13px;line-height:1.5;color:${COLOR_MUTED};word-break:break-all;">${safeUrl}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px 28px;border-top:1px solid ${COLOR_BORDER};margin-top:16px;">
              <div style="font-size:12px;line-height:1.6;color:#7b8794;">${footerHtml}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;
}

// --- report-ready copy ---------------------------------------------------

const REPORT_READY_COPY: Record<
  TranslatedLocale,
  {
    subject: string;
    heading: string;
    greeting: (name: string) => string;
    body: string;
    button: string;
    footer: string;
  }
> = {
  en: {
    subject: "Your AEDHAS assessment report is ready",
    heading: "Your report is ready",
    greeting: (name) => `Hi ${name},`,
    body: "Your assessment has been scored and your personalised report is now available. Click the button below to view your results and insights.",
    button: "View my report",
    footer:
      "You are receiving this email because you completed an assessment on AEDHAS. If you did not request this, please ignore this message.",
  },
  hi: {
    subject: "आपकी AEDHAS मूल्यांकन रिपोर्ट तैयार है",
    heading: "आपकी रिपोर्ट तैयार है",
    greeting: (name) => `नमस्ते ${name},`,
    body: "आपके मूल्यांकन का स्कोर तैयार हो गया है और आपकी व्यक्तिगत रिपोर्ट अब उपलब्ध है। अपने परिणाम और विश्लेषण देखने के लिए नीचे दिए गए बटन पर क्लिक करें।",
    button: "मेरी रिपोर्ट देखें",
    footer:
      "आपको यह ईमेल इसलिए मिला है क्योंकि आपने AEDHAS पर एक मूल्यांकन पूरा किया था। यदि आपने इसका अनुरोध नहीं किया था, तो कृपया इस संदेश को अनदेखा करें।",
  },
};

/**
 * Build the "assessment report ready" email.
 */
export function reportReadyEmail(params: ReportReadyParams): EmailContent {
  const copy = REPORT_READY_COPY[resolveLocale(params.locale)];
  const safeName = escapeHtml(params.name);

  const bodyHtml = `<p style="margin:0 0 12px 0;">${copy.greeting(
    safeName,
  )}</p><p style="margin:0;">${copy.body}</p>`;

  const html = layout({
    heading: copy.heading,
    bodyHtml,
    buttonLabel: copy.button,
    buttonUrl: params.reportUrl,
    footerHtml: copy.footer,
  });

  return { subject: copy.subject, html };
}

// --- guardian-consent copy -----------------------------------------------

const GUARDIAN_CONSENT_COPY: Record<
  TranslatedLocale,
  {
    subject: string;
    heading: string;
    intro: (studentName: string) => string;
    body: string;
    dpdpNotice: string;
    withdrawal: string;
    button: string;
    footer: string;
  }
> = {
  en: {
    subject: "Consent needed for your child's AEDHAS assessment",
    heading: "Guardian consent required",
    intro: (studentName) =>
      `A participation request has been created for <strong>${studentName}</strong>.`,
    body: "As the parent or legal guardian, we need your review and approval before your child can take part in the AEDHAS assessment. Please review the details and provide your consent using the link below.",
    dpdpNotice:
      "As part of this assessment we collect date, time, and place of birth. Under India's Digital Personal Data Protection (DPDP) Act, 2023, this birth data is treated as sensitive personal information and is processed only with your explicit consent.",
    withdrawal:
      "You may withdraw your consent at any time, after which processing of your child's data will stop and the data will be deleted in line with our privacy policy.",
    button: "Review and give consent",
    footer:
      "You are receiving this email because someone requested your consent for a minor's participation on AEDHAS. If this was not expected, you can safely ignore this message and no assessment will proceed.",
  },
  hi: {
    subject: "आपके बच्चे के AEDHAS मूल्यांकन के लिए सहमति आवश्यक है",
    heading: "अभिभावक की सहमति आवश्यक है",
    intro: (studentName) =>
      `<strong>${studentName}</strong> के लिए एक भागीदारी अनुरोध बनाया गया है।`,
    body: "माता-पिता या कानूनी अभिभावक के रूप में, आपके बच्चे के AEDHAS मूल्यांकन में भाग लेने से पहले हमें आपकी समीक्षा और स्वीकृति की आवश्यकता है। कृपया विवरण की समीक्षा करें और नीचे दिए गए लिंक का उपयोग करके अपनी सहमति दें।",
    dpdpNotice:
      "इस मूल्यांकन के हिस्से के रूप में हम जन्म की तारीख, समय और स्थान एकत्र करते हैं। भारत के डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम, 2023 के तहत, इस जन्म संबंधी डेटा को संवेदनशील व्यक्तिगत जानकारी माना जाता है और इसे केवल आपकी स्पष्ट सहमति से ही संसाधित किया जाता है।",
    withdrawal:
      "आप किसी भी समय अपनी सहमति वापस ले सकते हैं, जिसके बाद आपके बच्चे के डेटा का प्रसंस्करण रुक जाएगा और हमारी गोपनीयता नीति के अनुसार डेटा हटा दिया जाएगा।",
    button: "समीक्षा करें और सहमति दें",
    footer:
      "आपको यह ईमेल इसलिए मिला है क्योंकि किसी ने AEDHAS पर एक नाबालिग की भागीदारी के लिए आपकी सहमति का अनुरोध किया है। यदि यह अपेक्षित नहीं था, तो आप इस संदेश को सुरक्षित रूप से अनदेखा कर सकते हैं और कोई मूल्यांकन आगे नहीं बढ़ेगा।",
  },
};

/**
 * Build the guardian consent request email (DPDP Act 2023 compliant).
 */
export function guardianConsentEmail(
  params: GuardianConsentParams,
): EmailContent {
  const copy = GUARDIAN_CONSENT_COPY[resolveLocale(params.locale)];
  const safeStudentName = escapeHtml(params.studentName);

  const bodyHtml = `<p style="margin:0 0 12px 0;">${copy.intro(
    safeStudentName,
  )}</p><p style="margin:0 0 12px 0;">${copy.body}</p><p style="margin:0 0 12px 0;padding:12px 14px;background-color:#fff8e6;border:1px solid #f0d58a;border-radius:8px;font-size:14px;color:#5c4813;">${
    copy.dpdpNotice
  }</p><p style="margin:0;">${copy.withdrawal}</p>`;

  const html = layout({
    heading: copy.heading,
    bodyHtml,
    buttonLabel: copy.button,
    buttonUrl: params.consentUrl,
    footerHtml: copy.footer,
  });

  return { subject: copy.subject, html };
}
