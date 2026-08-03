import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { prisma } from "@/lib/db/prisma";
import { ContentTabs } from "@/components/admin/content/ContentTabs";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const pages = await prisma.pageContent.findMany();
  const byPage = Object.fromEntries(pages.map((p) => [p.page, p]));

  return (
    <>
      <AdminTopbar title="Website Content" />
      <div className="flex-1 p-6">
        <ContentTabs byPage={byPage} />
      </div>
    </>
  );
}
