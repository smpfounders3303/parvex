import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { prisma } from "@/lib/db/prisma";

export default async function NewProjectPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" }, select: { title: true } });

  return (
    <>
      <AdminTopbar title="New Project" />
      <div className="flex-1 p-6">
        <ProjectForm serviceOptions={services.map((s) => s.title)} />
      </div>
    </>
  );
}
