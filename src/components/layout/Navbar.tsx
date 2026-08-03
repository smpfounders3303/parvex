"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS } from "@/constants/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* TOP HEADER */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-40 p-5 md:p-6 flex items-center justify-between pointer-events-none transition-all duration-500",
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-black/5" : "bg-transparent"
        )}
      >
        {/* Left: Logo Design */}
        <Link href="/" className="pointer-events-auto hover:opacity-80 transition-opacity">
          <Logo variant="icon-only" className="w-10 h-10 md:w-11 md:h-11" />
        </Link>
        
        {/* Center: Web Name "parvex" */}
        <div className="absolute left-1/2 -translate-x-1/2 text-xl md:text-[22px] font-extrabold tracking-tight text-[#0A0A0A] pointer-events-auto select-none uppercase">
          Parvex
        </div>
        
        {/* Right: Empty spacer to balance the flex-between layout */}
        <div className="w-10 md:w-11"></div>
      </header>

      {/* BOTTOM PILL NAV */}
      <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
        <nav className="h-[52px] md:h-[56px] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-[30px] flex items-center p-1.5 shadow-2xl pointer-events-auto">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "px-5 py-2 md:py-2.5 rounded-[24px] text-[13px] md:text-sm font-semibold tracking-wide transition-all duration-300 block",
                      active 
                        ? "bg-white text-black shadow-sm" 
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
