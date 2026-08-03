"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PHOTOGRAPHY } from "@/data/photography";
import { VIDEOGRAPHY } from "@/data/videography";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const VIDEO_STILLS = [...VIDEOGRAPHY, ...PHOTOGRAPHY.slice(0, 2)];

/**
 * WorkVideography — cinematic still-frame showcase.
 * No autoplay (per project rules: never autoplay audio/video). Each tile
 * presents a still frame with a play affordance, matching premium studio
 * sites that lead with imagery rather than embedded players.
 */
export function WorkVideography() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const gridRef = useRevealChildren<HTMLDivElement>(90, { threshold: 0.06 });

  return (
    <section
      id="videography"
      className="py-20 md:py-28 lg:py-32 bg-white"
      aria-labelledby="work-videography-heading"
    >
      <Container>
        <div ref={headerRef} data-reveal className="mb-14 md:mb-18">
          <SectionHeader
            eyebrow="Videography"
            title="Stories told in motion."
            id="work-videography-heading"
          />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {VIDEO_STILLS.slice(0, 3).map((item, index) => (
            <div
              key={item.id}
              data-reveal-child
              className={
                index === 0
                  ? "md:col-span-2 relative aspect-[21/9] rounded-[16px] overflow-hidden bg-[#0A0A0A] group cursor-pointer"
                  : "relative aspect-[4/3] rounded-[16px] overflow-hidden bg-[#0A0A0A] group cursor-pointer"
              }
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                loading="lazy"
                className="object-cover object-center opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes={index === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
              />
              <div
                className="absolute inset-0 bg-[#0A0A0A]/35 group-hover:bg-[#0A0A0A]/45 transition-colors duration-500"
                aria-hidden="true"
              />
              {/* Play affordance — no autoplay, still frame only */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/95 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Play size={20} className="text-[#0A0A0A] ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
