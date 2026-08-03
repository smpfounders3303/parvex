import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
      <Icon className="h-8 w-8 text-neutral-300" />
      <p className="mt-4 font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-[var(--color-gray)]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
