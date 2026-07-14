import type { Metadata } from "next";
import { WorkHero } from "@/components/work/WorkHero";
import { WorkGrid } from "@/components/work/WorkGrid";
import { WorkPhotography } from "@/components/work/WorkPhotography";
import { WorkVideography } from "@/components/work/WorkVideography";
import { FutureWork } from "@/components/work/FutureWork";
import { WorkCTA } from "@/components/work/WorkCTA";
import { getPublishedProjects } from "@/lib/queries/projects";
import { getPageContent } from "@/lib/queries/content";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("WORK");

  return {
    title: content?.metaTitle ?? "Selected Work — Parvex",
    description:
      content?.metaDescription ??
      "A curated selection of products, platforms, and visual work by Parvex — including AuditGPT, Resume Analyzer, and Movie Ticket Booking. Each project shaped by a real problem and shipped to a real standard.",
    keywords: [
      "Parvex work",
      "Parvex portfolio",
      "case studies",
      "digital experience studio",
      "web development",
      "AI products",
      "photography",
      "videography",
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://parvex.in/work",
      siteName: "Parvex",
      title: content?.metaTitle ?? "Selected Work — Parvex",
      description: content?.metaDescription ?? "A curated selection of products, platforms, and visual work by Parvex.",
      images: [{ url: "/assets/logos/parvex-og-image.png", width: 1200, height: 630, alt: "Parvex — Beyond Excellence" }],
    },
    twitter: {
      card: "summary_large_image",
      title: content?.metaTitle ?? "Selected Work — Parvex",
      description: content?.metaDescription ?? "A curated selection of products, platforms, and visual work by Parvex.",
      images: ["/assets/logos/parvex-og-image.png"],
    },
    alternates: { canonical: content?.canonicalUrl ?? "https://parvex.in/work" },
    robots: content?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  const workCards = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    description: p.description,
    thumbnail: p.thumbnail?.url ?? p.coverImage?.url ?? "/assets/projects/placeholder.png",
    thumbnailAlt: p.thumbnail?.altText ?? p.title,
    services: p.services,
    year: p.year,
  }));

  return (
    <>
      <WorkHero />
      <WorkGrid projects={workCards} />
      <WorkPhotography />
      <WorkVideography />
      <FutureWork />
      <WorkCTA />
    </>
  );
}
