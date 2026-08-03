"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

/**
 * WorkHero — editorial opener for the Work page.
 * Mirrors the homepage Hero's animation sequence (data-hero attributes)
 * but with a balanced two-column grid using a premium visual asset to reduce unused white space.
 */
export function WorkHero() {
  useHeroAnimation();

  return (
    <section
      className="relative pt-[140px] pb-16 md:pt-[180px] md:pb-24 bg-white"
      aria-label="Work page hero"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Typography */}
          <div className="flex flex-col gap-6 md:gap-8">
            <div
              data-hero="eyebrow"
              data-hero-delay="60"
              className="flex items-center gap-3"
            >
              <div className="w-5 h-px bg-[#6B6B6B]" aria-hidden="true" />
              <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#6B6B6B]">
                Selected Work
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.04em] leading-[1.05] text-[#0A0A0A]"
              style={{ fontSize: "clamp(36px, 6vw, 68px)" }}
            >
              <span data-hero="h1-line" data-hero-delay="120">
                <span>Work that speaks</span>
              </span>
              <span data-hero="h1-line" data-hero-delay="200">
                <span className="font-light italic text-[#6B6B6B]">for itself.</span>
              </span>
            </h1>

            <p
              data-hero="subtext"
              data-hero-delay="320"
              className="text-base md:text-[17px] text-[#6B6B6B] leading-[1.7] max-w-[520px] tracking-[-0.01em]"
            >
              A selection of products, platforms, and visual work we&apos;ve
              built — each one shaped by a real problem and shipped to a real
              standard.
            </p>
          </div>

          {/* Right Column: Premium Visual Element */}
          <div
            data-hero="image"
            data-hero-delay="400"
            className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-[#F7F7F7] border border-[#E8E8E8] image-hover-zoom"
          >
            <Image
              src="/assets/work/hero-visual.png"
              alt="Parvex work identity visual study — abstract monochromatic digital sculpture"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 500px"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-[#0A0A0A]/5 pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </Container>
    </section>
  );
}
