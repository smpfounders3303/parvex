"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { deleteService, toggleServicePublished } from "@/app/admin/(authenticated)/services/actions";
import type { Media, Service } from "@prisma/client";

export function ServicesTable({ services }: { services: (Service & { media: Media | null })[] }) {
  const router = useRouter();

  async function handleToggle(id: string, published: boolean) {
    const result = await toggleServicePublished(id, !published);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else toast.error(result.message);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-gray)]">
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Service</th>
            <th className="px-4 py-3 font-medium">Published</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-neutral-50">
              <td className="px-4 py-3 text-[var(--color-gray)]">{s.number}</td>
              <td className="px-4 py-3">
                <Link href={`/admin/services/${s.id}/edit`} className="font-medium hover:underline">
                  {s.title}
                </Link>
                <p className="truncate text-xs text-[var(--color-gray)]">/{s.slug}</p>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleToggle(s.id, s.published)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.published ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {s.published ? "Published" : "Hidden"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <ConfirmButton
                    title={`Delete "${s.title}"?`}
                    description="This permanently removes the service. Existing projects that reference its name by label are not affected."
                    action={async () => {
                      const result = await deleteService(s.id);
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
  );
}
