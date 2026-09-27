import type { Metadata } from "next";
import { StudentsListClient } from "@/features/students/components/StudentsListClient";

export const metadata: Metadata = {
  title: "الطلاب | مدير المركز",
  description: "إدارة حسابات وبيانات الطلاب المسجلين بالمركز وتتبع تسجيلهم بالمراحل الدراسية.",
};

export default function OwnerStudentsPage() {
  return <StudentsListClient />;
}
