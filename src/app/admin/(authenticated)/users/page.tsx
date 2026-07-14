import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { UsersClient } from "@/components/admin/users/UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  try {
    await requireRole("SUPER_ADMIN");
  } catch (error) {
    if (error instanceof AuthzError) redirect("/admin");
    throw error;
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <AdminTopbar title="Users" />
      <div className="flex-1 p-6">
        <UsersClient users={users} />
      </div>
    </>
  );
}
