import type { NavLink, FooterSection } from "@/types";
import { SOCIAL_LINKS as SOCIAL_LINKS_DATA } from "@/data/social";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    heading: "Navigation",
    links: [
      { label: "Work", href: "/work" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Web Development", href: "/services#web-development" },
      { label: "App Development", href: "/services#app-development" },
      { label: "Photography", href: "/services#photography" },
      { label: "Videography", href: "/services#videography" },
    ],
  },
  {
    heading: "Connect",
    links: SOCIAL_LINKS_DATA.map((s) => ({ label: s.platform, href: s.href })),
  },
];

// Re-exported for any UI that wants the raw social links (with icon names)
// rather than the NavLink shape used in the footer.
export const SOCIAL_LINKS: NavLink[] = SOCIAL_LINKS_DATA.map((s) => ({
  label: s.platform,
  href: s.href,
}));
