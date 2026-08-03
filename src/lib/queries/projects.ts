import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { PROJECTS as STATIC_PROJECTS } from "@/data/projects";

type QueryMedia = {
  url: string;
  altText: string | null;
};

export type PublicProjectSummary = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  year: string;
  services: string[];
  displayOrder?: number;
  featured?: boolean;
  noIndex: boolean;
  updatedAt: Date;
  coverImage: QueryMedia | null;
  thumbnail: QueryMedia | null;
};

export type PublicProjectDetail = PublicProjectSummary & {
  clientName: string | null;
  clientType: "INTERNAL" | "CLIENT";
  deliveryStatus: "LIVE" | "IN_PROGRESS" | "CONCEPT";
  duration: string | null;
  challenge: string | null;
  solution: string | null;
  research: string | null;
  development: string | null;
  technology: { name: string; category: string; order?: number }[];
  gallery: { aspect: "landscape" | "portrait" | "square"; order?: number; media: QueryMedia }[];
  results: { metric: string; value: string; description: string; order?: number }[];
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
};

// Public queries. These must NEVER return draft/archived content — that
// invariant lives here (status: "PUBLISHED"), not scattered across callers.

const projectDetailInclude = {
  coverImage: true,
  thumbnail: true,
  technology: { orderBy: { order: "asc" as const } },
  gallery: { include: { media: true }, orderBy: { order: "asc" as const } },
  results: { orderBy: { order: "asc" as const } },
};

type PrismaProjectDetail = Prisma.ProjectGetPayload<{ include: typeof projectDetailInclude }>;
type GalleryAspect = PublicProjectDetail["gallery"][number]["aspect"];

function mediaFromStatic(url: string, altText: string): QueryMedia {
  return { url, altText };
}

function staticProjectSummary(): PublicProjectSummary[] {
  return STATIC_PROJECTS.map((project, index) => ({
    id: project.slug,
    slug: project.slug,
    title: project.title,
    category: project.category,
    description: project.description,
    year: project.year,
    services: project.services,
    displayOrder: index,
    featured: index < 4,
    noIndex: false,
    updatedAt: new Date(0),
    coverImage: mediaFromStatic(project.coverImage, project.coverImageAlt),
    thumbnail: mediaFromStatic(project.thumbnail, project.thumbnailAlt),
  }));
}

function staticProjectDetail(slug: string): PublicProjectDetail | null {
  const project = STATIC_PROJECTS.find((p) => p.slug === slug);
  if (!project) return null;

  return {
    id: project.slug,
    slug: project.slug,
    title: project.title,
    category: project.category,
    year: project.year,
    clientName: project.client,
    clientType: project.client?.toLowerCase().includes("internal") ? "INTERNAL" : "CLIENT",
    deliveryStatus:
      project.status === "Live" ? "LIVE" : project.status === "In Progress" ? "IN_PROGRESS" : "CONCEPT",
    duration: project.duration,
    description: project.description,
    coverImage: mediaFromStatic(project.coverImage, project.coverImageAlt),
    thumbnail: mediaFromStatic(project.thumbnail, project.thumbnailAlt),
    services: project.services,
    challenge: project.challenge,
    solution: project.solution,
    research: project.research,
    development: project.development,
    technology: project.technology.map((t, order) => ({ ...t, order })),
    gallery: project.gallery.map((image, order) => ({
      aspect: image.aspect,
      order,
      media: mediaFromStatic(image.src, image.alt),
    })),
    results: project.results.map((result, order) => ({ ...result, order })),
    metaTitle: project.metaTitle ?? null,
    metaDescription: project.metaDescription ?? null,
    canonicalUrl: project.canonicalUrl ?? null,
    noIndex: false,
    updatedAt: new Date(0),
  };
}

function toGalleryAspect(aspect: string): GalleryAspect {
  return aspect === "portrait" || aspect === "square" ? aspect : "landscape";
}

function normalizeProjectDetail(project: PrismaProjectDetail | null): PublicProjectDetail | null {
  if (!project) return null;

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    description: project.description,
    year: project.year,
    services: project.services,
    displayOrder: project.displayOrder,
    featured: project.featured,
    noIndex: project.noIndex,
    updatedAt: project.updatedAt,
    clientName: project.clientName,
    clientType: project.clientType,
    deliveryStatus: project.deliveryStatus,
    duration: project.duration,
    coverImage: project.coverImage,
    thumbnail: project.thumbnail,
    challenge: project.challenge,
    solution: project.solution,
    research: project.research,
    development: project.development,
    technology: project.technology,
    gallery: project.gallery.map((image) => ({
      aspect: toGalleryAspect(image.aspect),
      order: image.order,
      media: image.media,
    })),
    results: project.results,
    metaTitle: project.metaTitle,
    metaDescription: project.metaDescription,
    canonicalUrl: project.canonicalUrl,
  };
}

export async function getPublishedProjects(): Promise<PublicProjectSummary[]> {
  try {
    return await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { displayOrder: "asc" },
      include: { coverImage: true, thumbnail: true },
    });
  } catch {
    console.warn("Using static project fallback; database query failed.");
    return staticProjectSummary();
  }
}

export async function getFeaturedProjects(): Promise<PublicProjectSummary[]> {
  try {
    return await prisma.project.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { displayOrder: "asc" },
      include: { coverImage: true, thumbnail: true },
    });
  } catch {
    console.warn("Using static featured project fallback; database query failed.");
    return staticProjectSummary().filter((project) => project.featured);
  }
}

export async function getProjectBySlug(slug: string): Promise<PublicProjectDetail | null> {
  try {
    const project = await prisma.project.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: projectDetailInclude,
    });
    return normalizeProjectDetail(project);
  } catch {
    console.warn(`Using static project fallback for "${slug}"; database query failed.`);
    return staticProjectDetail(slug);
  }
}

/** Draft/archived preview for Admin only — callers MUST authorize before use. */
export async function getProjectForPreview(slug: string) {
  try {
    return await prisma.project.findFirst({
      where: { slug },
      include: projectDetailInclude,
    });
  } catch (error) {
    console.error("Failed to fetch project for preview:", error);
    return null;
  }
}

export async function getAdjacentProjects(
  currentSlug: string
): Promise<{ next: PublicProjectSummary | null; previous: PublicProjectSummary | null }> {
  try {
    const published = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        description: true,
        year: true,
        services: true,
        noIndex: true,
        updatedAt: true,
        thumbnail: { select: { url: true, altText: true } },
        coverImage: { select: { url: true, altText: true } },
      },
    });

    const index = published.findIndex((p) => p.slug === currentSlug);
    if (index === -1) return { next: null, previous: null };

    const next = index < published.length - 1 ? (published[index + 1] ?? null) : null;
    const previous = index > 0 ? (published[index - 1] ?? null) : null;

    return { next, previous };
  } catch {
    console.warn("Using static adjacent project fallback; database query failed.");
    const published = staticProjectSummary();
    const index = published.findIndex((p) => p.slug === currentSlug);

    return {
      next: index >= 0 && index < published.length - 1 ? (published[index + 1] ?? null) : null,
      previous: index > 0 ? (published[index - 1] ?? null) : null,
    };
  }
}

export async function getAllPublishedSlugs() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    return projects.map((p) => p.slug);
  } catch {
    console.warn("Using static project slug fallback; database query failed.");
    return STATIC_PROJECTS.map((project) => project.slug);
  }
}
