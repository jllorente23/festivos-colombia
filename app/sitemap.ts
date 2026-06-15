import type { MetadataRoute } from "next";
import { yearWindow } from "@/lib/holidays";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://festivoscolombia.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const yearPages = yearWindow().map((y) => ({
    url: `${SITE}/festivos/${y}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [
    { url: SITE, lastModified: now, changeFrequency: "daily" as const, priority: 1 },
    ...yearPages,
  ];
}
