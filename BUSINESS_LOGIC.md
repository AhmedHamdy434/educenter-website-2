# EduCenter Frontend — Business Logic & Implementation Documentation

> **Document Status:** Comprehensive Frontend Codebase Analysis & Backend Platform Integration Specification  
> **Frontend Architecture:** Next.js 16 (Turbopack, App Router), React 19, TypeScript, Tailwind CSS v4, TanStack Query v5, TanStack Table v8, React Hook Form + Zod, Zustand, Motion, Sonner  
> **Aesthetic Direction:** Deep Forest Professional (Warm Cream Canvas `#FAF6EC`, Deep Forest `#18362E`, Focal Ochre `#B45309`, Crisp Stone Borders `#E3DBC7`)  
> **Target Audience:** Engineering Team, Backend Developers, UI/UX Designers, and Product Managers

---

## 1. Frontend Architectural Overview

EduCenter Frontend is a modern **Next.js 16 App Router application** built with a **Feature-Based Modular Architecture**. It delivers a high-performance, accessible (WCAG 2.2 AA), and responsive Arabic (RTL) interface for three center-scoped user roles (**Center Owner**, **Teacher / Instructor**, and **Student**), alongside a public marketing portal and a zero-friction **Public Parent Portal** (`/p/:token`).

> [!NOTE]
> **Admin Dashboard Separation**: System Admins / Center Managers (`ADMIN` / Super Admin) have their own dedicated standalone dashboard application. The `educenter-website` application strictly serves **Center Owners (`OWNER`)**, **Teachers (`TEACHER`)**, **Students (`STUDENT`)**, and **Public Parent Magic Reports (`/p/:token`)**.

```
src/
├── app/
│   ├── (landing)/                    # Public guest routes (Landing page, Login, Auth flows)
│   │   ├── layout.tsx                # Header + Footer layout
│   │   ├── page.tsx                  # Marketing Landing Page
│   │   ├── login/page.tsx            # Login Page (with mustChangePassword detection)
│   │   ├── forgot-password/page.tsx  # OTP Request Flow
│   │   ├── reset-password/page.tsx   # OTP Verification & Password Reset
│   │   ├── change-password/page.tsx  # Mandatory Initial Password Change
│   │   └── p/[token]/page.tsx        # Public Parent Magic Report portal
│   └── (logged-in)/
│       └── [centerSlug]/             # Protected center-scoped dynamic routes
│           ├── layout.tsx            # Center shell (Sidebar + DashboardHeader + Grace Banner)
│           ├── page.tsx              # Role redirector to /:slug/owner, /teacher, or /student
│           ├── not-found.tsx         # Center-scoped 404 page
│           ├── (center-owner)/       # Center Owner views (/[centerSlug]/owner)
│           │   └── owner/
│           ├── (instructor)/         # Teacher / Instructor views (/[centerSlug]/teacher)
│           │   └── teacher/
│           └── (student)/            # Student portal views (/[centerSlug]/student)
│               └── student/
├── components/                       # Global reusable UI (ui/, common/, layout/)
├── features/                         # Modular domain features
│   ├── admins/                       # Center Managers Management (OWNER only: GET/POST /admins)
│   ├── attendance/                   # Daily Sessions & Reports
│   ├── audit-logs/                   # Center Operational & Security Audit Logs
│   ├── auth/                         # Login (1-day cookie maxAge), Logout, OTP Forgot/Reset, Change Password
│   ├── dashboard/                    # Shell, Sidebar, Header, Routes Config
│   ├── grades/                       # Academic Grades Management
│   ├── groups/                       # Class Groups, Schedules, Roster, Payments Grid
│   ├── landing/                      # Public Landing Page Sections
│   ├── notifications/                # WhatsApp Dispatch & Notification Logs
│   ├── parent-portal/                # Public Parent Magic Link Report
│   ├── students/                     # Student Records, Enrollment, Parent Link Generation
│   ├── subjects/                     # Academic Subjects Management
│   ├── subscription/                 # Center Plan, Limits, Resource Quotas, Grace Period
│   ├── teachers/                     # Teacher Directory & Assignments
│   └── users/                        # Center Users Directory & Status Management
├── hooks/ / providers/               # Global React Query Provider, Custom Hooks
├── lib/                              # API Client (serverApiClient), toast handlers, utils (cn)
├── proxy.ts                          # Next.js 16 Route Protection, Role Redirects & Auth Proxy
└── types/                            # Global TypeScript types and API interfaces
```

