import type { SEOFields } from "./seo";

export interface Service extends Partial<SEOFields> {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Longer-form copy for a future dedicated /services/[slug] page. */
  longDescription?: string;
  deliverables?: string[];
  /** Short, business-value outcome shown on the /services page cards. */
  outcome?: string;
}
