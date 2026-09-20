import type { Metadata } from "next";
import { GradesListClient } from "@/features/grades/components/GradesListClient";

export const metadata: Metadata = {
  title: "المراحل الدراسية | مدير المركز",
  description: "إدارة وتهيئة المراحل الدراسية والصفوف التابعة للمركز التعليمي.",
};

export default function GradesPage() {
  return <GradesListClient />;
}
