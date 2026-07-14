"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * useSmoothScroll — Handles:
 * 1. Smooth anchor-link scrolling on same page (#section).
 * 2. Cross-page hash navigation (/services#web-development):
 *    After route change, scrolls to the section matching the hash,
 *    accounting for the sticky navbar height.
 */
export function useSmoothScroll() {
  const pathname = usePathname();

  // Handle hash-based scroll after route navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Wait for page paint + layout to settle
    const timer = setTimeout(() => {
      const target = document.querySelector(hash);
      if (!target) return;

      const navHeight = 80; // sticky nav height
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: prefersReduced ? "auto" : "smooth",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle same-page anchor clicks
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const destination = document.querySelector(href);
      if (!destination) return;

      e.preventDefault();

      const navHeight = 80;
      const targetTop =
        destination.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: prefersReduced ? "auto" : "smooth",
      });

      history.pushState(null, "", href);
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);
}
