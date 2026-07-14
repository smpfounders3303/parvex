import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import type { CaseStudyProject } from "@/types";

interface CaseStudyHeroProps {
  project: CaseStudyProject;
}

/**
 * CaseStudyHero — Full-bleed editorial header for individual project pages.
 * Mirrors the homepage Hero animation system via data-hero attributes.
 */
export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  return (
    <section
      className="relative pt-[140px] pb-0 md:pt-[180px] bg-white overflow-hidden"
      aria-label={`${project.title} case study hero`}
    >
      <Container>
        {/* Meta row */}
        <div
          data-hero="eyebrow"
          data-hero-delay="60"
          className="flex flex-wrap items-center gap-3 mb-8 md:mb-10"
        >
          <Badge className="bg-[#0A0A0A]/5 text-[#0A0A0A] border-[#0A0A0A]/10">
            {project.category}
          </Badge>
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#6B6B6B]">
            {project.year}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#D0D0D0]" aria-hidden="true" />
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#6B6B6B]">
            {project.duration}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#D0D0D0]" aria-hidden="true" />
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#6B6B6B]">
            {project.status}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-semibold tracking-[-0.04em] leading-[1.0] text-[#0A0A0A] max-w-[900px] mb-6 md:mb-8"
          style={{ fontSize: "clamp(40px, 6.5vw, 80px)" }}
        >
          <span data-hero="h1-line" data-hero-delay="120">
            <span>{project.title}</span>
          </span>
        </h1>

        {/* Description */}
        <p
          data-hero="subtext"
          data-hero-delay="240"
          className="text-base md:text-[18px] text-[#6B6B6B] leading-[1.7] max-w-[600px] tracking-[-0.01em] mb-14 md:mb-18"
        >
          {project.description}
        </p>
      </Container>

      {/* Cover image — full width below header text */}
      <div
        data-hero="image"
        data-hero-delay="360"
        className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[#E8E8E8] overflow-hidden"
      >
        <Image
          src={project.coverImage}
          alt={project.coverImageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
