import { prisma } from "@/lib/db/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatCard } from "@/components/admin/StatCard";
import { AnalyticsConfigForm } from "@/components/admin/analytics/AnalyticsConfigForm";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [config, contactEvents, projectViews, projectCtaClicks, serviceCtaClicks] = await Promise.all([
    prisma.analyticsConfig.findUnique({ where: { id: "singleton" } }),
    prisma.analyticsEvent.count({ where: { type: "CONTACT_ENQUIRY_CREATED" } }),
    prisma.analyticsEvent.count({ where: { type: "PROJECT_VIEWED" } }),
    prisma.analyticsEvent.count({ where: { type: "PROJECT_CTA_CLICKED" } }),
    prisma.analyticsEvent.count({ where: { type: "SERVICE_CTA_CLICKED" } }),
  ]);

  const topProjects = await prisma.analyticsEvent.groupBy({
    by: ["entityId"],
    where: { type: "PROJECT_VIEWED", entityId: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { entityId: "desc" } },
    take: 5,
  });

  const topProjectDetails = await prisma.project.findMany({
    where: { id: { in: topProjects.map((t) => t.entityId).filter((id): id is string => !!id) } },
    select: { id: true, title: true },
  });
  const titleById = Object.fromEntries(topProjectDetails.map((p) => [p.id, p.title]));

  return (
    <>
      <AdminTopbar title="Analytics" />
      <div className="flex-1 space-y-6 p-6">
        <section>
          <p className="mb-3 text-sm font-medium text-[var(--color-gray)]">First-party events (recorded on this site)</p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Contact Enquiries" value={contactEvents} />
            <StatCard label="Project Page Views" value={projectViews} />
            <StatCard label="Project CTA Clicks" value={projectCtaClicks} />
            <StatCard label="Service CTA Clicks" value={serviceCtaClicks} />
          </div>
        </section>

        {topProjects.length > 0 && (
          <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
            <h2 className="mb-4 font-semibold">Most Viewed Projects</h2>
            <ul className="divide-y divide-[var(--color-border)]">
              {topProjects.map((t) => (
                <li key={t.entityId} className="flex items-center justify-between py-2 text-sm">
                  <span>{t.entityId ? (titleById[t.entityId] ?? "Unknown project") : "Unknown"}</span>
                  <span className="font-medium">{t._count._all}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="mb-1 font-semibold">Provider Integrations</h2>
          <p className="mb-4 text-sm text-[var(--color-gray)]">
            Connect Google Analytics, Vercel Analytics, or Microsoft Clarity. These render only in the public site — never in /admin.
          </p>
          <AnalyticsConfigForm config={config} />
        </section>
      </div>
    </>
  );
}
