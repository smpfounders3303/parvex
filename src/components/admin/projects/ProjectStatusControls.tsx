"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setProjectStatus } from "@/app/admin/(authenticated)/projects/actions";
import type { ProjectStatus } from "@prisma/client";

export function ProjectStatusControls({ id, status }: { id: string; status: ProjectStatus }) {
  const router = useRouter();

  async function handle(next: ProjectStatus) {
    const result = await setProjectStatus(id, next);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="flex gap-2">
      {status !== "PUBLISHED" && (
        <button
          onClick={() => handle("PUBLISHED")}
          className="rounded-lg bg-[#0a0a0a] px-3.5 py-2 text-sm font-medium text-white"
        >
          Publish
        </button>
      )}
      {status === "PUBLISHED" && (
        <button
          onClick={() => handle("DRAFT")}
          className="rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium"
        >
          Unpublish
        </button>
      )}
      {status !== "ARCHIVED" && (
        <button
          onClick={() => handle("ARCHIVED")}
          className="rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium text-[var(--color-gray)]"
        >
          Archive
        </button>
      )}
    </div>
  );
}
