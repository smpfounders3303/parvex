# PARVEX — COMPONENT LIBRARY

Version 1.0

---

# PURPOSE

Every reusable UI component in the project must follow this design language.

The goal is consistency.

Every page should feel like it belongs to the same product.

---

# COMPONENT PRINCIPLES

Every component must be

• Reusable

• Responsive

• Accessible

• Scalable

• Easy to customize

• Production Ready

Never create page-specific UI if it can become reusable.

---

# SECTION STRUCTURE

Every page follows

Section

↓

Container

↓

Content

↓

CTA

↓

Spacing

Keep this consistent everywhere.

---

# CONTAINER

Use one shared Container component.

Responsibilities

Maximum Width

Horizontal Padding

Responsive Layout

Never redefine container widths inside pages.

---

# SECTION

Every section uses the same wrapper.

Responsibilities

Top Padding

Bottom Padding

Background

Spacing

Animation Wrapper (Future)

---

# BUTTONS

Only three button variants.

Primary

Solid

Rounded

Large

Used for

Contact

Start Project

View Work

Secondary

Outline

Rounded

Used for

Learn More

Read Case Study

Ghost

Minimal

Navigation

Footer

Never create random button styles.

---

# NAVBAR

Reusable component.

Contains

Logo

Navigation

CTA Button

Mobile Menu

Transparent on top.

Solid after scrolling.

Sticky.

Simple.

Minimal.

---

# HERO

Most important component.

Contains

Headline

Description

Primary CTA

Secondary CTA

Visual Area

Must immediately explain

Who we are.

What we build.

Why clients should trust us.

---

# SECTION HEADER

Reusable.

Contains

Eyebrow

Title

Description

Every page should use the same typography hierarchy.

---

# SERVICE CARD

Contains

Title

Short Description

Optional Image

Hover State

Large spacing.

Minimal.

Professional.

Never overcrowded.

---

# PROJECT CARD

Contains

Large Image

Category

Title

Short Description

Arrow

Large hover interaction.

Image should dominate.

Minimal text.

---

# IMAGE GALLERY

Reusable gallery component.

Supports

Photography

Videography

Projects

Editorial layout.

Large imagery.

No Instagram feeling.

---

# FEATURE CARD

Used for

Why Choose Us

Statistics

Values

Simple.

Readable.

Minimal.

---

# TESTIMONIAL CARD

Future use.

Contains

Photo

Name

Role

Company

Review

Keep minimal.

---

# CTA SECTION

Reusable.

Contains

Title

Short Text

One Button

Simple.

Focused.

One action only.

---

# CONTACT FORM

Reusable.

Fields

Name

Email

Company

Budget

Project Details

Uses

React Hook Form

Zod

Large spacing.

Minimal styling.

---

# FOOTER

Reusable.

Contains

Logo

Navigation

Services

Social Links

Copyright

Minimal.

Professional.

---

# CARD RULES

Cards should

Have generous padding

Minimal borders

Soft radius

Readable typography

Large images

Avoid unnecessary shadows.

---

# IMAGE RULES

Always use

NextImage

Responsive

Optimized

High Quality

Never stretch.

Never distort.

---

# ICON RULES

Lucide React only.

Use icons only when they improve understanding.

Never decorate.

---

# TYPOGRAPHY COMPONENTS

Reusable typography.

Display

Heading

Subheading

Body

Caption

Never manually recreate text styles.

---

# ANIMATION PREPARATION

Components should be built ready for animation.

Future GSAP integration should require minimal changes.

Avoid layouts that depend on animations.

---

# RESPONSIVE RULES

Every component must support

Desktop

Tablet

Mobile

No exceptions.

---

# ACCESSIBILITY

Keyboard Support

Focus States

Semantic HTML

ARIA Labels

Alt Text

Proper Heading Structure

---

# PERFORMANCE

Lazy load where appropriate.

Avoid unnecessary renders.

Optimize images.

Small bundle size.

---

# REUSABILITY CHECK

Before creating a new component ask

Can this be reused

If yes

Create reusable component.

If no

Keep page specific.

---

# COMPONENT QUALITY CHECKLIST

✓ Responsive

✓ Accessible

✓ Reusable

✓ Typed

✓ Optimized

✓ Clean

✓ Minimal

✓ Production Ready

✓ Matches Design System

✓ Matches Brand Identity

---

# FINAL GOAL

Every page should feel like it was built using one unified design system.

No inconsistent buttons.

No inconsistent spacing.

No inconsistent cards.

No inconsistent typography.

Everything should feel like PARVEX.