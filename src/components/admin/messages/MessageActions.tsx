"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setMessageStatus, convertMessageToLead } from "@/app/admin/(authenticated)/messages/actions";
import type { MessageStatus } from "@prisma/client";

export function MessageActions({
  id,
  status,
  leadId,
}: {
  id: string;
  status: MessageStatus;
  leadId?: string;
}) {
  const router = useRouter();

  async function handleStatus(next: MessageStatus) {
    const result = await setMessageStatus(id, next);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else toast.error(result.message);
  }

  async function handleConvert() {
    const result = await convertMessageToLead(id);
    if (result.ok) {
      toast.success(result.message);
      router.push(`/admin/leads/${result.id}`);
    } else toast.error(result.message);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "REPLIED" && (
        <button onClick={() => handleStatus("REPLIED")} className="rounded-lg bg-[#0a0a0a] px-3.5 py-2 text-sm font-medium text-white">
          Mark Replied
        </button>
      )}
      {status !== "READ" && status !== "REPLIED" && (
        <button onClick={() => handleStatus("READ")} className="rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium">
          Mark Read
        </button>
      )}
      {status !== "ARCHIVED" && (
        <button onClick={() => handleStatus("ARCHIVED")} className="rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium text-[var(--color-gray)]">
          Archive
        </button>
      )}
      {leadId ? (
        <Link href={`/admin/leads/${leadId}`} className="rounded-lg border border-[var(--color-admin-gold)] px-3.5 py-2 text-sm font-medium text-[var(--color-admin-gold)]">
          View Lead
        </Link>
      ) : (
        <button onClick={handleConvert} className="rounded-lg border border-[var(--color-admin-gold)] px-3.5 py-2 text-sm font-medium text-[var(--color-admin-gold)]">
          Convert to Lead
        </button>
      )}
    </div>
  );
}
