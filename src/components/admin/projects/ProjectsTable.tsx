"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { setProjectStatus, deleteProject, duplicateProject } from "@/app/admin/(authenticated)/projects/actions";
import { Star, Copy, ExternalLink } from "lucide-react";
import type { Media, Project } from "@prisma/client";

type ProjectRow = Project & { thumbnail: Media | null };

export function ProjectsTable({
  projects,
  query,
  status,
}: {
  projects: ProjectRow[];
  query: string;
  status: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(query);
  const [, startTransition] = useTransition();

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  async function handlePublishToggle(id: string, current: string) {
    const next = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const result = await setProjectStatus(id, next);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateParams({ q })}
          onBlur={() => updateParams({ q })}
          placeholder="Search projects…"
          className="w-full max-w-xs rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <select
          value={status}
          onChange={(e) => updateParams({ status: e.target.value })}
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none"
        >
          <option value="all">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-gray)]">
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/projects/${p.id}`} className="flex items-center gap-3">
                    {p.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.thumbnail.url} alt="" className="h-9 w-14 rounded object-cover" />
                    )}
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-xs text-[var(--color-gray)]">/{p.slug}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--color-gray)]">{p.category}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handlePublishToggle(p.id, p.status)}>
                    <StatusBadge status={p.status} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  {p.featured && <Star className="h-4 w-4 fill-[var(--color-admin-gold)] text-[var(--color-admin-gold)]" />}
                </td>
                <td className="px-4 py-3 text-[var(--color-gray)]">{p.updatedAt.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {p.status === "PUBLISHED" && (
                      <Link
                        href={`/work/${p.slug}`}
                        target="_blank"
                        className="rounded-md p-1.5 text-[var(--color-gray)] hover:bg-neutral-100"
                        title="View live"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        const result = await duplicateProject(p.id);
                        if (result.ok) {
                          toast.success(result.message);
                          router.push(`/admin/projects/${result.id}`);
                        } else toast.error(result.message);
                      }}
                      className="rounded-md p-1.5 text-[var(--color-gray)] hover:bg-neutral-100"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <ConfirmButton
                      title={`Delete "${p.title}"?`}
                      description="This permanently removes the project record and cannot be undone."
                      action={async () => {
                        const result = await deleteProject(p.id);
                        if (result.ok) router.refresh();
                        return result;
                      }}
                      className="rounded-md px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </ConfirmButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
