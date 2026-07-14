export interface Feature {
  id: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  bio?: string;
  socialLinks?: { platform: string; href: string }[];
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: string;
  photoAlt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Technology {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Animation" | "Media" | "DevOps" | "Tooling";
  icon?: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  /** Lucide icon name, resolved by the component that renders it. */
  icon?: string;
}

export interface Company {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  email: string;
  phone?: string;
  address?: string;
  founded: string;
  socialLinks: SocialLink[];
}
