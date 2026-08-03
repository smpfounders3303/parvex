import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  displayNumber: string;
}

/**
 * ServiceCard — large, minimal card for a single core service.
 * Has an id matching service.id so deep-link navigation works:
 * /services#web-development scrolls here.
 */
export function ServiceCard({ service, displayNumber }: ServiceCardProps) {
  return (
    <div
      id={service.id}
      data-reveal-child
      className="card-interactive flex flex-col gap-7 rounded-[var(--radius-lg)] border border-[#E8E8E8] bg-white p-9 md:p-11 scroll-mt-24"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-[12px] font-medium text-[#C0C0C0] tracking-[0.1em] tabular-nums">
          {displayNumber}
        </span>
        <ArrowUpRight size={18} className="text-[#C0C0C0]" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-2xl md:text-[26px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.15]">
          {service.title}
        </h3>
        <p className="text-[14px] md:text-[15px] text-[#6B6B6B] leading-[1.65] max-w-[420px]">
          {service.description}
        </p>
      </div>

      {service.deliverables && service.deliverables.length > 0 && (
        <ul className="flex flex-col gap-2 pt-1">
          {service.deliverables.slice(0, 3).map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[13px] text-[#6B6B6B]">
              <span
                className="w-1 h-1 rounded-full bg-[#C0C0C0] flex-shrink-0"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      )}

      {service.outcome && (
        <div className="flex items-start gap-2.5 pt-1">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] mt-[7px] flex-shrink-0"
            aria-hidden="true"
          />
          <p className="text-[14px] font-medium text-[#0A0A0A] leading-[1.5]">
            {service.outcome}
          </p>
        </div>
      )}

      <Link
        href="/contact"
        className="inline-flex items-center gap-2 text-[13px] font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors duration-200 w-fit -ml-1 mt-1 group"
        aria-label={`Start a ${service.title} project`}
      >
        <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-6" aria-hidden="true" />
        Start a Project
      </Link>
    </div>
  );
}
