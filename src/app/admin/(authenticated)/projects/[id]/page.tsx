import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { prisma } from "@/lib/db/prisma";
import { ProjectStatusControls } from "@/components/admin/projects/ProjectStatusControls";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [project, services] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { coverImage: true, thumbnail: true, technology: true, gallery: { include: { media: true } }, results: true },
    }),
    prisma.service.findMany({ orderBy: { order: "asc" }, select: { title: true } }),
  ]);

  if (!project) notFound();

  return (
    <>
      <AdminTopbar title={project.title} />
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-white p-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="text-sm text-[var(--color-gray)]">/{project.slug}</span>
          </div>
          <ProjectStatusControls id={project.id} status={project.status} />
        </div>
        <ProjectForm project={project} serviceOptions={services.map((s) => s.title)} />
      </div>
    </>
  );
}
