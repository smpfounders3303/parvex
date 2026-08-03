"use client";

import { useEffect, useRef, RefObject } from "react";

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
}

/**
 * useReveal — Intersection Observer hook for scroll-triggered reveals.
 * Adds `data-revealed="true"` to the element when it enters the viewport.
 * CSS handles all animation via [data-reveal] and [data-reveal][data-revealed] selectors.
 * Zero JS animation overhead — GPU composited via CSS transform/opacity.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
): RefObject<T | null> {
  const {
    threshold = 0.12,
    rootMargin = "0px 0px -60px 0px",
    once = true,
    delay = 0,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const el = ref.current;
    if (!el) return;

    if (prefersReduced) {
      el.setAttribute("data-revealed", "true");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            if (delay > 0) {
              setTimeout(() => {
                target.setAttribute("data-revealed", "true");
              }, delay);
            } else {
              target.setAttribute("data-revealed", "true");
            }
            if (once) observer.unobserve(target);
          } else if (!once) {
            (entry.target as HTMLElement).removeAttribute("data-revealed");
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, delay]);

  return ref;
}

/**
 * useRevealChildren — observe a parent, stagger-reveal all [data-reveal-child] elements.
 * Cleaner than wrapping each child in its own observer.
 */
export function useRevealChildren<T extends HTMLElement = HTMLDivElement>(
  staggerMs = 80,
  options: Omit<UseRevealOptions, "delay"> = {}
): RefObject<T | null> {
  const { threshold = 0.08, rootMargin = "0px 0px -40px 0px", once = true } =
    options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const el = ref.current;
    if (!el) return;

    if (prefersReduced) {
      el.querySelectorAll("[data-reveal-child]").forEach((child) => {
        (child as HTMLElement).setAttribute("data-revealed", "true");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll("[data-reveal-child]");
            children.forEach((child, i) => {
              setTimeout(() => {
                (child as HTMLElement).setAttribute("data-revealed", "true");
              }, i * staggerMs);
            });
            if (once) observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [staggerMs, threshold, rootMargin, once]);

  return ref;
}
