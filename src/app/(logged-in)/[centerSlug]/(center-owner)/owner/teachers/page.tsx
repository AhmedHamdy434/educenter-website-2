import type { Metadata } from "next";
import { TeachersListClient } from "@/features/teachers/components/TeachersListClient";

export const metadata: Metadata = {
  title: "المدرسون | مدير المركز",
  description: "إدارة حسابات وبيانات معلمي المركز التعليمي والمواد الموكلة إليهم.",
};

export default function OwnerTeachersPage() {
  return <TeachersListClient />;
}
