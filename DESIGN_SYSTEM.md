# EduCenter Design System — "Deep Forest Professional"

This document defines the single source of truth for all visual tokens, component styling guidelines, and aesthetic rules across the EduCenter platform (Center Owner, Teacher, and Student dashboards).

---

## 1. Aesthetic Direction & Mood

* **Name:** Deep Forest Professional
* **Mood:** Authoritative, calm, academic, and tactile.
* **Canvas:** Warm Cream (`#FAF6EC`) rather than stark white.
* **Surfaces:** Crisp white (`#FFFFFF`) layered on cream canvas with tactile, warm stone borders (`#E3DBC7`) and secondary parchment surfaces (`#F1EAD9`).
* **Primary Brand:** Deep Forest Slate-Green (`#18362E` / `#16302A`).
* **Focal Accent:** Warm Amber/Ochre (`#B45309` / `#D97706`) reserved strictly for high-priority actions, active state markers, and vital highlights (maximum **one** focal accent per view).
* **Borders over Shadows:** Clean, deliberate 1px borders replace generic blurry drop shadows across tables, cards, and toolbars. Only primary elevated stat cards receive a whisper of tinted elevation.

---

## 2. Color Tokens

### 2.1 Core Palette
| Token Variable | CSS Variable | Hex / Value | Usage |
| :--- | :--- | :--- | :--- |
| `background` | `--background` | `#FAF6EC` | Global page canvas (Warm Cream) |
| `foreground` | `--foreground` | `#182622` | Primary body text (Deep Forest Charcoal) |
| `card` | `--card` | `#FFFFFF` | Primary card surface |
| `card-foreground`| `--card-foreground` | `#182622` | Text on primary card |
| `card-secondary` | `--card-secondary` | `#F1EAD9` | Secondary nested surface / table headers / well |
| `primary` | `--primary` | `#18362E` | Deep forest green for main branding and primary controls |
| `primary-foreground`| `--primary-foreground` | `#FFFFFF` | Text on primary background |
| `secondary` | `--secondary` | `#F1EAD9` | Warm secondary surface |
| `secondary-foreground`| `--secondary-foreground` | `#18362E` | Text on secondary surface |
| `muted` | `--muted` | `#F4EFE3` | Muted background, inactive tabs |
| `muted-foreground` | `--muted-foreground` | `#636B66` | Secondary labels, timestamps, placeholders |
| `accent` | `--accent` | `#B45309` | Warm Amber / Ochre for high-priority actions & active indicators |
| `accent-foreground` | `--accent-foreground` | `#FFFFFF` | Text on accent background |
| `destructive` | `--destructive` | `#DC2626` | Error states, dangerous actions |
| `destructive-foreground` | `--destructive-foreground` | `#FFFFFF` | Text on destructive background |
| `border` | `--border` | `#E3DBC7` | Default crisp border across cards and tables |
| `input` | `--input` | `#DCD3BD` | Form field borders |
| `ring` | `--ring` | `#18362E` | Focus rings |

### 2.2 Sidebar Tokens
| Token Variable | CSS Variable | Hex / Value | Usage |
| :--- | :--- | :--- | :--- |
| `sidebar` | `--sidebar` | `#122923` | Deepest forest evergreen background |
| `sidebar-foreground`| `--sidebar-foreground` | `#FAF6EC` | Text inside sidebar |
| `sidebar-primary`| `--sidebar-primary` | `#D97706` | Active navigation pill / indicator |
| `sidebar-primary-foreground` | `--sidebar-primary-foreground` | `#FFFFFF` | Text on active navigation item |
| `sidebar-accent` | `--sidebar-accent` | `rgba(255, 255, 255, 0.08)` | Hover background for navigation items |
| `sidebar-accent-foreground` | `--sidebar-accent-foreground` | `#FFFFFF` | Text on hover |
| `sidebar-border` | `--sidebar-border` | `rgba(255, 255, 255, 0.08)` | Internal dividers and header border |
| `sidebar-ring` | `--sidebar-ring` | `#D97706` | Focus ring for keyboard accessibility |

