---
trigger: always_on
---

# EduCenter Restyle Skill — De-genericize the UI (Style-Only)

## Purpose
This skill exists because the current UI reads as a generic AI-generated admin
template: solid dark-green sidebar, white rounded stat cards with an
icon+number+label pattern, uniform `rounded-xl` everywhere, default shadow-sm
on every surface, no typographic hierarchy, no visual identity. This skill
defines the rules for replacing the *look* with a deliberate, named aesthetic
— without touching structure, logic, routing, components, or UX flow.

Use this skill any time you are asked to "restyle," "redesign the look of,"
"make it feel less AI-generated," or "apply the design system" to this
project (`educenter-dashboard`, Next.js 16 App Router, Tailwind v4, RTL
Arabic).

---

## 0. Environment facts — verify before touching anything

- This project uses **Tailwind CSS v4**, which has NO `tailwind.config.js` /
  `tailwind.config.ts` by default. Design tokens live inside a CSS file
  (commonly `src/app/globals.css` or `src/styles/globals.css`) inside an
  `@theme { ... }` block, using CSS custom properties
  (e.g. `--color-primary`, `--font-sans`, `--radius-lg`).
- **Locate the actual theme file first.** Search for `@theme`, `@import
  "tailwindcss"`, or any `:root { --color-... }` block before assuming
  where tokens live. Do not create a `tailwind.config.js` file — that is
  the wrong pattern for this Tailwind version and will silently not apply.
- Layout is a fixed right-side sidebar (RTL) + main content area, used by
  three center roles: Owner, Teacher, and Student, alongside a clean standalone
  Public Parent Portal (`/p/:token`). Admin/Super Admin has a separate dashboard.
- Grace period banner and read-only disabled states must adhere to the palette:
  warm amber/ochre notices for grace period (Owner only), muted stone borders and
  disabled treatments for read-only buttons with descriptive Arabic tooltips.

---

## 1. Hard rules — never violate

- ✅ Allowed: color tokens, typography (family/scale/weight), spacing scale,
  radius scale, shadow/elevation scale, border treatment, icon stroke
  weight/size, hover/focus/active state styling, transition timing,
  background treatments (texture, gradient, pattern) that are purely visual.
- ❌ Never: change component structure, element order, number of elements,
  routing, business logic, API/hook calls, form validation, state
  management, prop shapes, file/folder structure, or UX flow (clicks,
  navigation depth, information architecture).
- ❌ Never introduce a new dependency (icon library, animation library, font
  loader) without flagging it first — prefer what's already installed.
- A purely cosmetic wrapper `<div>` added only for spacing/layout purposes
  is acceptable but must be called out explicitly in the change report.
- Every screen must keep working exactly as before. If a visual change would
  require touching `.tsx` logic (not just className/style), stop and ask.

---

## 2. Anti-patterns to actively remove (diagnosed from current screens)

These are the specific tells that make the current UI look AI-generated —
actively work against them:

1. **Flat solid-color sidebar with no depth or texture** — the current dark
   green block reads as an unmodified default. Add depth: subtle gradient,
   texture, a distinguishing top/bottom treatment, or a fundamentally
   different sidebar color strategy tied to the chosen direction.
2. **The "icon + huge number + label in a white rounded card" stat-block
   pattern repeated identically 5 times in a row** — this exact pattern is
   one of the most common LLM defaults. Vary the visual weight, alignment,
   or treatment between primary vs. secondary stats; don't repeat the
   identical card shape five times.
3. **Uniform `rounded-xl` + `shadow-sm` applied to every single surface**
   (cards, table, sidebar items, badges) with no variation — creates a
   "soft blob" sameness. Introduce a deliberate radius/elevation *scale*
   where different surface types get different, intentional treatment.
4. **No typographic hierarchy** — headings, body text, and labels all look
   like the same font at different sizes with default weight. Define a real
   scale with distinct weights and, ideally, a heading font that isn't the
   default system/Inter-equivalent.
