import { NextResponse } from "next/server";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { createMediaFromFile } from "@/lib/storage/media-service";
import type { MediaCategory } from "@prisma/client";

const FOLDER_BY_CATEGORY: Record<MediaCategory, string> = {
  PROJECT: "parvex/projects",
  PHOTOGRAPHY: "parvex/photography",
  SERVICE: "parvex/services",
  BRAND: "parvex/brand",
  ATTACHMENT: "parvex/attachments",
  GENERAL: "parvex/media",
};

export async function POST(request: Request) {
  try {
    await requireRole("EDITOR");

    const formData = await request.formData();
    const file = formData.get("file");
    const category = (formData.get("category") as MediaCategory | null) ?? "GENERAL";
    const altText = (formData.get("altText") as string | null) ?? undefined;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const media = await createMediaFromFile(file, {
      category,
      folder: FOLDER_BY_CATEGORY[category] ?? FOLDER_BY_CATEGORY.GENERAL,
      altText,
      title: file.name,
    });

    return NextResponse.json({ media });
  } catch (error) {
    if (error instanceof AuthzError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    const message = error instanceof Error ? error.message : "Upload failed.";
    console.error("Media upload failed:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
