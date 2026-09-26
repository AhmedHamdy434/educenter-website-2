import type { Metadata } from "next";
import { SubjectsListClient } from "@/features/subjects/components/SubjectsListClient";

export const metadata: Metadata = {
  title: "المواد الدراسية | مدير المركز",
  description: "إدارة وتهيئة المواد والمناهج الدراسية التابعة للمركز التعليمي.",
};

export default function OwnerSubjectsPage() {
  return <SubjectsListClient />;
}