5. **Default status-pill colors** (plain red/orange/green backgrounds) —
   keep the semantic meaning but give them a treatment consistent with the
   chosen direction (e.g. outlined instead of filled, or muted tones instead
   of saturated defaults).
6. **Generic thin-stroke icon set with no personality** — fine to keep the
   icon library, but ensure stroke weight/size is deliberately chosen, not
   left at default.

---

## 3. Process — always in this order

### Phase 1 — Pick ONE named aesthetic direction (no code yet)
Do not use vague adjectives ("clean," "modern," "minimal") as the whole
direction — these produce generic output by default. Pick and commit to
ONE specific direction from the options below (or a variant explicitly
approved by the user), and do not blend multiple directions.

Candidate directions for this product (tutoring-center SaaS, Arabic,
used daily by owners/teachers/students — not a marketing site):

- **"Warm Academic"** — terracotta/amber accent, deep ink-navy text, warm
  cream/off-white background instead of stark white, subtle paper-like
  texture. Feels bookish and human, not sterile-corporate.
- **"Structured Editorial"** — deep charcoal/navy primary, a single gold or
  brass accent used sparingly, generous whitespace, a bolder Arabic
  display typeface for headings (e.g. Cairo/Tajawal at heavy weight) vs. a
  plainer one for body text. Feels authoritative and print-inspired.
- **"Deep Forest Professional"** — keeps green (brand continuity) but makes
  it distinctive: a much deeper forest green (not the flat mid-green
  default) + warm sand/beige neutral instead of pure white + one
  unexpected accent color (coral or amber) reserved for key actions only.

Output Phase 1 as a short written brief (direction name, 2–3 sentence mood
description, why it fits daily-use education software) and wait for
approval before writing any tokens.

### Phase 2 — Define the design system as a single source of truth
Once a direction is approved, define and write actual token values into the
project's real theme location (the `@theme` block found in Phase 0 — do NOT
create a parallel config file). Cover:
- Color: primary, secondary/accent, full neutral scale, surface/background
  layers (at least 2 levels — base background vs. card/surface), semantic
  colors (success/warning/error/info) restyled to match the direction.
- Typography: font family for headings vs. body (must support Arabic),
  a type scale (at least 5 steps), weight scale.
- Spacing scale (if not already using Tailwind's default consistently).
- Radius scale — deliberately varied, not one value everywhere.
- Shadow/elevation scale — at least 2 distinct levels.
- Motion/transition timing convention.

Write this to a `DESIGN_SYSTEM.md` file summarizing the decisions in plain
language alongside the actual CSS token changes, so it's reviewable
independent of the code.

### Phase 3 — Apply to a small representative set first
Before touching the whole app, apply the new tokens to: the sidebar, the
stat-card component, the table, badges/status pills, and buttons — since
these repeat across every dashboard. Show this subset for approval before
rolling out further.

### Phase 4 — Full rollout
Apply consistently across all pages/roles (Owner, Teacher, Student
dashboards) using the same tokens — no per-page one-off colors or values.

### Phase 5 — Report
For every file touched: file path, what visual properties changed, and a
confirmation that no structural/logic changes occurred. Explicitly list any
cosmetic-only wrapper elements added per the exception in Section 1.

---

## 4. Definition of done

- No `tailwind.config.js` was created; tokens live in the existing CSS
  theme location.
- All five anti-patterns in Section 2 are visibly addressed.
- The same design tokens are used consistently across Owner, Teacher, and
  Student dashboards — no drift between roles.
- Every interactive element (buttons, table rows, badges, sidebar items)
  has an intentional hover/focus/active state, not just the default.
- RTL Arabic rendering is verified — no visual bugs introduced by font or
  spacing changes.
- A `DESIGN_SYSTEM.md` exists and matches what was actually implemented.
- Zero changes to `.tsx` logic, props, hooks, routing, or API calls.