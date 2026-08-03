import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/queries/projects";

const BASE_URL = "https://parvex.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/work`, changeFrequency: "weekly", priority: 0.9 },
    // Services page — individual services use anchor IDs on this single page,
    // so fragment URLs (e.g. /services#web-dev) are excluded from the sitemap
    // because Google ignores fragment identifiers. The page itself is indexed.
    { url: `${BASE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => !p.noIndex)
    .map((p) => ({
      url: `${BASE_URL}/work/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...projectRoutes];
}

