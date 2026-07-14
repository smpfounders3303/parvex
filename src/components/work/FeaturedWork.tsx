"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FEATURED_PROJECTS } from "@/data/projects";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

/**
 * FeaturedWork — curated case-study presentation of real Parvex products.
 * Each card communicates challenge → solution → outcome rather than
 * just a screenshot, per the Phase 3 storytelling requirement.
 */
export function FeaturedWork() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const listRef = useRevealChildren<HTMLDivElement>(110, { threshold: 0.04 });

  return (
    <section
      id="featured-work"
      className="py-20 md:py-28 lg:py-32 bg-white"
      aria-labelledby="featured-work-heading"
    >
      <Container>
        <div ref={headerRef} data-reveal className="mb-14 md:mb-18">
          <SectionHeader
            eyebrow="Featured Work"
            title="Built end to end."
            description="Each project below was designed, engineered, and shipped by one team — from the first sketch to the final deploy."
            id="featured-work-heading"
          />
        </div>

        <div ref={listRef} className="flex flex-col gap-16 md:gap-24">
          {FEATURED_PROJECTS.map((project, index) => (
            <CaseStudyCard
              key={project.id}
              project={project}
              reversed={index % 2 === 1}
              data-reveal-child
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

interface CaseStudyCardProps {
  project: Project;
  reversed?: boolean;
  "data-reveal-child"?: boolean;
}

function CaseStudyCard({ project, reversed, ...rest }: CaseStudyCardProps) {
  return (
    <article
      {...rest}
      className={cn(
        "group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center",
      )}
    >
      {/* Cover image */}
      <div
        className={cn(
          "lg:col-span-7 relative aspect-[4/3] md:aspect-[16/11] rounded-[16px] overflow-hidden bg-[#E0E0E0] image-hover-zoom",
          reversed && "lg:order-2"
        )}
      >
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div
          className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/8 transition-colors duration-500"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className={cn("lg:col-span-5 flex flex-col gap-6", reversed && "lg:order-1")}>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#0A0A0A]/5 text-[#0A0A0A] border-[#0A0A0A]/10 backdrop-blur-none">
            {project.category}
          </Badge>
        </div>

        <h3 className="text-3xl md:text-[34px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.1]">
          {project.title}
        </h3>

        <p className="text-[15px] md:text-base text-[#6B6B6B] leading-[1.75]">
          {project.description}
        </p>

        {/* Challenge / Solution / Outcome — storytelling, not screenshots */}
        <div className="flex flex-col gap-4 border-l-2 border-[#E8E8E8] pl-5">
          {project.challenge && (
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] mb-1.5">
                Challenge
              </p>
              <p className="text-[14px] text-[#6B6B6B] leading-[1.7]">
                {project.challenge}
              </p>
            </div>
          )}
          {project.solution && (
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] mb-1.5">
                Solution
              </p>
              <p className="text-[14px] text-[#6B6B6B] leading-[1.7]">
                {project.solution}
              </p>
            </div>
          )}
          {project.outcome && (
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] mb-1.5">
                Outcome
              </p>
              <p className="text-[14px] text-[#6B6B6B] leading-[1.7]">
                {project.outcome}
              </p>
            </div>
          )}
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[12px] font-medium text-[#6B6B6B] bg-[#F7F7F7] border border-[#E8E8E8] rounded-full px-3 py-1.5"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <a
          href={`/work/${project.id}`}
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0A0A0A] mt-2 w-fit hover:opacity-70 transition-opacity duration-300"
        >
          View Case Study
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </a>
      </div>
    </article>
  );
}