---

## 2. Authentication, Cookie Lifecycle & Proxy (`proxy.ts`)

### 2.1 Cookie Duration Synchronization (1-Day Alignment)
* **JWT & Cookie Lifetime**: The backend JWT access token has a **1-day lifespan** (`24 hours`).
* **Strict Alignment**: The `token` cookie `maxAge` is set to exactly `60 * 60 * 24` (`86,400 seconds` / `1 day`) in `loginAction`.
* **Safe Cleanup**: If `payload.exp * 1000 < Date.now()`, `proxy.ts` strips the stale cookie header and triggers `response.cookies.delete("token")` to prevent false logged-in states and RSC `401 Unauthorized` console noise.

### 2.2 Route Protection & Redirection Logic
Routing and role-based protection are handled natively in `src/proxy.ts` using the Next.js 16 named export `proxy` function:

```
                                  Incoming Request
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                   Has Token?                        No Token?
                         │                               │
            ┌────────────┴────────────┐                  ├─ Public route (/, /login, /forgot-password, /reset-password, /p/*) ──► Allow
            ▼                         ▼                  └─ Protected (/[centerSlug]/*) ─────────────────────────────────────► Redirect to /login
       Valid & Active?         Expired/Invalid?
            │                         │
            │                         ├─ Delete 'token' & 'centerSlug' cookies
            │                         ├─ Strip Cookie from request headers
            │                         └─ Redirect to /login (if protected)
            ▼
   Route Role Matching:
   ├─ Request /login ────────────────────────► Redirect to Role Dashboard (/[centerSlug]/[role])
   ├─ Role OWNER   ──► /:slug/owner/*
   ├─ Role TEACHER ──► /:slug/teacher/*
   └─ Role STUDENT ──► /:slug/student/*
```

* **Public Allowed Routes**: `/`, `/login`, `/forgot-password`, `/reset-password`, `/change-password`, and `/p/*` (Parent Magic Link Portal).
* **Role Mappings**:
  - `UserRole.OWNER` $\rightarrow$ `/[centerSlug]/owner`
  - `UserRole.TEACHER` $\rightarrow$ `/[centerSlug]/teacher`
  - `UserRole.STUDENT` $\rightarrow$ `/[centerSlug]/student`

---

## 3. Subscription Lifecycle & Grace Period Handling

### 3.1 Capturing the Grace Period Header
The backend returns a warning header during the 3 days following center subscription expiration:
```http
X-Subscription-Warning: Grace period active. X days remaining.
```
* **Capture**: `serverApiClient` extracts `X-Subscription-Warning` from response headers and stores it in the Zustand subscription store (`useSubscriptionStore`).

### 3.2 Role-Specific Banner Visibility
* **Display Banner For**: `OWNER` **ONLY** in `DashboardLayoutClient` / `DashboardHeader`.
* **DO NOT Display For**: `TEACHER` and `STUDENT` (to avoid burdening educational end-users with billing notices).

### 3.3 Read-Only Mode (After Grace Period Expiration)
When the 3-day grace period concludes:
1. **Safe Reads (`GET`, `HEAD`, `OPTIONS`)**: Remain fully accessible so center staff can review records and export data.
2. **Mutating Actions (`POST`, `PUT`, `PATCH`, `DELETE`)**: Blocked by the backend with `403 Forbidden` (`'اشتراك السنتر منتهي، برجاء التجديد لاستكمال الإضافة والتعديل.'`).
3. **UI Adaptation for Owner**: Disable all mutating action buttons ("مرحلة جديدة", "مادة جديدة", "طالب جديد", "مجموعة جديدة", "حفظ الحضور", "تسجيل دفع") with a tooltip: *"اشتراك المركز منتهي، يرجى التجديد لاستئناف العمليات"*.

---

## 4. Security & Authentication for Center Users

### 4.1 Mandatory Initial Password Change (`mustChangePassword`)
* When `POST /auth/login` returns `mustChangePassword === true` (new teachers, students, or users created with default credentials):
  - The UI presents a mandatory modal or routes to `/change-password`.
  - Calls `PATCH /auth/change-password` with `{ currentPassword, newPassword }`.
  - On success: updates local auth state, displays success toast, and proceeds to the user's dashboard.

