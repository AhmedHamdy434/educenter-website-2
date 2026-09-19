# 🎓 EduCenter - Educational Centers Management SaaS

**EduCenter** is an enterprise-grade, high-performance Software-as-a-Service (SaaS) platform designed to streamline the operations of modern educational centers, academies, and private tutors. The application facilitates student tracking, teacher assignments, courses/grades enrollment, exam execution, financial subscription plans, and deep analytical reports under a unified Arabic-first interface.

---

## 🚀 Key Features

*   **Arabic-First UI/UX**: Designed natively in professional Arabic utilizing modern typography (Cairo font), fluid animations, and premium dark/light interfaces.
*   **Role-Based Access Control (RBAC)**: Comprehensive permission boundaries separating **Owners/Admins**, **Instructors**, and **Students** with automatic path routing.
*   **Isomorphic Fetch Architecture**: Custom unified API Client (`serverApiClient`) with dynamic client/server detection and seamless isomorphic cookie forwarding.
*   **Next.js 16 Edge Proxy**: Secure client-side route guard using the latest `proxy.ts` Edge specification to enforce authentication and roles checks.
*   **Modular Feature Architecture**: Highly structured directory design prioritizing clean decoupling of domain concerns.
*   **Performant Forms & Validation**: High-performance uncontrolled forms using `react-hook-form` coupled with runtime schema enforcement via `zod`.
*   **TanStack Query State Sync**: Optimized client data fetching, mutation synchronization, and aggressive cache management.

---

## 🛠️ Technology Stack

| Technology | Purpose | Key Libraries / Features |
| :--- | :--- | :--- |
| **Framework** | Server-Side Rendering & Routing | Next.js 16 (App Router), React 19 |
| **Language** | Strict Type Safety | TypeScript 5.x |
| **Styling** | Utility-first responsive design | Tailwind CSS 4.x, tw-animate-css |
| **UI Components** | Accessible Primitive base | shadcn/ui, Radix UI |
| **Form Handling** | Performance-oriented validation | React Hook Form, `@hookform/resolvers` |
| **Validation** | Schema declarations | Zod |
| **Data Fetching** | Server State management | TanStack React Query v5 |
| **Visual Feedback** | Toast Alerts & Transitions | Sonner, Motion (Framer Motion) |

---

## 📂 Architecture & Directory Structure

The repository follows a clean, feature-driven architecture. Common global structures reside at the root level of `src`, while domain-specific logic is entirely encapsulated within modular features.

```
src/
├── app/                  # Next.js App Router Pages and Layouts (Layout composition only)
├── components/           # Domain-independent global components
│   ├── ui/               # Low-level primitive components (shadcn/ui)
│   └── common/           # Custom reusable primitives (FormInput, MotionWrapper)
├── features/             # Feature-based modular directories
│   ├── auth/             # Authentication feature (Login, Register actions, LoginForm component)
│   └── landing/          # Customer-facing marketing components and plans
├── lib/                  # Library configurations and shared clients (apiClient)
├── types/                # Project-wide TypeScript interfaces and types
├── utils/                # Pure utility helpers (date formats, currency parses)
├── constants/            # Global constant configurations (routes, roles)
└── proxy.ts              # Next.js 16 Route Protection and redirection layer
```

Each module under `src/features/<name>/` strictly exposes its internal API through structured sub-directories:
*   `actions/` — Server Actions.
*   `components/` — Feature UI components.
*   `schemas/` — Validation rules.
*   `types/` — Domain types.

---

## 🏁 Getting Started

### Prerequisites

*   Node.js 20.x or higher
*   NPM 10.x or higher
*   Backend API service running (usually [educenter-api](file:///d:/front/projects/center-education-saas/educenter-api))

### Installation

1.  Clone the repository and navigate to the directory:
    ```bash
    git clone https://github.com/AhmedHamdy434/educenter-website.git
    cd educenter-website
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` (or `.env.local`) in the root directory:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛡️ Route Protection & Middleware (Proxy)

Next.js 16 named `proxy.ts` specification handles authentication and role redirection at the network edge:
*   Unauthenticated users are restricted only to the Homepage (`/`) and Login page (`/login`).
*   Authenticated sessions automatically redirect `/dashboard` request entry-points to role-specific layouts:
    *   `OWNER` $\rightarrow$ `/dashboard/center-owner`
    *   `TEACHER` $\rightarrow$ `/dashboard/instructor`
    *   `STUDENT` $\rightarrow$ `/dashboard/student`
*   Cross-role page requests (e.g. a student requesting Owner pages) are immediately caught and redirected back.

---

## 📜 Development Guidelines

To contribute or write code for this repository, you **must** strictly review and follow the standards listed in [PROJECT_RULES.md](file:///d:/front/projects/center-education-saas/educenter-website/PROJECT_RULES.md). Key constraints include:
1.  **Zero inline business logic inside pages**: Pages only orchestrate layouts.
2.  **No `any` types**: Enforce strict TS configurations.
3.  **Arabic Language Standard**: All UI copy and feedback toasts must use Cairo typography and standard Arabic grammar.
4.  **No Raw Fetch**: Use `serverApiClient` for all outbound API communication.
