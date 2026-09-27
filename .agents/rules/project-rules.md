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
*   **Shared Outside Click Hook (`useOnClickOutside`)**: All dropdowns, popovers, custom selectors, and mobile menus must use `@/hooks/useOnClickOutside(ref, handler)` to handle mouse and touch dismissals, eliminating manual `document.addEventListener` boilerplate.
*   **Shared Cascading Reset Hook (`useResetOnChange`)**: When form fields have dependent or cascading relationships (e.g. `gradeId -> subjectId -> teacherId`), use `@/hooks/useResetOnChange(value, onChange, initialValue?, resetTrigger?)` to cleanly trigger resets only on intentional user value changes while skipping initial mount and entity edit loads.

---

## 11. Constants & Utilities
*   **Constants**: Name variables in `UPPER_SNAKE_CASE` (e.g., `API_TIMEOUT_MS`). Group local configurations inside the feature's constants folder.
*   **Shared Dropdown Constants**: Common dropdown options (`DEFAULT_LIMIT`, `LIMITS`, `STATUSES`) must be imported from `@/constants/dropdown-options` instead of re-defining them locally.
*   **Shared Table Filters Hook (`useTableFilters`)**: All list tables must use `@/hooks/useTableFilters` to synchronize pagination (`page`, `limit`), search (`search`), custom filters, and sorting (`sortBy`, `sortOrder`, `sorting`, `onSortingChange`) with URL search parameters. Filter and sorting updates automatically reset `page` to 1.
*   **Shared CRUD Modal Hook (`useCrudModal`)**: All entity create/edit modal states must use `@/hooks/useCrudModal<T>()` providing `{ isOpen, selectedItem, openCreate, openEdit, close }`, eliminating redundant per-feature Zustand modal stores. Its action handlers must be memoized via `useCallback` to maintain reference stability and prevent invalidating downstream `useMemo` hooks (such as table columns).
*   **Query Parameter Sanitization**: When extracting filter values from URL params via `useTableFilters` to pass to TanStack Query hooks or API clients, sanitize empty strings (e.g., `active: active || undefined`) so empty strings are omitted from query payloads.
*   **Utilities**: Write helpers as pure, deterministic functions (e.g., date formats, currency parsers) inside `src/utils/`.
*   **Shared Date & Time Utilities**: All schedule selectors (day list, hours, minutes, period dropdown options), the time formatter function `formatTime`, and the 12-to-24 hour converter `to24Hour(hour, period)` must be imported from `@/utils/time` instead of being re-declared locally in forms and columns.
*   **Dropdown Loading States**: Dropdowns with asynchronous data dependencies (`FilterDropdown`, `FormSelect`, `FormMultiSelect`) must support and accept `isLoading?: boolean`. When true, they must display a loading spinner (`Loader2`) alongside placeholder "جاري التحميل..." and disable interaction until data resolution.
*   **Shared Row Actions (`<RowActions>`)**: Table edit and delete action buttons must use `@/components/common/RowActions` with `deleteVariant: "icon" | "button"` to prevent duplicating inline action button styles and handlers across features.
*   **Standardized Modals & Dialogs**:
    - `<SharedModal>` is built on Radix UI `DialogPrimitive` with keyboard `Escape` closing, overlay focus-trap, and accessible `DialogTitle`. Modals must strictly consume `{ isOpen, onClose, title, children }`.
    - `<ConfirmDialog>` must use `confirmLabel` and `cancelLabel` (legacy `confirmText` and `cancelText` are deprecated and removed).
*   **File Import Guards**: All Excel/file import modals must enforce file size limits (max 3 MB via `MAX_FILE_SIZE_MB = 3`) and validate file extensions before triggering server upload actions.
*   **Feature Toolbar Configurations**: All list table toolbar settings must be isolated in `src/features/<feature>/config/<feature>-toolbar.config.ts`, exporting:
    - `get<Feature>FiltersConfig(options, isLoading)` returning typed `FilterConfig<...>[]`.
    - `<feature>ExcelConfig: ToolbarExcelConfig` with `exportEndpoint`, `templateEndpoint`, and localized `fileName`.
    - `<feature>PdfConfig: ToolbarPdfConfig` with `exportEndpoint` and localized `fileName`.
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
*   [ ] Checked that form fields, Zod schemas, and table columns strictly match the backend Prisma schema and DTOs (no ghost/unsupported fields)?
*   [ ] Used `@/hooks/useOnClickOutside` instead of manual window/document listeners?
*   [ ] Used `@/hooks/useResetOnChange` for cascading field resets instead of manual `useEffect` + `useRef` boilerplate?
*   [ ] Used `@/components/common/RowActions` for table edit/delete actions?
*   [ ] Included `if (!isOpen) return;` early return in modal form reset `useEffect`?
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
3. **`config/`**: Feature toolbar configuration files (e.g., `<feature>-toolbar.config.ts`) exporting typed filter config factory `get<Feature>FiltersConfig(options, isLoading)`, `<feature>ExcelConfig`, and `<feature>PdfConfig`.
4. **`hooks/`**: TanStack Query custom queries and mutations (e.g., `queries.ts` and `mutations.ts`).
5. **`schemas/`**: Zod validation schemas (e.g., `<feature>-schema.ts`).
6. **`state/`**: Zustand stores for complex local/global feature state management. *(Note: Standard CRUD modals must use the shared `@/hooks/useCrudModal` hook instead of creating per-feature modal stores).*
7. **`types/`**: TypeScript interfaces and types for the feature (e.g., `index.ts`), including `<Feature>Filters`.
8. **`utils/`**: Feature-specific pure functions or constant helpers.

