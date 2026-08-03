import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { AnalyticsEventType, Prisma } from "@prisma/client";

/**
 * Records a first-party analytics event. Fire-and-forget: never throws, so a
 * logging failure can never break a page render or a user-facing action.
 */
export async function recordAnalyticsEvent(
  type: AnalyticsEventType,
  entityId?: string,
  metadata?: Prisma.InputJsonValue
) {
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  try {
    await prisma.analyticsEvent.create({ data: { type, entityId, metadata } });
  } catch {
    console.warn("Skipped analytics event; database write failed.");
  }
}
