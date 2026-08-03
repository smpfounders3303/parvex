"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useReveal } from "@/hooks/useReveal";

export interface WorkCardView {
  slug: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
  services: string[];
  year: string;
}

interface WorkCardProps {
  project: WorkCardView;
  index: number;
}

/**
 * WorkCard — A single project row in the WorkGrid.
 * Horizontal layout: thumbnail left, metadata right.
 * Hover reveals arrow and lifts thumbnail.
 */
export function WorkCard({ project, index }: WorkCardProps) {
  const ref = useReveal<HTMLAnchorElement>({ threshold: 0.05 });

  return (
    <Link
      ref={ref}
      href={`/work/${project.slug}`}
      data-reveal
      className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center py-10 md:py-12 cursor-pointer"
      aria-label={`View ${project.title} case study`}
    >
      {/* Index */}
      <div className="hidden md:block md:col-span-1">
        <span className="text-[12px] font-medium text-[#C0C0C0] tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="md:col-span-3 relative aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden bg-[#E8E8E8] image-hover-zoom">
        <Image
          src={project.thumbnail}
          alt={project.thumbnailAlt}
          fill
          unoptimized={project.thumbnail.startsWith("http")}
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="md:col-span-6 flex flex-col gap-3">
        <Badge className="bg-[#0A0A0A]/5 text-[#0A0A0A] border-[#0A0A0A]/10 w-fit">
          {project.category}
        </Badge>
        <h3 className="text-xl md:text-2xl font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.2] group-hover:text-[#0A0A0A]/80 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-[14px] text-[#6B6B6B] leading-[1.65] max-w-[480px]">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="text-[12px] font-medium text-[#6B6B6B]"
            >
              {service}
              {project.services.indexOf(service) < Math.min(2, project.services.length - 1) && (
                <span className="ml-2 text-[#D0D0D0]">/</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Meta + arrow */}
      <div className="md:col-span-2 flex flex-col items-start md:items-end gap-4">
        <span className="text-[12px] font-medium text-[#6B6B6B]">{project.year}</span>
        <div className="w-10 h-10 rounded-full border border-[#E8E8E8] group-hover:border-[#0A0A0A] group-hover:bg-[#0A0A0A] flex items-center justify-center transition-all duration-300">
          <ArrowUpRight
            size={16}
            className="text-[#6B6B6B] group-hover:text-white transition-colors duration-300"
          />
        </div>
      </div>
    </Link>
  );
}
