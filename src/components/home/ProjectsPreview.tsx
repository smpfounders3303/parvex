"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export interface FeaturedProjectView {
  slug: string;
  title: string;
  category: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export function ProjectsPreview({
  projects,
  heading = "Projects that define us.",
}: {
  projects: FeaturedProjectView[];
  heading?: string;
}) {
  const [projectA, projectB, projectC, projectD] = projects;
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const row1Ref = useRevealChildren<HTMLDivElement>(100, { threshold: 0.05 });
  const row2Ref = useRevealChildren<HTMLDivElement>(100, { threshold: 0.05 });

  if (projects.length === 0) return null;

  return (
    <section
      id="work"
      className="py-28 md:py-36 lg:py-44 bg-[#F7F7F7]"
      aria-labelledby="projects-heading"
    >
      <Container>
        {/* Header row */}
        <div
          ref={headerRef}
          data-reveal
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 md:mb-18"
        >
          <SectionHeader
            eyebrow="Featured Work"
            title={heading}
            id="projects-heading"
          />
          <Button
            href="/work"
            variant="secondary"
            size="md"
            className="flex-shrink-0 btn-interactive"
          >
            View All Work
          </Button>
        </div>

        {/* Asymmetric 2-row project grid */}
        <div className="flex flex-col gap-5">
          {/* Row 1 */}
          <div ref={row1Ref} className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-5">
            {projectA && <ProjectCard project={projectA} aspectClass="aspect-[4/3] md:aspect-[16/10]" size="large" data-reveal-child />}
            {projectB && <ProjectCard project={projectB} aspectClass="aspect-[4/5] md:aspect-auto" data-reveal-child />}
          </div>

          {/* Row 2 — reversed proportion */}
          {(projectC || projectD) && (
            <div ref={row2Ref} className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-5">
              {projectC && <ProjectCard project={projectC} aspectClass="aspect-[4/5] md:aspect-auto" data-reveal-child />}
              {projectD && <ProjectCard project={projectD} aspectClass="aspect-[4/3] md:aspect-[16/10]" size="large" data-reveal-child />}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

interface ProjectCardProps {
  project: FeaturedProjectView;
  aspectClass?: string;
  size?: "default" | "large";
  "data-reveal-child"?: boolean;
}

function ProjectCard({ project, aspectClass, size = "default", ...rest }: ProjectCardProps) {
  return (
    <Link
      {...rest}
      href={`/work/${project.slug}`}
      aria-label={`View ${project.title} case study`}
      data-cursor="View"
      className={cn(
        "group relative rounded-[16px] overflow-hidden bg-[#E0E0E0]",
        "block w-full min-h-[200px] md:min-h-[260px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2",
        aspectClass
      )}
    >
      {/* Image — zoom on hover via CSS group */}
      <Image
        src={project.imageSrc}
        alt={project.imageAlt}
        fill
        unoptimized={project.imageSrc.startsWith("http")}
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Base gradient — always present for text legibility */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#0A0A0A]/75 via-[#0A0A0A]/30 to-transparent"
        aria-hidden="true"
      />

      {/* Hover overlay — darkens smoothly */}
      <div
        className="project-card-overlay absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/22"
        aria-hidden="true"
      />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          <Badge>{project.category}</Badge>
          <h3
            className={cn(
              "text-white font-semibold tracking-[-0.02em] drop-shadow-sm leading-tight",
              "transition-transform duration-500 ease-out",
              "group-hover:translate-y-[-2px]",
              size === "large" ? "text-xl md:text-2xl" : "text-lg md:text-xl"
            )}
          >
            {project.title}
          </h3>
          {size === "large" && (
            <p className="text-white/65 text-sm leading-relaxed max-w-[400px] hidden md:block
                          opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                          transition-all duration-500 ease-out">
              {project.description}
            </p>
          )}
        </div>

        {/* Arrow — lifts in on hover */}
        <div
          className="project-card-arrow w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0
                      opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          aria-hidden="true"
        >
          <ArrowUpRight size={16} className="text-[#0A0A0A]" />
        </div>
      </div>
    </Link>
  );
}
