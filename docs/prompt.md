# PARVEX — FINAL DESIGN, MOTION, NAVIGATION & EXPERIENCE POLISH V2.0

STOP.

Before inspecting, planning, editing, deleting, creating or refactoring any code:

Read these four files completely:

/docs/00_PROJECT_RULES.md
/docs/01_DESIGN_SYSTEM.md
/docs/02_CODING_STANDARDS.md
/docs/03_COMPONENT_LIBRARY.md

Do not skim them.

These documents are the source of truth for PARVEX.

After reading them, inspect the COMPLETE existing project.

Review:

- Homepage
- Work page
- Services page
- About page
- Contact page
- Navigation
- Mobile navigation
- Footer
- Project cards
- Service sections
- Forms
- Buttons
- Images
- Cursor behaviour
- Lenis configuration
- GSAP animations
- Framer Motion animations
- Route transitions
- Responsive layouts

Also carefully inspect every reference screenshot attached with this prompt.

The screenshots show both:

1. the current PARVEX implementation
2. visual interaction references

Do not blindly copy any reference website.

Understand the design principle behind the reference and translate it into the PARVEX design language.

The existing website is already designed.

THIS IS NOT A REDESIGN.

Do not destroy the current visual identity.

Do not rebuild pages from zero.

Refine, repair, elevate and finalize the existing experience.

---

# YOUR ROLE

Act simultaneously as:

Creative Director

Senior Digital Product Designer

Senior UX Designer

Senior Motion Designer

Senior Next.js Engineer

Senior Frontend Performance Engineer

Accessibility Engineer

QA Engineer

Think like a production team preparing PARVEX for public launch.

Do not simply execute individual requests mechanically.

Inspect the complete experience.

If an implementation is technically poor, visually inconsistent or creates performance problems, use a better production-quality solution.

---

# PRIMARY OBJECTIVE

The current PARVEX website is visually clean but still feels slightly static and occasionally slightly laggy.

The goal of this phase is to make the website feel exceptionally smooth, responsive and intentional.

The experience should feel:

Premium

Fluid

Immediate

Editorial

Confident

Modern

Controlled

The website must NOT become an animation showcase.

The user should feel the smoothness without constantly noticing animations.

PERFORMANCE COMES BEFORE VISUAL EFFECTS.

Do not hide poor performance behind additional animation.

---

# FIRST TASK — COMPLETE TECHNICAL AND VISUAL AUDIT

Before implementation, inspect the current codebase.

Identify:

- unnecessary Client Components
- excessive useEffect usage
- unnecessary React state
- unnecessary re-renders
- duplicate animation logic
- conflicting GSAP and Framer Motion animations
- Lenis configuration problems
- layout-triggering animations
- oversized images
- badly sized images
- poor object-fit usage
- image layout shifts
- hydration problems
- route transition delays
- expensive event listeners
- excessive mousemove calculations
- animation cleanup problems
- ScrollTrigger cleanup problems
- duplicate scroll listeners
- unused components
- unused imports
- console warnings
- broken routes
- non-functional buttons

Explain the major problems internally before changing implementation.

Then fix them.

Do not add advanced motion until the performance foundation is clean.

---

# 1. GLOBAL SMOOTHNESS — HIGHEST PRIORITY

The current website has a small amount of perceived lag.

Find the REAL reason.

Do not blindly add:

will-change everywhere

translateZ everywhere

React.memo everywhere

requestAnimationFrame everywhere

These are not automatic performance fixes.

Profile the implementation logically.

Optimize animation architecture.

GSAP should control timeline-driven and scroll-driven motion.

Framer Motion should control UI interaction and component states.

CSS should control simple hover and focus transitions.

Lenis should control smooth scrolling.

Do not make multiple systems fight over the same element.

One element should not have GSAP, Framer Motion and CSS transform animations competing simultaneously.

Review the complete animation architecture.

Consolidate duplicated animation behaviour.

Use primarily:

transform

opacity

clip-path only when justified

Avoid continuous animations of:

width

height

top

left

margin

large blur values

large box shadows

background-position

Avoid expensive backdrop-filter usage across large surfaces.

Use GPU-friendly motion where appropriate.

