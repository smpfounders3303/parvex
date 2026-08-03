import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ServiceForm } from "@/components/admin/services/ServiceForm";
import { prisma } from "@/lib/db/prisma";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id }, include: { media: true } });
  if (!service) notFound();

  return (
    <>
      <AdminTopbar title={service.title} />
      <div className="flex-1 p-6">
        <ServiceForm service={service} />
      </div>
    </>
  );
}
