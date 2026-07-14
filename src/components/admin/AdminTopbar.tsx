import Link from "next/link";
import { Plus } from "lucide-react";

export function AdminTopbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-white/95 px-6 backdrop-blur">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-1.5 rounded-lg bg-[#0a0a0a] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Project</span>
        </Link>
      </div>
    </header>
  );
}
