"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { recordAudit } from "@/lib/audit";

const schema = z.object({
  googleAnalyticsId: z.string().optional().or(z.literal("")),
  vercelAnalyticsEnabled: z.boolean().default(false),
  microsoftClarityId: z.string().optional().or(z.literal("")),
});

export async function updateAnalyticsConfig(raw: unknown) {
  try {
    const session = await requireRole("ADMIN");
    const data = schema.parse(raw);

    await prisma.analyticsConfig.upsert({
      where: { id: "singleton" },
      update: {
        googleAnalyticsId: data.googleAnalyticsId || null,
        vercelAnalyticsEnabled: data.vercelAnalyticsEnabled,
        microsoftClarityId: data.microsoftClarityId || null,
      },
      create: {
        id: "singleton",
        googleAnalyticsId: data.googleAnalyticsId || null,
        vercelAnalyticsEnabled: data.vercelAnalyticsEnabled,
        microsoftClarityId: data.microsoftClarityId || null,
      },
    });

    await recordAudit(session, "ANALYTICS_CONFIG_UPDATED", "AnalyticsConfig", "singleton");
    revalidatePath("/");
    return { ok: true, message: "Saved." };
  } catch (error) {
    if (error instanceof AuthzError) return { ok: false, message: error.message };
    if (error instanceof z.ZodError) return { ok: false, message: error.issues[0]?.message ?? "Invalid data." };
    console.error(error);
    return { ok: false, message: "Something went wrong." };
  }
}