Maintain smooth interaction on normal Windows laptops and Mac devices.

The website must not require a high-end GPU to feel premium.

---

# 2. LENIS SMOOTH SCROLL AUDIT

Audit the current Lenis implementation.

There must be only one primary Lenis instance.

Ensure correct cleanup.

Ensure Lenis integrates correctly with GSAP ScrollTrigger if ScrollTrigger is used.

Tune scrolling so it feels smooth but immediate.

The scroll must NOT feel:

floaty

heavy

delayed

slippery

disconnected from the mouse wheel

Use a restrained configuration.

Desktop scrolling should feel refined.

Touch and mobile scrolling should remain natural.

Do not force desktop-style smooth scrolling behaviour onto mobile if native scrolling performs better.

Respect prefers-reduced-motion.

---

# 3. PAGE TRANSITIONS — FIX NAVBAR NAVIGATION

The current navigation experience is not polished enough.

When clicking:

Home

Work

Services

Contact

or other internal primary routes,

do not allow the new page to simply appear with an awkward load feeling.

Create one reusable global route transition system.

REFERENCE FEEL:

The incoming page should appear from slightly below and move upward into its natural position.

The movement must be subtle.

Do NOT slide an entire page from the bottom of the screen like a mobile modal.

Recommended visual language:

Incoming page:

opacity 0 → 1

translateY 24px–40px → 0

Optional subtle reveal mask if performance remains excellent.

Duration approximately:

450ms–700ms

Use premium easing.

The transition should feel soft and immediate.

Do not use:

loading screens

logo loaders

percentage loaders

multi-second transitions

large black overlays

dramatic page wipes

Cuberto-copy transitions

Navigation must remain responsive.

The route should start immediately after click.

Build this as ONE reusable transition architecture.

Do not manually duplicate transition code on every page.

Important:

Back navigation must work.

Browser history must work.

Direct URLs must work.

Refresh must work.

Accessibility must remain intact.

Reduced motion users should receive an immediate or simple fade transition.

---

# 4. NAVIGATION INTERACTION

Audit the complete navigation.

Improve:

hover feedback

active page indication

button feedback

mobile menu

route click behaviour

keyboard navigation

focus states

The active route should be subtly identifiable.

Do not use a loud active navigation style.

The "Start a Project" button must work everywhere.

It must navigate correctly to the Contact page or relevant project-start section.

Prevent dead buttons.

Prevent href="#".

Prevent placeholder navigation.

Every navigation item must be tested.

---

# 5. PREMIUM CUSTOM CURSOR

The current website uses a normal browser cursor.

Create a refined custom circular cursor experience inspired by premium digital studio interactions.

Do NOT copy the exact cursor from the reference screenshots.

Create a PARVEX-specific cursor.

Desktop pointer devices only.

Base cursor:

Small circular cursor.

Minimal.

High contrast.

Responsive.

It should follow pointer movement smoothly with very low perceived latency.

Do not create excessive trailing delay.

On interactive elements such as:

Project cards

Service cards

Images

Buttons

Navigation links

Media

the cursor may expand.

Contextual cursor states may display short labels such as:

View

Explore

Open

Drag

Start

Only use text when it adds useful interaction feedback.

Do not display cursor labels everywhere.

The cursor must adapt to light and dark surfaces.

Use mix-blend-mode only if it remains visually reliable and performant.

Otherwise create controlled light and dark variants.

Critical requirements:

Disable custom cursor on touch devices.

Disable on coarse pointers.

Do not break text selection.

Do not block clicks.

Use pointer-events: none.

Respect reduced motion.

Use an efficient pointer animation architecture.

Do not trigger React state updates on every mousemove.

Prefer refs and animation utilities designed for high-frequency pointer movement.

The cursor should feel directly connected to the pointer.

Not delayed.

Not floaty.

---

# 6. HOMEPAGE — MAKE SERVICES CLICKABLE

The homepage Services section must become functionally connected to the Services page.

Each service preview must be clickable.

Examples:

Web Development

App Development

Photography

Videography

Clicking a service should navigate to the Services page AND open/scroll to the relevant service.

Use stable section identifiers or a clean route architecture.

Example concept:

/services#web-development

/services#app-development

/services#photography

