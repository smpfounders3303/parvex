"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { recordAudit } from "@/lib/audit";
import { slugify, isValidSlug } from "@/lib/slug";

const technologySchema = z.object({ name: z.string().min(1), category: z.string().min(1) });
const resultSchema = z.object({
  metric: z.string().min(1),
  value: z.string().min(1),
  description: z.string().min(1),
});
const gallerySchema = z.object({
  mediaId: z.string().min(1),
  aspect: z.enum(["landscape", "portrait", "square"]).default("landscape"),
});

const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((s) => s === "" || isValidSlug(s), "Slug may only contain lowercase letters, numbers and hyphens."),
  category: z.string().trim().min(1, "Category is required."),
  year: z.string().trim().min(4).max(4),
  clientType: z.enum(["CLIENT", "INTERNAL"]),
  clientName: z.string().trim().max(120).optional().or(z.literal("")),
  deliveryStatus: z.enum(["LIVE", "IN_PROGRESS", "CONCEPT"]),
  duration: z.string().trim().max(60).optional().or(z.literal("")),
  description: z.string().trim().min(10, "Short description is required."),

  coverImageId: z.string().optional().or(z.literal("")),
  thumbnailId: z.string().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),

  services: z.array(z.string()).default([]),

  challenge: z.string().optional().or(z.literal("")),
  solution: z.string().optional().or(z.literal("")),
  research: z.string().optional().or(z.literal("")),
  development: z.string().optional().or(z.literal("")),
  outcome: z.string().optional().or(z.literal("")),

  technology: z.array(technologySchema).default([]),
  gallery: z.array(gallerySchema).default([]),
  results: z.array(resultSchema).default([]),

  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),

  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  noIndex: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

type ActionResult = { ok: boolean; message?: string; id?: string };

async function resolveUniqueSlug(desired: string, excludeId?: string) {
  const base = slugify(desired);
  let candidate = base || "project";
  let n = 2;
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}

function revalidatePublicProjectRoutes(slug?: string) {
  revalidatePath("/");
  revalidatePath("/work");
  if (slug) revalidatePath(`/work/${slug}`);
}

export async function createProject(raw: unknown): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");
    const data = projectSchema.parse(raw);

    const slug = await resolveUniqueSlug(data.slug || data.title);

    const project = await prisma.project.create({
      data: {
        slug,
        title: data.title,
        category: data.category,
        year: data.year,
        clientType: data.clientType,
        clientName: data.clientName || null,
        deliveryStatus: data.deliveryStatus,
        duration: data.duration || null,
        description: data.description,
        coverImageId: data.coverImageId || null,
        thumbnailId: data.thumbnailId || null,
        videoUrl: data.videoUrl || null,
        services: data.services,
        challenge: data.challenge || null,
        solution: data.solution || null,
        research: data.research || null,
        development: data.development || null,
        outcome: data.outcome || null,
        featured: data.featured,
        displayOrder: data.displayOrder,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        noIndex: data.noIndex,
        status: "DRAFT",
        technology: { create: data.technology.map((t, i) => ({ ...t, order: i })) },
        results: { create: data.results.map((r, i) => ({ ...r, order: i })) },
        gallery: { create: data.gallery.map((g, i) => ({ ...g, order: i })) },
      },
    });

    await recordAudit(session, "PROJECT_CREATED", "Project", project.id, { slug: project.slug });
    return { ok: true, id: project.id, message: "Draft created." };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateProject(id: string, raw: unknown): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");
    const data = projectSchema.parse(raw);

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return { ok: false, message: "Project not found." };

    const slug = data.slug ? await resolveUniqueSlug(data.slug, id) : existing.slug;

    await prisma.$transaction(async (tx) => {
      await tx.projectTechnology.deleteMany({ where: { projectId: id } });
      await tx.projectResult.deleteMany({ where: { projectId: id } });
      await tx.projectGalleryImage.deleteMany({ where: { projectId: id } });
      await tx.project.update({
        where: { id },
        data: {
          slug,
          title: data.title,
          category: data.category,
          year: data.year,
          clientType: data.clientType,
          clientName: data.clientName || null,
          deliveryStatus: data.deliveryStatus,
          duration: data.duration || null,
          description: data.description,
          coverImageId: data.coverImageId || null,
          thumbnailId: data.thumbnailId || null,
          videoUrl: data.videoUrl || null,
          services: data.services,
          challenge: data.challenge || null,
          solution: data.solution || null,
          research: data.research || null,
          development: data.development || null,
          outcome: data.outcome || null,
          featured: data.featured,
          displayOrder: data.displayOrder,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          canonicalUrl: data.canonicalUrl || null,
          noIndex: data.noIndex,
          technology: { create: data.technology.map((t, i) => ({ ...t, order: i })) },
          results: { create: data.results.map((r, i) => ({ ...r, order: i })) },
          gallery: { create: data.gallery.map((g, i) => ({ ...g, order: i })) },
        },
      });
    });

    await recordAudit(session, "PROJECT_UPDATED", "Project", id, { slug });
    if (existing.status === "PUBLISHED") revalidatePublicProjectRoutes(slug);

    return { ok: true, message: "Saved." };
  } catch (error) {
    return handleError(error);
  }
}

