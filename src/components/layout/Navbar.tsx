"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS } from "@/constants/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navReady, setNavReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = prefersReduced ? 0 : 40;

    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });

    const t = setTimeout(() => setNavReady(true), delay);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: closes the mobile menu whenever the route changes
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        ref={headerRef}
        suppressHydrationWarning
        data-nav-ready={navReady ? "true" : "false"}
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-[background-color,border-color,box-shadow] duration-400 ease-out",
          scrolled
            ? "bg-white/92 backdrop-blur-lg border-b border-[#E8E8E8] shadow-sm"
            : "bg-transparent"
        )}
      >
        <Container>
          <nav
            className="flex h-[68px] items-center justify-between"
            aria-label="Main navigation"
          >
            {/* Logo */}
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  history.pushState(null, "", "/");
                }
              }}
              className="text-[#0A0A0A] hover:opacity-60 transition-opacity duration-200"
              aria-label="Parvex — Home"
            >
              <Logo variant="mark" />
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-7" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "nav-link-animated text-[13px] transition-colors duration-200 tracking-[-0.01em]",
                      isActive(link.href)
                        ? "text-[#0A0A0A] font-medium"
                        : "text-[#6B6B6B] hover:text-[#0A0A0A]"
                    )}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Button href="/contact" variant="primary" size="sm" className="btn-interactive" data-cursor="Start">
                Start a Project
                <span aria-hidden="true">→</span>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 text-[#0A0A0A] hover:opacity-60 transition-opacity"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={cn(
                  "transition-all duration-300",
                  menuOpen ? "rotate-90 opacity-100" : "rotate-0 opacity-100"
                )}
              >
                {menuOpen ? <X size={19} /> : <Menu size={19} />}
              </span>
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile Full-Screen Menu */}
      {mounted && (
        <div
          id="mobile-menu"
          className={cn(
            "fixed inset-0 z-40 bg-white flex flex-col justify-center px-6",
            "transition-all duration-500 ease-out md:hidden",
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          aria-hidden={!menuOpen}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <ul className="flex flex-col gap-7" role="list">
            {NAV_LINKS.map((link, index) => (
              <li
                key={link.href}
                className={cn(
                  "transition-all duration-500",
                  menuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                )}
                style={{ transitionDelay: menuOpen ? `${index * 60}ms` : "0ms" }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "text-[40px] font-semibold tracking-[-0.04em] transition-colors duration-200 leading-none",
                    isActive(link.href)
                      ? "text-[#0A0A0A]"
                      : "text-[#0A0A0A] hover:text-[#6B6B6B]"
                  )}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={cn(
              "mt-14 transition-all duration-500",
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: menuOpen ? "280ms" : "0ms" }}
          >
            <Button
              href="/contact"
              variant="primary"
              size="lg"
              onClick={() => setMenuOpen(false)}
              className="w-full justify-center btn-interactive"
            >
              Start a Project →
            </Button>
          </div>

          {/* Mobile menu bottom — contact */}
          <div
            className={cn(
              "absolute bottom-10 left-6 right-6 transition-all duration-500",
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
            style={{ transitionDelay: menuOpen ? "340ms" : "0ms" }}
          >
            <a
              href="mailto:hello@parvex.in"
              className="text-[13px] text-[#6B6B6B]"
            >
              hello@parvex.in
            </a>
          </div>
        </div>
      )}
    </>
  );
}
