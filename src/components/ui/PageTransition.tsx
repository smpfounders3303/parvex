"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * PageTransition — Wraps the page content and animates on route change.
 *
 * Visual language:
 *   incoming page: opacity 0→1, translateY 28px→0
 *   duration: ~550ms with premium ease
 *
 * Uses a ref + CSS transition (no Framer Motion dependency, no layout triggers).
 * Works with back/forward navigation and direct URL loads.
 * Reduced motion: immediate or simple fade only.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      if (prefersReduced) {
        // Simple fade only for reduced motion
        el.style.transition = "opacity 200ms ease-out";
        el.style.opacity = "0";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = "1";
          });
        });
      } else {
        // Premium entrance: fade + subtle lift
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition =
              "opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), transform 550ms cubic-bezier(0.16, 1, 0.3, 1)";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });
        });
      }
    } else {
      // Initial load
      if (!prefersReduced) {
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition =
              "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });
        });
      }
    }
  }, [pathname]);

  return (
    <div
      ref={wrapperRef}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </div>
  );
}
