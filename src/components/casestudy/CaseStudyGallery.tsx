import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { CaseStudyProject, GalleryImage } from "@/types";

interface CaseStudyGalleryProps {
  project: CaseStudyProject;
}

const aspectClasses: Record<GalleryImage["aspect"], string> = {
  landscape: "aspect-[16/10]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
};

/**
 * CaseStudyGallery — Editorial image grid.
 * First image spans full width; remaining images share a row.
 * Adapts layout based on number of gallery images.
 */
export function CaseStudyGallery({ project }: CaseStudyGalleryProps) {
  const { gallery } = project;
  if (!gallery || gallery.length === 0) return null;

  const [primary, ...rest] = gallery;

  return (
    <section className="py-20 md:py-28 border-b border-[#E8E8E8]" aria-label="Project gallery">
      <Container>
        <div data-reveal className="mb-12">
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B]">
            <span className="text-[#C0C0C0] mr-2">06</span>Gallery
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Primary image — full width */}
          <div
            data-reveal
            className={cn(
              "relative w-full rounded-[var(--radius-lg)] overflow-hidden bg-[#E8E8E8] image-hover-zoom",
              aspectClasses[primary.aspect]
            )}
          >
            <Image
              src={primary.src}
              alt={primary.alt}
              fill
              unoptimized={primary.src.startsWith("http")}
              className="object-cover object-center"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
          </div>

          {/* Secondary images */}
          {rest.length > 0 && (
            <div
              className={cn(
                "grid gap-4",
                rest.length === 1 && "grid-cols-1",
                rest.length === 2 && "grid-cols-1 md:grid-cols-2",
                rest.length >= 3 && "grid-cols-1 md:grid-cols-3"
              )}
            >
              {rest.map((img, i) => (
                <div
                  key={i}
                  data-reveal
                  className={cn(
                    "relative w-full rounded-[var(--radius-lg)] overflow-hidden bg-[#E8E8E8] image-hover-zoom",
                    aspectClasses[img.aspect]
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    unoptimized={img.src.startsWith("http")}
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
