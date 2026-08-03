import { prisma } from "@/lib/db/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.setting.findUnique({ where: { id: "singleton" } });

  return (
    <>
      <AdminTopbar title="Settings" />
      <div className="flex-1 p-6">
        <SettingsForm settings={settings} />
      </div>
    </>
  );
}
