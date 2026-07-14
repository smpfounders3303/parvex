import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactAvailability } from "@/components/contact/ContactAvailability";
import { ContactAlternatives } from "@/components/contact/ContactAlternatives";
import { ContactClosing } from "@/components/contact/ContactClosing";

export const metadata: Metadata = {
  title: "Contact — Parvex",
  description:
    "Tell Parvex what you're building. Share a few details about your project and we'll reply within 24 hours — no sales calls, no obligation.",
  keywords: [
    "contact Parvex",
    "hire digital experience studio",
    "web development enquiry",
    "app development enquiry",
    "start a project",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://parvex.in/contact",
    siteName: "Parvex",
    title: "Contact — Parvex",
    description:
      "Tell us what you're building. We'll reply within 24 hours — no sales calls, no obligation.",
    images: [
      {
        url: "/assets/logos/parvex-og-image.png",
        width: 1200,
        height: 630,
        alt: "Parvex — Beyond Excellence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Parvex",
    description:
      "Tell us what you're building. We'll reply within 24 hours — no sales calls, no obligation.",
    images: ["/assets/logos/parvex-og-image.png"],
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactForm />
      <ContactAvailability />
      <ContactAlternatives />
      <ContactClosing />
    </>
  );
}
