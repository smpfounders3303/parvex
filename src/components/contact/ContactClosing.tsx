"use client";

import { Container } from "@/components/ui/Container";
import { useReveal } from "@/hooks/useReveal";

export function ContactClosing() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section className="py-28 md:py-40 bg-[#0A0A0A]" aria-label="Closing statement">
      <Container>
        <div
          ref={ref}
          data-reveal
          data-reveal-type="fade"
          className="flex justify-center text-center"
        >
          <p
            className="font-semibold tracking-[-0.03em] leading-[1.2] text-white max-w-[720px]"
            style={{ fontSize: "clamp(24px, 3.4vw, 38px)" }}
          >
            The best work starts as a{" "}
            <span className="font-light italic text-white/50">rough idea</span>{" "}
            in someone&apos;s message.
          </p>
        </div>
      </Container>
    </section>
  );
}
