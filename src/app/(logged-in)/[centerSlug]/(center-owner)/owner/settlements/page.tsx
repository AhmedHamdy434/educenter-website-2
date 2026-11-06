import type { Metadata } from "next";
import { TeacherSettlementsClient } from "@/features/settlements/components/TeacherSettlementsClient";

export const metadata: Metadata = {
  title: "تسويات المعلمين | مدير المركز",
  description: "إدارة ومتابعة مستحقات المعلمين وإصدار التسويات المالية والتحويلات",
};

export default function TeacherSettlementsPage() {
  return <TeacherSettlementsClient />;
}

