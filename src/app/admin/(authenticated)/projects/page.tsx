import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { EmptyState } from "@/components/admin/EmptyState";
import { FolderKanban, Plus } from "lucide-react";
import { ProjectsTable } from "@/components/admin/projects/ProjectsTable";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ProjectsListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string }>;
}) {
  const { q, status, sort } = await searchParams;

  const where: Prisma.ProjectWhereInput = {
    ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    ...(status && status !== "all" ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {}),
  };

  const orderBy: Prisma.ProjectOrderByWithRelationInput =
    sort === "updated" ? { updatedAt: "desc" } : { displayOrder: "asc" };

  const projects = await prisma.project.findMany({
    where,
    orderBy,
    include: { thumbnail: true },
  });

  const totalCount = await prisma.project.count();

  return (
    <>
      <AdminTopbar title="Projects" />
      <div className="flex-1 p-6">
        {totalCount === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first case study to see it here and, once published, on the public Work page."
            action={
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" /> New Project
              </Link>
            }
          />
        ) : (
          <ProjectsTable projects={projects} query={q ?? ""} status={status ?? "all"} />
        )}
      </div>
    </>
  );
}
