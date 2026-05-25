import type { MetadataRoute } from "next";
import { routing } from "@/lib/i18n/routing";

const BASE_URL = "https://aedhas.com";

const staticPaths = [
  "",
  "/astro/quick",
  "/sign-in",
  "/sign-up",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1.0 : 0.7,
      });
    }
  }

  return entries;
}