### 4.2 Forgot & Reset Password Flow via OTP
1. **Forgot Password Screen (`/forgot-password`)**:
   - Submits `POST /auth/forgot-password` with `{ email }`.
   - Sends a 6-digit OTP code to the email (valid for 10 minutes).
   - Redirects to `/reset-password?email=...` with an interactive countdown timer.
2. **Reset Password Screen (`/reset-password`)**:
   - Submits `POST /auth/reset-password` with `{ email, otp, newPassword }`.
   - On success: displays confirmation toast and redirects to `/login`.

---

## 5. Role Capabilities & Operational Dashboards

```
                            ┌───────────────────────────────┐
                            │    Center Education Tenant    │
                            └───────────────┬───────────────┘
                                            │
             ┌──────────────────────────────┼──────────────────────────────┐
             ▼                              ▼                              ▼
     ┌───────────────┐              ┌───────────────┐              ┌───────────────┐
     │     OWNER     │              │    TEACHER    │              │    STUDENT    │
     │  Center Owner │              │ Class Teacher │              │Enrolled Pupil │
     └───────────────┘              └───────────────┘              └───────────────┘
```

---

### 5.1 Center Owner Dashboard (`OWNER` Role)
The `OWNER` has full administrative and financial authority over their center:

* **Center Users Directory (`/[centerSlug]/owner/users`)**:
  - `GET /users`: Comprehensive user registry with search, role filters (`TEACHER`, `STUDENT`), phone numbers, and status toggle.
  - `PATCH /users/:id`: Toggle user active status via body `{ isActive: boolean }`.
* **Audit Logs (`/[centerSlug]/owner/audit-logs`)**:
  - `GET /audit-logs`: Chronological security and operations log (timestamp, actor user/ID, action, entity, IP address, details payload).
* **WhatsApp Dispatch Logs (`/[centerSlug]/owner/notifications`)**:
  - `GET /notifications`: Log of sent WhatsApp messages (recipients, student name, delivery status, message preview, timestamp).
* **Academic Catalog Management**:
  - Full creation and management of Grades (`POST /grades`), Subjects (`POST /subjects`), Teachers, Students, and Groups.
* **Center Subscription Overview (`/[centerSlug]/owner/subscription`)**:
  - `GET /centers/my-subscription`: View current plan limits, remaining days, student/teacher/subject quotas, and grace period status.
* **Full Operational Access**:
  - Full management of Students (`/[centerSlug]/owner/students`), Teachers (`/[centerSlug]/owner/teachers`), Groups (`/[centerSlug]/owner/groups`), Exams (`/[centerSlug]/owner/exams`), and Center Settings (`/[centerSlug]/owner/settings`).

---

### 5.2 Teacher Portal (`TEACHER` Role)
The teacher interface is strictly scoped to academic execution for their assigned groups:

* **Assigned Groups (`/[centerSlug]/teacher/groups` - `GET /groups`)**: Filtered automatically to groups where `teacherId === currentTeacher.id`.
* **Class Attendance (`/[centerSlug]/teacher/attendance/:groupId`)**: Open/retrieve today's session, record presence, absence, lateness, and excuse notes, view group attendance reports.
* **Student Tuition Status (`GET /students/:studentId/payments`)**: Inspect monthly payment status **only for students currently enrolled in the teacher's groups**.
* **Generate Parent Magic Links (`POST /p/generate/:studentId`)**: Generate a 30-day magic report link for any taught student to share with parents via WhatsApp or direct copy.
* **Teacher Profile (`GET /auth/me`, `GET /teachers/:id`)**: View profile, assignments (`/[centerSlug]/teacher/assignments`), and exams (`/[centerSlug]/teacher/exams`).
* **Strict Exclusions**: Center finances, subscription warnings, audit logs, center settings, and other teachers' groups/salaries are completely hidden.

---

### 5.3 Student Portal (`STUDENT` Role)
The student interface is a clean, read-only personal progress dashboard:

* **Enrolled Groups (`/[centerSlug]/student/subjects` - `GET /groups`)**: Lists active groups the student is enrolled in (`GroupStudent`), schedule, teacher name, and subject.
* **Personal Attendance Records (`/[centerSlug]/student/attendance` - `GET /students/me/attendance/report`)**: Attendance percentage, total sessions, counts of Present/Absent/Late/Excused, and chronological session logs.
* **Personal Tuition Payment History (`/[centerSlug]/student/payments` - `GET /students/:studentId/payments`)**: List of paid monthly fees, dates of payment, and receipts.
* **Assignments & Exams (`/[centerSlug]/student/assignments`, `/[centerSlug]/student/exams`, `/[centerSlug]/student/results`)**: Access to personal academic assignments and test grades.
* **Personal Profile (`GET /auth/me`)**: Student info, grade level, parent contact details, and settings (`/[centerSlug]/student/settings`).
* **Strict Isolation**: Cannot view other students' records, group-wide attendance matrices, peer payment status, or center administrative settings.

