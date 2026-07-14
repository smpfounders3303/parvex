import Link from "next/link";
import type { ComponentType } from "react";
import { prisma } from "@/lib/db/prisma";
import { StatCard } from "@/components/admin/StatCard";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FolderPlus, Upload, MessageSquare, FileEdit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    unreadMessages,
    activeLeads,
    mediaAssets,
    recentMessages,
    recentProjects,
    leadsByStage,
    publishedServices,
    seoIssueCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.project.count({ where: { status: "DRAFT" } }),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.lead.count({ where: { stage: { notIn: ["WON", "LOST"] } } }),
    prisma.media.count(),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.lead.groupBy({ by: ["stage"], _count: { _all: true } }),
    prisma.service.count({ where: { published: true } }),
    prisma.project.count({ where: { status: "PUBLISHED", metaTitle: null } }),
  ]);

  const stageCounts = Object.fromEntries(leadsByStage.map((s) => [s.stage, s._count._all]));

  return (
    <>
      <AdminTopbar title="Dashboard" />
      <div className="flex-1 space-y-8 p-6">
        {/* Key Metrics */}
        <section>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total Projects" value={totalProjects} href="/admin/projects" />
            <StatCard label="Published Projects" value={publishedProjects} href="/admin/projects" />
            <StatCard label="Draft Projects" value={draftProjects} href="/admin/projects" />
            <StatCard label="Unread Messages" value={unreadMessages} href="/admin/messages" />
            <StatCard label="Active Leads" value={activeLeads} href="/admin/leads" />
            <StatCard label="Media Assets" value={mediaAssets} href="/admin/media" />
            <StatCard label="Published Services" value={publishedServices} href="/admin/services" />
            <StatCard label="Projects Missing SEO Title" value={seoIssueCount} href="/admin/seo" />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Enquiries */}
          <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Recent Enquiries</h2>
              <Link href="/admin/messages" className="text-sm text-[var(--color-gray)] hover:text-black">
                View all
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <p className="text-sm text-[var(--color-gray)]">No enquiries yet.</p>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {recentMessages.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0">
                      <Link href={`/admin/messages/${m.id}`} className="truncate text-sm font-medium hover:underline">
                        {m.name}
                      </Link>
                      <p className="truncate text-xs text-[var(--color-gray)]">{m.projectType}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recent Projects */}
          <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Recent Projects</h2>
              <Link href="/admin/projects" className="text-sm text-[var(--color-gray)] hover:text-black">
                View all
              </Link>
            </div>
            {recentProjects.length === 0 ? (
              <p className="text-sm text-[var(--color-gray)]">No projects yet.</p>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {recentProjects.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3">
                    <Link href={`/admin/projects/${p.id}`} className="truncate text-sm font-medium hover:underline">
                      {p.title}
                    </Link>
                    <StatusBadge status={p.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Lead Pipeline Summary */}
          <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
            <h2 className="mb-4 font-semibold">Lead Pipeline</h2>
            <ul className="space-y-2">
              {["NEW", "QUALIFIED", "DISCUSSION", "PROPOSAL", "WON", "LOST"].map((stage) => (
                <li key={stage} className="flex items-center justify-between text-sm">
                  <StatusBadge status={stage} />
                  <span className="font-medium">{stageCounts[stage] ?? 0}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick Actions */}
          <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
            <h2 className="mb-4 font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <QuickAction href="/admin/projects/new" icon={FolderPlus} label="New Project" />
              <QuickAction href="/admin/media" icon={Upload} label="Upload Media" />
              <QuickAction href="/admin/messages" icon={MessageSquare} label="View Messages" />
              <QuickAction href="/admin/content" icon={FileEdit} label="Edit Homepage" />
            </div>
          </section>
        </div>

        {/* Website Status */}
        <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="mb-4 font-semibold">Website Status</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
            <div>
              <dt className="text-[var(--color-gray)]">Published Projects</dt>
              <dd className="mt-1 font-medium">{publishedProjects}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-gray)]">Projects Missing SEO Title</dt>
              <dd className="mt-1 font-medium">{seoIssueCount}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-gray)]">Contact Form</dt>
              <dd className="mt-1 font-medium">{process.env.RESEND_API_KEY ? "Configured" : "Not configured"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-gray)]">Last Content Update</dt>
              <dd className="mt-1 font-medium">
                {recentProjects[0]?.updatedAt.toLocaleDateString() ?? "—"}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm hover:border-neutral-300 hover:bg-neutral-50"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
