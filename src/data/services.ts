import type { Service } from "@/types";

export const SERVICES: Service[] = [
  {
    id: "web-development",
    number: "01",
    title: "Web Development",
    description:
      "Full-stack digital products engineered for performance, reliability, and growth. Built to last.",
    longDescription:
      "We design and build production-grade web platforms end to end — from information architecture to deployment — using Next.js, TypeScript, and modern infrastructure.",
    deliverables: ["Product strategy", "UI/UX design", "Frontend & backend engineering", "Deployment & monitoring"],
    outcome: "A site that turns visitors into clients.",
    slug: "web-development",
    metaTitle: "Web Development — Parvex",
    metaDescription: "Full-stack web development for startups and growing businesses, built on Next.js and modern infrastructure.",
    ogImage: "/assets/services/web-development-og.jpg",
    keywords: ["web development", "Next.js development", "full-stack engineering"],
    canonicalUrl: "https://parvex.in/services/web-development",
  },
  {
    id: "app-development",
    number: "02",
    title: "App Development",
    description:
      "Native and cross-platform applications that people actually enjoy using — on iOS and Android.",
    longDescription:
      "From product definition to App Store release, we build mobile experiences that feel native, perform well, and are built to scale with your user base.",
    deliverables: ["Product definition", "Cross-platform engineering", "App Store / Play Store launch", "Post-launch support"],
    outcome: "An app your users actually open twice.",
    slug: "app-development",
    metaTitle: "App Development — Parvex",
    metaDescription: "Native and cross-platform mobile app development for iOS and Android.",
    ogImage: "/assets/services/app-development-og.jpg",
    keywords: ["app development", "mobile app studio", "iOS development", "Android development"],
    canonicalUrl: "https://parvex.in/services/app-development",
  },
  {
    id: "ai-products",
    number: "03",
    title: "AI Products",
    description:
      "Intelligent tools and workflows that make your product faster, smarter, and genuinely useful.",
    longDescription:
      "We integrate AI where it earns its place — automation, retrieval, and intelligent workflows — without it becoming a gimmick layered on top of your product.",
    deliverables: ["AI feasibility scoping", "Model integration", "Workflow automation", "Evaluation & guardrails"],
    slug: "ai-products",
    metaTitle: "AI Product Development — Parvex",
    metaDescription: "AI-powered tools and workflows built into real products, not bolted on as a gimmick.",
    ogImage: "/assets/services/ai-products-og.jpg",
    keywords: ["AI product development", "AI integration", "LLM products"],
    canonicalUrl: "https://parvex.in/services/ai-products",
  },
  {
    id: "photography",
    number: "04",
    title: "Photography",
    description:
      "Editorial and commercial photography that captures the truth of your brand — nothing staged.",
    longDescription:
      "Our photography work covers product, brand, and editorial shoots, delivered with the same attention to composition and light as the references that inspire us.",
    deliverables: ["Concept & shot list", "On-location or studio shoot", "Editing & color grading", "Delivery in web & print formats"],
    outcome: "Images that make your brand look as good as it is.",
    slug: "photography",
    metaTitle: "Photography — Parvex",
    metaDescription: "Editorial and commercial photography for brands that care about how they're seen.",
    ogImage: "/assets/services/photography-og.jpg",
    keywords: ["commercial photography", "editorial photography", "brand photography"],
    canonicalUrl: "https://parvex.in/services/photography",
  },
  {
    id: "videography",
    number: "05",
    title: "Videography",
    description:
      "Cinematic production from concept to final frame. Every story, told with intention.",
    longDescription:
      "From brand films to product launches, we handle the full production pipeline — concept, shoot, and edit — so every frame supports the story you're telling.",
    deliverables: ["Concept & scripting", "Production & direction", "Editing & color grading", "Sound design"],
    outcome: "A story people watch all the way through.",
    slug: "videography",
    metaTitle: "Videography — Parvex",
    metaDescription: "Cinematic video production for brand films, product launches, and commercial work.",
    ogImage: "/assets/services/videography-og.jpg",
    keywords: ["video production", "videography studio", "brand film production"],
    canonicalUrl: "https://parvex.in/services/videography",
  },
];
