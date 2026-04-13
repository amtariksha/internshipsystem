import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  async redirects() {
    return [
      { source: "/:locale/dashboard", destination: "/:locale", permanent: false },
      { source: "/:locale/assessment/start", destination: "/:locale/start", permanent: false },
      { source: "/:locale/assessment/session/:id", destination: "/:locale/session/:id", permanent: false },
      { source: "/:locale/assessment/complete/:id", destination: "/:locale/complete/:id", permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
