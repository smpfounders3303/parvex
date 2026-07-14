import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * "mark" — gold ring symbol + PARVEX wordmark, for light navbar surfaces.
   * "full" — the complete lockup (symbol + wordmark + tagline), for the
   *          dark footer where there is more room to let the brand breathe.
   */
  variant?: "mark" | "full";
  className?: string;
}

/**
 * PARVEX brand mark. Renders the official gold ring symbol as an optimized,
 * transparent asset so it drops cleanly onto any background without a
 * visible image edge.
 */
export function Logo({ variant = "mark", className }: LogoProps) {
  if (variant === "full") {
    return (
      <Image
        src="/assets/logos/parvex-logo-full.png"
        alt="Parvex — Beyond Excellence"
        width={239}
        height={240}
        className={cn("h-auto w-[140px] select-none", className)}
        priority={false}
      />
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/assets/logos/parvex-symbol.png"
        alt=""
        aria-hidden="true"
        width={96}
        height={96}
        className="h-[22px] w-[22px] select-none"
        priority
      />
      <span className="text-[17px] font-semibold tracking-[-0.03em] leading-none">
        PARVEX
      </span>
    </span>
  );
}
