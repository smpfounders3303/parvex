import { WorkCard, type WorkCardView } from "@/components/work/WorkCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * WorkGrid — Renders all published projects as a scrollable card list.
 * Data is fetched server-side from the CMS in work/page.tsx and passed down.
 */
export function WorkGrid({ projects }: { projects: WorkCardView[] }) {
  return (
    <section
      id="all-work"
      className="py-20 md:py-28 lg:py-32 bg-white"
      aria-labelledby="work-grid-heading"
    >
      <Container>
        <div className="mb-14 md:mb-18">
          <SectionHeader
            eyebrow="All Projects"
            title="Every project, one page."
            description="From AI products to creative showcases — each built end to end by one team."
            id="work-grid-heading"
          />
        </div>

        {projects.length === 0 ? (
          <p className="text-[15px] text-[#6B6B6B] py-10">More work coming soon.</p>
        ) : (
          <div className="flex flex-col divide-y divide-[#E8E8E8]">
            {projects.map((project, index) => (
              <WorkCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
