import type { Metadata } from "next";
import { StudentPaymentsClient } from "@/features/students/components/StudentPaymentsClient";

export const metadata: Metadata = {
  title: "سجل المدفوعات والاشتراكات | الطالب",
  description: "استعراض تفاصيل وتاريخ الاشتراكات الشهرية والمدفوعات المسددة للمجموعات الدراسية.",
};

export default function StudentPaymentsPage() {
  return <StudentPaymentsClient />;
}
