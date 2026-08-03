const STYLES: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DRAFT: "bg-neutral-100 text-neutral-600 border-neutral-200",
  ARCHIVED: "bg-neutral-50 text-neutral-400 border-neutral-200",
  UNREAD: "bg-blue-50 text-blue-700 border-blue-200",
  READ: "bg-neutral-100 text-neutral-600 border-neutral-200",
  REPLIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  QUALIFIED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DISCUSSION: "bg-amber-50 text-amber-700 border-amber-200",
  PROPOSAL: "bg-purple-50 text-purple-700 border-purple-200",
  WON: "bg-emerald-50 text-emerald-700 border-emerald-200",
  LOST: "bg-red-50 text-red-600 border-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? "bg-neutral-100 text-neutral-600 border-neutral-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      {status.toLowerCase().replace("_", " ")}
    </span>
  );
}
