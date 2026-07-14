"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Image as ImageIcon,
  FileText,
  Mail,
  Users2,
  Search,
  BarChart3,
  UserCog,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth/auth-client";
import type { Role } from "@/lib/auth/authz";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  minRole?: Role;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  { heading: "Overview", items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    heading: "Content",
    items: [
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Services", href: "/admin/services", icon: Layers },
      { label: "Media", href: "/admin/media", icon: ImageIcon },
      { label: "Website Content", href: "/admin/content", icon: FileText },
    ],
  },
  {
    heading: "Business",
    items: [
      { label: "Messages", href: "/admin/messages", icon: Mail },
      { label: "Leads", href: "/admin/leads", icon: Users2 },
    ],
  },
  {
    heading: "Growth",
    items: [
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Users", href: "/admin/users", icon: UserCog, minRole: "SUPER_ADMIN" },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const ROLE_RANK: Record<Role, number> = { EDITOR: 0, ADMIN: 1, SUPER_ADMIN: 2 };

export function AdminSidebar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: Role;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const content = (
    <div className="flex h-full flex-col bg-[#0a0a0a] text-white">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-admin-gold)]" />
          {!collapsed && <span>PARVEX</span>}
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-md p-1 text-white/60 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {NAV.map((group) => (
          <div key={group.heading} className="mb-5">
            {!collapsed && (
              <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-white/35">
                {group.heading}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items
                .filter((item) => !item.minRole || ROLE_RANK[userRole] >= ROLE_RANK[item.minRole])
                .map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-3">
        <div className="flex items-center gap-2 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-white/40">{userRole.replace("_", " ")}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="mt-1 hidden w-full rounded-md px-2 py-1.5 text-left text-xs text-white/40 hover:text-white/70 lg:block"
          >
            Collapse
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mt-1 hidden w-full rounded-md px-2 py-1.5 text-xs text-white/40 hover:text-white/70 lg:block"
          >
            Expand
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-md bg-[#0a0a0a] p-2 text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72">{content}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden shrink-0 transition-all duration-200 lg:block ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className="fixed h-screen" style={{ width: collapsed ? 72 : 256 }}>
          {content}
        </div>
      </aside>
    </>
  );
}
