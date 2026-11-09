import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticLastModified = new Date("2026-11-01");
  const routes = [
    "",
    "/login",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: staticLastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}

