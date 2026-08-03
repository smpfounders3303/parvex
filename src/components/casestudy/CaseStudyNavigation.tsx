import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

export interface NextProjectView {
  slug: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
}

interface CaseStudyNavigationProps {
  nextProject: NextProjectView;
}

/**
 * CaseStudyNavigation — Full-width "Next Project" call to action.
 * Feels like turning a page rather than clicking a button.
 */
export function CaseStudyNavigation({ nextProject }: CaseStudyNavigationProps) {
  return (
    <section className="py-20 md:py-28" aria-label="Next project">
      <Container>
        <div data-reveal className="mb-6">
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B]">
            Next Project
          </p>
        </div>

        <Link
          href={`/work/${nextProject.slug}`}
          className="group block"
          aria-label={`View next project: ${nextProject.title}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8 md:py-10 border-t border-[#E8E8E8] hover:border-[#0A0A0A] transition-colors duration-300">
            {/* Thumbnail */}
            <div
              data-reveal
              className="lg:col-span-4 relative aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden bg-[#E8E8E8] image-hover-zoom"
            >
              <Image
                src={nextProject.thumbnail}
                alt={nextProject.thumbnailAlt}
                fill
                unoptimized={nextProject.thumbnail.startsWith("http")}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>

            {/* Text */}
            <div data-reveal className="lg:col-span-7 flex flex-col gap-4">
              <Badge className="bg-[#0A0A0A]/5 text-[#0A0A0A] border-[#0A0A0A]/10 w-fit">
                {nextProject.category}
              </Badge>
              <h3
                className="font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.1] group-hover:text-[#0A0A0A]/80 transition-colors duration-300"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
              >
                {nextProject.title}
              </h3>
              <p className="text-[15px] text-[#6B6B6B] leading-[1.7] max-w-[480px]">
                {nextProject.description}
              </p>
            </div>

            {/* Arrow */}
            <div
              data-reveal
              className="lg:col-span-1 flex justify-end"
              aria-hidden="true"
            >
              <div className="w-12 h-12 rounded-full border border-[#E8E8E8] group-hover:border-[#0A0A0A] group-hover:bg-[#0A0A0A] flex items-center justify-center transition-all duration-300">
                <ArrowRight
                  size={18}
                  className="text-[#6B6B6B] group-hover:text-white transition-colors duration-300"
                />
              </div>
            </div>
          </div>
        </Link>
      </Container>
    </section>
  );
}
