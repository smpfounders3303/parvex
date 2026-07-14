import type { CaseStudyProject } from "@/types";
import type { Media, Project, ProjectGalleryImage, ProjectResult, ProjectTechnology } from "@prisma/client";

type ProjectWithRelations = Project & {
  coverImage: Media | null;
  thumbnail: Media | null;
  technology: ProjectTechnology[];
  gallery: (ProjectGalleryImage & { media: Media })[];
  results: ProjectResult[];
};

const STATUS_MAP: Record<Project["deliveryStatus"], CaseStudyProject["status"]> = {
  LIVE: "Live",
  IN_PROGRESS: "In Progress",
  CONCEPT: "Concept",
};

/** Adapts a DB Project record into the shape the existing case-study UI components expect. */
export function toCaseStudyProject(project: ProjectWithRelations, nextProjectSlug = ""): CaseStudyProject {
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    year: project.year,
    client: project.clientName ?? (project.clientType === "INTERNAL" ? "Internal" : ""),
    status: STATUS_MAP[project.deliveryStatus],
    duration: project.duration ?? "",

    description: project.description,
    coverImage: project.coverImage?.url ?? "/assets/projects/placeholder.png",
    coverImageAlt: project.coverImage?.altText ?? project.title,
    thumbnail: project.thumbnail?.url ?? project.coverImage?.url ?? "/assets/projects/placeholder.png",
    thumbnailAlt: project.thumbnail?.altText ?? project.title,

    services: project.services,

    challenge: project.challenge ?? "",
    solution: project.solution ?? "",
    research: project.research ?? "",
    development: project.development ?? "",

    technology: project.technology.map((t) => ({ name: t.name, category: t.category })),
    gallery: project.gallery.map((g) => ({
      src: g.media.url,
      alt: g.media.altText ?? project.title,
      aspect: g.aspect as "landscape" | "portrait" | "square",
    })),
    results: project.results.map((r) => ({ metric: r.metric, value: r.value, description: r.description })),

    nextProject: nextProjectSlug,

    metaTitle: project.metaTitle ?? undefined,
    metaDescription: project.metaDescription ?? undefined,
    canonicalUrl: project.canonicalUrl ?? undefined,
  };
}
