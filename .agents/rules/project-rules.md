---
trigger: always_on
---

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

## 9. State Management
*   **Local UI**: Use `useState` for simple UI toggles, tabs, and modals.
*   **Server State**: Delegate to Next.js Cache or React Query.
*   **Global UI**: Use React Context or Zustand for cross-feature UI states.
*   **Derived Data**: Calculate values on the fly. Do not duplicate state for derived calculations.

---

## 10. Custom Hooks
*   Prefix all custom hooks with `use`.
*   Create hooks to encapsulate complex state interactions, keeping React components clean and focused.

---

## 11. Constants & Utilities
*   **Constants**: Name variables in `UPPER_SNAKE_CASE` (e.g., `API_TIMEOUT_MS`). Group local configurations inside the feature's constants folder.
*   **Shared Dropdown Constants**: Common dropdown options (`DEFAULT_LIMIT`, `LIMITS`, `STATUSES`) must be imported from `@/constants/dropdown-options` instead of re-defining them locally.
*   **Shared Table Filters Hook (`useTableFilters`)**: All list tables must use `@/hooks/useTableFilters` to synchronize pagination (`page`, `limit`), search (`search`), custom filters, and sorting (`sortBy`, `sortOrder`, `sorting`, `onSortingChange`) with URL search parameters. Filter and sorting updates automatically reset `page` to 1.
*   **Shared CRUD Modal Hook (`useCrudModal`)**: All entity create/edit modal states must use `@/hooks/useCrudModal<T>()` providing `{ isOpen, selectedItem, openCreate, openEdit, close }`, eliminating redundant per-feature Zustand modal stores. Its action handlers must be memoized via `useCallback` to maintain reference stability and prevent invalidating downstream `useMemo` hooks (such as table columns).
*   **Query Parameter Sanitization**: When extracting filter values from URL params via `useTableFilters` to pass to TanStack Query hooks or API clients, sanitize empty strings (e.g., `active: active || undefined`) so empty strings are omitted from query payloads.
*   **Utilities**: Write helpers as pure, deterministic functions (e.g., date formats, currency parsers) inside `src/utils/`.
*   **Shared Date & Time Utilities**: All schedule selectors (day list, hours, minutes, period dropdown options) and the time formatter function `formatTime` must be imported from `@/utils/time` instead of being re-declared locally in forms and columns.
*   **Utility Reusability Check**: Before using or creating any helper/utility function (e.g., date formatters), verify if it is already present in the shared `src/utils/` directory. If it is not present, implement it inside the shared directory instead of writing a local/duplicate version.

---

## 12. Error Handling
*   **Standard Response**: API methods must return `{ success: boolean, message: string, data?: T }`.
*   **Toasts**: Centralized via `MutationCache` in `ReactQueryProvider.tsx` which automatically triggers `handleResponseToast(result)` for all React Query mutations (with optional opt-out via `meta: { skipToast: true }`). For direct non-mutation client calls, manually call `handleResponseToast(result)` from `@/lib/api/handleResponseToast`.
*   **Uncaught Errors**: Use Next.js `error.tsx` page boundaries to capture unhandled rendering failures.

---

## 13. Authentication, Role Protection & Center Lifecycle
*   **Token Storage**: Store JWT tokens in secure, HTTP-only `token` cookies.
*   **Role Hierarchy & Scopes**:
    - Valid application roles: `OWNER` (Center Owner), `TEACHER` (Class Instructor), `STUDENT` (Enrolled Pupil), and public guest parent viewers.
    - Note: System Admins / Center Managers (`ADMIN` / Super Admin) use their own separate standalone dashboard application and are not routed here.
    - `OWNER` navigates `/[centerSlug]/owner` (includes appointing center managers via `/users`, managing catalog, groups, and center subscription).
    - `TEACHER` navigates `/[centerSlug]/teacher` (scoped strictly to assigned groups, attendance recording, tuition status of taught students, and magic link generation).
    - `STUDENT` navigates `/[centerSlug]/student` (strictly isolated read-only personal progress, attendance history, and payment logs).
*   **Route Redirection (`proxy.ts`)**:
    - Public allowed routes: `/`, `/login`, `/forgot-password`, `/reset-password`, `/change-password`, and `/p/*` (Parent Magic Link Portal).
    - Protected application routes are scoped by center slug: `/[centerSlug]/owner`, `/[centerSlug]/teacher`, `/[centerSlug]/student`.
    - Unauthenticated requests to protected routes redirect to `/login`.
    - Authenticated users accessing `/login` are routed to their role-specific dashboard (`/[centerSlug]/owner`, `/[centerSlug]/teacher`, `/[centerSlug]/student`).
    - Role guards strictly protect: `/:slug/owner/*` for `OWNER`, `/:slug/teacher/*` for `TEACHER`, and `/:slug/student/*` for `STUDENT`.
*   **Security & Password Lifecycle**:
    - Mandatory password change when `mustChangePassword === true` using `PATCH /auth/change-password`.
    - OTP Forgot Password flow: `POST /auth/forgot-password` (10-min OTP countdown) and `POST /auth/reset-password`.
*   **Subscription Grace Period & Read-Only Protection**:
    - Capture `X-Subscription-Warning` response header and display grace period banner to `OWNER` **only** (never to `TEACHER` or `STUDENT`).
    - When expired, disable mutating buttons (Add, Edit, Delete, Toggle) with an explanatory Arabic tooltip.
*   **Parent Magic Link Portal (`/p/:token`)**:
    - Staff (`OWNER`, `TEACHER`) generate 30-day tokens via `POST /p/generate/:studentId`.
    - Public mobile-responsive view without login requirement.

---