---

### 5.4 Public Parent Magic Link Portal (`/p/:token`)
A zero-friction, public mobile-responsive web view for parents that does not require login or passwords:

```
                            ┌───────────────────────────────┐
                            │      Parent Magic Report      │
                            │        (GET /p/:token)        │
                            └───────────────┬───────────────┘
                                            │
         ┌──────────────────────────────────┼──────────────────────────────────┐
         ▼                                  ▼                                  ▼
┌──────────────────┐               ┌──────────────────┐               ┌──────────────────┐
│ Attendance Rates │               │ Enrolled Groups  │               │ Monthly Tuition  │
│   & Absence Log  │               │   & Subjects     │               │  Payment Status  │
└──────────────────┘               └──────────────────┘               └──────────────────┘
```

* **Staff Generation**: `OWNER` and `TEACHER` generate the link from student cards/rosters via `POST /p/generate/:studentId`.
* **Actions**: "نسخ رابط التقرير" (Copy Link) or "إرسال عبر واتساب" (WhatsApp Share).
* **Parent Report Screen (`/p/[token]`)**:
  1. **Student Header Card**: Name, grade, center name, center phone, and report expiration date.
  2. **Attendance Summary**: Visual gauge for overall attendance percentage, total sessions attended vs absent, and a detailed absence log with recorded reasons.
  3. **Academic Enrollments**: Active subjects, group names, teachers, and weekly schedules.
  4. **Tuition & Payment Status**: Transparent grid of paid vs pending months for each enrolled subject.

---

## 6. Complete Frontend Route & Component Inventory

