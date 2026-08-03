import { cn } from "@/lib/utils";

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  inverted?: boolean;
  className?: string;
}

/**
 * FeatureCard — minimal numbered card used for "Why Choose Us", values,
 * or future statistics. Deliberately restrained: no icons, no imagery,
 * just number, title, and a short line of copy.
 */
export function FeatureCard({
  number,
  title,
  description,
  inverted = false,
  className,
}: FeatureCardProps) {
  return (
    <div
      data-reveal-child
      className={cn(
        "flex flex-col gap-4 rounded-[var(--radius-lg)] border p-8 md:p-9",
        inverted
          ? "border-white/10 bg-white/[0.02]"
          : "border-[#E8E8E8] bg-white",
        className
      )}
    >
      <span
        className={cn(
          "text-[12px] font-medium tracking-[0.1em] tabular-nums",
          inverted ? "text-white/35" : "text-[#C0C0C0]"
        )}
      >
        {number}
      </span>
      <h3
        className={cn(
          "text-lg md:text-[19px] font-semibold tracking-[-0.02em] leading-snug",
          inverted ? "text-white" : "text-[#0A0A0A]"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "text-[14px] leading-[1.65]",
          inverted ? "text-white/50" : "text-[#6B6B6B]"
        )}
      >
        {description}
      </p>
    </div>
  );
}
