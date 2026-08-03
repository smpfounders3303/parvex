import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface SeoRow {
  label: string;
  editHref: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

export default async function SeoOverviewPage() {
  const [projects, services, pages] = await Promise.all([
    prisma.project.findMany({ where: { status: "PUBLISHED" }, select: { id: true, title: true, metaTitle: true, metaDescription: true } }),
    prisma.service.findMany({ where: { published: true }, select: { id: true, title: true, metaTitle: true, metaDescription: true } }),
    prisma.pageContent.findMany({ select: { page: true, metaTitle: true, metaDescription: true } }),
  ]);

  const rows: SeoRow[] = [
    ...projects.map((p) => ({ label: `Project: ${p.title}`, editHref: `/admin/projects/${p.id}`, metaTitle: p.metaTitle, metaDescription: p.metaDescription })),
    ...services.map((s) => ({ label: `Service: ${s.title}`, editHref: `/admin/services/${s.id}/edit`, metaTitle: s.metaTitle, metaDescription: s.metaDescription })),
    ...pages.map((p) => ({ label: `Page: ${p.page}`, editHref: `/admin/content`, metaTitle: p.metaTitle, metaDescription: p.metaDescription })),
  ];

  const issues = rows.filter(
    (r) => !r.metaTitle || !r.metaDescription || r.metaTitle.length > 60 || (r.metaDescription?.length ?? 0) > 160
  );

  return (
    <>
      <AdminTopbar title="SEO" />
      <div className="flex-1 space-y-6 p-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-sm text-[var(--color-gray)]">
            {issues.length === 0
              ? "Every published Project, Service, and Page has a meta title and description within recommended length."
              : `${issues.length} of ${rows.length} published items need SEO attention.`}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-gray)]">
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Meta Title</th>
                <th className="px-4 py-3 font-medium">Meta Description</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const hasIssue =
                  !row.metaTitle || !row.metaDescription || row.metaTitle.length > 60 || (row.metaDescription?.length ?? 0) > 160;
                return (
                  <tr key={row.label} className="border-b border-[var(--color-border)] last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link href={row.editHref} className="font-medium hover:underline">
                        {row.label}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-gray)]">{row.metaTitle ? `${row.metaTitle.length} chars` : "Missing"}</td>
                    <td className="px-4 py-3 text-[var(--color-gray)]">
                      {row.metaDescription ? `${row.metaDescription.length} chars` : "Missing"}
                    </td>
                    <td className="px-4 py-3">
                      {hasIssue ? (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertTriangle className="h-4 w-4" /> Needs attention
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" /> Good
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
