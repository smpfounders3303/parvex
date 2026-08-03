import { Container } from "@/components/ui/Container";
import type { CaseStudyProject } from "@/types";

interface CaseStudySolutionProps {
  project: CaseStudyProject;
}

/**
 * CaseStudySolution — How Parvex responded to the challenge.
 */
export function CaseStudySolution({ project }: CaseStudySolutionProps) {
  return (
    <section className="py-20 md:py-28 border-b border-[#E8E8E8]" aria-labelledby="solution-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Label */}
          <div data-reveal className="lg:col-span-3">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] lg:sticky lg:top-32">
              <span className="block text-[#C0C0C0] mb-1">02</span>
              Solution
            </p>
          </div>

          {/* Content */}
          <div data-reveal className="lg:col-span-9">
            <h2
              id="solution-heading"
              className="text-2xl md:text-[32px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.25] mb-8"
            >
              How we approached it.
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#4A4A4A] leading-[1.85] max-w-[680px]">
              {project.solution}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