### Core Component Design Patterns

#### 1. Page Client Container (`<Feature>sListClient.tsx`)
Must orchestrate the main view components and should compose:
- **`useTableFilters<TFilters>()`**: Reads and updates URL search parameters for `page`, `limit`, `search`, custom filters, and sorting (`sortBy`, `sortOrder`, `sorting`, `onSortingChange`).
- **`useCrudModal<TEntity>()`**: Provides `{ isOpen, selectedItem, openCreate, openEdit, close }` for create/edit modal lifecycle.
- **`<PageHeader>`**: Renders the title, Arabic description, and a "create new" action button triggering `openCreate`.
- **`<TableToolbar>`**: Replaces manual search/filter bars by unifying:
  - `searchPlaceholder`: Localized placeholder for search input.
  - `filters`: Dynamic filter configurations from `get<Feature>FiltersConfig(options, isLoading)`.
  - `filterValues`: Current filter state values mapped to keys.
  - `onFilterChange={updateQuery}`: Directly wires filter updates into URL search params.
  - `excelConfig`: Server-side export configuration (`exportEndpoint`, `templateEndpoint`, `fileName`).
  - `pdfConfig`: Server-side PDF export configuration (`exportEndpoint`, `fileName`).
  - `totalRecords`: Backend total items count (`data?.meta?.total ?? 0`).
  - `isLoading`: Query loading state.
  - `onImport`: Excel import mutation handler (`onImport={import<Feature>}`).
- **Excel Import Mutation (`useImport<Feature>Mutation`)**: Must accept `{ file: File, dryRun?: boolean }`, append `file` to `FormData`, call `importFileAction(endpoint, formData)`, specify `meta: { skipToast: true }`, and trigger `queryClient.invalidateQueries` on success when `!variables.dryRun`.
- **Options Stabilization**: Wrap fallback options in `useMemo(() => data ?? [], [data])` to guarantee stable array references and avoid breaking downstream `useMemo` hooks.
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
- **Strict Schema Alignment (No Ghost Fields)**: Form fields, Zod schemas, and DTO payloads must strictly match existing backend DTOs and Prisma database models. Never introduce unsupported fields (e.g. ad-hoc `salary` or `specialization`) without full-stack backend and database support.
- **Early Return on Close**: The reset `useEffect` must start with `if (!isOpen) return;` to avoid redundant state updates and re-renders when the modal is closed.
- **Cascading Field Resets**: When form fields have dependent relationships (e.g. `gradeId -> subjectId -> teacherId`), use `@/hooks/useResetOnChange` instead of inline `useEffect` + `useRef` boilerplate.
- **Sub-Component Extraction**: For complex or multi-state input sections (such as schedule builders, rich editors, or multi-field pickers), extract focused subcomponents (e.g., `<WeeklySchedulePicker>`) to keep form components under 200 lines.
- Form inputs must leverage standard styling wrapper components:
  - **`<FormInput>`**: Standard text/number inputs.
  - **`<FormSelect>`**: Single choice selector supporting `isLoading` to show `Loader2` indicator when options query is pending.
  - **`<FormMultiSelect>`**: Custom multi-select dropdown supporting `isLoading` with search, list filter, and tag list output.
  - **`<FormTextarea>`**: Richer description textarea.
  - **`<FormActions>`**: Arabic-labeled submit/cancel buttons with dynamic loading indicators.

#### 3. Column Definition (`columns.tsx`)
Must define column metadata for rendering inside the table:
- Exports `get<Feature>Columns({ ... }): ColumnDef<TEntity>[]` with an explicit return type from `@tanstack/react-table`.
- **Only Valid Database/API Fields**: Only define columns and enable server-side sorting for fields that actually exist in the database and API select payloads. Never render columns with phantom values (`undefined`).
- Set `enableSorting: true` on columns that support server-side sorting (e.g., `order`, `name`, `createdAt`). Non-sortable columns default to `enableSorting: false` in `SharedTable`.
- **Badges & Chips**: Use `<Badge variant="subtle">` for index/order/counter/status/enrollment chips instead of hardcoded ad-hoc `<span>` elements.
- **Row Actions**: Table edit and delete action buttons must use `<RowActions>` with `deleteVariant: "icon" | "button"` to prevent repeating inline button styling.
- **Server-Side Export Only**: Do NOT define client-side `meta: { exportHeader, exportValue }` in columns; file exports (Excel/PDF) are handled strictly server-side via backend endpoints.
- **Stable Callbacks**: Pass direct function references (e.g., `onDelete: setItemToDelete`) to prevent breaking `useMemo` in parent containers.


