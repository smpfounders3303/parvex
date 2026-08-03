import type { SEOFields } from "./seo";

/** Lightweight card shape used on the homepage and featured-work sections. */
export interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  span: "large" | "small";
  technologies?: string[];
  challenge?: string;
  solution?: string;
  outcome?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  aspect: "landscape" | "portrait" | "square";
}

export interface CaseStudyResult {
  metric: string;
  value: string;
  description: string;
}

export interface TechnologyItem {
  name: string;
  category: string;
}

/** Full case-study shape powering /work and /work/[slug]. */
export interface CaseStudyProject extends Partial<SEOFields> {
  slug: string;
  title: string;
  category: string;
  year: string;
  client: string;
  status: "Live" | "In Progress" | "Concept";
  duration: string;

  description: string;
  coverImage: string;
  coverImageAlt: string;
  thumbnail: string;
  thumbnailAlt: string;

  services: string[];

  challenge: string;
  solution: string;
  research: string;
  development: string;

  technology: TechnologyItem[];
  gallery: GalleryImage[];
  results: CaseStudyResult[];

  /** slug of next project, used for case-study navigation */
  nextProject: string;
}
