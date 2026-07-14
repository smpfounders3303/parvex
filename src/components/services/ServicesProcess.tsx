import { ProcessTimeline, type ProcessStep } from "@/components/ui/ProcessTimeline";

// Local to this section — mirrors how FutureWork.tsx keeps a short,
// page-specific list inline rather than in /data.
const PROCESS_STEPS: ProcessStep[] = [
  { id: "discovery", label: "Discovery", description: "We learn your business, your users, and your goals." },
  { id: "strategy", label: "Strategy", description: "We map the right approach before writing a line of code." },
  { id: "design", label: "Design", description: "We shape the structure, hierarchy, and visual language." },
  { id: "development", label: "Development", description: "We build it properly — clean, tested, production-ready." },
  { id: "launch", label: "Launch", description: "We ship, monitor, and stay close for what comes next." },
];

/**
 * ServicesProcess — "How We Work" section for the Services page.
 * Renders the shared ProcessTimeline with this page's steps.
 */
export function ServicesProcess() {
  return (
    <ProcessTimeline
      id="process"
      eyebrow="How We Work"
      title="A process built for clarity."
      steps={PROCESS_STEPS}
    />
  );
}
