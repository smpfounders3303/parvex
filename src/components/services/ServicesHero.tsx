"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

/**
 * ServicesHero — editorial opener for the Services page.
 * Mirrors WorkHero's entrance sequence (data-hero attributes) so the
 * page feels native to the rest of the site: no new animation language,
 * no image — just headline, subtext, and a single CTA.
 */
export function ServicesHero() {
  useHeroAnimation();

  return (
    <section
      className="relative pt-[160px] pb-20 md:pt-[200px] md:pb-28 bg-white"
      aria-label="Services page hero"
    >
      <Container className="flex flex-col gap-8 md:gap-10">
        <div
          data-hero="eyebrow"
          data-hero-delay="60"
          className="flex items-center gap-3"
        >
          <div className="w-5 h-px bg-[#6B6B6B]" aria-hidden="true" />
          <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#6B6B6B]">
            What We Do
          </span>
        </div>

        <h1
          className="font-semibold tracking-[-0.04em] leading-[1.0] text-[#0A0A0A] max-w-[880px]"
          style={{ fontSize: "clamp(40px, 6.5vw, 76px)" }}
        >
          <span data-hero="h1-line" data-hero-delay="120">
            <span>Engineering and craft,</span>
          </span>
          <span data-hero="h1-line" data-hero-delay="200">
            <span className="font-light italic text-[#6B6B6B]">under one roof.</span>
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
          <p
            data-hero="subtext"
            data-hero-delay="320"
            className="text-base md:text-[17px] text-[#6B6B6B] leading-[1.7] max-w-[540px] tracking-[-0.01em]"
          >
            We design, build, and shoot — so nothing about how your brand
            looks or works feels like it came from a different team.
          </p>

          <div data-hero="ctas" data-hero-delay="400" className="flex-shrink-0">
            <Button href="/contact" variant="primary" size="lg" className="btn-interactive">
              Start a Project →
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
