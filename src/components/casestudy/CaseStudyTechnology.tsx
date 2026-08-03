import { Container } from "@/components/ui/Container";
import type { CaseStudyProject } from "@/types";

interface CaseStudyTechnologyProps {
  project: CaseStudyProject;
}

/**
 * CaseStudyTechnology — Technology stack, grouped by category.
 */
export function CaseStudyTechnology({ project }: CaseStudyTechnologyProps) {
  // Group tech by category
  const grouped = project.technology.reduce<Record<string, string[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item.name);
      return acc;
    },
    {}
  );

  return (
    <section className="py-20 md:py-28 border-b border-[#E8E8E8]" aria-labelledby="technology-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div data-reveal className="lg:col-span-3">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] lg:sticky lg:top-32">
              <span className="block text-[#C0C0C0] mb-1">05</span>
              Technology
            </p>
          </div>

          <div data-reveal className="lg:col-span-9">
            <h2
              id="technology-heading"
              className="text-2xl md:text-[32px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.25] mb-12"
            >
              The stack behind it.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] mb-4">
                    {category}
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="text-[14px] font-medium text-[#0A0A0A]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
