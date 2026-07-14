import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { Session } from "@/lib/auth/auth";

/**
 * Records an important Admin action. Never log passwords, auth secrets, or
 * complete sensitive Contact data — `metadata` should hold small, safe,
 * human-readable context only (e.g. { slug: "auditgpt", from: "DRAFT", to: "PUBLISHED" }).
 *
 * Never throws — a failed audit write must never break the caller's operation.
 */
export async function recordAudit(
  session: Session,
  action: string,
  entityType: string,
  entityId: string | null,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        actorName: session.user.name ?? session.user.email,
        action,
        entityType,
        entityId,
        metadata,
      },
    });
  } catch (error) {
    // Audit failure must never surface to the user — the action already succeeded.
    console.error("[audit] Failed to record audit log:", error);
  }
}

