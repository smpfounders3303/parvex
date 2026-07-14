"use client";

import { useEffect } from "react";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";
import { useReveal } from "@/hooks/useReveal";

/**
 * CaseStudyAnimationInit — lightweight client boundary that boots
 * the hero animation sequence and scroll-reveal system for case study pages.
 * Keeps the parent page component a Server Component.
 * Renders nothing to the DOM.
 */
export function CaseStudyAnimationInit() {
  useHeroAnimation();

  // Activate all [data-reveal] elements on this page via a shared observer
  const ref = useReveal<HTMLDivElement>({ threshold: 0.01 });
  void ref; // ref is not attached to a DOM node — we only need the side effect

  useEffect(() => {
    // Re-scan for any data-reveal elements added after initial mount
    // (e.g. if Next.js hydrates them after the first paint)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-revealed", "true");
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
