"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

export interface ProcessStep {
  id: string;
  label: string;
  description: string;
}

interface ProcessTimelineProps {
  id?: string;
  eyebrow: string;
  title: string;
  steps: ProcessStep[];
}

/**
 * ProcessTimeline — minimal numbered workflow section.
 * Shared by the Services page ("How We Work") and the About page
 * ("How We Work") so the two step-by-step sections stay pixel-identical
 * instead of drifting apart as separate implementations.
 */
export function ProcessTimeline({ id, eyebrow, title, steps }: ProcessTimelineProps) {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const stepsRef = useRevealChildren<HTMLDivElement>(80, { threshold: 0.05 });
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      className="py-20 md:py-28 lg:py-32 bg-white"
      aria-labelledby={headingId}
    >
      <Container>
        <div ref={headerRef} data-reveal className="mb-16 md:mb-20">
          <SectionHeader eyebrow={eyebrow} title={title} id={headingId} />
        </div>

        <div
          ref={stepsRef}
          className="flex flex-col xl:flex-row xl:items-start gap-10 xl:gap-0"
          role="list"
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              data-reveal-child
              role="listitem"
              className="flex-1 flex flex-col gap-5 xl:pr-8 xl:border-l xl:border-[#E8E8E8] xl:pl-8 xl:first:border-l-0 xl:first:pl-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-[#C0C0C0] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="h-px flex-1 bg-[#E8E8E8]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[#0A0A0A] tracking-[-0.02em]">
                {step.label}
              </h3>
              <p className="text-[14px] text-[#6B6B6B] leading-[1.65]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
