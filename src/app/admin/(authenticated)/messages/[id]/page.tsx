import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MessageActions } from "@/components/admin/messages/MessageActions";

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({
    where: { id },
    include: { attachments: { include: { media: true } }, lead: true },
  });

  if (!message) notFound();

  return (
    <>
      <AdminTopbar title="Enquiry Detail" />
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{message.name}</h2>
                <p className="text-sm text-[var(--color-gray)]">{message.email}</p>
              </div>
              <StatusBadge status={message.status} />
            </div>

            <dl className="grid grid-cols-2 gap-4 border-y border-[var(--color-border)] py-4 text-sm">
              <div>
                <dt className="text-[var(--color-gray)]">Company</dt>
                <dd className="mt-0.5">{message.company || "—"}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-gray)]">Project Type</dt>
                <dd className="mt-0.5">{message.projectType}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-gray)]">Timeline</dt>
                <dd className="mt-0.5">{message.timeline}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-gray)]">Budget</dt>
                <dd className="mt-0.5">{message.budget || "—"}</dd>
              </div>
            </dl>

            <div className="py-4">
              <p className="mb-2 text-sm text-[var(--color-gray)]">Message</p>
              <p className="whitespace-pre-wrap text-sm">{message.message}</p>
            </div>

            {message.attachments.length > 0 && (
              <div className="border-t border-[var(--color-border)] pt-4">
                <p className="mb-2 text-sm text-[var(--color-gray)]">Attachments</p>
                <ul className="space-y-1">
                  {message.attachments.map((a) => (
                    <li key={a.id}>
                      <a href={a.media.url} target="_blank" className="text-sm text-blue-600 hover:underline">
                        {a.media.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <MessageActions id={message.id} status={message.status} leadId={message.lead?.id} />
        </div>
      </div>
    </>
  );
}
