import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesList } from "@/components/services/ServicesList";
import { WhyChooseParvex } from "@/components/services/WhyChooseParvex";
import { ServicesProcess } from "@/components/services/ServicesProcess";
import { CTASection } from "@/components/home/CTASection";
import { getPublishedServices } from "@/lib/queries/services";
import { getPageContent } from "@/lib/queries/content";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("SERVICES");

  return {
    title: content?.metaTitle ?? "Services — Parvex",
    description:
      content?.metaDescription ??
      "Web development, app development, photography, and videography from Parvex — a Digital Experience Studio that builds products and brands worth trusting.",
    keywords: [
      "Parvex services",
      "web development studio",
      "app development studio",
      "photography services",
      "videography services",
      "digital experience studio",
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://parvex.in/services",
      siteName: "Parvex",
      title: content?.metaTitle ?? "Services — Parvex",
      description: content?.metaDescription ?? "Web development, app development, photography, and videography — engineering and creative craft under one roof.",
      images: [{ url: "/assets/logos/parvex-og-image.png", width: 1200, height: 630, alt: "Parvex — Beyond Excellence" }],
    },
    twitter: {
      card: "summary_large_image",
      title: content?.metaTitle ?? "Services — Parvex",
      description: content?.metaDescription ?? "Web development, app development, photography, and videography — engineering and creative craft under one roof.",
      images: ["/assets/logos/parvex-og-image.png"],
    },
    alternates: { canonical: content?.canonicalUrl ?? "https://parvex.in/services" },
    robots: content?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function ServicesPage() {
  const [services, content] = await Promise.all([getPublishedServices(), getPageContent("SERVICES")]);

  const serviceViews = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
    longDescription: s.longDescription,
    deliverables: s.deliverables,
    outcome: s.outcome,
    imageUrl: s.media?.url ?? "",
  }));

  return (
    <>
      <ServicesHero />
      <ServicesList services={serviceViews} />
      <WhyChooseParvex />
      <ServicesProcess />
      <CTASection
        headline={content?.finalCtaHeadline ?? undefined}
        ctaLabel={content?.finalCtaLabel ?? undefined}
        ctaLink={content?.finalCtaLink ?? undefined}
      />
    </>
  );
}
