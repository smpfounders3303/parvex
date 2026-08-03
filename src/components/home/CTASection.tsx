"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";

export function CTASection({
  headline = "Have an idea?",
  ctaLabel = "Start a Project →",
  ctaLink = "mailto:hello@parvex.in",
  contactEmail = "hello@parvex.in",
}: {
  headline?: string;
  ctaLabel?: string;
  ctaLink?: string;
  contactEmail?: string;
}) {
  const contentRef = useReveal<HTMLDivElement>({ threshold: 0.12 });

  return (
    <section
      id="contact"
      className="py-28 md:py-36 lg:py-44 bg-[#0A0A0A]"
      aria-labelledby="cta-heading"
    >
      <Container>
        <div
          ref={contentRef}
          data-reveal
          data-reveal-type="fade"
          className="flex flex-col items-center text-center gap-8 md:gap-10"
        >
          <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-white/35">
            Let&apos;s Build Together
          </span>

          <h2
            id="cta-heading"
            className="font-semibold tracking-[-0.04em] leading-[1.0] text-white max-w-[800px]"
            style={{ fontSize: "clamp(38px, 6vw, 76px)" }}
          >
            {headline}
            <br />
            <span className="font-light italic text-white/50">Let&apos;s make it real.</span>
          </h2>

          <p className="text-[15px] md:text-base text-white/45 leading-[1.75] max-w-[440px]">
            Tell us what you&apos;re building. We&apos;ll tell you how to make it
            worth building.
          </p>

          <div className="flex items-center gap-3 mt-2">
            <Button
              href={ctaLink}
              variant="secondary"
              size="lg"
              className="btn-interactive border-white/20 text-white hover:bg-white hover:text-[#0A0A0A]"
            >
              {ctaLabel}
            </Button>
          </div>

          <p className="text-[13px] text-white/30">
            Or reach us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-white/60 underline underline-offset-4 decoration-white/20 hover:text-white hover:decoration-white transition-all duration-200"
            >
              {contactEmail}
            </a>
            {" "}— we reply within 24 hours.
          </p>
        </div>
      </Container>
    </section>
  );
}
