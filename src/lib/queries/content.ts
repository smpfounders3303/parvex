import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { PageKey } from "@prisma/client";

export async function getPageContent(page: PageKey) {
  try {
    return await prisma.pageContent.findUnique({ where: { page } });
  } catch {
    console.warn(`Using default page content for ${page}; database query failed.`);
    return null;
  }
}
