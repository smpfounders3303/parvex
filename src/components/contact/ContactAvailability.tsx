"use client";

import { Container } from "@/components/ui/Container";
import { useReveal } from "@/hooks/useReveal";

const ITEMS = [
  { label: "Availability", value: "Currently taking on new projects" },
  { label: "Response time", value: "Within 24 hours, most days sooner" },
  { label: "Where we work", value: "Remote-first, across time zones" },
];

export function ContactAvailability() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="py-16 md:py-20 border-y border-[#E8E8E8] bg-white" aria-label="Availability">
      <Container>
        <div
          ref={ref}
          data-reveal
          data-reveal-type="fade"
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12"
        >
          {ITEMS.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#C0C0C0]">
                {item.label}
              </span>
              <span className="text-[15px] text-[#0A0A0A] tracking-[-0.01em] flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]"
                  aria-hidden="true"
                />
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
