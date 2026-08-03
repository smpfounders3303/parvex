"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PHOTOGRAPHY } from "@/data/photography";
import { VIDEOGRAPHY } from "@/data/videography";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

// Combined, ordered for this specific editorial grid layout.
const MEDIA_ITEMS = [
  PHOTOGRAPHY[0],
  PHOTOGRAPHY[1],
  PHOTOGRAPHY[4],
  PHOTOGRAPHY[2],
  VIDEOGRAPHY[0],
  PHOTOGRAPHY[3],
];

export function MediaShowcase() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const gridRef = useRevealChildren<HTMLDivElement>(55, { threshold: 0.04 });

  return (
    <section
      id="media"
      className="py-28 md:py-36 lg:py-44 bg-white"
      aria-labelledby="media-heading"
    >
      <Container>
        {/* Header — editorial, wide */}
        <div
          ref={headerRef}
          data-reveal
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-16 md:mb-20 items-end"
        >
          <div className="flex flex-col gap-6">
            <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#6B6B6B]">
              Photography & Film
            </span>
            <h2
              id="media-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A] text-4xl md:text-5xl lg:text-[52px]"
            >
              Through the lens,
              <br />
              we capture what
              <br />
              words cannot.
            </h2>
          </div>
          <p className="text-[#6B6B6B] text-[15px] md:text-base leading-[1.75] max-w-[380px]">
            Editorial and commercial work for brands that understand the power
            of image. Every frame is intentional. Every shot is earned.
          </p>
        </div>

        {/* Editorial grid — 3 columns, varied heights */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-5 auto-rows-[180px] md:auto-rows-[200px]"
        >
          <MediaItem item={MEDIA_ITEMS[0]} className="col-span-1 md:col-span-4 row-span-3" />
          <MediaItem item={MEDIA_ITEMS[1]} className="col-span-1 md:col-span-5 row-span-2" />
          <MediaItem item={MEDIA_ITEMS[5]} className="hidden md:block md:col-span-3 row-span-1" />
          <MediaItem item={MEDIA_ITEMS[2]} className="hidden md:block md:col-span-3 row-span-2" />
          <MediaItem item={MEDIA_ITEMS[3]} className="col-span-1 md:col-span-5 row-span-2" showVideoTag />
          <MediaItem item={MEDIA_ITEMS[4]} className="col-span-1 md:col-span-3 row-span-1" />
        </div>
      </Container>
    </section>
  );
}

interface MediaItemProps {
  item: (typeof MEDIA_ITEMS)[0];
  className?: string;
  showVideoTag?: boolean;
}

function MediaItem({ item, className, showVideoTag }: MediaItemProps) {
  return (
    <div
      data-reveal-child
      className={`media-item group relative overflow-hidden rounded-[14px] bg-[#E8E8E8] ${className ?? ""}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      {/* Video badge */}
      {(item.type === "video" || showVideoTag) && (
        <div className="absolute top-3.5 left-3.5 bg-white/92 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" aria-hidden="true" />
          <span className="text-[9px] font-semibold tracking-[0.1em] uppercase text-[#0A0A0A]">
            Video
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/10 transition-all duration-500"
        aria-hidden="true"
      />
    </div>
  );
}
