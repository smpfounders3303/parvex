import { Container } from "@/components/ui/Container";

/**
 * CaseStudyProcess — Optional interstitial section showing Parvex's
 * standard process steps. Shown between Research and Development.
 * Kept as a static, reusable component since the process is consistent
 * across every project.
 */
export function CaseStudyProcess() {
  const steps = [
    { number: "01", title: "Discovery", description: "We embed with the team to understand the real problem before touching any tools." },
    { number: "02", title: "Strategy", description: "We define scope, architecture, and success metrics before writing a single line of code." },
    { number: "03", title: "Design", description: "Interfaces designed for the actual user — tested against real workflows, not assumptions." },
    { number: "04", title: "Engineering", description: "Production-grade code, built to scale from day one." },
    { number: "05", title: "Delivery", description: "Shipped, monitored, and supported — not handed off and forgotten." },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F7F7F7]" aria-label="Our process">
      <Container>
        <div data-reveal className="mb-14">
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] mb-4">
            How We Work
          </p>
          <h2 className="text-2xl md:text-[32px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.2] max-w-[500px]">
            The same process, applied to every project.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#E8E8E8] rounded-[var(--radius-lg)] overflow-hidden">
          {steps.map((step) => (
            <div key={step.number} data-reveal className="bg-[#F7F7F7] p-6 md:p-8">
              <p className="text-[11px] font-semibold text-[#C0C0C0] tracking-[0.1em] mb-4">
                {step.number}
              </p>
              <h3 className="text-[15px] font-semibold text-[#0A0A0A] mb-3 tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="text-[13px] text-[#6B6B6B] leading-[1.65]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
