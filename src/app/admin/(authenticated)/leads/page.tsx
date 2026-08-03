import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { EmptyState } from "@/components/admin/EmptyState";
import { Users2 } from "lucide-react";
import type { LeadStage } from "@prisma/client";

export const dynamic = "force-dynamic";

const STAGES: LeadStage[] = ["NEW", "QUALIFIED", "DISCUSSION", "PROPOSAL", "WON", "LOST"];

export default async function LeadsListPage() {
  const leads = await prisma.lead.findMany({ orderBy: { updatedAt: "desc" } });

  if (leads.length === 0) {
    return (
      <>
        <AdminTopbar title="Leads" />
        <div className="flex-1 p-6">
          <EmptyState icon={Users2} title="No leads yet" description="Convert a contact message into a lead to start tracking it here." />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="Leads" />
      <div className="flex-1 overflow-x-auto p-6">
        <div className="grid min-w-[900px] grid-cols-6 gap-4">
          {STAGES.map((stage) => {
            const items = leads.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="min-w-0">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-gray)]">
                  {stage.replace("_", " ")} · {items.length}
                </p>
                <div className="space-y-2">
                  {items.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/admin/leads/${lead.id}`}
                      className="block rounded-lg border border-[var(--color-border)] bg-white p-3 hover:border-neutral-300"
                    >
                      <p className="truncate text-sm font-medium">{lead.name}</p>
                      <p className="truncate text-xs text-[var(--color-gray)]">{lead.company || lead.email}</p>
                      {lead.estimatedBudget && (
                        <p className="mt-1 text-xs text-[var(--color-admin-gold)]">{lead.estimatedBudget}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
