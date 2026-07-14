import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full",
        "text-[10px] font-semibold tracking-[0.08em] uppercase",
        "bg-white/15 backdrop-blur-sm text-white border border-white/20",
        className
      )}
    >
      {children}
    </span>
  );
}
