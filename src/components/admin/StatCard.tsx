import Link from "next/link";

export function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 transition-colors hover:border-neutral-300">
      <p className="text-sm text-[var(--color-gray)]">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
