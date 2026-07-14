import type { CaseStudyProject, Project } from "@/types";

/**
 * PARVEX — Master project data store.
 *
 * Adding a new project = adding one object to this array.
 * The Work page, Work grid, and every case study page auto-generate from this data.
 * No UI files need to be touched.
 */
export const PROJECTS: CaseStudyProject[] = [
  {
    slug: "auditgpt",
    title: "AuditGPT",
    category: "AI Product",
    year: "2024",
    client: "Internal / SaaS",
    status: "Live",
    duration: "14 weeks",
    description:
      "An AI-powered compliance auditing tool that reduces manual review time by 80%. Built for financial teams who cannot afford errors.",
    coverImage:
      "/assets/projects/auditgpt.png",
    coverImageAlt: "AuditGPT — AI compliance auditing dashboard",
    thumbnail:
      "/assets/projects/auditgpt.png",
    thumbnailAlt: "AuditGPT project thumbnail",
    services: ["Product Strategy", "UI/UX Design", "Web Development", "AI Integration"],
    challenge:
      "Financial teams were spending entire weeks manually cross-referencing regulatory documents for compliance gaps — a process that was slow, repetitive, and deeply prone to human error at scale. As document volumes grew, the problem compounded: more reviewers, more time, but still no guarantee of complete coverage. The team needed a fundamentally different approach, not just a faster version of the same manual process.",
    solution:
      "We built an AI auditing layer that reads, indexes, and flags inconsistencies across large document sets in minutes. The system uses large language models to understand context across hundreds of pages simultaneously, surfacing only the items that need human judgment. The interface was designed around trust — every flag is explained, traceable, and can be overridden with a reason. The goal was confidence, not blind automation.",
    research:
      "Before writing a line of code, we spent three weeks embedded with compliance officers at two financial firms. We mapped their existing review workflows step by step, identifying the exact moments where errors crept in and where reviewers felt most uncertain. We found that the core anxiety was not speed but accountability — reviewers feared missing something and being blamed for it. That insight shaped everything: the AI would not replace the reviewer but give them a defensible paper trail for every decision they made.",
    development:
      "We structured development in three layers. First, the ingestion pipeline: PDF parsing, OCR fallback for scanned documents, and a chunked embedding store using pgvector. Second, the analysis layer: a fine-tuned prompt chain that compares document sections against a curated rulebook, returning structured JSON with confidence scores and source citations. Third, the review interface: a split-panel editor where flagged items appear inline with their rationale, and reviewers can accept, reject, or escalate. Each layer was shipped as an independent service so they could be tested and scaled separately.",
    technology: [
      { name: "Next.js 15", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
      { name: "PostgreSQL", category: "Database" },
      { name: "pgvector", category: "Database" },
      { name: "Prisma", category: "ORM" },
      { name: "OpenAI API", category: "AI" },
      { name: "Cloudinary", category: "Media" },
      { name: "Vercel", category: "Deployment" },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85&auto=format&fit=crop",
        alt: "AuditGPT dashboard overview",
        aspect: "landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=85&auto=format&fit=crop",
        alt: "Document analysis interface",
        aspect: "portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=85&auto=format&fit=crop",
        alt: "Compliance flag review panel",
        aspect: "landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=85&auto=format&fit=crop",
        alt: "Data visualization and reporting",
        aspect: "square",
      },
    ],
    results: [
      {
        metric: "Review time",
        value: "−80%",
        description: "Manual review time dropped by 80%, allowing teams to handle significantly more volume.",
      },
      {
        metric: "Coverage",
        value: "100%",
        description: "Every document section is checked against every rule — no items fall through the gaps.",
      },
      {
        metric: "Confidence",
        value: "High",
        description: "Every flag is explained and traceable, giving reviewers a defensible audit trail.",
      },
    ],
    nextProject: "resume-analyzer",
  },

  {
    slug: "resume-analyzer",
    title: "Resume Analyzer",
    category: "AI Product",
    year: "2024",
    client: "HR Tech / SaaS",
    status: "Live",
    duration: "10 weeks",
    description:
      "Intelligent screening at scale. Matches candidates to roles using contextual understanding, not just keywords.",
    coverImage:
      "/assets/projects/resume-analyzer.png",
    coverImageAlt: "Resume Analyzer — AI recruitment screening interface",
    thumbnail:
      "/assets/projects/resume-analyzer.png",
    thumbnailAlt: "Resume Analyzer project thumbnail",
    services: ["Product Strategy", "UI/UX Design", "Web Development", "AI Integration"],
    challenge:
      "Keyword-based applicant tracking systems were systematically filtering out strong candidates simply because their resumes used different phrasing than the job description. A senior engineer who wrote 'built distributed systems' would be rejected if the job posting said 'microservices architecture.' Recruiters knew this was happening but had no alternative — manually reviewing hundreds of applications was not scalable.",
    solution:
      "We designed a contextual matching engine that understands skills and experience semantically, not syntactically. The system embeds both the job description and each resume into the same vector space, then ranks candidates by genuine conceptual fit rather than exact string overlap. Recruiters see a ranked list with clear explanations of why each candidate was ranked where they were — making the process transparent and auditable.",
    research:
      "We interviewed eight recruiters across technology, finance, and healthcare to understand how screening decisions were actually being made. The consistent finding: recruiters trusted their gut more than their ATS, often manually reviewing candidates the system had filtered out when something felt off. The product opportunity was not to automate the recruiter's judgment but to make their instincts scalable — giving them a tool that surfaced the same candidates they would have found manually, just faster.",
    development:
      "The core of the system is a two-stage pipeline. In stage one, both the job description and each resume are processed through a shared embedding model, producing dense vectors that capture semantic meaning. In stage two, cosine similarity scores are computed across all candidates and normalized into a 0–100 fit score. A secondary LLM pass generates the natural-language explanations that accompany each score. The frontend is a clean list view with expandable candidate cards, built to handle batches of up to 500 resumes without pagination.",
    technology: [
      { name: "React", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
      { name: "PostgreSQL", category: "Database" },
      { name: "OpenAI API", category: "AI" },
      { name: "Pinecone", category: "Vector DB" },
      { name: "Vercel", category: "Deployment" },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=85&auto=format&fit=crop",
        alt: "Candidate ranking dashboard",
        aspect: "landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=85&auto=format&fit=crop",
        alt: "Resume analysis detail view",
        aspect: "portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=85&auto=format&fit=crop",
        alt: "Job description matching interface",
        aspect: "landscape",
      },
    ],
    results: [
      {
        metric: "Screening time",
        value: "−70%",
        description: "Recruiting teams cut initial screening time significantly across all roles.",
      },
      {
        metric: "Candidate quality",
        value: "+45%",
        description: "More qualified candidates surfaced per role compared to keyword-based filtering.",
      },
      {
        metric: "False negatives",
        value: "Near zero",
        description: "Strong candidates are no longer filtered out due to phrasing differences.",
      },
    ],
    nextProject: "movie-ticket",
  },

  {
    slug: "movie-ticket",
    title: "Movie Ticket Booking",
    category: "Web Development",
    year: "2023",
    client: "Entertainment / B2C",
    status: "Live",
    duration: "8 weeks",
    description:
      "A seamless seat-selection and ticketing experience. Zero friction from browse to booking confirmation.",
    coverImage:
      "/assets/projects/movie-ticket.png",
    coverImageAlt: "Movie Ticket Booking — seat selection interface",
    thumbnail:
      "/assets/projects/movie-ticket.png",
    thumbnailAlt: "Movie Ticket Booking project thumbnail",
    services: ["UI/UX Design", "Web Development", "Payment Integration"],
    challenge:
      "Existing booking flows buried seat selection behind multiple registration screens and redundant confirmation steps, causing significant drop-off right before payment — the moment that mattered most. On release days for high-demand films, the combination of poor UX and slow server responses meant many customers gave up and went elsewhere. The business was losing revenue not from lack of demand but from a broken purchase experience.",
    solution:
      "We rebuilt the entire booking flow around a single, fast seat-map interaction. Date selection, showtime, and seat availability are all visible on one screen. The checkout is collapsed into as few steps as the experience allows — for returning users, it is a single click. Real-time availability updates prevent the frustration of selecting a seat that is already taken. The result is a flow that respects the user's time and removes every unnecessary decision.",
    research:
      "We ran usability sessions with twelve frequent moviegoers, recording their attempts to book tickets on three competing platforms. The session data was unambiguous: users abandoned bookings when they encountered unexpected registration requirements mid-flow, when seat maps were slow to load, or when the number of steps to checkout exceeded five. We used these findings to define a strict constraint for the new experience: every user should be able to go from landing to confirmation in under two minutes.",
    development:
      "The seat map is rendered as an SVG component with real-time WebSocket updates, ensuring availability data is always current. Seat status changes are broadcast server-side and applied client-side without a full page reload. Payment is handled through Stripe Elements, which loads asynchronously so it never blocks the seat selection experience. The backend is a Next.js API layer backed by PostgreSQL with optimistic locking on seat reservations to handle concurrent requests during high-traffic release windows.",
    technology: [
      { name: "Next.js 15", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "PostgreSQL", category: "Database" },
      { name: "Prisma", category: "ORM" },
      { name: "Stripe", category: "Payments" },
      { name: "WebSockets", category: "Real-time" },
      { name: "Vercel", category: "Deployment" },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=85&auto=format&fit=crop",
        alt: "Movie browsing and showtime selection",
        aspect: "landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=85&auto=format&fit=crop",
        alt: "Seat map interface",
        aspect: "portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&q=85&auto=format&fit=crop",
        alt: "Checkout and payment flow",
        aspect: "landscape",
      },
    ],
    results: [
      {
        metric: "Time to book",
        value: "< 2 min",
        description: "Average time from landing to confirmation, down from 8+ minutes on the old flow.",
      },
      {
        metric: "Drop-off rate",
        value: "−60%",
        description: "Booking abandonment dropped significantly after the redesigned flow launched.",
      },
      {
        metric: "Peak load",
        value: "10k req/min",
        description: "The system handles high-traffic release days without degradation.",
      },
    ],
    nextProject: "photography-showcase",
  },

  {
    slug: "photography-showcase",
    title: "Photography Showcase",
    category: "Creative / Photography",
    year: "2024",
    client: "Creative Studio",
    status: "Live",
    duration: "6 weeks",
    description:
      "An editorial photography portfolio built to communicate visual quality without competing with it.",
    coverImage:
      "/assets/projects/photography-showcase.png",
    coverImageAlt: "Photography Showcase — editorial portfolio",
    thumbnail:
      "/assets/projects/photography-showcase.png",
    thumbnailAlt: "Photography Showcase project thumbnail",
    services: ["Creative Direction", "UI/UX Design", "Web Development"],
    challenge:
      "Most photography portfolios fall into one of two traps: either they are so minimal that the photography has no context, or they are so designed that the UI competes with the images themselves. The client had a strong body of work spanning portraiture, landscape, and commercial photography — but no way to present it that felt as considered as the photographs themselves.",
    solution:
      "We designed a layout system that treats whitespace as the primary design element. Every gallery view gives images room to breathe. Navigation is invisible until needed. The typography is restrained to the point of near-absence. The result is a portfolio where the first thing a visitor notices is always the photography — not the website.",
    research:
      "We audited forty photography portfolio websites, categorizing each by how they balanced UI presence against image presence. The correlation was striking: the portfolios that felt most premium were consistently the ones where the UI was least visible. We also interviewed five photography clients on what they noticed first when evaluating a photographer's work online. The unanimous answer: the quality and cohesion of the images. The website's job, they said, was to stay out of the way.",
    development:
      "The gallery is built on a custom masonry layout that adapts to image aspect ratios rather than forcing all images into a rigid grid. Images are loaded progressively — a low-resolution blur placeholder appears immediately, then the full-resolution image fades in once loaded. A lightbox mode allows full-screen viewing with keyboard navigation. All images are served through Cloudinary with automatic format detection (WebP for supporting browsers, JPEG fallback) and responsive srcsets at five breakpoints.",
    technology: [
      { name: "Next.js 15", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Cloudinary", category: "Media" },
      { name: "Framer Motion", category: "Animation" },
      { name: "Vercel", category: "Deployment" },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=1200&q=85&auto=format&fit=crop",
        alt: "Portrait photography series",
        aspect: "landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85&auto=format&fit=crop",
        alt: "Landscape photography collection",
        aspect: "portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=1200&q=85&auto=format&fit=crop",
        alt: "Commercial photography work",
        aspect: "landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=85&auto=format&fit=crop",
        alt: "Gallery layout system",
        aspect: "square",
      },
    ],
    results: [
      {
        metric: "Engagement",
        value: "+120%",
        description: "Average session time doubled after launch compared to the previous portfolio.",
      },
      {
        metric: "Inquiries",
        value: "+85%",
        description: "Client inquiry volume increased significantly in the first month post-launch.",
      },
      {
        metric: "Load time",
        value: "< 1.2s",
        description: "LCP under 1.2 seconds despite serving large, high-resolution images.",
      },
    ],
    nextProject: "videography-showcase",
  },

  {
    slug: "videography-showcase",
    title: "Videography Showcase",
    category: "Creative / Videography",
    year: "2024",
    client: "Creative Studio",
    status: "Live",
    duration: "7 weeks",
    description:
      "A video portfolio that loads instantly, plays smoothly, and communicates craft before a single frame finishes.",
    coverImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=90&auto=format&fit=crop",
    coverImageAlt: "Videography Showcase — video portfolio platform",
    thumbnail:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=85&auto=format&fit=crop",
    thumbnailAlt: "Videography Showcase project thumbnail",
    services: ["Creative Direction", "UI/UX Design", "Web Development", "Video Optimization"],
    challenge:
      "Video portfolios are notoriously difficult to get right on the web. Load times are slow, autoplay is unreliable across browsers, and embedding third-party players introduces visual inconsistency and tracking concerns. The client needed a portfolio that communicated the quality of their video work without making visitors wait, and without the visual interruption of a YouTube or Vimeo player appearing mid-page.",
    solution:
      "We built a custom video presentation system using optimized preview clips that autoplay silently on hover, with a full-screen modal player that launches on click. Preview clips are short (8–12 seconds), heavily compressed WebM files that load in under a second even on mobile connections. The full player uses the browser's native video element with a custom UI layer, eliminating the need for third-party embeds entirely.",
    research:
      "We tested video loading behavior across six devices and four connection speeds to establish what viewers actually tolerated before abandoning. The finding: on mobile 4G, users gave videos approximately 3 seconds to begin playing before scrolling past. On desktop, the threshold was slightly higher but not dramatically so. We used these numbers to define hard performance budgets for every video on the site, and built the encoding pipeline around meeting those budgets at acceptable quality.",
    development:
      "The encoding pipeline uses FFmpeg to produce three video variants for each project: a preview clip (WebM, ~200KB), a standard-quality full version (MP4 + WebM, ~15MB), and a high-quality full version (~60MB) served only when the connection supports it. Cloudinary handles hosting and CDN delivery. The custom player component tracks viewing progress, supports keyboard shortcuts, and handles the edge cases that native controls often miss — particularly on iOS where autoplay behavior differs from every other platform.",
    technology: [
      { name: "Next.js 15", category: "Frontend" },
      { name: "TypeScript", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Cloudinary", category: "Media" },
      { name: "FFmpeg", category: "Video Processing" },
      { name: "Framer Motion", category: "Animation" },
      { name: "Vercel", category: "Deployment" },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=85&auto=format&fit=crop",
        alt: "Video production showcase",
        aspect: "landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800&q=85&auto=format&fit=crop",
        alt: "Behind the scenes footage",
        aspect: "portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1603850096583-cf1a89ca6889?w=1200&q=85&auto=format&fit=crop",
        alt: "Custom video player interface",
        aspect: "landscape",
      },
    ],
    results: [
      {
        metric: "Preview load",
        value: "< 1s",
        description: "Preview clips load in under one second on 4G connections across all devices.",
      },
      {
        metric: "Completion rate",
        value: "78%",
        description: "78% of visitors who open a full video watch it to completion.",
      },
      {
        metric: "Third-party scripts",
        value: "Zero",
        description: "No external embeds. No tracking pixels. No visual inconsistency.",
      },
    ],
    nextProject: "auditgpt",
  },
];

