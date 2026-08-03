import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { MediaLibraryClient } from "@/components/admin/media/MediaLibraryClient";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function MediaLibraryPage() {
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <>
      <AdminTopbar title="Media Library" />
      <div className="flex-1 p-6">
        <MediaLibraryClient initialItems={items} />
      </div>
    </>
  );
}
