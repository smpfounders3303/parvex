"use client";

import { Mail, Globe, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useRevealChildren } from "@/hooks/useReveal";
import { COMPANY } from "@/data/company";
import { SOCIAL_LINKS } from "@/data/social";

// This lucide-react version ships generic icons only (no brand marks), so
// every social platform falls back to Globe — same convention already used
// for Behance in src/data/social.ts.
const ICON_MAP: Record<string, LucideIcon> = {
  instagram: Globe,
  linkedin: Globe,
  globe: Globe,
};

export function ContactAlternatives() {
  const ref = useRevealChildren<HTMLDivElement>(70, { threshold: 0.1 });

  const cards = [
    { label: "Email", value: COMPANY.email, href: `mailto:${COMPANY.email}`, icon: Mail },
    ...SOCIAL_LINKS.map((s) => ({
      label: s.platform,
      value: `@parvex`,
      href: s.href,
      icon: ICON_MAP[s.icon ?? "globe"] ?? Globe,
    })),
  ];

  return (
    <section className="py-24 md:py-32 bg-white" aria-labelledby="alt-contact-heading">
      <Container>
        <div className="flex flex-col gap-10 md:gap-12">
          <span id="alt-contact-heading" className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#6B6B6B]">
            Other ways to reach us
          </span>

          <div
            ref={ref}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
          >
            {cards.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                data-reveal-child
                className="group flex flex-col justify-between gap-8 rounded-[var(--radius-lg)] border border-[#E8E8E8] bg-white p-6 hover:border-[#0A0A0A] transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <Icon size={18} className="text-[#6B6B6B] group-hover:text-[#0A0A0A] transition-colors duration-300" aria-hidden="true" />
                  <ArrowUpRight
                    size={15}
                    className="text-[#C0C0C0] group-hover:text-[#0A0A0A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium text-[#0A0A0A] tracking-[-0.01em]">
                    {label}
                  </span>
                  <span className="text-[13px] text-[#6B6B6B]">{value}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
