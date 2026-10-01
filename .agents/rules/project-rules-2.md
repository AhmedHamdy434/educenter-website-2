---
trigger: always_on
---

# Project Rules & Coding Standards — Part 2: Security, Patterns & Workflows

This document defines the mandatory engineering standards for authentication, role protection, naming conventions, code review checklists, and standard feature folder structures / component design patterns for the **EduCenter SaaS** project. Every developer and AI assistant must follow these rules without exception.

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
*   [ ] Verified that list pages (`page.tsx`) do not pass server `initialData` to client list containers, delegating list fetching entirely to React Query?
*   [ ] Used `@/hooks/useOnClickOutside` instead of manual window/document listeners?
*   [ ] Used `@/hooks/useResetOnChange` for cascading field resets instead of manual `useEffect` + `useRef` boilerplate?
*   [ ] Separated Grade and Subject selectors in forms/toolbars so subjects are strictly dependent on the selected grade via `useResetOnChange`?
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
- **Pure Client-Side React Query Fetching**: Data fetching is initiated strictly within the client container via `const { data, isLoading } = use<Feature>Query(queryParams)`. Never accept or pass down server `initialData`.
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
- **Separation of Dependent Grade & Subject Selectors**: Whenever subjects are selectable (e.g. in Group forms, Teacher forms, or list filters), they must **never** be presented as an unpartitioned flat list combining grade and subject names in one dropdown. Instead, Grade (`gradeId`) must always be selected first via a dedicated `<FormSelect>`, and the Subject selector (`subjectId` or `subjectIds`) must be strictly dependent on the selected grade (`disabled={!selectedGradeId}`, placeholder indicates choosing grade first, queries enabled only when `selectedGradeId` is chosen). In single-grade forms (e.g. Groups), apply cascading reset via `@/hooks/useResetOnChange` on grade change. In multi-grade entities (e.g. Teachers), allow selecting subjects across multiple grades by accumulating chosen subjects with their grade labels in a dedicated chips container underneath and submitting `subjectIds: string[]`.
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
