import type { Metadata } from "next";

// Applies to every /admin route including /admin/login. The real auth gate
// lives one level down in admin/(authenticated)/layout.tsx.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