/**
 * Get a single project by slug.
 * Returns undefined if not found — caller should handle 404.
 */
export function getProjectBySlug(slug: string): CaseStudyProject | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/**
 * Get the next project in the sequence.
 */
export function getNextProject(currentSlug: string): CaseStudyProject | undefined {
  const current = getProjectBySlug(currentSlug);
  if (!current) return undefined;
  return getProjectBySlug(current.nextProject);
}

/**
 * Get all project slugs — used for generateStaticParams.
 */
export function getAllProjectSlugs(): string[] {
  return PROJECTS.map((p) => p.slug);
}

/**
 * Derive the lightweight "Project" card shape (used by the homepage and
 * FeaturedWork) from the single source of truth above, instead of keeping a
 * second, manually-duplicated content array in sync by hand.
 *
 * `spans` lets callers control the asymmetric grid layout without baking
 * layout concerns into the content model itself.
 */
const FEATURED_SLUGS = ["auditgpt", "resume-analyzer", "movie-ticket", "photography-showcase"];
const FEATURED_SPANS: Project["span"][] = ["large", "small", "small", "large"];

export function getFeaturedProjects(): Project[] {
  return FEATURED_SLUGS.map((slug, index) => {
    const project = getProjectBySlug(slug);
    if (!project) {
      throw new Error(`getFeaturedProjects: no project found for slug "${slug}"`);
    }
    return {
      id: project.slug,
      category: project.category,
      title: project.title,
      description: project.description,
      imageSrc: project.coverImage,
      imageAlt: project.coverImageAlt,
      span: FEATURED_SPANS[index],
      technologies: project.technology.map((t) => t.name),
      challenge: project.challenge,
      solution: project.solution,
      outcome: project.results[0]?.description ?? project.solution,
    };
  });
}

/** Backward-compatible eagerly-evaluated export for simple call sites. */
export const FEATURED_PROJECTS: Project[] = getFeaturedProjects();
