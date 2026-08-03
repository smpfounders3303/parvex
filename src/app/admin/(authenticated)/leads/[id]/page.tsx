import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { LeadDetailClient } from "@/components/admin/leads/LeadDetailClient";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { notes: { include: { author: true }, orderBy: { createdAt: "desc" } }, sourceMessage: true },
  });

  if (!lead) notFound();

  return (
    <>
      <AdminTopbar title={lead.name} />
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-lg font-semibold">{lead.name}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[var(--color-gray)]">Company</dt>
                <dd className="mt-0.5">{lead.company || "—"}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-gray)]">Email</dt>
                <dd className="mt-0.5">{lead.email}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-gray)]">Service Interest</dt>
                <dd className="mt-0.5">{lead.serviceInterest || "—"}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-gray)]">Estimated Budget</dt>
                <dd className="mt-0.5">{lead.estimatedBudget || "—"}</dd>
              </div>
            </dl>
            {lead.sourceMessage && (
              <p className="mt-4 text-sm">
                <Link href={`/admin/messages/${lead.sourceMessage.id}`} className="text-blue-600 hover:underline">
                  View original enquiry
                </Link>
              </p>
            )}
          </div>

          <LeadDetailClient leadId={lead.id} stage={lead.stage} notes={lead.notes} />
        </div>
      </div>
    </>
  );
}
