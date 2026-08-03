import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

/**
 * WorkCTA — Bottom of work page call to action.
 * Encourages visitors to start a project after reviewing the work.
 */
export function WorkCTA() {
  return (
    <section className="py-20 md:py-28 bg-[#0A0A0A]" aria-label="Start a project">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div data-reveal className="lg:col-span-8">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/40 mb-6">
              Ready to build?
            </p>
            <h2
              className="font-semibold text-white tracking-[-0.04em] leading-[1.0]"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Let&apos;s build something
              <span className="font-light italic text-white/50"> worth showing.</span>
            </h2>
          </div>

          <div data-reveal className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-white text-[#0A0A0A] rounded-full px-7 py-4 text-[14px] font-semibold tracking-[-0.01em] hover:bg-white/90 transition-colors duration-300"
            >
              Start a project
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
