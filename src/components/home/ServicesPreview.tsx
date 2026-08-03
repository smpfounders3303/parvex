"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

export interface ServicePreviewView {
  slug: string;
  number: string;
  title: string;
  description: string;
}

export function ServicesPreview({
  services,
  heading = "What we do,\ndone right.",
}: {
  services: ServicePreviewView[];
  heading?: string;
}) {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1, rootMargin: "0px 0px -80px 0px" });
  const listRef = useRevealChildren<HTMLDivElement>(70, { threshold: 0.04 });

  if (services.length === 0) return null;

  const [headingLine1, headingLine2] = heading.split("\n");

  return (
    <section
      id="services"
      className="py-28 md:py-36 lg:py-44 bg-white"
      aria-labelledby="services-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-16 lg:gap-28">
          {/* Sticky left header */}
          <div
            ref={headerRef}
            data-reveal
            className="lg:sticky lg:top-32 lg:self-start flex flex-col gap-7"
          >
            <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#6B6B6B]">
              What We Build
            </span>
            <h2
              id="services-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A] text-4xl md:text-5xl"
            >
              {headingLine1}
              {headingLine2 && (
                <>
                  <br />
                  {headingLine2}
                </>
              )}
            </h2>
            <p className="text-[#6B6B6B] text-[15px] leading-[1.7] max-w-[280px]">
              Every service we offer is executed to the same standard: precise,
              purposeful, and built to perform.
            </p>
            <Button href="/services" variant="secondary" size="md" className="w-fit mt-1 btn-interactive">
              All Services
            </Button>
          </div>

          {/* Services list — stagger reveal, each row is a clickable link */}
          <div ref={listRef} className="flex flex-col" role="list">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services#${service.slug}`}
                role="listitem"
                data-reveal-child
                data-cursor="Explore"
                className="service-row group flex items-start gap-6 py-7 border-b border-[#E8E8E8] first:border-t cursor-pointer"
                aria-label={`View ${service.title} service`}
              >
                {/* Number */}
                <span className="text-[11px] font-medium text-[#C0C0C0] tracking-[0.1em] mt-1 w-6 flex-shrink-0 group-hover:text-[#0A0A0A] transition-colors duration-300">
                  {service.number}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-[22px] font-medium text-[#0A0A0A] tracking-[-0.025em] mb-2 group-hover:opacity-60 transition-opacity duration-300">
                    {service.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-[#6B6B6B] leading-[1.65]">
                    {service.description}
                  </p>
                </div>

                {/* Arrow — slides in on hover */}
                <div className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-6px] group-hover:translate-x-0">
                  <ArrowRight size={17} className="text-[#0A0A0A]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
