import { Container } from "@/components/ui/Container";
import type { CaseStudyProject } from "@/types";

interface CaseStudyResultsProps {
  project: CaseStudyProject;
}

/**
 * CaseStudyResults — Quantified outcomes in a clean metric grid.
 * Large numbers, concise labels, one-line descriptions.
 */
export function CaseStudyResults({ project }: CaseStudyResultsProps) {
  return (
    <section className="py-20 md:py-28 border-b border-[#E8E8E8]" aria-labelledby="results-heading">
      <Container>
        <div data-reveal className="mb-14 md:mb-16">
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] mb-4">
            <span className="text-[#C0C0C0] mr-2">07</span>Results
          </p>
          <h2
            id="results-heading"
            className="text-2xl md:text-[36px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.2] max-w-[600px]"
          >
            What changed after we shipped.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#E8E8E8] rounded-[var(--radius-lg)] overflow-hidden">
          {project.results.map((result, i) => (
            <div
              key={i}
              data-reveal
              className="bg-white p-8 md:p-10"
            >
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] mb-4">
                {result.metric}
              </p>
              <p
                className="font-semibold text-[#0A0A0A] tracking-[-0.04em] leading-[1.0] mb-4"
                style={{ fontSize: "clamp(36px, 4vw, 52px)" }}
              >
                {result.value}
              </p>
              <p className="text-[14px] text-[#6B6B6B] leading-[1.65]">
                {result.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
