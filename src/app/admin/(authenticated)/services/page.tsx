import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { EmptyState } from "@/components/admin/EmptyState";
import { Layers, Plus } from "lucide-react";
import { ServicesTable } from "@/components/admin/services/ServicesTable";

export const dynamic = "force-dynamic";

export default async function ServicesListPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" }, include: { media: true } });

  return (
    <>
      <AdminTopbar title="Services" />
      <div className="flex-1 p-6">
        <div className="mb-4 flex justify-end">
          <Link
            href="/admin/services/new"
            className="flex items-center gap-1.5 rounded-lg bg-[#0a0a0a] px-3.5 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" /> New Service
          </Link>
        </div>
        {services.length === 0 ? (
          <EmptyState icon={Layers} title="No services yet" description="Add the services PARVEX offers — these appear on the public Services page." />
        ) : (
          <ServicesTable services={services} />
        )}
      </div>
    </>
  );
}
