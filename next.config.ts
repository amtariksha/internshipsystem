import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    // `:locale` MUST be constrained to real locales. As a bare wildcard it also
    // matched the literal segment "api", so these rules hijacked our own API
    // routes: /api/assessment/session/<id> was redirected to /api/session/<id>
    // (which does not exist) and /api/assessment/start to /api/start. That broke
    // resuming an assessment and made the session page fail to load.
    const locale = "(en|hi|te|ta|kn)";
    return [
      {
        source: `/:locale${locale}/assessment/start`,
        destination: "/:locale/start",
        permanent: false,
      },
      {
        source: `/:locale${locale}/assessment/session/:id`,
        destination: "/:locale/session/:id",
        permanent: false,
      },
      {
        source: `/:locale${locale}/assessment/complete/:id`,
        destination: "/:locale/complete/:id",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
