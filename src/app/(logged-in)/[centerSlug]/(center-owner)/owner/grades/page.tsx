import type { Metadata } from "next";
import { getGrades } from "@/features/grades/actions/grades-actions";
import { GradesListClient } from "@/features/grades/components/GradesListClient";

export const metadata: Metadata = {
  title: "المراحل الدراسية | مدير المركز",
  description: "إدارة وتهيئة المراحل الدراسية والصفوف التابعة للمركز التعليمي.",
};

export default async function GradesPage() {
  // Fetch initial page of grades on the server
  const initialData = await getGrades({ page: 1, limit: 10 });

  return <GradesListClient initialData={initialData} />;
}
