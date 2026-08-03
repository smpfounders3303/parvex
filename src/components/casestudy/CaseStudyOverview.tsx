import { Container } from "@/components/ui/Container";
import type { CaseStudyProject } from "@/types";

interface CaseStudyOverviewProps {
  project: CaseStudyProject;
}

/**
 * CaseStudyOverview — Project metadata grid.
 * Client, services, duration, status — clear and scannable.
 */
export function CaseStudyOverview({ project }: CaseStudyOverviewProps) {
  const fields = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Duration", value: project.duration },
    { label: "Status", value: project.status },
  ];

  return (
    <section className="py-20 md:py-28 border-b border-[#E8E8E8]" aria-label="Project overview">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Services */}
          <div data-reveal className="lg:col-span-7">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] mb-5">
              Services
            </p>
            <div className="flex flex-wrap gap-3">
              {project.services.map((service) => (
                <span
                  key={service}
                  className="text-[14px] font-medium text-[#0A0A0A] bg-[#F7F7F7] border border-[#E8E8E8] rounded-full px-4 py-2"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Meta grid */}
          <div
            data-reveal
            className="lg:col-span-5 grid grid-cols-2 gap-x-8 gap-y-8"
          >
            {fields.map((field) => (
              <div key={field.label}>
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] mb-2">
                  {field.label}
                </p>
                <p className="text-[15px] font-medium text-[#0A0A0A]">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
