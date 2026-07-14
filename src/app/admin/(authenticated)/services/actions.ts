"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { recordAudit } from "@/lib/audit";
import { slugify, isValidSlug } from "@/lib/slug";

const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((s) => s === "" || isValidSlug(s), "Slug may only contain lowercase letters, numbers and hyphens."),
  number: z.string().trim().min(1),
  title: z.string().trim().min(2, "Title is required."),
  description: z.string().trim().min(10, "Description is required."),
  longDescription: z.string().optional().or(z.literal("")),
  deliverables: z.array(z.string().min(1)).default([]),
  outcome: z.string().optional().or(z.literal("")),
  mediaId: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  keywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  noIndex: z.boolean().default(false),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
type ActionResult = { ok: boolean; message?: string; id?: string };

async function resolveUniqueSlug(desired: string, excludeId?: string) {
  const base = slugify(desired);
  let candidate = base || "service";
  let n = 2;
  while (true) {
    const existing = await prisma.service.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}

function revalidatePublicServiceRoutes() {
  revalidatePath("/");
  revalidatePath("/services");
}

export async function createService(raw: unknown): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");
    const data = serviceSchema.parse(raw);
    const slug = await resolveUniqueSlug(data.slug || data.title);

    const service = await prisma.service.create({
      data: {
        slug,
        number: data.number,
        title: data.title,
        description: data.description,
        longDescription: data.longDescription || null,
        deliverables: data.deliverables,
        outcome: data.outcome || null,
        mediaId: data.mediaId || null,
        order: data.order,
        published: data.published,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        keywords: data.keywords,
        canonicalUrl: data.canonicalUrl || null,
        noIndex: data.noIndex,
      },
    });

    await recordAudit(session, "SERVICE_CREATED", "Service", service.id, { slug });
    revalidatePublicServiceRoutes();
    return { ok: true, id: service.id, message: "Service created." };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateService(id: string, raw: unknown): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");
    const data = serviceSchema.parse(raw);
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return { ok: false, message: "Service not found." };

    const slug = data.slug ? await resolveUniqueSlug(data.slug, id) : existing.slug;

    await prisma.service.update({
      where: { id },
      data: {
        slug,
        number: data.number,
        title: data.title,
        description: data.description,
        longDescription: data.longDescription || null,
        deliverables: data.deliverables,
        outcome: data.outcome || null,
        mediaId: data.mediaId || null,
        order: data.order,
        published: data.published,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        keywords: data.keywords,
        canonicalUrl: data.canonicalUrl || null,
        noIndex: data.noIndex,
      },
    });

    await recordAudit(session, "SERVICE_UPDATED", "Service", id, { slug });
    revalidatePublicServiceRoutes();
    return { ok: true, message: "Saved." };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  try {
    const session = await requireRole("ADMIN");
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) return { ok: false, message: "Service not found." };

    // Note: this does not remove the service's title from Project.services[]
    // string arrays — those are display labels a Project chose at the time,
    // not a relational reference, so deleting a Service intentionally does
    // not cascade into existing case studies.
    await prisma.service.delete({ where: { id } });
    await recordAudit(session, "SERVICE_DELETED", "Service", id, { slug: service.slug });
    revalidatePublicServiceRoutes();
    return { ok: true, message: `"${service.title}" deleted.` };
  } catch (error) {
    return handleError(error);
  }
}

export async function toggleServicePublished(id: string, published: boolean): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");
    await prisma.service.update({ where: { id }, data: { published } });
    await recordAudit(session, published ? "SERVICE_PUBLISHED" : "SERVICE_UNPUBLISHED", "Service", id);
    revalidatePublicServiceRoutes();
    return { ok: true, message: published ? "Published." : "Unpublished." };
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown): ActionResult {
  if (error instanceof AuthzError) return { ok: false, message: error.message };
  if (error instanceof z.ZodError) return { ok: false, message: error.issues[0]?.message ?? "Invalid data." };
  console.error(error);
  return { ok: false, message: "Something went wrong. Please try again." };
}
