"use client";

import { useEffect } from "react";

/**
 * useHeroAnimation — Runs a staggered entrance timeline on page load.
 * Targets elements by data-hero attribute. Sequenced via CSS animation-delay.
 * Structured to be 1:1 replaceable with GSAP timeline if needed.
 *
 * Sequence:
 *   0ms   — eyebrow line + label
 *   100ms — headline line 1
 *   180ms — headline line 2 (italic)
 *   260ms — headline line 3
 *   360ms — subtext paragraph
 *   440ms — CTA buttons
 *   520ms — hero image reveal
 */
export function useHeroAnimation() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const elements = document.querySelectorAll("[data-hero]");
    if (!elements.length) return;

    if (prefersReduced) {
      elements.forEach((el) => {
        (el as HTMLElement).setAttribute("data-hero-ready", "true");
      });
      return;
    }

    // Small initial render delay so layout is stable
    const frameId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        elements.forEach((el) => {
          const delay = parseInt(
            (el as HTMLElement).dataset.heroDelay ?? "0",
            10
          );
          setTimeout(() => {
            (el as HTMLElement).setAttribute("data-hero-ready", "true");
          }, delay);
        });
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, []);
}
