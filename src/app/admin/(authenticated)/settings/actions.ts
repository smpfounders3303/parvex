"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { recordAudit } from "@/lib/audit";

const schema = z.object({
  companyName: z.string().trim().min(1),
  tagline: z.string().optional().or(z.literal("")),
  primaryEmail: z.string().email().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  availabilityStatus: z.string().optional().or(z.literal("")),
  responseTime: z.string().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
});

export async function updateSettings(raw: unknown) {
  try {
    const session = await requireRole("ADMIN");
    const data = schema.parse(raw);

    await prisma.setting.upsert({
      where: { id: "singleton" },
      update: {
        companyName: data.companyName,
        tagline: data.tagline || null,
        primaryEmail: data.primaryEmail || null,
        contactEmail: data.contactEmail || null,
        availabilityStatus: data.availabilityStatus || null,
        responseTime: data.responseTime || null,
        linkedin: data.linkedin || null,
        instagram: data.instagram || null,
        github: data.github || null,
      },
      create: {
        id: "singleton",
        companyName: data.companyName,
        tagline: data.tagline || null,
        primaryEmail: data.primaryEmail || null,
        contactEmail: data.contactEmail || null,
        availabilityStatus: data.availabilityStatus || null,
        responseTime: data.responseTime || null,
        linkedin: data.linkedin || null,
        instagram: data.instagram || null,
        github: data.github || null,
      },
    });

    await recordAudit(session, "SETTINGS_UPDATED", "Setting", "singleton");
    revalidatePath("/");
    revalidatePath("/contact");
    return { ok: true, message: "Saved." };
  } catch (error) {
    if (error instanceof AuthzError) return { ok: false, message: error.message };
    if (error instanceof z.ZodError) return { ok: false, message: error.issues[0]?.message ?? "Invalid data." };
    console.error(error);
    return { ok: false, message: "Something went wrong." };
  }
}
