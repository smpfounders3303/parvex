import "server-only";
import { prisma } from "@/lib/db/prisma";
import { SERVICES as STATIC_SERVICES } from "@/data/services";

const SERVICE_IMAGE_BY_SLUG: Record<string, string> = {
  "web-development": "/assets/services/web-development.png",
  "app-development": "/assets/services/app-development.png",
  "ai-products": "/assets/services/web-development.png",
  photography: "/assets/services/photography.png",
  videography: "/assets/services/videography.png",
};

function staticServices() {
  return STATIC_SERVICES.map((service, order) => ({
    ...service,
    slug: service.slug ?? service.id,
    longDescription: service.longDescription ?? null,
    deliverables: service.deliverables ?? [],
    outcome: service.outcome ?? null,
    order,
    published: true,
    media: {
      url: SERVICE_IMAGE_BY_SLUG[service.slug ?? service.id] ?? "/assets/services/web-development.png",
      altText: `${service.title} service visualization`,
    },
  }));
}

export async function getPublishedServices() {
  try {
    return await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { media: true },
    });
  } catch {
    console.warn("Using static service fallback; database query failed.");
    return staticServices();
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    return await prisma.service.findFirst({
      where: { slug, published: true },
      include: { media: true },
    });
  } catch {
    console.warn(`Using static service fallback for "${slug}"; database query failed.`);
    return staticServices().find((service) => service.slug === slug) ?? null;
  }
}