/services#videography

Do not use fragile DOM hacks.

When navigation completes:

smoothly move to the relevant service section

account for sticky navigation height

ensure the section heading is visible

do not position content underneath the navbar

Direct links to these URLs must also work.

Back navigation must remain correct.

On reduced motion, jump directly without animated scrolling.

Add clear interaction feedback so users understand service items are clickable.

Do not turn everything into large obvious buttons.

Use cursor, hover and subtle movement.

---

# 7. HOMEPAGE — MAKE PROJECTS CLICKABLE

Every project displayed on the homepage must be connected to its project detail/case-study route.

Clicking:

project image

project title

project interactive area

should open the correct project.

Use the existing dynamic Work architecture.

Do not duplicate project URLs manually if project data already contains slug information.

The entire meaningful project card area should be interactive.

Maintain keyboard accessibility.

Use semantic links.

The custom cursor may display:

View

or

Open

when hovering over a project.

Do not create nested conflicting links.

---

# 8. WORK PAGE — VISUAL IMPROVEMENT

Based on the attached screenshot, the Work page hero currently contains too much unused white space and relies almost completely on typography.

The typography is strong.

DO NOT replace it.

Improve the composition.

Introduce one premium visual element that supports the Work identity.

Do not use:

team photos

people sitting at laptops

handshake photos

meeting room stock photography

generic office photography

Instead use visual directions such as:

abstract digital sculpture

premium 3D geometry

experimental product object

glass material study

metallic form

digital architecture

minimal monochrome CGI

liquid simulation still

generative geometry

light and shadow study

high-end interface macro

technology-inspired art direction

The image should feel like editorial art direction.

Not stock photography.

It must complement PARVEX's black-and-white system.

A controlled blue, silver, glass or neutral tone may appear inside imagery.

Do not change the base website colour system.

Use the visual to improve hero balance and reduce the feeling of empty unused space.

Do not overcrowd the hero.

One excellent visual is better than four average visuals.

Use next/image correctly.

Correct sizes.

Correct priority only when above the fold.

Prevent CLS.

---

# 9. SERVICES PAGE — VISUAL IMPROVEMENT

The Services page currently feels too text-led and visually basic.

The headline:

"Engineering and craft, under one roof."

has a strong direction.

Preserve the general quality of the typography.

Do not make the page longer.

Do not add unnecessary sections.

Do not add large paragraphs.

Improve visual storytelling using premium imagery.

Each major service should have a carefully art-directed visual.

WEB DEVELOPMENT visual direction:

abstract browser composition

high-end UI macro

digital grid

minimal screen architecture

glass interface

APP DEVELOPMENT visual direction:

premium device composition

abstract mobile UI

3D device form

interface detail

PHOTOGRAPHY visual direction:

editorial light study

camera detail

architectural photography

texture

shadow

controlled composition

VIDEOGRAPHY visual direction:

cinematic frame

studio light

lens detail

film texture

motion-inspired abstract frame

Avoid cliché stock imagery.

Avoid random Unsplash team photos.

The Services page should feel like PARVEX understands visual direction, not simply software development.

Images must be part of the layout.

Do not just add a rectangular image below every paragraph.

Experiment with restrained editorial composition:

asymmetric image placement

large image crop

controlled overlap

image paired with typography

alternating visual rhythm

Maintain readability and responsiveness.

---

# 10. IMAGE REFERENCE DIRECTION

Use the attached references only to understand:

visual confidence

scale

image composition

editorial placement

contrast

Do not copy exact assets or layouts.

Search/select temporary imagery based on these concepts:

"abstract digital sculpture editorial"

"minimal 3D technology art"

"glass object CGI"

"monochrome digital architecture"

"experimental product CGI"

"premium interface macro"

"cinematic camera detail"

"editorial light shadow photography"

"metallic abstract geometry"

"liquid glass digital art"

Temporary imagery must still look intentional.

Do not insert an image simply because a section feels empty.

Every image needs an art-direction reason.

Prepare the media architecture so PARVEX can replace temporary images with original media later.

---

# 11. MOBILE PROJECT IMAGE BUG — MUST FIX

Based on the attached mobile screenshot, the final project image/card is not correctly contained within the mobile viewport.

