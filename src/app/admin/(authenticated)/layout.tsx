import { Toaster } from "sonner";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { Role } from "@/lib/auth/authz";

// ADMIN LAYOUT — the entire authenticated Admin shell. Deliberately does NOT
// render CustomCursor, Lenis, the public Navbar/Footer, or any public motion
// provider. This is a professional product UI, not the editorial website.
//
// This layout lives in the (authenticated) route group, which is a sibling
// of admin/login — so /admin/login never passes through this auth gate and
// can render its own minimal, sidebar-free shell.

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.disabled) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <AdminSidebar userName={session.user.name} userRole={session.user.role as Role} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
