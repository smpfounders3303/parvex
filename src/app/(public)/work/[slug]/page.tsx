import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAdjacentProjects, getAllPublishedSlugs } from "@/lib/queries/projects";
import { toCaseStudyProject } from "@/lib/queries/adapters";
import { CaseStudyHero } from "@/components/casestudy/CaseStudyHero";
import { CaseStudyOverview } from "@/components/casestudy/CaseStudyOverview";
import { CaseStudyChallenge } from "@/components/casestudy/CaseStudyChallenge";
import { CaseStudySolution } from "@/components/casestudy/CaseStudySolution";
import { CaseStudyResearch } from "@/components/casestudy/CaseStudyResearch";
import { CaseStudyProcess } from "@/components/casestudy/CaseStudyProcess";
import { CaseStudyDevelopment } from "@/components/casestudy/CaseStudyDevelopment";
import { CaseStudyTechnology } from "@/components/casestudy/CaseStudyTechnology";
import { CaseStudyGallery } from "@/components/casestudy/CaseStudyGallery";
import { CaseStudyResults } from "@/components/casestudy/CaseStudyResults";
import { CaseStudyNavigation } from "@/components/casestudy/CaseStudyNavigation";
import { WorkCTA } from "@/components/work/WorkCTA";
import { CaseStudyAnimationInit } from "@/components/casestudy/CaseStudyAnimationInit";
import { recordAnalyticsEvent } from "@/lib/analytics";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Failed to generateStaticParams for work/[slug]:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) return {};

    const title = project.metaTitle ?? `${project.title} — Parvex`;
    const description = project.metaDescription ?? project.description;

    return {
      title,
      description,
      openGraph: {
        type: "website",
        locale: "en_IN",
        url: `https://parvex.in/work/${project.slug}`,
        siteName: "Parvex",
        title,
        description,
        images: project.coverImage ? [{ url: project.coverImage.url, alt: project.coverImage.altText ?? project.title }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      alternates: {
        canonical: project.canonicalUrl ?? `https://parvex.in/work/${project.slug}`,
      },
      robots: project.noIndex ? { index: false, follow: false } : undefined,
    };
  } catch (error) {
    console.error("Error generating metadata for work/[slug]:", error);
    return {};
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  let projectRecord = null;
  try {
    projectRecord = await getProjectBySlug(slug);
  } catch (error) {
    console.error("Error fetching project in CaseStudyPage:", error);
  }

  if (!projectRecord) notFound();

  let next = null;
  try {
    const adjacent = await getAdjacentProjects(slug);
    next = adjacent.next;
  } catch (error) {
    console.error("Error fetching adjacent projects in CaseStudyPage:", error);
  }
  const project = toCaseStudyProject(projectRecord, next?.slug ?? "");

  // First-party analytics — never blocks rendering, never throws to the page.
  void recordAnalyticsEvent("PROJECT_VIEWED", projectRecord.id);

  return (
    <>
      {/* Client-side animation initialiser — mounts hero + scroll reveals */}
      <CaseStudyAnimationInit />

      {/* Storytelling order per Phase 3 spec */}
      <CaseStudyHero project={project} />
      <CaseStudyOverview project={project} />
      <CaseStudyChallenge project={project} />
      <CaseStudySolution project={project} />
      <CaseStudyResearch project={project} />
      <CaseStudyProcess />
      <CaseStudyDevelopment project={project} />
      <CaseStudyTechnology project={project} />
      <CaseStudyGallery project={project} />
      <CaseStudyResults project={project} />
      {next && (
        <CaseStudyNavigation
          nextProject={{
            slug: next.slug,
            title: next.title,
            category: next.category,
            description: next.description,
            thumbnail: next.thumbnail?.url ?? next.coverImage?.url ?? "/assets/projects/auditgpt.png",
            thumbnailAlt: next.thumbnail?.altText ?? next.title,
          }}
        />
      )}
      <WorkCTA />
    </>
  );
}
