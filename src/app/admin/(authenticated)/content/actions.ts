"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { recordAudit } from "@/lib/audit";

const contentSchema = z.object({
  heroEyebrow: z.string().optional().or(z.literal("")),
  heroHeadline: z.string().optional().or(z.literal("")),
  heroSupportingCopy: z.string().optional().or(z.literal("")),
  primaryCtaLabel: z.string().optional().or(z.literal("")),
  primaryCtaLink: z.string().optional().or(z.literal("")),
  selectedWorkHeading: z.string().optional().or(z.literal("")),
  servicesHeading: z.string().optional().or(z.literal("")),
  photographyHeading: z.string().optional().or(z.literal("")),
  finalCtaHeadline: z.string().optional().or(z.literal("")),
  finalCtaLabel: z.string().optional().or(z.literal("")),
  finalCtaLink: z.string().optional().or(z.literal("")),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  noIndex: z.boolean().default(false),
});

const PATH_BY_PAGE: Record<string, string> = {
  HOMEPAGE: "/",
  WORK: "/work",
  SERVICES: "/services",
  ABOUT: "/about",
  CONTACT: "/contact",
};

export async function updatePageContent(page: string, raw: unknown) {
  try {
    const session = await requireRole("EDITOR");
    const data = contentSchema.parse(raw);

    await prisma.pageContent.upsert({
      where: { page: page as never },
      update: {
        ...data,
        heroEyebrow: data.heroEyebrow || null,
        heroHeadline: data.heroHeadline || null,
        heroSupportingCopy: data.heroSupportingCopy || null,
        primaryCtaLabel: data.primaryCtaLabel || null,
        primaryCtaLink: data.primaryCtaLink || null,
        selectedWorkHeading: data.selectedWorkHeading || null,
        servicesHeading: data.servicesHeading || null,
        photographyHeading: data.photographyHeading || null,
        finalCtaHeadline: data.finalCtaHeadline || null,
        finalCtaLabel: data.finalCtaLabel || null,
        finalCtaLink: data.finalCtaLink || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        canonicalUrl: data.canonicalUrl || null,
      },
      create: { page: page as never, ...data },
    });

    await recordAudit(session, "PAGE_CONTENT_UPDATED", "PageContent", page);
    revalidatePath(PATH_BY_PAGE[page] ?? "/");

    return { ok: true, message: "Saved." };
  } catch (error) {
    if (error instanceof AuthzError) return { ok: false, message: error.message };
    if (error instanceof z.ZodError) return { ok: false, message: error.issues[0]?.message ?? "Invalid data." };
    console.error(error);
    return { ok: false, message: "Something went wrong." };
  }
}
