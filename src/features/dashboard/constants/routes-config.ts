import {
  LayoutDashboard,
  Users,
  // UserCheck,
  // History,
  // MessageSquare,
  GraduationCap,
  Layers,
  BookOpen,
  // ClipboardCheck,
  CreditCard,
  // Settings,
  CalendarCheck,
  // FileText,
  // Award,
} from "lucide-react";
import { UserRole } from "@/types";

export interface RouteItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export const dashboardRoutes: RouteItem[] = [
  // OWNER Routes
  {
    title: "لوحة التحكم",
    href: "/owner",
    icon: LayoutDashboard,
    roles: [UserRole.OWNER],
  },
  {
    title: "المراحل الدراسية",
    href: "/owner/grades",
    icon: Layers,
    roles: [UserRole.OWNER],
  },
  {
    title: "المواد الدراسية",
    href: "/owner/subjects",
    icon: BookOpen,
    roles: [UserRole.OWNER],
  },
  {
    title: "المعلمون",
    href: "/owner/teachers",
    icon: GraduationCap,
    roles: [UserRole.OWNER],
  },
  {
    title: "الطلاب",
    href: "/owner/students",
    icon: Users,
    roles: [UserRole.OWNER],
  },
  {
    title: "المجموعات",
    href: "/owner/groups",
    icon: Layers,
    roles: [UserRole.OWNER],
  },
  // {
  //   title: "المستخدمين",
  //   href: "/owner/users",
  //   icon: UserCheck,
  //   roles: [UserRole.OWNER],
  // },
  // {
  //   title: "سجل العمليات",
  //   href: "/owner/audit-logs",
  //   icon: History,
  //   roles: [UserRole.OWNER],
  // },
  // {
  //   title: "رسائل الواتساب",
  //   href: "/owner/notifications",
  //   icon: MessageSquare,
  //   roles: [UserRole.OWNER],
  // },
  // {
  //   title: "الاختبارات",
  //   href: "/owner/exams",
  //   icon: ClipboardCheck,
  //   roles: [UserRole.OWNER],
  // },
  // {
  //   title: "الاشتراك والفوترة",
  //   href: "/owner/subscription",
  //   icon: CreditCard,
  //   roles: [UserRole.OWNER],
  // },
  // {
  //   title: "الإعدادات",
  //   href: "/owner/settings",
  //   icon: Settings,
  //   roles: [UserRole.OWNER],
  // },

  // TEACHER Routes
  {
    title: "لوحة التحكم",
    href: "/teacher",
    icon: LayoutDashboard,
    roles: [UserRole.TEACHER],
  },
  {
    title: "مجموعاتي",
    href: "/teacher/groups",
    icon: Layers,
    roles: [UserRole.TEACHER],
  },
  // {
  //   title: "الاختبارات",
  //   href: "/teacher/exams",
  //   icon: ClipboardCheck,
  //   roles: [UserRole.TEACHER],
  // },
  // {
  //   title: "الواجبات",
  //   href: "/teacher/assignments",
  //   icon: FileText,
  //   roles: [UserRole.TEACHER],
  // },
  // {
  //   title: "الإعدادات",
  //   href: "/teacher/settings",
  //   icon: Settings,
  //   roles: [UserRole.TEACHER],
  // },

  // STUDENT Routes
  {
    title: "لوحة التحكم",
    href: "/student",
    icon: LayoutDashboard,
    roles: [UserRole.STUDENT],
  },
  {
    title: "موادي الدراسية",
    href: "/student/subjects",
    icon: BookOpen,
    roles: [UserRole.STUDENT],
  },
  // {
  //   title: "الواجبات",
  //   href: "/student/assignments",
  //   icon: FileText,
  //   roles: [UserRole.STUDENT],
  // },
  // {
  //   title: "الاختبارات",
  //   href: "/student/exams",
  //   icon: ClipboardCheck,
  //   roles: [UserRole.STUDENT],
  // },
  // {
  //   title: "النتائج",
  //   href: "/student/results",
  //   icon: Award,
  //   roles: [UserRole.STUDENT],
  // },
  {
    title: "سجل الحضور والغياب",
    href: "/student/attendance",
    icon: CalendarCheck,
    roles: [UserRole.STUDENT],
  },
  {
    title: "سجل المدفوعات",
    href: "/student/payments",
    icon: CreditCard,
    roles: [UserRole.STUDENT],
  },
  // {
  //   title: "الإعدادات",
  //   href: "/student/settings",
  //   icon: Settings,
  //   roles: [UserRole.STUDENT],
  // },
];
