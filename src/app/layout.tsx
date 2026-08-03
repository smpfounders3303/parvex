import type { Metadata } from "next";
import "./globals.css";

// ROOT LAYOUT — truly global document concerns only.
//
// The public marketing experience (Navbar, Footer, CustomCursor, Lenis smooth
// scroll, page transitions) lives in `(public)/layout.tsx` and must never run
// inside /admin. The Admin experience owns its own shell in `admin/layout.tsx`.
// This file must stay minimal so neither experience leaks into the other.

export const metadata: Metadata = {
  metadataBase: new URL("https://parvex.in"),
  title: {
    default: "Parvex — Digital Experience Studio",
    template: "%s — Parvex",
  },
  description:
    "Parvex is a modern Digital Experience Studio. We combine software engineering with creative media to help businesses build strong digital products and memorable visual identities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased bg-white text-[#0A0A0A]">{children}</body>
    </html>
  );
}
