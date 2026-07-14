import "server-only";
import { prisma } from "@/lib/db/prisma";

// Public queries. These must NEVER return draft/archived content — that
// invariant lives here (status: "PUBLISHED"), not scattered across callers.

const projectDetailInclude = {
  coverImage: true,
  thumbnail: true,
  technology: { orderBy: { order: "asc" as const } },
  gallery: { include: { media: true }, orderBy: { order: "asc" as const } },
  results: { orderBy: { order: "asc" as const } },
};

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
    include: { coverImage: true, thumbnail: true },
  });
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: { displayOrder: "asc" },
    include: { coverImage: true, thumbnail: true },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: projectDetailInclude,
  });
}

/** Draft/archived preview for Admin only — callers MUST authorize before use. */
export async function getProjectForPreview(slug: string) {
  return prisma.project.findFirst({
    where: { slug },
    include: projectDetailInclude,
  });
}

export async function getAdjacentProjects(currentSlug: string) {
  const published = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
    select: {
      slug: true,
      title: true,
      category: true,
      description: true,
      thumbnail: { select: { url: true, altText: true } },
      coverImage: { select: { url: true, altText: true } },
    },
  });

  const index = published.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return { next: null, previous: null };

  const next = index < published.length - 1 ? (published[index + 1] ?? null) : null;
  const previous = index > 0 ? (published[index - 1] ?? null) : null;

  return { next, previous };
}

export async function getAllPublishedSlugs() {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return projects.map((p) => p.slug);
}
