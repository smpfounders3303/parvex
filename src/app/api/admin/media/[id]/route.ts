import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { prisma } from "@/lib/db/prisma";
import { deleteMediaSafely } from "@/lib/storage/media-service";
import { recordAudit } from "@/lib/audit";

const patchSchema = z.object({
  altText: z.string().max(300).optional(),
  title: z.string().max(200).optional(),
  category: z.enum(["PROJECT", "PHOTOGRAPHY", "SERVICE", "BRAND", "ATTACHMENT", "GENERAL"]).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("EDITOR");
    const { id } = await params;
    const body = patchSchema.parse(await request.json());

    const media = await prisma.media.update({ where: { id }, data: body });
    return NextResponse.json({ media });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole("EDITOR");
    const { id } = await params;

    await deleteMediaSafely(id);
    await recordAudit(session, "MEDIA_DELETED", "Media", id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

function errorResponse(error: unknown) {
  if (error instanceof AuthzError) return NextResponse.json({ error: error.message }, { status: 403 });
  const message = error instanceof Error ? error.message : "Something went wrong.";
  return NextResponse.json({ error: message }, { status: 400 });
}
