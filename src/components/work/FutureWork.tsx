"use client";

import { Container } from "@/components/ui/Container";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const FUTURE_WORK = [
  { id: "brand-identity", label: "Brand Identity" },
  { id: "commercial-shoots", label: "Commercial Shoots" },
  { id: "creative-campaigns", label: "Creative Campaigns" },
  { id: "motion-graphics", label: "Motion Graphics" },
];

/**
 * FutureWork — subtle section signaling expanding capability without
 * overpromising. Restrained by design: a dark band, small type, no
 * imagery — it should read as a quiet note, not a new pitch.
 */
export function FutureWork() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const listRef = useRevealChildren<HTMLDivElement>(60, { threshold: 0.1 });

  return (
    <section
      className="py-16 md:py-20 bg-[#0A0A0A]"
      aria-labelledby="future-work-heading"
    >
      <Container>
        <div
          ref={headerRef}
          data-reveal
          data-reveal-type="fade"
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
        >
          <div className="flex flex-col gap-3 max-w-[420px]">
            <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-white/35">
              What&apos;s Next
            </span>
            <h2
              id="future-work-heading"
              className="text-2xl md:text-[28px] font-semibold text-white tracking-[-0.025em] leading-snug"
            >
              We&apos;re expanding into new kinds of work.
            </h2>
          </div>

          <div ref={listRef} className="flex flex-wrap gap-2.5 md:justify-end">
            {FUTURE_WORK.map((item) => (
              <span
                key={item.id}
                data-reveal-child
                data-reveal-type="fade"
                className="text-[12px] font-medium text-white/55 border border-white/15 rounded-full px-4 py-2"
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
