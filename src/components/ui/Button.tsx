import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
  "data-cursor"?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0A0A0A] text-white hover:bg-[#1a1a1a] border border-[#0A0A0A]",
  secondary:
    "bg-transparent text-[#0A0A0A] border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white",
  ghost:
    "bg-transparent text-[#6B6B6B] border border-transparent hover:text-[#0A0A0A] hover:border-[#E8E8E8]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-[13px]",
  md: "px-6 py-3 text-[13px]",
  lg: "px-8 py-3.5 text-[14px]",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  "data-cursor": dataCursor,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium",
    "transition-all duration-300 ease-out cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "tracking-[-0.01em]",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    // External links
    if (href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) {
      return (
        <a
          href={href}
          className={baseClasses}
          data-cursor={dataCursor}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }
    // Internal links — use Next.js Link for prefetching + client-side navigation
    return (
      <Link href={href} className={baseClasses} data-cursor={dataCursor}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClasses} data-cursor={dataCursor} {...props}>
      {children}
    </button>
  );
}
