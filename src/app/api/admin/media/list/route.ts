import { NextResponse } from "next/server";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { prisma } from "@/lib/db/prisma";
import type { MediaCategory } from "@prisma/client";

const VALID_CATEGORIES = ["PROJECT", "PHOTOGRAPHY", "SERVICE", "BRAND", "ATTACHMENT", "GENERAL"];

export async function GET(request: Request) {
  try {
    await requireRole("EDITOR");

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    const items = await prisma.media.findMany({
      where: {
        ...(category && VALID_CATEGORIES.includes(category)
          ? { category: category as MediaCategory }
          : {}),
        ...(q ? { OR: [{ filename: { contains: q, mode: "insensitive" } }, { altText: { contains: q, mode: "insensitive" } }] } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AuthzError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to load media." }, { status: 500 });
  }
}
