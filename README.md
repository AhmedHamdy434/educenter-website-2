# 🎓 EduCenter — Educational Centers Management SaaS

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=react-query)](https://tanstack.com/query)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#-license)

**EduCenter** is an enterprise-grade Software-as-a-Service (SaaS) web application engineered for modern educational centers, private academies, tutoring institutions, and academic instructors. Built with **Next.js 16 (App Router)** and **React 19**, it delivers a high-performance, RTL-native Arabic interface backed by a feature-driven modular architecture.

The platform provides dedicated, tenant-scoped operational dashboards for **Center Owners (`OWNER`)**, **Instructors / Teachers (`TEACHER`)**, and **Students (`STUDENT`)**, alongside a zero-friction, passwordless **Public Parent Portal (`/p/:token`)** for real-time attendance and tuition tracking.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture & Roles](#-system-architecture--roles)
- [Design System & Aesthetics](#-design-system--aesthetics)
- [Tech Stack](#-tech-stack)
- [Repository & Project Structure](#-repository--project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Local Setup](#-installation--local-setup)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Authentication, Cookies & Edge Proxy](#-authentication-cookies--edge-proxy)
- [Subscription Lifecycle & Grace Period](#-subscription-lifecycle--grace-period)
- [API Integration & Endpoint Catalog](#-api-integration--endpoint-catalog)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Production Deployment](#-production-deployment)
- [Security & Best Practices](#-security--best-practices)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Educational centers face significant operational friction managing disparate workflows: student enrollment, teacher assignments, class group scheduling, attendance marking, tuition payment tracking, parent communications, and subscription limits.

**EduCenter** unifies these operations into a single platform:
- **Tenant Isolation by Center Slug**: Every center operates within its dynamic route namespace (`/[centerSlug]/owner`, `/[centerSlug]/teacher`, `/[centerSlug]/student`), ensuring strict isolation and clean URL structures.
- **Arabic-First UX**: Natively designed for right-to-left (RTL) reading with typography powered by the **Cairo** font (`next/font/google`).
- **Deep Forest Professional Aesthetic**: A tactile, academic design system combining warm cream canvases (`#FAF6EC`), deep forest slate-green (`#18362E`), warm ochre accents (`#B45309`), and crisp stone borders (`#E3DBC7`).
- **Public Parent Magic Links**: Allows staff to share direct 30-day student report cards with parents via WhatsApp or direct links, requiring no login or account creation.
- **Zero-Stale Client State**: Real-time optimistic updates and synchronized URL-driven filtering using **TanStack Query v5** and **TanStack Table v8**.

---

## 🚀 Key Features

### 🏢 Center Owner Administration (`OWNER`)
- **Center Overview Metrics**: Live statistical summaries of student enrollments, active instructors, class groups, and revenue streams.
- **Academic Catalog**: Complete lifecycle management (CRUD, status toggling, sorting) for:
  - **Academic Grades (`/owner/grades`)**: Educational levels with display order and linked subject counts.
  - **Subjects (`/owner/subjects`)**: Subjects bound to specific academic grades.
  - **Instructors (`/owner/teachers`)**: Instructor profiles, bios, contact details, and multi-grade subject assignments.
  - **Student Directory (`/owner/students`)**: Student records, emergency guardian phones, academic grade enrollment, and instant parent report link generation.
  - **Class Groups (`/owner/groups`)**: Multi-day weekly timetable scheduling, group capacity, monthly fee tracking, student roster management, and monthly fee settlement matrix.
- **Center Users Directory (`/owner/users`)**: Unified staff and student user directory with role-based filters and one-click account activation/deactivation.
- **Audit Logs (`/owner/audit-logs`)**: Complete historical audit trail recording system actions, actors, affected entities, client IP addresses, user agents, and metadata payloads.
- **WhatsApp Notification Logs (`/owner/notifications`)**: Historical tracking of automated WhatsApp message dispatches, recipient phones, and delivery statuses.
- **Subscription & Quota Management (`/owner/subscription`)**: Transparent overview of current center plan limits (student, teacher, subject caps), remaining active days, and grace-period status.
- **Data Import & Export**: Server-side Excel and PDF exports across all entity grids, plus Excel template downloads and batch student imports.

### 👨‍🏫 Teacher Portal (`TEACHER`)
- **Assigned Group Roster (`/teacher/groups`)**: Displays only class groups assigned to the authenticated teacher.
- **Daily Attendance Marking (`/teacher/attendance/[id]`)**:
  - Instant session creation or retrieval for today's date.
  - One-click status toggling: **Present (حاضر)**, **Absent (غائب)**, **Late (متأخر)**, or **Excused (مستأذن)** with optional excuse notes.
  - Historical attendance report generation per group.
- **Student Tuition Oversight**: Read-only monthly tuition status for enrolled students in taught groups to facilitate follow-ups without exposing center financial accounts.
- **Parent Link Dispatch**: Instant generation and WhatsApp sharing of 30-day parent progress links for any taught student.
- **Academic Content**: Access to assignments (`/teacher/assignments`) and exams (`/teacher/exams`).

### 🎓 Student Portal (`STUDENT`)
- **Enrolled Subjects & Groups (`/student/subjects`)**: Weekly class schedules, group names, subject details, and instructor information.
- **Personal Attendance History (`/student/attendance`)**: Attendance rate percentage gauge, total session counts, breakdown of attendances/absences/lateness, and chronological session logs.
- **Tuition & Payment Receipts (`/student/payments`)**: Clear list of paid vs pending months, payment timestamps, and receipt identifiers.
- **Assignments, Exams & Results (`/student/assignments`, `/student/exams`, `/student/results`)**: Personal academic deliverables and grading records.
- **Strict Peer Isolation**: Read-only access strictly restricted to personal data; peer records and administrative data are entirely inaccessible.

### 📱 Public Parent Magic Portal (`/p/:token`)
- **Zero-Friction Access**: No username, password, or application download required.
- **30-Day Token Security**: Signed token access generated by center staff (`POST /api/p/generate/:studentId`).
- **Comprehensive Student Summary**:
  - Student identity, grade level, center name, and center contact number.
  - Visual attendance rate gauge and absence history with logged reasons.
  - Active subject enrollments, instructor names, and weekly lecture times.
  - Transparent monthly tuition payment status.

---

## 🏛️ System Architecture & Roles

```
                                  🌐 Incoming Request
                                          │
                                          ▼
                             ┌─────────────────────────┐
                             │    Next.js 16 Proxy     │
                             │     (src/proxy.ts)      │
                             └────────────┬────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
         Public Guest Routes                            Protected Center Routes
     ┌───────────────────────────┐                     ┌───────────────────────────┐
     │  /                        │                     │  /[centerSlug]/owner/*    │
     │  /login                   │                     │  /[centerSlug]/teacher/*  │
     │  /forgot-password         │                     │  /[centerSlug]/student/*  │
     │  /reset-password          │                     └─────────────┬─────────────┘
     │  /change-password         │                                   │
     │  /p/[token] (Parent View) │                                   ▼
     │  /subscription-required   │                      Center Layout Verification
     └───────────────────────────┘                     (Validates slug & user role)
```

### Role Separation Matrix

| Feature / Domain | Center Owner (`OWNER`) | Instructor (`TEACHER`) | Student (`STUDENT`) | Parent (`/p/:token`) |
| :--- | :---: | :---: | :---: | :---: |
| **Center Slug Route** | `/[slug]/owner` | `/[slug]/teacher` | `/[slug]/student` | Public (`/p/:token`) |
| **Catalog Management (Grades/Subjects)** | Full CRUD | Hidden | Hidden | Hidden |
| **Instructors Management** | Full CRUD | Hidden | Hidden | Hidden |
| **Student Profiles & Enrollment** | Full CRUD | View Assigned | Personal Only | Student Only |
| **Class Groups & Timetable** | Full CRUD | Assigned Only | Enrolled Only | Enrolled Only |
| **Attendance Session Marking** | View / Manage | Mark & Save | Personal Log | Personal Log |
| **Tuition Payment Logging** | Record / View | View Status | Personal Receipts | Subject Status |
| **Parent Magic Link Generation** | Yes | Yes | No | No (Consumes Link) |
| **Center User Directory** | Full CRUD | Hidden | Hidden | Hidden |
| **Operational Audit Logs** | View All | Hidden | Hidden | Hidden |
| **WhatsApp Dispatch History** | View All | Hidden | Hidden | Hidden |
| **Subscription Quotas & Grace Banner** | Full Access | Hidden | Hidden | Hidden |

> [!NOTE]
> **Super Admin / Platform Management Separation**: System Admins (`ADMIN` / Super Admin) manage global centers and billing via a completely separate dashboard application. This application strictly implements center-level operations.

---

## 🎨 Design System & Aesthetics

The application implements the **"Deep Forest Professional"** design system defined in `DESIGN_SYSTEM.md`, replacing standard admin template tropes with an intentional, tactile academic visual identity.

### 1. Palette & Surface Tokens
- **Page Canvas (`--background`)**: `#FAF6EC` (Warm Cream Canvas).
- **Primary Brand (`--primary`)**: `#18362E` (Deep Forest Slate-Green).
- **Focal Accent (`--accent`)**: `#B45309` (Warm Amber/Ochre, strictly reserved for key calls-to-action and active navigation pills).
- **Tactile Borders (`--border`)**: `#E3DBC7` (Crisp 1px stone borders instead of blurry shadows).
- **Secondary Surfaces (`--secondary` / `--card-secondary`)**: `#F1EAD9` (Parchment tone for table headers and nested wells).
- **Sidebar (`--sidebar`)**: `#122923` (Deep evergreen slate).

### 2. Semantic Attendance Status Tokens
| Status | Arabic Label | Text Token | Background Token | Border Token |
| :--- | :--- | :--- | :--- | :--- |
| **Present** | حاضر | `text-emerald-800` | `bg-emerald-50/80` | `border-emerald-200/80` |
| **Late** | متأخر | `text-amber-800` | `bg-amber-50/80` | `border-amber-200/80` |
| **Absent** | غائب | `text-rose-800` | `bg-rose-50/80` | `border-rose-200/80` |
| **Excused** | مستأذن | `text-slate-700` | `bg-stone-100/80` | `border-stone-300/80` |

### 3. Typography
- **Primary Typeface**: **Cairo** (`--font-cairo`), loaded natively through `next/font/google` with weights `300` through `800`.
- **RTL Support**: Enforced globally on the root `<html>` element (`dir="rtl" lang="ar"`).

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) | `16.2.9` | App Router, Server Components, Turbopack, Server Actions |
| **Runtime** | [React](https://react.dev/) | `19.2.4` | Modern UI rendering library with Concurrent Features |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5.0.0` | Strict type safety, interface definitions, and DTO types |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^4.0.0` | Utility-first styling with `@theme` block in `globals.css` |
| **CSS Animations**| `tw-animate-css` | `^1.4.0` | Declarative transitions and keyframe animations |
| **Primitives** | [Radix UI](https://www.radix-ui.com/) | `^1.6.1` | Unstyled, accessible UI primitives (Dialogs, Dropdowns, Tabs) |
| **Component Kit** | [shadcn/ui](https://ui.shadcn.com/) | `^4.12.0` | Accessible component building blocks |
| **Server State** | [TanStack React Query](https://tanstack.com/query) | `^5.101.2` | Client data fetching, caching, and mutation orchestration |
| **Data Tables** | [TanStack Table](https://tanstack.com/table) | `^8.21.3` | Headless sorting, pagination, and data grid rendering |
| **Forms** | [React Hook Form](https://react-hook-form.com/) | `^7.80.0` | Performant uncontrolled forms with change tracking |
| **Validation** | [Zod](https://zod.dev/) | `^4.4.3` | Runtime schema validation and TypeScript type inference |
| **Client State** | [Zustand](https://zustand.docs.pmnd.rs/) | `^5.0.15` | Transient cross-component state (subscription warnings) |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.22.0` | Lightweight, scalable vector icons |
| **Motion** | [Motion](https://motion.dev/) | `^12.42.2` | Fluid micro-interactions and route animations |
| **Notifications**| [Sonner](https://sonner.emilkowal.ski/) | `^2.0.7` | Toast notifications wired to mutation lifecycles |
| **Date Utilities**| [date-fns](https://date-fns.org/) | `^4.4.0` | Arabic locale date formatting and schedule math |
| **Compiler** | `babel-plugin-react-compiler` | `1.0.0` | React Compiler optimization plugin |

---

## 📂 Repository & Project Structure

The project follows a clean, feature-driven architecture. Global utilities and generic components reside in root folders, while domain-specific logic is entirely encapsulated within `src/features/`.

```
educenter-website-2/
├── .agents/                      # AI rules, custom skills, and engineering standards
├── public/                       # Static public assets, icons, and logos
├── src/
│   ├── app/                      # Next.js 16 App Router routes and page layouts
│   │   ├── (landing)/            # Public routes: Landing page, Login, Password flows, Parent Portal
│   │   │   ├── change-password/  # Mandatory first-login password change
│   │   │   ├── forgot-password/  # 6-digit OTP dispatch flow
│   │   │   ├── login/            # Authentication form
│   │   │   ├── p/[token]/        # Public Parent Magic Report portal
│   │   │   ├── reset-password/   # OTP verification and password reset
│   │   │   └── page.tsx          # Marketing home page
│   │   ├── (logged-in)/          # Protected center-scoped dynamic routes
│   │   │   └── [centerSlug]/     # Dynamic tenant route parameter
│   │   │       ├── (center-owner)/owner/ # Center Owner dashboard & resource pages
│   │   │       ├── (instructor)/teacher/ # Teacher assigned groups & attendance
│   │   │       ├── (student)/student/   # Student read-only academic portal
│   │   │       ├── layout.tsx    # Center slug resolver & layout wrapper
│   │   │       └── page.tsx      # Role redirector to /:slug/owner, /teacher, /student
│   │   ├── subscription-required/# Read-only / inactive subscription notice page
│   │   ├── globals.css           # Tailwind v4 @theme inline tokens & CSS variables
│   │   ├── layout.tsx            # Root HTML layout (RTL, Cairo font, Sonner Toaster)
│   │   ├── manifest.ts           # Web application manifest configuration
│   │   ├── robots.ts             # Search engine crawling rules
│   │   └── sitemap.ts            # Dynamic sitemap index
│   ├── components/               # Global reusable UI components
│   │   ├── common/               # Enterprise components: SharedTable, TableToolbar,
│   │   │                         # SharedModal, ConfirmDialog, FormSelect, FilterDropdown
│   │   ├── layout/               # Header, Footer, navigation links, and mobile drawer
│   │   └── ui/                   # Low-level Radix/shadcn primitives (button, badge, dialog)
│   ├── constants/                # Global static constants (dropdown options, roles, limits)
│   ├── features/                 # Modular domain features (15 modules)
│   │   ├── admins/               # Center manager management components & types
│   │   ├── attendance/           # Daily attendance sessions, records & group reports
│   │   ├── audit-logs/           # Operational audit trail tables & filters
│   │   ├── auth/                 # Server actions (login, logout, OTP reset, change-password)
│   │   ├── dashboard/            # Shell layout, Sidebar, DashboardHeader, Route configs
│   │   ├── grades/               # Academic grades CRUD, tables, modals & schemas
│   │   ├── groups/               # Class groups, schedules, roster & fee payment grids
│   │   ├── landing/              # Marketing sections (Hero, Features, Pricing, Testimonials)
│   │   ├── notifications/        # WhatsApp dispatch log history
│   │   ├── parent-portal/        # Public parent report card components & actions
│   │   ├── students/             # Student records, enrollment forms & parent link actions
│   │   ├── subjects/             # Academic subjects catalog linked to grades
│   │   ├── subscription/         # Plan limits, usage metrics, grace banner & Zustand store
│   │   ├── teachers/             # Instructor catalog, subject assignments & profiles
│   │   └── users/                # Center users directory & status toggle actions
│   ├── hooks/                    # Reusable React hooks
│   │   ├── useCrudModal.ts       # Standardized create/edit modal state helper
│   │   ├── useDebounce.ts        # Input debouncing hook
│   │   ├── useOnClickOutside.ts  # Outside click/touch listener for popovers
│   │   ├── useResetOnChange.ts   # Cascading dropdown reset hook
│   │   └── useTableFilters.ts    # URL search parameters synchronized data table hook
│   ├── lib/
│   │   ├── api/
│   │   │   ├── apiClient.ts      # Isomorphic unified fetch client (serverApiClient)
│   │   │   ├── buildParams.ts    # URL query parameter builder
│   │   │   └── handleResponseToast.ts # Centralized Sonner feedback handler
│   │   └── utils.ts              # Class name merger helper (cn)
│   ├── providers/
│   │   └── ReactQueryProvider.tsx # TanStack Query provider with MutationCache toast sync
│   ├── proxy.ts                  # Next.js 16 Edge runtime route protection & role redirection
│   ├── types/                    # Core TypeScript interfaces, ApiResponse, UserRole, Meta
│   └── utils/                    # Pure deterministic helpers (time, schedule, options)
├── next.config.ts                # Next.js configuration & backend /uploads rewrite proxy
├── package.json                  # Dependencies, scripts, and package metadata
├── postcss.config.mjs            # PostCSS plugin pipeline (@tailwindcss/postcss)
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 📋 Prerequisites

Before setting up the project locally, verify that your environment satisfies:

- **Node.js**: `v20.10.0` or higher (Node.js 20 LTS or Node.js 22 LTS recommended).
- **Package Manager**: `npm` `v10.x` or higher (bundled with Node.js).
- **Backend API**: Running instance of the **EduCenter API** service (typically running at `http://localhost:5000`).

---

## ⚙️ Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/AhmedHamdy434/educenter-website-2.git
cd educenter-website-2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` (or `.env.local`) file in the root directory:
```bash
cp .env.example .env
```
Ensure the variables point to your local or staging backend API:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
```

The application will start at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔐 Environment Variables

The application relies on the following environment variables:

| Variable | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | **Yes** | `http://localhost:5000` | Base URL of the backend REST API server. Used by `serverApiClient` and Next.js asset rewrites. |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `http://localhost:3000` | Canonical site URL used for Open Graph metadata, Twitter cards, and sitemaps. |

> [!IMPORTANT]
> Never commit `.env` or production credentials to version control. The repository ignores `.env*` files via `.gitignore`.

---

## 📜 Available Scripts

The following npm scripts are defined in [package.json](file:///d:/front/projects/center-education-saas-2/educenter-website-2/package.json):

```bash
# Start Next.js development server with Turbopack enabled
npm run dev

# Create an optimized production build
npm run build

# Start the compiled production server
npm run start

# Run ESLint to verify code quality and style rules
npm run lint

# Run TypeScript compiler type-checking without emitting files
npx tsc --noEmit
```

---

## 🛡️ Authentication, Cookies & Edge Proxy

### 1. The Next.js 16 Edge Proxy (`src/proxy.ts`)
Authentication and role boundaries are enforced at the network edge using Next.js 16's named `proxy` function:
- **Token Extraction**: Decodes the JWT from the `token` cookie safely in Edge runtime.
- **Expiration Check**: Validates `payload.exp`. If expired, it automatically deletes the `token` cookie and redirects unauthenticated protected route requests to `/login`.
- **Role Verification**: Ensures that only `OWNER`, `TEACHER`, and `STUDENT` roles access their authorized path segment (`/[centerSlug]/owner`, `/[centerSlug]/teacher`, `/[centerSlug]/student`).
- **Slug Verification**: When accessing `/[centerSlug]/*`, `src/app/(logged-in)/[centerSlug]/layout.tsx` verifies that the route slug matches `user.center.slug`. Mismatched slugs are redirected to the user's legitimate center.

### 2. Cookie Lifespan Alignment
- The backend access token has a **24-hour lifespan** (`86,400 seconds`).
- The `token` and `centerSlug` cookies are written with `httpOnly: true`, `sameSite: "strict"`, and `maxAge: 86400` in `loginAction` to prevent session drift and RSC `401 Unauthorized` noise.

### 3. Password Lifecycle
- **Mandatory Change (`mustChangePassword`)**: If a user logs in with temporary credentials, `loginAction` detects `mustChangePassword === true`, triggering a redirection to `/change-password` to execute `PATCH /api/auth/change-password`.
- **Forgot / Reset Flow**:
  - `POST /api/auth/forgot-password` sends a 6-digit OTP code with a 10-minute validity.
  - `POST /api/auth/reset-password` accepts `{ email, otp, newPassword }` to restore account access.

---

## ⏳ Subscription Lifecycle & Grace Period

EduCenter implements full subscription lifecycle enforcement to protect tenant billing:

```
 Active Subscription          Grace Period (3 Days)          Expired (Read-Only)
┌──────────────────────┐    ┌─────────────────────────┐    ┌──────────────────────────┐
│ All Operations Open  │───►│ X-Subscription-Warning  │───►│ Mutating actions blocked │
│ POST, PUT, DELETE ok │    │ Amber banner for OWNER  │    │ Redirect to /subscription│
└──────────────────────┘    └─────────────────────────┘    └──────────────────────────┘
```

1. **Grace Period Header**:
   - The backend includes the header: `X-Subscription-Warning: Grace period active. X days remaining.`
   - `serverApiClient` extracts this header and populates the Zustand store (`useSubscriptionStore`).
2. **Owner-Only Visibility**:
   - The warning banner renders **only** on Center Owner dashboards (`DashboardLayoutClient`). Instructors and students are not burdened with billing notices.
3. **Read-Only Enforcement**:
   - After grace period expiry, mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`) return `403 Forbidden` with error code `CENTER_SUBSCRIPTION_INACTIVE`.
   - `serverApiClient` automatically redirects the browser to `/subscription-required`.

---

## 🔌 API Integration & Endpoint Catalog

All outbound communication is unified under `serverApiClient` (`src/lib/api/apiClient.ts`), prepending `/api` to endpoints and standardizing responses into:
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    filename?: string;
  };
}
```

### Verified Endpoints Catalog

#### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/login` | Authenticate user with email/phone & password | No |
| `GET` | `/auth/me` | Fetch authenticated user profile & center details | Yes |
| `POST` | `/auth/logout` | Clear server session & invalidate tokens | Yes |
| `POST` | `/auth/forgot-password` | Dispatch 6-digit password reset OTP code | No |
| `POST` | `/auth/reset-password` | Verify OTP code and set new account password | No |
| `PATCH` | `/auth/change-password` | Change password for accounts flagged `mustChangePassword` | Yes |

#### 📚 Academic Grades (`/api/grades`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :---: |
| `GET` | `/grades` | Paginated grades list with search & active filter | `OWNER` |
| `GET` | `/grades/:id` | Retrieve single grade details | `OWNER` |
| `POST` | `/grades` | Create new academic grade | `OWNER` |
| `PATCH` | `/grades/:id` | Update grade title, description, or order | `OWNER` |
| `PATCH` | `/grades/:id/toggle-status` | Toggle grade active / inactive status | `OWNER` |
| `DELETE` | `/grades/:id` | Delete grade record | `OWNER` |

#### 📖 Subjects Catalog (`/api/subjects`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :---: |
| `GET` | `/subjects` | Paginated subjects list filtered by grade or search | `OWNER` |
| `GET` | `/subjects/options` | Lightweight dropdown options filtered by `gradeId` | `OWNER`, `TEACHER` |
| `POST` | `/subjects` | Create subject bound to a grade | `OWNER` |
| `PATCH` | `/subjects/:id` | Update subject name or description | `OWNER` |
| `PATCH` | `/subjects/:id/toggle-status`| Toggle subject active status | `OWNER` |
| `DELETE` | `/subjects/:id` | Delete subject record | `OWNER` |

#### 👨‍🏫 Instructors (`/api/teachers`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :---: |
| `GET` | `/teachers` | Paginated teachers list with grade/subject filters | `OWNER` |
| `POST` | `/teachers` | Create teacher account with subject assignments | `OWNER` |
| `PATCH` | `/teachers/:id` | Update teacher details, bio, or subject links | `OWNER` |
| `PATCH` | `/teachers/:id/toggle-status`| Toggle instructor account status | `OWNER` |
| `DELETE` | `/teachers/:id` | Remove instructor record | `OWNER` |

#### 🧑‍🎓 Students & Enrollments (`/api/students`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :---: |
| `GET` | `/students` | Paginated student registry filtered by grade & status | `OWNER` |
| `POST` | `/students` | Register student, parent contact & grade enrollment | `OWNER` |
| `PATCH` | `/students/:id` | Update student profile & guardian phone | `OWNER` |
| `PATCH` | `/students/:id/toggle-status`| Toggle student active status | `OWNER` |
| `DELETE` | `/students/:id` | Delete student record | `OWNER` |
| `GET` | `/students/:id/payments` | Retrieve tuition fee payment history | `OWNER`, `TEACHER`, `STUDENT` |
| `GET` | `/students/:id/attendance/report` | Retrieve student attendance summary & logs | `OWNER`, `STUDENT` |

#### 👥 Class Groups & Schedules (`/api/groups`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :---: |
| `GET` | `/groups` | List groups (scoped to instructor for `TEACHER`) | `OWNER`, `TEACHER` |
| `GET` | `/groups/:id` | Detailed group data, schedule & student roster | `OWNER`, `TEACHER` |
| `POST` | `/groups` | Create class group with timetable and fee | `OWNER` |
| `PATCH` | `/groups/:id` | Update group schedule, capacity, or monthly fee | `OWNER` |
| `PATCH` | `/groups/:id/toggle-status` | Toggle group active status | `OWNER` |
| `DELETE` | `/groups/:id` | Delete class group | `OWNER` |
| `POST` | `/groups/:id/students` | Enroll students into group with start date | `OWNER` |
| `DELETE` | `/groups/:id/students` | Remove students from group roster | `OWNER` |
| `GET` | `/groups/:id/payments` | Group student tuition payments matrix | `OWNER` |
| `POST` | `/group-students/:id/payments`| Record monthly tuition payment | `OWNER` |

#### 📅 Attendance Engine (`/api/groups/:groupId/attendance`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :---: |
| `POST` | `/groups/:groupId/attendance/session` | Create or fetch today's attendance session | `OWNER`, `TEACHER` |
| `GET` | `/groups/:groupId/attendance/session/:id` | Retrieve session roster & marked statuses | `OWNER`, `TEACHER` |
| `POST` | `/groups/:groupId/attendance/session/:id/save`| Save attendance statuses & excuse notes | `OWNER`, `TEACHER` |
| `GET` | `/groups/:groupId/attendance/sessions` | List all historical sessions for group | `OWNER`, `TEACHER` |
| `GET` | `/groups/:groupId/attendance/report` | Statistical group report (rates, top absentees)| `OWNER`, `TEACHER` |

#### 🔗 Parent Magic Link Portal (`/api/p`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :---: |
| `POST` | `/p/generate/:studentId` | Generate signed 30-day parent magic report link | `OWNER`, `TEACHER` |
| `GET` | `/p/:token` | Retrieve student attendance, enrollments & fees | Public (Signed Token) |

#### 📊 Center Audit, Notifications & Subscriptions
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :---: |
| `GET` | `/users` | Paginated center users list filtered by role | `OWNER` |
| `PATCH` | `/users/:id` | Toggle user active status | `OWNER` |
| `GET` | `/audit-logs` | Filterable operational and security audit trail | `OWNER` |
| `GET` | `/notifications` | WhatsApp dispatch log and message statuses | `OWNER` |
| `GET` | `/centers/my-subscription` | Active center plan limits and resource quotas | `OWNER` |
| `GET` | `/subscription-plans` | Public marketing subscription plans | Public |

#### 📥 Exports & Batch Imports
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :---: |
| `GET` | `/:entity/export/excel` | Stream formatted Excel file of current entity grid | `OWNER` |
| `GET` | `/:entity/export/pdf` | Stream formatted PDF document of current entity grid | `OWNER` |
| `GET` | `/:entity/export/template`| Download blank Excel template for batch import | `OWNER` |
| `POST` | `/:entity/import/excel` | Upload and process Excel file (`multipart/form-data`) | `OWNER` |

---

## 🧪 Testing & Quality Assurance

- **Current Testing Setup**: The project does not currently configure an automated test runner (such as Jest, Vitest, Cypress, or Playwright).
- **Code Quality Verification**:
  - **Static Type Checking**: Verified via `npx tsc --noEmit` against TypeScript 5 strict configurations.
  - **Linting**: Verified via `npm run lint` using ESLint 9 and `eslint-config-next`.
  - **React Compiler**: `babel-plugin-react-compiler` enforces hook and memoization safety.

---

## 🚀 Production Deployment

### 1. Build the Application
```bash
npm run build
```
This generates the optimized `.next` build output utilizing Next.js 16 App Router optimizations.

### 2. Start the Production Server
```bash
npm run start
```

### 3. Vercel Deployment
Deploying to [Vercel](https://vercel.com/) is fully supported out of the box:
1. Connect the GitHub repository `AhmedHamdy434/educenter-website-2`.
2. Configure environment variables (`NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_SITE_URL`) in the Vercel dashboard.
3. Deploy directly on the Next.js preset.

### 4. Docker / Self-Hosted Node.js
When deploying within a container:
- Ensure `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_SITE_URL` are supplied at build time (Next.js inlines `NEXT_PUBLIC_*` variables during compilation).
- Forward port `3000` to your reverse proxy (e.g. Nginx, Caddy, or Cloudflare Tunnel).
- Ensure the backend API server is reachable over the private network or public URL.

---

## 🔒 Security & Best Practices

1. **HTTP-Only Cookies**: JWT access tokens are stored in secure, `httpOnly: true`, `sameSite: "strict"` cookies. Client-side JavaScript cannot read or leak tokens via XSS.
2. **Edge Route Protection**: All protected routes are intercepted at the network edge in `src/proxy.ts`, discarding expired sessions before server components execute.
3. **Tenant Boundary Enforcement**: Dynamic routes enforce that `user.center.slug` strictly matches `/[centerSlug]/*`. Cross-center URL tampering is immediately caught and redirected.
4. **No Ghost Fields**: Form schemas and TypeScript types strictly match backend database DTOs, eliminating phantom properties or unhandled payload injections.
5. **Sanitized Input & Zod Validation**: All client mutations are validated with runtime Zod schemas before submission to the API layer.
6. **Zero Secrets in Code**: No sensitive API keys or private certificates exist in client or repository code.

---

## 🤝 Contributing

Contributions to **EduCenter** must strictly adhere to the engineering standards detailed in `.agents/rules/`:

1. **Review Rules**: Read `PROJECT_RULES.md` and `.agents/rules/` before writing code.
2. **Component Size**: Keep React components focused, stateless where possible, and under 150 lines.
3. **Decouple Business Logic**: Pages only compose layouts. Data fetching and mutation handling belong in `actions/` or `hooks/`.
4. **Arabic UI Standard**: All user-facing text, error messages, and feedback toasts must use grammatically standard Arabic.
5. **No Raw Fetch**: Use `serverApiClient` for all network requests.
6. **No `any` Types**: TypeScript strict mode is enabled throughout the project.
7. **Verify Builds**: Run `npx tsc --noEmit` and `npm run lint` before committing changes.

---

## 📄 License

This software is **Proprietary and Confidential**. All rights reserved.  
Unauthorized copying, modification, distribution, or commercial deployment of this codebase, via any medium, is strictly prohibited without explicit written permission from the project owners.
