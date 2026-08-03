import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTransition } from "@/components/ui/PageTransition";

// PUBLIC LAYOUT — owns the entire approved public experience.
// Nothing here may run inside /admin. Do not add Admin concerns to this file.

export const metadata: Metadata = {
  keywords: [
    "digital experience studio",
    "web development",
    "app development",
    "photography",
    "videography",
    "UI/UX design",
    "branding",
  ],
  authors: [{ name: "Parvex" }],
  creator: "Parvex",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://parvex.in",
    siteName: "Parvex",
    title: "Parvex — Digital Experience Studio",
    description:
      "We combine software engineering with creative media to help businesses build strong digital products and memorable visual identities.",
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
    title: "Parvex — Digital Experience Studio",
    description:
      "We combine software engineering with creative media to help businesses build strong digital products and memorable visual identities.",
    images: ["/assets/logos/parvex-og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Skip to main content — accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {/* Custom cursor — desktop only, pointer-events: none */}
      <CustomCursor />
      <SmoothScrollProvider />
      <Navbar />
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