export async function setProjectStatus(
  id: string,
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return { ok: false, message: "Project not found." };

    await prisma.project.update({
      where: { id },
      data: {
        status,
        publishedAt: status === "PUBLISHED" && !project.publishedAt ? new Date() : project.publishedAt,
      },
    });

    await recordAudit(session, `PROJECT_${status}`, "Project", id, { slug: project.slug });
    revalidatePublicProjectRoutes(project.slug);

    const labels = { DRAFT: "Moved to draft.", PUBLISHED: "Published.", ARCHIVED: "Archived." };
    return { ok: true, message: labels[status] };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    const session = await requireRole("ADMIN");
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return { ok: false, message: "Project not found." };

    await prisma.project.delete({ where: { id } });
    await recordAudit(session, "PROJECT_DELETED", "Project", id, { slug: project.slug });
    revalidatePublicProjectRoutes(project.slug);

    return { ok: true, message: `"${project.title}" deleted.` };
  } catch (error) {
    return handleError(error);
  }
}

export async function duplicateProject(id: string): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");
    const original = await prisma.project.findUnique({
      where: { id },
      include: { technology: true, results: true, gallery: true },
    });
    if (!original) return { ok: false, message: "Project not found." };

    const slug = await resolveUniqueSlug(`${original.slug}-copy`);

    const copy = await prisma.project.create({
      data: {
        slug,
        title: `${original.title} (Copy)`,
        category: original.category,
        year: original.year,
        clientType: original.clientType,
        clientName: original.clientName,
        deliveryStatus: original.deliveryStatus,
        duration: original.duration,
        description: original.description,
        coverImageId: original.coverImageId,
        thumbnailId: original.thumbnailId,
        services: original.services,
        challenge: original.challenge,
        solution: original.solution,
        research: original.research,
        development: original.development,
        outcome: original.outcome,
        status: "DRAFT",
        technology: {
          create: original.technology.map((t) => ({ name: t.name, category: t.category, order: t.order })),
        },
        results: {
          create: original.results.map((r) => ({
            metric: r.metric,
            value: r.value,
            description: r.description,
            order: r.order,
          })),
        },
        gallery: {
          create: original.gallery.map((g) => ({ mediaId: g.mediaId, aspect: g.aspect, order: g.order })),
        },
      },
    });

    await recordAudit(session, "PROJECT_DUPLICATED", "Project", copy.id, { from: original.slug });
    return { ok: true, id: copy.id, message: "Duplicated as a new draft." };
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown): ActionResult {
  if (error instanceof AuthzError) return { ok: false, message: error.message };
  if (error instanceof z.ZodError) {
    return { ok: false, message: error.issues[0]?.message ?? "Invalid data." };
  }
  console.error(error);
  return { ok: false, message: "Something went wrong. Please try again." };
}
