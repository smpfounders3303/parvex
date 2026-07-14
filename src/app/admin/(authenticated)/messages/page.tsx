import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MessagesListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const messages = await prisma.contactMessage.findMany({
    where: status && status !== "all" ? { status: status as never } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <AdminTopbar title="Messages" />
      <div className="flex-1 p-6">
        <div className="mb-4 flex gap-1.5">
          {["all", "UNREAD", "READ", "REPLIED", "ARCHIVED"].map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/admin/messages" : `/admin/messages?status=${s}`}
              className={`rounded-full px-3 py-1.5 text-sm ${
                (status ?? "all") === s ? "bg-[#0a0a0a] text-white" : "border border-[var(--color-border)] text-[var(--color-gray)]"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>

        {messages.length === 0 ? (
          <EmptyState icon={Mail} title="No messages" description="Enquiries submitted through the public Contact form will appear here." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-gray)]">
                  <th className="px-4 py-3 font-medium">From</th>
                  <th className="px-4 py-3 font-medium">Project Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/messages/${m.id}`} className="font-medium hover:underline">
                        {m.name}
                      </Link>
                      <p className="text-xs text-[var(--color-gray)]">{m.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-gray)]">{m.projectType}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3 text-[var(--color-gray)]">{m.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