| Route Path | Role Access | Component / Page | Key Server Actions / API Hooks | Integration Status |
| :--- | :--- | :--- | :--- | :---: |
| `/` | Public | `src/app/(landing)/page.tsx` | `getCurrentUser` | **Integrated** |
| `/login` | Public | `src/app/(landing)/login/page.tsx` | `loginAction` (1-day cookie maxAge, sets `centerSlug`) | **Integrated** |
| `/forgot-password` | Public | `src/app/(landing)/forgot-password/page.tsx` | `forgotPasswordAction` | **New** |
| `/reset-password` | Public | `src/app/(landing)/reset-password/page.tsx` | `resetPasswordAction` | **New** |
| `/change-password` | Public / Logged In | `src/app/(landing)/change-password/page.tsx` | `changePasswordAction` | **New** |
| `/p/[token]` | Public (Parents) | `src/app/(landing)/p/[token]/page.tsx` | `getParentReportAction` | **New** |
| `/[centerSlug]` | All Roles | `src/app/(logged-in)/[centerSlug]/page.tsx` | Redirects to role-specific route (`/owner`, `/teacher`, `/student`) | **Integrated** |
| `/[centerSlug]/owner` | `OWNER` | `(center-owner)/owner/page.tsx` | Overview metrics | **Integrated** |
| `/[centerSlug]/owner/users` | `OWNER` | `(center-owner)/owner/users/page.tsx` (`UsersListClient`) | `getUsers`, `toggleUserStatusAction` | **Integrated** |
| `/[centerSlug]/owner/audit-logs` | `OWNER` | `(center-owner)/owner/audit-logs/page.tsx` (`AuditLogsListClient`) | `getAuditLogs` | **Integrated** |
| `/[centerSlug]/owner/notifications` | `OWNER` | `(center-owner)/owner/notifications/page.tsx` (`NotificationsListClient`) | `getNotifications` | **Integrated** |
| `/[centerSlug]/owner/grades` | `OWNER` | `(center-owner)/owner/grades/page.tsx` (`GradesListClient`) | `getGrades`, `createGradeAction`, `updateGradeAction`, `toggleGradeStatusAction` | **Integrated** |
| `/[centerSlug]/owner/subjects` | `OWNER` | `(center-owner)/owner/subjects/page.tsx` (`SubjectsListClient`) | `getSubjects`, `createSubjectAction`, `updateSubjectAction`, `toggleSubjectStatusAction` | **Integrated** |
| `/[centerSlug]/owner/teachers` | `OWNER` | `(center-owner)/owner/teachers/page.tsx` (`TeachersListClient`) | `getTeachers`, `createTeacherAction`, `updateTeacherAction`, `toggleTeacherStatusAction` | **Integrated** |
| `/[centerSlug]/owner/students` | `OWNER` | `(center-owner)/owner/students/page.tsx` (`StudentsListClient`) | `getStudents`, `createStudentAction`, `updateStudentAction`, `generateParentLinkAction` | **Integrated** |
| `/[centerSlug]/owner/groups` | `OWNER` | `(center-owner)/owner/groups/page.tsx` (`GroupsListClient`) | `getGroups`, `createGroupAction`, `updateGroupAction`, `toggleGroupStatusAction` | **Integrated** |
| `/[centerSlug]/owner/groups/[id]` | `OWNER` | `(center-owner)/owner/groups/[id]/page.tsx` (`GroupDetailsClient`) | `getGroupDetails`, `addStudentsToGroupAction`, `saveAttendanceAction`, `payMonthAction` | **Integrated** |
| `/[centerSlug]/owner/exams` | `OWNER` | `(center-owner)/owner/exams/page.tsx` | Overview & manage exams | **Integrated** |
| `/[centerSlug]/owner/subscription` | `OWNER` | `(center-owner)/owner/subscription/page.tsx` (`SubscriptionClient`) | `getSubscriptionOverviewAction` | **Integrated** |
| `/[centerSlug]/owner/settings` | `OWNER` | `(center-owner)/owner/settings/page.tsx` | `getCenterSettingsAction`, `updateCenterSettingsAction` | **Shell** |
| `/[centerSlug]/teacher` | `TEACHER` | `(instructor)/teacher/page.tsx` | Instructor Overview | **Integrated** |
| `/[centerSlug]/teacher/groups` | `TEACHER` | `(instructor)/teacher/groups/page.tsx` (`TeacherGroupsList`) | `getGroups` (scoped to teacher) | **Integrated** |
| `/[centerSlug]/teacher/groups/[id]` | `TEACHER` | `(instructor)/teacher/groups/[id]/page.tsx` | `getGroupDetails`, `generateParentLinkAction` | **Integrated** |
| `/[centerSlug]/teacher/attendance` | `TEACHER` | `(instructor)/teacher/attendance/page.tsx` (`TeacherAttendanceList`) | `getTeacherGroupsAttendance` | **Integrated** |
| `/[centerSlug]/teacher/attendance/[id]` | `TEACHER` | `(instructor)/teacher/attendance/[id]/page.tsx` (`TeacherAttendanceDetailsClient`) | `getGroupDetails`, `saveAttendanceAction` | **Integrated** |
| `/[centerSlug]/teacher/exams` | `TEACHER` | `(instructor)/teacher/exams/page.tsx` | Teacher exams management | **Integrated** |
| `/[centerSlug]/teacher/assignments` | `TEACHER` | `(instructor)/teacher/assignments/page.tsx` | Teacher assignments management | **Integrated** |
| `/[centerSlug]/teacher/settings` | `TEACHER` | `(instructor)/teacher/settings/page.tsx` | Teacher settings | **Integrated** |
| `/[centerSlug]/student` | `STUDENT` | `(student)/student/page.tsx` | Student Portal Overview | **Integrated** |
| `/[centerSlug]/student/subjects` | `STUDENT` | `(student)/student/subjects/page.tsx` | `getStudentEnrolledGroups` | **Integrated** |
| `/[centerSlug]/student/assignments` | `STUDENT` | `(student)/student/assignments/page.tsx` | Student assignments list | **Integrated** |
| `/[centerSlug]/student/exams` | `STUDENT` | `(student)/student/exams/page.tsx` | Student exams list | **Integrated** |
| `/[centerSlug]/student/results` | `STUDENT` | `(student)/student/results/page.tsx` | Student results list | **Integrated** |
| `/[centerSlug]/student/attendance` | `STUDENT` | `(student)/student/attendance/page.tsx` | `getStudentAttendanceReport` | **Integrated** |
| `/[centerSlug]/student/payments` | `STUDENT` | `(student)/student/payments/page.tsx` (`StudentPaymentsClient`) | `getStudentPayments` | **Integrated** |
| `/[centerSlug]/student/settings` | `STUDENT` | `(student)/student/settings/page.tsx` | Student settings | **Integrated** |