Part of the project media extends outside the visible layout.

This is a real responsive bug.

Find the actual cause.

Inspect:

container width

fixed widths

min-width

grid sizing

absolute positioning

translate transforms

GSAP transforms

image aspect ratio

object-fit

overflow

parent width

viewport calculations

Do not fix this using an arbitrary overflow-x: hidden patch without identifying the source.

Project cards must remain fully contained on mobile.

Requirements:

width: 100% where structurally appropriate

max-width must respect container

no horizontal page overflow

image must fill card

consistent border radius

intentional aspect ratio

object-fit: cover

focal point should remain visually useful

For project thumbnails, define responsive aspect ratios rather than depending on uncontrolled original image dimensions.

Example principle:

Desktop:
art-directed variable layout

Mobile:
consistent card width with controlled aspect ratio

Use different object-position values when a specific image requires focal-point adjustment.

Test at:

320px

375px

390px

430px

768px

Do not allow any project card to escape the viewport.

---

# 12. PROJECT IMAGE QUALITY

Audit all project thumbnail images.

The current images vary significantly in visual quality and art direction.

Create a more consistent visual presentation.

Do not falsely represent internal projects as client projects.

However, present them professionally.

Audit:

AuditGPT

Resume Analyzer

Movie Ticket Booking

Photography Showcase

other current projects

Each project needs a visual that communicates the product.

For software projects, prefer:

high-quality product mockups

interface crops

browser compositions

device compositions

custom branded visual covers

Do not rely on unrelated generic images when a product interface can be shown.

Movie Ticket Booking should eventually use a polished cinema/product composition rather than only a generic cinema photograph.

AuditGPT should visually communicate AI, finance or analysis through its actual interface or a designed product cover.

Resume Analyzer should show its product experience.

Photography can remain image-led.

The Work page should feel like case studies, not a stock image gallery.

---

# 13. IMAGE HOVER INTERACTIONS

For project and selected service imagery:

Use restrained image interaction.

Possible behaviour:

image scale 1 → 1.025

subtle media movement

cursor expands

title shifts 2px–4px

Do not use extreme zoom.

Do not apply large parallax to every image.

Avoid animations that make text difficult to click.

Maintain one interaction language.

---

# 14. BUTTON SYSTEM AUDIT

Audit EVERY button in the project.

Test:

Navbar CTA

Hero CTA

Project CTA

Service CTA

Contact CTA

Footer links

Form submit

Mobile navigation actions

For every button verify:

correct route/action

hover state

active/pressed state

focus-visible state

disabled state where relevant

loading state where relevant

cursor interaction

touch behaviour

No dead buttons.

No placeholder actions.

No console errors.

No nested interactive elements.

Create one consistent premium button motion language.

Do not use different hover animation styles randomly.

---

# 15. CONTACT PAGE FINAL POLISH

Keep the Contact page minimal.

Do not make it visually busy.

Improve the form interaction.

Final fields:

Name

Email

Company — Optional

Project Type

Estimated Timeline

Estimated Budget

Message

Attachment — Optional

Budget options:

Exploring / Not Sure Yet

Under ₹50K

₹50K – ₹1L

₹1L – ₹3L

₹3L – ₹10L

₹10L+

Do not use "Exploring Ideas" if the UI becomes unclear.

Use human, direct labels.

Attachment interaction:

Support:

PDF

DOCX

ZIP

PNG

JPG

JPEG

Maximum 10 MB.

Provide drag and drop.

Provide click to browse.

Display selected filename.

Display file size.

Allow removing the selected attachment.

Show validation clearly.

Helper copy:

"Share a brief, wireframe, reference, or project document. Max 10 MB."

The attachment interaction must work on mobile.

Do not create a huge upload box.

Keep it elegant and integrated with the form.

Audit form:

validation

keyboard use

loading state

submission errors

success state

double submission prevention

server-side validation

client-side validation

The success state should feel polished but restrained.

---

# 16. PAGE AND SECTION REVEAL LANGUAGE

The website currently needs stronger consistency between animations.

Define ONE reveal language.

Default section reveal:

opacity 0 → 1

translateY 24px–32px → 0

duration approximately 0.7s–0.9s

