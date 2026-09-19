import type { Metadata } from "next";
import { getSubjects } from "@/features/subjects/actions/subjects-actions";
import { getGrades } from "@/features/grades/actions/grades-actions";
import { SubjectsListClient } from "@/features/subjects/components/SubjectsListClient";

export const metadata: Metadata = {
  title: "المواد الدراسية | مدير المركز",
  description: "إدارة وتهيئة المواد والمناهج الدراسية التابعة للمركز التعليمي.",
};

export default async function OwnerSubjectsPage() {
  // Fetch initial subjects and grades options in parallel on the server
  const [initialData, gradesData] = await Promise.all([
    getSubjects({ page: 1, limit: 10 }),
    getGrades({ limit: 100, active: true }),
  ]);

  const gradesOptions = (gradesData?.data || []).map((grade) => ({
    value: grade.id,
    label: grade.name,
  }));

  return (
    <SubjectsListClient
      initialData={initialData}
      gradesOptions={gradesOptions}
    />
  );
}
