"use client";

import { Container } from "@/components/ui/Container";
import { useReveal } from "@/hooks/useReveal";

export function ContactHero() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section
      className="relative pt-[148px] pb-20 md:pt-[172px] md:pb-28 bg-white"
      aria-label="Contact hero"
    >
      <Container>
        <div
          ref={ref}
          data-reveal
          data-reveal-type="fade"
          className="flex flex-col gap-8 md:gap-10 max-w-[820px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-px bg-[#6B6B6B]" aria-hidden="true" />
            <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#6B6B6B]">
              Contact
            </span>
          </div>

          <h1
            className="font-semibold tracking-[-0.04em] leading-[1.05] text-[#0A0A0A]"
            style={{ fontSize: "clamp(38px, 5.6vw, 68px)" }}
          >
            Tell us what you&apos;re building.{" "}
            <span className="font-light italic text-[#6B6B6B]">
              We&apos;ll take it from there.
            </span>
          </h1>

          <p className="text-base md:text-[17px] text-[#6B6B6B] leading-[1.7] max-w-[480px] tracking-[-0.01em]">
            A few details are all we need to start the right conversation.
            No sales calls, no obligation — just a straight answer on
            whether we&apos;re a fit.
          </p>
        </div>
      </Container>
    </section>
  );
}
