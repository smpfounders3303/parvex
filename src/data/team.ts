import type { TeamMember } from "@/types";

// Placeholder roster — swap in real names, photos, and bios when available.
// Photos should live in /public/assets/team/.
export const TEAM: TeamMember[] = [
  {
    id: "founder-engineering",
    name: "Add Name",
    role: "Founder & Engineering Lead",
    photo: "/assets/team/founder.jpg",
    photoAlt: "Portrait of the Parvex founder and engineering lead",
    bio: "Leads product strategy and engineering across every Parvex build.",
    socialLinks: [{ platform: "LinkedIn", href: "#" }],
  },
  {
    id: "creative-lead",
    name: "Add Name",
    role: "Creative & Visual Lead",
    photo: "/assets/team/creative-lead.jpg",
    photoAlt: "Portrait of the Parvex creative and visual lead",
    bio: "Directs photography, videography, and visual identity work.",
    socialLinks: [{ platform: "Instagram", href: "#" }],
  },
];
