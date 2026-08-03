import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverted?: boolean;
  className?: string;
  id?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  inverted = false,
  className,
  id,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-xs font-medium tracking-[0.14em] uppercase",
            inverted ? "text-white/40" : "text-[#6B6B6B]"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className={cn(
          "font-semibold tracking-[-0.03em] leading-[1.1]",
          "text-4xl md:text-5xl lg:text-[52px]",
          inverted ? "text-white" : "text-[#0A0A0A]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base md:text-lg leading-relaxed max-w-[640px]",
            inverted ? "text-white/55" : "text-[#6B6B6B]"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
