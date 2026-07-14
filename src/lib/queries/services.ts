import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getPublishedServices() {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { media: true },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findFirst({
    where: { slug, published: true },
    include: { media: true },
  });
}
