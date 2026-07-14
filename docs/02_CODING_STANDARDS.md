# PARVEX — CODING STANDARDS

Version: 1.0

---

# DEVELOPMENT PHILOSOPHY

Write code like a senior software engineer.

Every file should be:

• Clean
• Readable
• Reusable
• Scalable
• Production Ready

Avoid quick fixes.

Avoid hacks.

Avoid unnecessary complexity.

Quality is always more important than speed.

---

# TECH STACK

Frontend

• Next.js 15 (App Router)
• React 19
• TypeScript
• Tailwind CSS
• Shadcn/UI

Animations

• GSAP
• Framer Motion
• Lenis

Backend

• Node.js
• Express.js
• Prisma
• PostgreSQL

Authentication

• Better Auth

Media

• Cloudinary

Forms

• React Hook Form
• Zod

Email

• Resend

Deployment

• Vercel
• GitHub
• Cloudflare

Analytics

• Google Analytics
• Microsoft Clarity
• Vercel Analytics

---

# PROJECT STRUCTURE

/app

/components

/features

/hooks

/lib

/utils

/types

/constants

/services

/providers

/context

/styles

/public

/assets

/prisma

/emails

---

# COMPONENT STRUCTURE

Every component must have one responsibility.

Example

Button

Navbar

Hero

ProjectCard

Gallery

Footer

Avoid giant components.

---

# FILE SIZE

Ideal

100–250 lines

Maximum

400 lines

If larger

Split into smaller components.

---

# FOLDER ORGANIZATION

Example

/components

/ui

/layout

/home

/services

/projects

/shared

Keep components grouped by feature.

---

# NAMING CONVENTION

Components

PascalCase

Hero.tsx

Navbar.tsx

ProjectCard.tsx

Hooks

camelCase

useCursor.ts

useScroll.ts

Utils

camelCase

formatDate.ts

slugify.ts

Constants

UPPER_CASE

ROUTES

COLORS

---

# IMPORT ORDER

1.

React

2.

Next.js

3.

External Libraries

4.

Internal Components

5.

Hooks

6.

Utils

7.

Types

8.

Styles

Always keep imports organized.

---

# TYPESCRIPT

Always use TypeScript.

Never use any.

Create proper interfaces.

Use strict typing.

Prefer interfaces over types for objects.

Never disable TypeScript errors.

---

# PROPS

Always define interfaces.

Example

interface HeroProps {

title: string

description: string

}

Never use implicit props.

---

# STATE MANAGEMENT

Prefer local state.

Use Context only when necessary.

Avoid unnecessary global state.

Do not introduce Redux.

---

# CUSTOM HOOKS

Move reusable logic into hooks.

Examples

useScroll

useCursor

useWindowSize

useMousePosition

Keep hooks reusable.

---

# UTILITIES

Never duplicate utility functions.

Place reusable helpers inside /utils.

Examples

formatCurrency

truncateText

debounce

clamp

---

# CONSTANTS

Move repeated values into constants.

Examples

Navigation Links

Routes

Animation Durations

Colors

Breakpoints

Never hardcode repeatedly.

---

# STYLING

Use Tailwind only.

Avoid inline styles.

Avoid custom CSS unless absolutely necessary.

Prefer utility classes.

---

# CLASS MANAGEMENT

Use clsx or cn() helper.

Never create unreadable class strings.

Group related classes logically.

---

# RESPONSIVE

Desktop First

Tablet

Mobile

Never ignore tablet.

Test all layouts.

---

# ACCESSIBILITY

Semantic HTML

Keyboard Navigation

Alt Text

ARIA Labels

Visible Focus

Accessible Forms

---

# PERFORMANCE

Lazy load heavy components.

Use dynamic imports.

Optimize images.

Avoid unnecessary re-renders.

Memoize expensive calculations.

Use Suspense when appropriate.

---

# IMAGES

Always use Next/Image.

Never use img tag unless required.

Optimize dimensions.

Lazy load by default.

---

# ICONS

Use Lucide React.

Avoid multiple icon libraries.

Keep icon sizes consistent.

---

# FONTS

Use next/font.

Never import Google Fonts manually.

Optimize loading.

---

# FORMS

Use

React Hook Form

+

Zod

Every form must include:

Validation

Loading State

Error State

Success State

---

# API

Separate API logic.

Never fetch directly inside large components.

Use services folder.

Example

/services/contact.ts

/services/projects.ts

---

# DATABASE

Never write raw SQL unless necessary.

Use Prisma.

Keep schema clean.

---

# AUTHENTICATION

Use Better Auth.

Keep authentication isolated.

Never mix auth logic into UI components.

---

# EMAILS

Use Resend.

Create reusable email templates.

Store inside

/emails

---

# CLOUDINARY

All media must come from Cloudinary.

Never store uploaded assets inside the repository.

---

# SEO

Every page needs

Title

Description

OpenGraph

Twitter Card

Canonical URL

Structured Data (Future)

---

# ANIMATIONS

GSAP

Hero

Scroll

Text Reveal

Image Reveal

Page Transition

Framer Motion

Buttons

Cards

Hover

Drawer

Modal

Lenis

Smooth Scrolling

Do not mix animation libraries unnecessarily.

---

# ERROR HANDLING

Handle loading.

Handle errors.

Handle empty states.

Never assume data always exists.

---

# LOGGING

No console.log in production.

Use proper error handling.

---

# COMMENTS

Write self-documenting code.

Comment only when logic is complex.

Avoid obvious comments.

---

# REUSABILITY

If code is repeated twice

Consider abstraction.

If repeated three times

Create reusable component.

---

# GIT

Small commits.

Meaningful commit messages.

One feature per commit.

---

# CODE REVIEW CHECKLIST

Before completing any feature ask:

✓ Is the code reusable?

✓ Is TypeScript strict?

✓ Is performance optimized?

✓ Is accessibility respected?

✓ Is responsive complete?

✓ Is folder structure clean?

✓ Is naming consistent?

✓ Is unnecessary code removed?

✓ Is duplicate logic eliminated?

✓ Is this production ready?

---

# AI DEVELOPMENT RULES

The AI must NEVER

Generate unnecessary files.

Duplicate components.

Write placeholder code.

Overengineer simple features.

Install unnecessary packages.

Create dead code.

Ignore responsiveness.

Ignore accessibility.

Ignore performance.

---

# AI OUTPUT FORMAT

Before coding

Explain architecture.

Explain folder placement.

Explain why components are separated.

Then write production-quality code.

Do not write pseudo code.

Do not skip typing.

Do not leave TODO comments.

Every output should be ready to paste into the project.

---

# FINAL GOAL

The codebase should feel like it was built by a professional product team.

Every developer joining the project should immediately understand the structure.

Every component should be easy to maintain.

Every page should be scalable.

Every line of code should have a purpose.