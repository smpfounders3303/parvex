import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * "mark" — gold ring symbol + PARVEX wordmark, for light navbar surfaces.
   * "full" — the complete lockup (symbol + wordmark + tagline), for the
   *          dark footer where there is more room to let the brand breathe.
   * "icon-only" — just the symbol.
   */
  variant?: "mark" | "full" | "icon-only";
  className?: string;
  color?: "white" | "default";
}

const LogoSymbol = ({ className, color }: { className?: string, color?: "white" | "default" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(color === "white" ? "text-white" : "text-current", className)}
  >
    <circle
      cx="50"
      cy="50"
      r="40"
      stroke="currentColor"
      strokeWidth="9"
      pathLength="100"
      strokeDasharray="94 6"
      strokeDashoffset="-15.5"
      transform="rotate(-90 50 50)"
    />
  </svg>
);

/**
 * PARVEX brand mark.
 */
export function Logo({ variant = "mark", className, color = "default" }: LogoProps) {
  if (variant === "full") {
    return (
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("select-none h-auto w-[140px]", color === "white" ? "text-white" : "text-current", className)}
        aria-label="Parvex — Beyond Excellence"
      >
        <circle
          cx="120"
          cy="90"
          r="70"
          stroke="currentColor"
          strokeWidth="12"
          pathLength="100"
          strokeDasharray="94 6"
          strokeDashoffset="-15.5"
          transform="rotate(-90 120 90)"
        />
        <text
          x="124"
          y="190"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="600"
          fontSize="36"
          letterSpacing="0.25em"
          textAnchor="middle"
          fill="currentColor"
        >
          PΛRVEX
        </text>
        <text
          x="122"
          y="220"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="600"
          fontSize="10"
          letterSpacing="0.4em"
          textAnchor="middle"
          fill="currentColor"
        >
          BEYOND EXCELLENCE.
        </text>
      </svg>
    );
  }

  if (variant === "icon-only") {
    return (
      <LogoSymbol 
        className={cn("select-none w-[96px] h-[96px]", className)} 
        color={color} 
      />
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className, color === "white" ? "text-white" : "text-current")}>
      <LogoSymbol className="h-[22px] w-[22px] select-none" color={color} />
      <span className="text-[17px] font-semibold tracking-[0.02em] leading-none">
        PΛRVEX
      </span>
    </span>
  );
}
