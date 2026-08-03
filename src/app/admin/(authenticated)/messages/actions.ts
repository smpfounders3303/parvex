"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { recordAudit } from "@/lib/audit";
import type { MessageStatus } from "@prisma/client";

type ActionResult = { ok: boolean; message?: string; id?: string };

export async function setMessageStatus(id: string, status: MessageStatus): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");
    await prisma.contactMessage.update({ where: { id }, data: { status } });
    await recordAudit(session, "MESSAGE_STATUS_CHANGED", "ContactMessage", id, { status });
    revalidatePath("/admin/messages");
    return { ok: true, message: "Updated." };
  } catch (error) {
    return handleError(error);
  }
}

export async function convertMessageToLead(id: string): Promise<ActionResult> {
  try {
    const session = await requireRole("EDITOR");

    const existingLead = await prisma.lead.findUnique({ where: { sourceMessageId: id } });
    if (existingLead) return { ok: true, id: existingLead.id, message: "Already converted." };

    const msg = await prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) return { ok: false, message: "Message not found." };

    const lead = await prisma.lead.create({
      data: {
        name: msg.name,
        company: msg.company,
        email: msg.email,
        serviceInterest: msg.projectType,
        estimatedBudget: msg.budget,
        source: "Contact Form",
        sourceMessageId: msg.id,
        stage: "NEW",
      },
    });

    await prisma.contactMessage.update({ where: { id }, data: { status: "READ" } });
    await recordAudit(session, "LEAD_CREATED_FROM_MESSAGE", "Lead", lead.id, { messageId: id });
    revalidatePath("/admin/leads");

    return { ok: true, id: lead.id, message: "Converted to lead." };
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown): ActionResult {
  if (error instanceof AuthzError) return { ok: false, message: error.message };
  console.error(error);
  return { ok: false, message: "Something went wrong." };
}
