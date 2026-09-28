import type { MetadataRoute } from "next";
import { featuredProjects } from "./data/projects";
import { SITE_URL } from "./data/site.config";

/**
 * Pinned rather than `new Date()`. Using the current date regenerated
 * `lastModified` on every single request, which tells crawlers the page
 * changes continuously and is the opposite of the intended signal.
 */
const LAST_MODIFIED = new Date("2026-09-27T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
      {
        url: SITE_URL,
        lastModified: LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: `${SITE_URL}/projects`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.9,
      },
      ...featuredProjects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
