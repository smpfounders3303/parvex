import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { PageKey } from "@prisma/client";

export async function getPageContent(page: PageKey) {
  return prisma.pageContent.findUnique({ where: { page } });
}
