---
trigger: always_on
---

# Project Rules & Coding Standards — Part 1: Core Architecture, State & API

This document defines the mandatory engineering standards, architectural patterns, state management, and API rules for the **EduCenter SaaS** project. Every developer and AI assistant must follow these rules without exception.

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
*   **No Server `initialData` in List Pages**: Standard CRUD list pages (`page.tsx` for Students, Grades, Teachers, Subjects, Groups, etc.) must NOT fetch `initialData` on the server to pass down to `<Feature>sListClient`. All entity list data fetching must be handled exclusively by TanStack Query in the client container via `use<Feature>Query(queryParams)`. This avoids stale hydration states, simplifies URL-driven filtering/pagination, and keeps `page.tsx` as lightweight server layouts.
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
*   **No `initialData` for List Queries**: List queries (such as `useStudentsQuery`, `useGradesQuery`, `useTeachersQuery`, `useSubjectsQuery`, `useGroupsQuery`) must not accept or configure `initialData`. Let TanStack Query manage fetching, caching, loading states, and pagination purely on the client.

---

## 7. Forms & Validation
*   **Tech Stack**: Always combine `react-hook-form` + `@hookform/resolvers/zod` + `zod`.
*   **Location**: Validation schemas must live in `features/<feature>/schemas/<name>-schema.ts`.
*   **Inputs**: Prefer uncontrolled inputs utilizing `register` for maximum render performance.
*   **Separation of Dependent Grade/Subject Selectors**: Grade (`gradeId`) and Subject (`subjectId` / `subjectIds`) selectors in forms and toolbars must always be partitioned into separate, dependent dropdowns. Users must select the grade first, which dynamically loads the subject options for that grade and disables the subject selector until a grade is chosen. For entities tied to a single grade (e.g. Groups), switching grades triggers a cascading reset via `@/hooks/useResetOnChange`. For entities supporting multi-grade subjects (e.g. Teachers), the grade selector acts as an active filter, allowing subjects from multiple grades to accumulate with their grade tags displayed underneath, submitting `subjectIds: string[]`.

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
