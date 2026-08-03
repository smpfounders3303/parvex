/**
 * One-time seed / migration script.
 *
 *   npm run db:seed
 *
 * Safe to re-run: every step checks for existing records first so it never
 * duplicates data or clobbers content already edited through the Admin CMS.
 *
 * Migrates:
 *   - PROJECTS (src/data/projects.ts)   -> Project + related tables
 *   - SERVICES (src/data/services.ts)   -> Service
 *   - Sensible PageContent defaults for Homepage/Work/Services/Contact
 *   - Default Setting + AnalyticsConfig singletons
 *   - Initial SUPER_ADMIN user (PARVEX_INITIAL_ADMIN_EMAIL / _PASSWORD env vars)
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { PROJECTS } from "../src/data/projects";
import { SERVICES } from "../src/data/services";
import { COMPANY } from "../src/data/company";

const prisma = new PrismaClient();

// Existing static assets (local /public paths or external URLs) are recorded
// as "external" media so no Cloudinary credentials are required just to run
// the one-time migration. New uploads made through the Admin Media Library
// always go through Cloudinary — see src/lib/storage/media-service.ts.
async function upsertExternalMedia(url: string, altText: string) {
  return prisma.media.upsert({
    where: { publicId: `external:${url}` },
    update: {},
    create: {
      type: "IMAGE",
      category: "PROJECT",
      provider: "external",
      publicId: `external:${url}`,
      url,
      filename: url.split("/").pop() ?? "asset",
      mimeType: "image/jpeg",
      bytes: 0,
      altText,
    },
  });
}

async function seedProjects() {
  console.log(`Migrating ${PROJECTS.length} project(s)...`);

  for (const [index, p] of PROJECTS.entries()) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`  - skip "${p.slug}" (already migrated)`);
      continue;
    }

    const cover = await upsertExternalMedia(p.coverImage, p.coverImageAlt);
    const thumb = await upsertExternalMedia(p.thumbnail, p.thumbnailAlt);

    await prisma.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        category: p.category,
        year: p.year,
        clientType: p.client?.toLowerCase().includes("internal") ? "INTERNAL" : "CLIENT",
        clientName: p.client,
        deliveryStatus:
          p.status === "Live" ? "LIVE" : p.status === "In Progress" ? "IN_PROGRESS" : "CONCEPT",
        duration: p.duration,
        description: p.description,
        coverImageId: cover.id,
        thumbnailId: thumb.id,
        services: p.services ?? [],
        challenge: p.challenge,
        solution: p.solution,
        research: p.research,
        development: p.development,
        displayOrder: index,
        status: "PUBLISHED",
        publishedAt: new Date(),
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        canonicalUrl: p.canonicalUrl,
        technology: {
          create: p.technology.map((t, i) => ({ name: t.name, category: t.category, order: i })),
        },
        results: {
          create: p.results.map((r, i) => ({
            metric: r.metric,
            value: r.value,
            description: r.description,
            order: i,
          })),
        },
      },
    });

    // Gallery images need their own Media rows first.
    for (const [gi, g] of p.gallery.entries()) {
      const media = await upsertExternalMedia(g.src, g.alt);
      await prisma.projectGalleryImage.create({
        data: {
          projectId: (await prisma.project.findUniqueOrThrow({ where: { slug: p.slug } })).id,
          mediaId: media.id,
          aspect: g.aspect,
          order: gi,
        },
      });
    }

    console.log(`  + migrated "${p.slug}"`);
  }
}

async function seedServices() {
  console.log(`Migrating ${SERVICES.length} service(s)...`);

  for (const [index, s] of SERVICES.entries()) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug ?? s.id } });
    if (existing) {
      console.log(`  - skip "${s.slug}" (already migrated)`);
      continue;
    }

    await prisma.service.create({
      data: {
        slug: s.slug ?? s.id,
        number: s.number,
        title: s.title,
        description: s.description,
        longDescription: s.longDescription,
        deliverables: s.deliverables ?? [],
        outcome: s.outcome,
        order: index,
        published: true,
        metaTitle: s.metaTitle,
        metaDescription: s.metaDescription,
        keywords: s.keywords ?? [],
        canonicalUrl: s.canonicalUrl,
      },
    });
    console.log(`  + migrated "${s.slug}"`);
  }
}

async function seedPageContent() {
  await prisma.pageContent.upsert({
    where: { page: "HOMEPAGE" },
    update: {},
    create: {
      page: "HOMEPAGE",
      heroEyebrow: "Digital Experience Studio",
      heroHeadline: "Beyond Excellence.",
      heroSupportingCopy: COMPANY.description,
      primaryCtaLabel: "Start a Project",
      primaryCtaLink: "/contact",
      selectedWorkHeading: "Selected Work",
      servicesHeading: "What We Do",
      photographyHeading: "Photography & Film",
      finalCtaHeadline: "Let's build something exceptional.",
      finalCtaLabel: "Get in Touch",
      finalCtaLink: "/contact",
    },
  });

  await prisma.pageContent.upsert({
    where: { page: "WORK" },
    update: {},
    create: { page: "WORK", heroHeadline: "Our Work" },
  });

  await prisma.pageContent.upsert({
    where: { page: "SERVICES" },
    update: {},
    create: { page: "SERVICES", heroHeadline: "Services" },
  });

  await prisma.pageContent.upsert({
    where: { page: "CONTACT" },
    update: {},
    create: {
      page: "CONTACT",
      heroHeadline: "Let's Talk",
      heroSupportingCopy: "Tell us about your project and we'll get back to you within 24 hours.",
    },
  });

  console.log("Seeded default PageContent for Homepage/Work/Services/Contact.");
}

async function seedSettings() {
  await prisma.setting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      companyName: COMPANY.name,
      tagline: COMPANY.tagline,
      primaryEmail: COMPANY.email,
      contactEmail: COMPANY.email,
      availabilityStatus: "Available for new projects",
      responseTime: "Within 24 hours",
      linkedin: COMPANY.socialLinks.find((s) => s.platform.toLowerCase() === "linkedin")?.href,
      instagram: COMPANY.socialLinks.find((s) => s.platform.toLowerCase() === "instagram")?.href,
      github: COMPANY.socialLinks.find((s) => s.platform.toLowerCase() === "github")?.href,
    },
  });

  await prisma.analyticsConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  console.log("Seeded Settings and AnalyticsConfig.");
}

async function seedSuperAdmin() {
  const email = process.env.PARVEX_INITIAL_ADMIN_EMAIL;
  const password = process.env.PARVEX_INITIAL_ADMIN_PASSWORD;
  const name = process.env.PARVEX_INITIAL_ADMIN_NAME ?? "Parvex Admin";

  if (!email || !password) {
    console.warn(
      "\nSkipping initial SUPER_ADMIN — set PARVEX_INITIAL_ADMIN_EMAIL and PARVEX_INITIAL_ADMIN_PASSWORD (12+ chars) in your environment and re-run `npm run db:seed` to create it.\n"
    );
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`SUPER_ADMIN "${email}" already exists — skipping.`);
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role: "SUPER_ADMIN",
      emailVerified: true,
    },
  });

  const hashed = await hashPassword(password);
  await prisma.account.create({
    data: {
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: hashed,
    },
  });

  console.log(`Created initial SUPER_ADMIN: ${email}`);
}

async function main() {
  await seedSuperAdmin();
  await seedSettings();
  await seedPageContent();
  await seedServices();
  await seedProjects();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
