"use client";

import { useEffect, useRef } from "react";

/**
 * CustomCursor — PARVEX premium cursor.
 *
 * Architecture:
 * - Uses refs + direct DOM style manipulation — zero React state on mousemove.
 * - requestAnimationFrame-based lerp for smoothness without React render cycles.
 * - Disabled on touch / coarse pointer devices.
 * - Respects prefers-reduced-motion (instant follow, no lerp).
 * - pointer-events: none — never blocks clicks.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    // Hide on non-pointer or touch devices
    const mq = window.matchMedia("(pointer: coarse)");
    if (mq.matches) return;

    isReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // Show cursor elements
    dot.style.opacity = "1";
    ring.style.opacity = "1";

    // Hide native cursor
    document.documentElement.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      // Dot follows immediately
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const lerpFactor = isReducedMotion.current ? 1 : 0.1;

    const animate = () => {
      const { x: tx, y: ty } = posRef.current;
      const rx = ringPosRef.current.x;
      const ry = ringPosRef.current.y;

      const nx = lerp(rx, tx, lerpFactor);
      const ny = lerp(ry, ty, lerpFactor);

      if (Math.abs(nx - rx) > 0.01 || Math.abs(ny - ry) > 0.01) {
        ringPosRef.current = { x: nx, y: ny };
        ring.style.transform = `translate(${nx}px, ${ny}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Cursor state: expand on interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [data-cursor], [role='button'], input, textarea, select, label"
      ) as HTMLElement | null;

      if (interactive) {
        const cursorLabel = interactive.getAttribute("data-cursor") || "";
        ring.setAttribute("data-expanded", "true");
        if (cursorLabel && label) {
          label.textContent = cursorLabel;
          label.style.opacity = "1";
        }
      } else {
        ring.removeAttribute("data-expanded");
        if (label) {
          label.style.opacity = "0";
          label.textContent = "";
        }
      }
    };

    const onMouseLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onMouseEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Dot — follows pointer instantly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#0A0A0A",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transform: "translate(-100px, -100px)",
          marginTop: -3,
          marginLeft: -3,
          willChange: "transform",
          mixBlendMode: "difference",
        }}
      />
      {/* Ring — lerp-follows for smooth feel */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid #0A0A0A",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: 0,
          transform: "translate(-100px, -100px)",
          marginTop: -18,
          marginLeft: -18,
          willChange: "transform",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition:
            "width 300ms cubic-bezier(0.16, 1, 0.3, 1), height 300ms cubic-bezier(0.16, 1, 0.3, 1), margin 300ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms ease-out, border-color 200ms ease-out",
        }}
        data-expanded={undefined}
      >
        <span
          ref={labelRef}
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#ffffff",
            opacity: 0,
            transition: "opacity 200ms ease-out",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        />
      </div>

      {/* Cursor expansion styles */}
      <style>{`
        .cursor-ring[data-expanded="true"] {
          width: 60px;
          height: 60px;
          margin-top: -30px;
          margin-left: -30px;
          background-color: #0A0A0A;
          border-color: #0A0A0A;
        }
        @media (pointer: coarse) {
          .cursor-dot,
          .cursor-ring {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
