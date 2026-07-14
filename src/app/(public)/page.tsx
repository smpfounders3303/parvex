import { Hero } from "@/components/home/Hero";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ProjectsPreview } from "@/components/home/ProjectsPreview";
import { MediaShowcase } from "@/components/home/MediaShowcase";
import { CTASection } from "@/components/home/CTASection";
import { getFeaturedProjects } from "@/lib/queries/projects";
import { getPublishedServices } from "@/lib/queries/services";
import { getPageContent } from "@/lib/queries/content";
import { prisma } from "@/lib/db/prisma";

export const revalidate = 3600; // ISR fallback; Admin mutations explicitly revalidatePath() too

export default async function HomePage() {
  const [content, featuredProjects, services, settings] = await Promise.all([
    getPageContent("HOMEPAGE"),
    getFeaturedProjects(),
    getPublishedServices(),
    prisma.setting.findUnique({ where: { id: "singleton" } }),
  ]);

  const projectViews = featuredProjects.slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    description: p.description,
    imageSrc: p.thumbnail?.url ?? p.coverImage?.url ?? "/assets/projects/placeholder.png",
    imageAlt: p.thumbnail?.altText ?? p.title,
  }));

  const serviceViews = services.slice(0, 4).map((s) => ({
    slug: s.slug,
    number: s.number,
    title: s.title,
    description: s.description,
  }));

  return (
    <>
      <Hero
        eyebrow={content?.heroEyebrow ?? undefined}
        supportingCopy={content?.heroSupportingCopy ?? undefined}
        primaryCtaLabel={content?.primaryCtaLabel ?? undefined}
        primaryCtaLink={content?.primaryCtaLink ?? undefined}
      />
      <ServicesPreview services={serviceViews} heading={content?.servicesHeading ? content.servicesHeading : undefined} />
      <ProjectsPreview projects={projectViews} heading={content?.selectedWorkHeading ?? undefined} />
      <MediaShowcase />
      <CTASection
        headline={content?.finalCtaHeadline ?? undefined}
        ctaLabel={content?.finalCtaLabel ?? undefined}
        ctaLink={content?.finalCtaLink ?? undefined}
        contactEmail={settings?.primaryEmail ?? undefined}
      />
    </>
  );
}
