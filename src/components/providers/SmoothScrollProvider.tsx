"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/**
 * SmoothScrollProvider — activates smooth scroll and cross-page hash navigation site-wide.
 * Mounted once in the root layout. Renders nothing.
 */
export function SmoothScrollProvider() {
  useSmoothScroll();
  return null;
}
