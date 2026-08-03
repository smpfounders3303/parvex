"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export interface ServiceListItemView {
  slug: string;
  title: string;
  description: string;
  longDescription: string | null;
  deliverables: string[];
  outcome: string | null;
  imageUrl: string;
}

const FALLBACK_IMAGE_BY_INDEX = [
  "/assets/services/web-development.png",
  "/assets/services/app-development.png",
  "/assets/services/photography.png",
  "/assets/services/videography.png",
];

export function ServicesList({ services }: { services: ServiceListItemView[] }) {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const listRef = useRevealChildren<HTMLDivElement>(100, { threshold: 0.05 });

  return (
    <section
      id="services"
      className="py-20 md:py-28 lg:py-32 bg-white"
      aria-labelledby="services-list-heading"
    >
      <Container>
        {/* Section Header */}
        <div ref={headerRef} data-reveal className="mb-16 md:mb-24">
          <SectionHeader
            eyebrow="Core Services"
            title="What we do, one standard."
            description="Every engagement is scoped around business value — not a checklist of technologies."
            id="services-list-heading"
          />
        </div>

        {/* Alternating Editorial Services List */}
        <div ref={listRef} className="flex flex-col" role="list">
          {services.map((service, index) => {
            const isEven = index % 2 === 1;
            const imgPath = service.imageUrl || FALLBACK_IMAGE_BY_INDEX[index % FALLBACK_IMAGE_BY_INDEX.length];

            return (
              <div
                key={service.slug}
                id={service.slug}
                role="listitem"
                data-reveal-child
                className="scroll-mt-24 py-16 md:py-24 border-b border-[#E8E8E8] last:border-b-0"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                  
                  {/* Image Column */}
                  <div
                    className={cn(
                      "lg:col-span-5 relative aspect-[4/3] rounded-[20px] overflow-hidden bg-[#F7F7F7] border border-[#E8E8E8] image-hover-zoom",
                      isEven ? "lg:order-last" : ""
                    )}
                  >
                    <Image
                      src={imgPath}
                      alt={`${service.title} service visualization`}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 480px"
                    />
                    <div className="absolute inset-0 bg-[#0A0A0A]/5 pointer-events-none" aria-hidden="true" />
                  </div>

                  {/* Content Column */}
                  <div className="lg:col-span-7 flex flex-col gap-6 md:gap-7">
                    {/* Index & Title */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[12px] font-medium text-[#C0C0C0] tracking-[0.12em] uppercase tabular-nums">
                        Service / {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-tight">
                        {service.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-5">
                      <p className="text-[16px] md:text-[18px] text-[#6B6B6B] leading-[1.65] max-w-[580px]">
                        {service.longDescription || service.description}
                      </p>

                      {/* Deliverables */}
                      {service.deliverables && service.deliverables.length > 0 && (
                        <div className="flex flex-col gap-3 mt-2">
                          <span className="text-[11px] font-semibold text-[#0A0A0A] tracking-[0.14em] uppercase">
                            What we deliver
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
                            {service.deliverables.map((item) => (
                              <li key={item} className="flex items-center gap-3 text-[14px] text-[#6B6B6B]">
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-[#C0C0C0] flex-shrink-0"
                                  aria-hidden="true"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Outcome */}
                      {service.outcome && (
                        <div className="flex items-start gap-3 border-l-2 border-[#0A0A0A] pl-4 py-1 mt-2">
                          <p className="text-[15px] font-medium text-[#0A0A0A] leading-relaxed">
                            <span className="text-[#6B6B6B] font-normal">Expected Outcome:</span> {service.outcome}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CTA Link */}
                    <Link
                      href="/contact"
                      data-cursor="Start"
                      className="inline-flex items-center gap-3 text-[14px] font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors duration-200 w-fit mt-3 group"
                      aria-label={`Start a ${service.title} project`}
                    >
                      <span className="w-6 h-px bg-current transition-all duration-300 group-hover:w-9" aria-hidden="true" />
                      Start a Project
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