## 14. Naming Conventions
*   **Components**: PascalCase (e.g., `LoginForm.tsx`)
*   **Hooks / Utilities**: camelCase (e.g., `useAuth.ts`, `formatDate.ts`)
*   **Types / Interfaces**: PascalCase (e.g., `ApiResponse<T>`)
*   **Schemas**: camelCase with `-schema` suffix (e.g., `loginSchema`)
*   **Zod Types**: PascalCase with `Values` suffix (e.g., `LoginFormValues`)

---

## 15. Import Order
1.  React and Next.js libraries
2.  Third-party modules (`sonner`, `lucide-react`)
3.  Absolute paths (`@/components`, `@/lib`)
4.  Relative feature paths (`../components`, `./utils`)
5.  Styles/Types

---

## 16. Code Review Checklist
*   [ ] Checked and reused existing components/helpers?
*   [ ] Decoupled code correctly inside `src/features/<feature>/`?
*   [ ] Checked that no `any` types were used?
*   [ ] Handled loading, empty, and error states?
*   [ ] Called `handleResponseToast()` for user notifications?
*   [ ] Verified code builds cleanly (`npx tsc --noEmit`) and passes `npm run lint`?

---

## 17. Standard Feature Folder Structure & Patterns

Every feature module (e.g., `src/features/students/`, `src/features/subjects/`, `src/features/teachers/`) must strictly adhere to the following sub-directory structure and component conventions:

### Sub-directory Layout
1. **`actions/`**: Server Action files (e.g., `<feature>-actions.ts`) containing API wrappers utilizing `serverApiClient` for data fetching/mutations.
2. **`components/`**: Feature-specific UI components:
   - **`<Feature>sListClient.tsx`**: The main page container (client component).
   - **`<Feature>Form.tsx`**: The modal form component.
   - **`columns.tsx`**: Standard column definition function `get<Feature>Columns` for tables.
3. **`hooks/`**: TanStack Query custom queries and mutations (e.g., `queries.ts` and `mutations.ts`).
4. **`schemas/`**: Zod validation schemas (e.g., `<feature>-schema.ts`).
5. **`state/`**: Zustand stores for complex local/global feature state management. *(Note: Standard CRUD modals must use the shared `@/hooks/useCrudModal` hook instead of creating per-feature modal stores).*
6. **`types/`**: TypeScript interfaces and types for the feature (e.g., `index.ts`).
7. **`utils/`**: Feature-specific pure functions or constant helpers.

### Core Component Design Patterns

#### 1. Page Client Container (`<Feature>sListClient.tsx`)
Must orchestrate the main view components and should compose:
- **`useTableFilters<TFilters>()`**: Reads and updates URL search parameters for `page`, `limit`, `search`, custom filters, and sorting (`sortBy`, `sortOrder`, `sorting`, `onSortingChange`).
- **`useCrudModal<TEntity>()`**: Provides `{ isOpen, selectedItem, openCreate, openEdit, close }` for create/edit modal lifecycle.
- **`<PageHeader>`**: Renders the title, Arabic description, and a "create new" action button triggering `openCreate`.
- **`<TableToolbar>`**: Replaces manual search/filter bars by unifying search (`searchPlaceholder`), filter panel (`filters`, `filterValues`), server export endpoints (`excelConfig`, `pdfConfig`), and Excel import modal (`onImport`).
- **`<SharedTable>`**: Grid table component accepting:
  - `columns`: Column definitions explicitly typed as `ColumnDef<TEntity>[]`.
  - `data`: List items.
  - `isLoading`: Loading state.
  - `meta`: Backend pagination metadata (`meta={data?.meta}`) containing `total`, `page`, `limit`, `totalPages`.
  - `sorting`, `onSortingChange`: Server-side sorting wired to TanStack Table.
  - `emptyMessage`: Localized empty state message.
- **`<SharedModal>`**: A popup wrapper triggered by `isOpen` which renders `<Feature>Form`.
- **`<ConfirmDialog>`**: Standard deletion confirmation dialog utilizing state `itemToDelete`, `onClose={() => setItemToDelete(null)}`, and a clean async callback `handleConfirmDelete`.

#### 2. Feature Form (`<Feature>Form.tsx`)
Must manage item creation and editing using React Hook Form + Zod:
- **`useForm<FormValues>`** with `resolver: zodResolver(<feature>Schema)`.
- Use the **`control`** object and register inputs.
- Form inputs must leverage standard styling wrapper components:
  - **`<FormInput>`**: Standard text/number inputs.
  - **`<FormSelect>`**: Single choice selector.
  - **`<FormMultiSelect>`**: Custom multi-select dropdown with list filter and tag list output.
  - **`<FormTextarea>`**: Richer description textarea.
  - **`<FormActions>`**: Arabic-labeled submit/cancel buttons with dynamic loading indicators.

#### 3. Column Definition (`columns.tsx`)
Must define column metadata for rendering inside the table:
- Exports `get<Feature>Columns({ ... }): ColumnDef<TEntity>[]` with an explicit return type from `@tanstack/react-table`.
- Set `enableSorting: true` on columns that support server-side sorting (e.g., `order`, `name`, `createdAt`). Non-sortable columns default to `enableSorting: false` in `SharedTable`.
- **Badges & Chips**: Use `<Badge variant="subtle">` for index/order/counter chips instead of hardcoded ad-hoc `<span>` elements.
- **Server-Side Export Only**: Do NOT define client-side `meta: { exportHeader, exportValue }` in columns; file exports (Excel/PDF) are handled strictly server-side via backend endpoints.
- **Stable Callbacks**: Pass direct function references (e.g., `onDelete: setItemToDelete`) to prevent breaking `useMemo` in parent containers.
