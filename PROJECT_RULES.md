# Project Rules & Coding Standards

This document defines the mandatory engineering standards, architectural patterns, and rules for the **EduCenter SaaS** project. Every developer and AI assistant must follow these rules without exception.

---

## 1. General Principles
*   **Keep Components Small**: Single responsibility, under 150 lines. Extract sub-components early.
*   **Reuse Before Creating**: Search the codebase before writing any component or utility helper.
*   **Decouple Business Logic**: Page files must only compose layouts. Logic and fetching belong in actions or hooks.
*   **Arabic Language Standard**: All user-facing copies, error banners, and toast messages must be in professional Arabic.

---

## 2. Directory Structure
```
src/
├── app/                  # Next.js pages, layouts, and route definitions only
├── components/           # Global reusable UI (ui/, layout/, common/)
├── features/             # Modular domain features (auth/, landing/)
├── hooks/ / providers/   # Global React hooks and Context providers
├── lib/ / types/         # Library configurations (apiClient.ts) and TS types
├── utils/ / constants/   # Pure utility helpers and static configurations
└── proxy.ts              # Next.js 16 route protection & redirects
```

---

## 3. Feature-Based Architecture
Encapsulate feature-specific logic inside `src/features/<feature-name>/`:
- Component-scoped UI, hooks, actions/services, types, and validation schemas must remain local.
- Promote files to global directories ONLY when shared across two or more distinct features.

---

## 4. Page & Component Rules
*   **Pages (`page.tsx`)**: Must remain server-rendered by default, containing zero inline event handlers or state.
*   **Leaves Interactivity**: Place `"use client"` only at leaf components requiring browser state or handlers.
*   **Presentational components**: Keep UI components stateless (accept props, emit callbacks) and store them in `src/components/ui`.

---

## 5. API Layer & Next.js 16 Proxy
*   **No Raw Fetch**: All HTTP requests must use `serverApiClient` in [apiClient.ts](file:///d:/front/projects/center-education-saas/educenter-website/src/lib/api/apiClient.ts).
*   **Direct Server Calls**: Calls from Server Actions/Components fetch directly from `process.env.NEXT_PUBLIC_API_BASE_URL`.
*   **Next.js 16 Proxy**:
    - Route protection, authentication, and role-based redirects are handled in `src/proxy.ts` using the Next.js 16 named export `proxy` function.
    - Matcher excludes: `api`, static assets (`_next`), and Next.js internal files.

---

## 6. React Query (TanStack Query)
*   **Query Keys**: Standardize key structures using structured object factories.
*   **Cache Invalidation**: Always trigger `queryClient.invalidateQueries` on successful mutations.
*   **Scope**: Use React Query only for shared server state. Do not use for transient UI states or forms.

---

## 7. Forms & Validation
*   **Tech Stack**: Always combine `react-hook-form` + `@hookform/resolvers/zod` + `zod`.
*   **Location**: Validation schemas must live in `features/<feature>/schemas/<name>-schema.ts`.
*   **Inputs**: Prefer uncontrolled inputs utilizing `register` for maximum render performance.

---

## 8. TypeScript Rules
*   **Strict Mode**: The `any` type is strictly forbidden. Use `unknown` or specify explicit types/interfaces.
*   **Types vs. Interfaces**: Use `interface` for structural object definitions/props; use `type` for unions/intersections.
*   **Payload Suffixes**: Suffix request payloads with `DTO` (e.g., `UpdateUserDTO`) and validate them.

---

## 9. Styling (Tailwind CSS)
*   **Utility First**: Use Tailwind classes exclusively. No custom inline styles.
*   **Design Tokens**: Reference color variables (e.g., `text-primary`) rather than hardcoding hex/rgb values.
*   **Conditional Classes**: Always merge conditional Tailwind classes using the `cn()` utility.

---

## 10. State Management
*   **Local UI**: Use `useState` for simple UI toggles, tabs, and modals.
*   **Server State**: Delegate to Next.js Cache or React Query.
*   **Global UI**: Use React Context or Zustand for cross-feature UI states.
*   **Derived Data**: Calculate values on the fly. Do not duplicate state for derived calculations.

---

## 11. Custom Hooks
*   Prefix all custom hooks with `use`.
*   Create hooks to encapsulate complex state interactions, keeping React components clean and focused.

---

## 12. Constants & Utilities
*   **Constants**: Name variables in `UPPER_SNAKE_CASE` (e.g., `API_TIMEOUT_MS`). Group local configurations inside the feature's constants folder.
*   **Utilities**: Write helpers as pure, deterministic functions (e.g., date formats, currency parsers) inside `src/utils/`.

---

## 13. Error Handling
*   **Standard Response**: API methods must return `{ success: boolean, message: string, data?: T }`.
*   **Toasts**: Always call `handleResponseToast(result)` from `@/lib/api/handleResponseToast` for client-side feedback.
*   **Uncaught Errors**: Use Next.js `error.tsx` page boundaries to capture unhandled rendering failures.

---

## 14. Authentication & Role Protection
*   **Token Storage**: Store JWT tokens in secure, HTTP-only `token` cookies.
*   **Route Redirection**: Checked inside `src/proxy.ts`. Valid roles are `OWNER`, `TEACHER`, and `STUDENT`.
    - Unauthenticated requests redirect to `/login`.
    - Accessing `/dashboard` redirects to `/dashboard/center-owner`, `/dashboard/instructor`, or `/dashboard/student` based on the user's role.

---

## 15. Naming Conventions
*   **Components**: PascalCase (e.g., `LoginForm.tsx`)
*   **Hooks / Utilities**: camelCase (e.g., `useAuth.ts`, `formatDate.ts`)
*   **Types / Interfaces**: PascalCase (e.g., `ApiResponse<T>`)
*   **Schemas**: camelCase with `-schema` suffix (e.g., `loginSchema`)
*   **Zod Types**: PascalCase with `Values` suffix (e.g., `LoginFormValues`)

---

## 16. Import Order
1.  React and Next.js libraries
2.  Third-party modules (`sonner`, `lucide-react`)
3.  Absolute paths (`@/components`, `@/lib`)
4.  Relative feature paths (`../components`, `./utils`)
5.  Styles/Types

---

## 17. Performance Optimization
*   Use Next.js `<Image />` with defined sizes.
*   Lazy-load massive components using `next/dynamic`.
*   Optimize renders using `useMemo` and `useCallback` for expensive operations.

---

## 18. Code Review Checklist
*   [ ] Checked and reused existing components/helpers?
*   [ ] Decoupled code correctly inside `src/features/<feature>/`?
*   [ ] Checked that no `any` types were used?
*   [ ] Handled loading, empty, and error states?
*   [ ] Called `handleResponseToast()` for user notifications?
*   [ ] Verified code builds cleanly (`npx tsc --noEmit`) and passes `npm run lint`?