premium easing

Use stagger only for actual groups.

Do not stagger every sentence.

Large typography may use line or mask reveals where already appropriate.

Do not add text splitting to every heading.

Images may use:

clip reveal

mask reveal

or restrained scale reveal

Choose based on context.

Do not randomly mix reveal styles.

---

# 17. MOBILE EXPERIENCE

Do not treat mobile as reduced desktop.

Audit every page manually.

Homepage

Work

Services

About

Contact

Check:

navigation

headline wrapping

section spacing

project cards

service visuals

images

forms

buttons

cursor removal

scroll performance

footer

No horizontal overflow.

No accidental clipped cards.

No oversized empty spaces caused by desktop min-height values.

Reduce hero min-height on mobile where necessary.

Maintain premium whitespace without creating blank screens.

---

# 18. PERFORMANCE BUDGET

Do not sacrifice smoothness for visual effects.

Audit JavaScript bundle impact.

Do not install another animation library.

Existing stack:

GSAP

Framer Motion

Lenis

CSS

is enough.

Lazy load below-the-fold media.

Use responsive image sizes.

Avoid loading desktop-resolution imagery on mobile.

Use modern image formats where possible.

Remove unused dependencies if safely possible.

Ensure animations are cleaned up on unmount.

Avoid memory leaks.

Avoid persistent global listeners without cleanup.

Avoid React state for continuous pointer coordinates.

Target:

smooth 60 FPS interaction where hardware permits

excellent perceived responsiveness

minimal layout shift

no animation jank during normal scrolling

Lighthouse should remain strong.

Do not fake Lighthouse scores.

Improve real performance.

---

# 19. ACCESSIBILITY

The custom experience must not reduce accessibility.

Maintain:

semantic links

semantic buttons

keyboard navigation

focus-visible states

proper labels

heading hierarchy

image alt text

reduced motion support

touch support

screen reader usability

Custom cursor must never be the only indication that an element is interactive.

---

# 20. FINAL FUNCTIONAL QA

After implementation, inspect the COMPLETE website.

Do not stop after visual changes.

Test every route.

Test every navigation link.

Test every CTA.

Test every project card.

Test every service link.

Test homepage service deep links.

Test homepage project links.

Test Contact form.

Test attachment.

Test mobile navigation.

Test browser back navigation.

Test direct URL loading.

Test refresh on nested routes.

Test reduced motion.

Test keyboard navigation.

Run:

TypeScript check

Lint

Production build

Fix errors.

Review browser console.

Fix relevant warnings.

Check for hydration errors.

Check for horizontal overflow.

Check for animation cleanup issues.

---

# REQUIRED DELIVERY PROCESS

Do not immediately start making random edits.

Follow this exact workflow:

STEP 1

Read all four /docs files completely.

STEP 2

Inspect the complete current project.

STEP 3

Inspect all attached screenshots.

STEP 4

Create a concise internal audit of the existing problems.

STEP 5

Prioritize:

1. Performance and smoothness
2. Animation architecture
3. Navigation transitions
4. Functional links
5. Cursor
6. Work visual improvement
7. Services visual improvement
8. Mobile image bug
9. Contact form polish
10. Final QA

STEP 6

Implement changes carefully.

STEP 7

Run the complete project checks.

STEP 8

Review the final website as one connected experience.

Do not stop because one page looks good.

The complete website must feel consistent.

---

# FINAL SUCCESS CRITERIA

PARVEX should no longer feel like a collection of individually designed pages.

It should feel like one connected digital experience.

Navigation should feel fluid.

Scrolling should feel responsive.

Cursor interaction should feel intentional.

Projects should feel interactive.

Services should feel visual.

Work should feel art-directed.

Mobile should feel deliberately designed.

Contact should feel professional.

Every button should work.

Every link should lead somewhere meaningful.

Every animation should have a purpose.

The website must remain fast on normal Windows laptops and Mac devices.

Do not chase animation complexity.

Do not copy Cuberto.

Do not redesign PARVEX.

Take the existing PARVEX identity and finish it to a production-quality standard.

Smoothness first.

Function second.

Visual polish third.

Complexity last.

This is the final design and motion refinement phase.

After this phase, freeze the visual system.
