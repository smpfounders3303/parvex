"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

export function Hero({
  eyebrow = "Digital Experience Studio",
  supportingCopy = "From product interfaces to creative media — Parvex is where software meets story. We help businesses build things worth noticing.",
  primaryCtaLabel = "Start a Project →",
  primaryCtaLink = "/contact",
}: {
  eyebrow?: string;
  supportingCopy?: string;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;
}) {
  useHeroAnimation();

  return (
    <section
      className="relative pt-[108px] pb-0 bg-white"
      aria-label="Hero section"
    >
      <Container className="flex flex-col gap-10 md:gap-14">
        {/* Text content area */}
        <div className="flex flex-col">
          {/* Eyebrow — animates first */}
          <div
            data-hero="eyebrow"
            data-hero-delay="60"
            className="flex items-center gap-3 mb-7 md:mb-9"
          >
            <div className="w-5 h-px bg-[#6B6B6B]" aria-hidden="true" />
            <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#6B6B6B]">
              {eyebrow}
            </span>
          </div>

          {/* Headline — 3 lines, staggered clip reveal */}
          <h1
            className="font-semibold tracking-[-0.04em] leading-[1.0] text-[#0A0A0A] mb-9 md:mb-11"
            style={{ fontSize: "clamp(46px, 7.5vw, 92px)" }}
          >
            <span data-hero="h1-line" data-hero-delay="120">
              <span>We build digital</span>
            </span>
            <span data-hero="h1-line" data-hero-delay="200">
              <span className="font-light italic text-[#6B6B6B]">experiences</span>
            </span>
            <span data-hero="h1-line" data-hero-delay="280">
              <span>that matter.</span>
            </span>
          </h1>

          {/* Sub-text + CTAs */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
            <p
              data-hero="subtext"
              data-hero-delay="380"
              className="text-base md:text-[17px] text-[#6B6B6B] leading-[1.7] max-w-[480px] tracking-[-0.01em]"
            >
              {supportingCopy}
            </p>

            <div
              data-hero="ctas"
              data-hero-delay="460"
              className="flex items-center gap-3 flex-shrink-0"
            >
              <Button href={primaryCtaLink} variant="primary" size="lg" className="btn-interactive">
                {primaryCtaLabel}
              </Button>
              <Button href="#work" variant="secondary" size="lg" className="btn-interactive">
                View Our Work
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div
          data-hero="image"
          data-hero-delay="540"
          className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-t-[20px] overflow-hidden bg-[#F7F7F7] image-hover-zoom"
        >
          <Image
            src="/assets/work/"
            alt="Parvex studio — digital experiences crafted with precision"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1400px) 100vw, 1400px"
          />
          {/* Subtle dark overlay */}
          <div
            className="absolute inset-0 bg-[#0A0A0A]/12"
            aria-hidden="true"
          />
        </div>
      </Container>
    </section>
  );
}
