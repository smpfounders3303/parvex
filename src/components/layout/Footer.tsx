"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { FOOTER_SECTIONS } from "@/constants/navigation";
import { useRevealChildren } from "@/hooks/useReveal";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const colsRef = useRevealChildren<HTMLDivElement>(60, { threshold: 0.05 });

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/8" role="contentinfo">
      <Container>
        {/* Main Footer Grid */}
        <div
          ref={colsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 md:py-20"
        >
          {/* Brand Column */}
          <div data-footer-col data-reveal-child className="flex flex-col gap-5 lg:col-span-1">
            <Link
              href="/"
              className="w-fit opacity-95 hover:opacity-70 transition-opacity duration-200"
              aria-label="Parvex — Home"
            >
              <Logo variant="full" />
            </Link>
            <p className="text-[13px] text-white/40 leading-[1.7] max-w-[200px]">
              A modern Digital Experience Studio. We build what matters.
            </p>
            <a
              href="mailto:hello@parvex.in"
              className="text-[13px] text-white/40 hover:text-white/70 transition-colors duration-200"
            >
              hello@parvex.in
            </a>
          </div>

          {/* Link Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.heading} data-footer-col data-reveal-child className="flex flex-col gap-5">
              <h3 className="text-[10px] font-semibold text-white/30 tracking-[0.14em] uppercase">
                {section.heading}
              </h3>
              <ul className="flex flex-col gap-3" role="list">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto") ? (
                      <a
                        href={link.href}
                        className="text-[14px] text-white/50 hover:text-white/90 transition-colors duration-200"
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[14px] text-white/50 hover:text-white/90 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/8">
          <p className="text-[12px] text-white/25">
            © {currentYear} Parvex. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[12px] text-white/25">Privacy</span>
            <span className="text-[12px] text-white/25">Terms</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