### 2.3 Semantic Status Tokens (Outlined / Tinted with Crisp Borders)
| Semantic State | Text Class | Background Class | Border Class | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Present (حاضر)** | `text-emerald-800` | `bg-emerald-50/80` | `border-emerald-200/80` | Confirmed attendance, paid subscriptions |
| **Late (متأخر)** | `text-amber-800` | `bg-amber-50/80` | `border-amber-200/80` | Delayed attendance, pending verification |
| **Absent (غائب)** | `text-rose-800` | `bg-rose-50/80` | `border-rose-200/80` | Student absence, unpaid dues |
| **Excused (مستأذن)** | `text-slate-700` | `bg-stone-100/80` | `border-stone-300/80` | Excused absence, neutral status |

---

## 3. Typography & Hierarchy

* **Font Family:** `Cairo` (`--font-cairo`, Arabic-first with Latin numeral fallback).
* **Heading Scale:**
  * **Page Title (H1):** `text-2xl font-extrabold text-foreground tracking-tight`
  * **Section Title (H2):** `text-lg font-bold text-foreground`
  * **Card / Subsection Title (H3):** `text-sm font-bold text-foreground`
  * **Body / Cell Data:** `text-sm font-medium text-foreground`
  * **Micro Labels / Captions:** `text-xs font-semibold text-muted-foreground`
  * **Code / Numbers / Timestamps:** `font-mono text-xs text-muted-foreground`

---

## 4. Radius & Elevation Scale

### 4.1 Radius Scale
* `rounded-sm` (`4px`): Micro badges, status dots.
* `rounded-md` (`6px`): Table cell tags, schedule slot badges.
* `rounded-lg` (`8px`): Form inputs, buttons, filter dropdown triggers.
* `rounded-xl` (`12px`): Stat cards, tables, modal dialogs, section wrappers.
* `rounded-2xl` (`16px`): Outer dashboard shell cards.
* `rounded-full`: Avatars, circular icon holders, pill badges.

### 4.2 Elevation / Shadow Scale
* **Base / Flat (default for tables, badges, nested cards):** `shadow-none border border-border`
* **Subtle Elevation (primary hero stat card, active dropdowns):** `shadow-sm` (`0 1px 3px rgba(24, 38, 34, 0.05)`)
* **Floating (modals, popovers):** `shadow-xl border border-border`

---

## 5. Component Styling Standards

### 5.1 Sidebar (`Sidebar.tsx`)
- Background: `bg-sidebar` (`#122923`).
- Active link: `bg-white/10 text-white font-semibold border-r-2 border-accent` (or warm amber indicator).
- Hover link: `hover:bg-white/5 text-white/80 hover:text-white`.
- Logo & User card: Subtle translucent surface `bg-white/[0.04]` with `border-sidebar-border`.

### 5.2 Stat Cards (Differentiated Visual Weights)
- **Primary Hero Stat Card (e.g. Overall Attendance Rate / Total Revenue):**
  Deep Forest or tinted container with distinct typography and elevation (`border-primary/20 bg-primary/5` or `bg-white shadow-sm border-border`).
- **Secondary Stat Cards:**
  Clean, compact metric blocks with light backgrounds and crisp borders (`bg-white border-border shadow-none`).
- **No identical repetitive 5-card rows:** Vary primary vs secondary stats to establish a clear visual hierarchy.

### 5.3 Tables (`SharedTable.tsx`)
- Container: `rounded-xl border border-border bg-card overflow-hidden shadow-none`.
- Thead: `bg-secondary/60 border-b border-border text-foreground font-bold text-xs uppercase`.
- Tbody rows: `divide-y divide-border/60 hover:bg-muted/40 transition-colors`.

### 5.4 Buttons (`button.tsx`)
- `default` / `brand`: `bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-none font-semibold`.
- `brandOutline` / `outline`: `border border-border bg-card text-foreground hover:bg-muted rounded-lg`.
- `accent`: `bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg font-semibold`.

---

## 6. Implementation Rules
1. **Zero Hardcoded Colors:** All `#1E4632`, `#F0F7F4`, `#163625`, and ad-hoc Tailwind colors must use design tokens (`bg-primary`, `text-primary`, `bg-secondary`, `border-border`, etc.).
2. **Zero `tailwind.config.js`:** All tokens are registered inside `src/app/globals.css` in `@theme inline` and `:root`.
3. **No logic changes:** Pure style and CSS class refactoring.
