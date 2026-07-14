// Shared SEO contract for any content model that will eventually own its
// own route (projects, services, future blog posts, etc.).
//
// Phase 4 note: this prepares every content model for SEO. It is not wired
// into <head> output yet — that is intentionally a future phase.
export interface SEOFields {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  keywords: string[];
  canonicalUrl: string;
}
