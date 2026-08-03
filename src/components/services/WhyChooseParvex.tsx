"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";
import type { Feature } from "@/types";

// Kept local to this section — small, page-specific content that mirrors
// how FutureWork.tsx handles its own short list (see /work).
const WHY_CHOOSE: Feature[] = [
  {
    id: "quality",
    title: "Quality over quantity",
    description: "We take on fewer projects so each one gets full attention.",
  },
  {
    id: "modern-tech",
    title: "Modern technologies",
    description: "Built on current, well-supported tools — not legacy patterns.",
  },
  {
    id: "performance",
    title: "Performance-first",
    description: "Speed and reliability are part of the design, not an afterthought.",
  },
  {
    id: "creative-engineering",
    title: "Creative + engineering",
    description: "One team handles both the code and the visuals.",
  },
  {
    id: "long-term-support",
    title: "Long-term support",
    description: "We stay involved after launch, not just until handoff.",
  },
  {
    id: "attention-to-detail",
    title: "Attention to detail",
    description: "Spacing, timing, wording — every small decision gets considered.",
  },
];

export function WhyChooseParvex() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const gridRef = useRevealChildren<HTMLDivElement>(60, { threshold: 0.04 });

  return (
    <section
      className="py-20 md:py-28 lg:py-32 bg-[#F7F7F7]"
      aria-labelledby="why-choose-heading"
    >
      <Container>
        <div ref={headerRef} data-reveal className="mb-14 md:mb-18">
          <SectionHeader
            eyebrow="Why Parvex"
            title="Why clients choose to work with us."
            id="why-choose-heading"
          />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          role="list"
        >
          {WHY_CHOOSE.map((item, index) => (
            <div key={item.id} role="listitem">
              <FeatureCard
                number={String(index + 1).padStart(2, "0")}
                title={item.title}
                description={item.description}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
