"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { recordAudit } from "@/lib/audit";
import type { LeadStage } from "@prisma/client";

type ActionResult = { ok: boolean; message?: string };

export async function setLeadStage(id: string, stage: LeadStage): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");
    await prisma.lead.update({ where: { id }, data: { stage } });
    await recordAudit(session, "LEAD_STAGE_CHANGED", "Lead", id, { stage });
    revalidatePath("/admin/leads");
    return { ok: true, message: "Updated." };
  } catch (error) {
    return handleError(error);
  }
}

export async function addLeadNote(id: string, body: string): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");
    if (!body.trim()) return { ok: false, message: "Note can't be empty." };

    await prisma.leadNote.create({ data: { leadId: id, authorId: session.user.id, body: body.trim() } });
    await recordAudit(session, "LEAD_NOTE_ADDED", "Lead", id);
    revalidatePath(`/admin/leads/${id}`);
    return { ok: true, message: "Note added." };
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown): ActionResult {
  if (error instanceof AuthzError) return { ok: false, message: error.message };
  console.error(error);
  return { ok: false, message: "Something went wrong." };
}
