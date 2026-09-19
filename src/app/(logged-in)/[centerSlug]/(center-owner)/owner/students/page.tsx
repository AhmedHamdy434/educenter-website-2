import type { Metadata } from "next";
import { getStudents } from "@/features/students/actions/students-actions";
import { getGrades } from "@/features/grades/actions/grades-actions";
import { StudentsListClient } from "@/features/students/components/StudentsListClient";

export const metadata: Metadata = {
  title: "الطلاب | مدير المركز",
  description: "إدارة حسابات وبيانات الطلاب المسجلين بالمركز وتتبع تسجيلهم بالمراحل الدراسية.",
};

export default async function OwnerStudentsPage() {
  // Fetch initial students and grades options in parallel on the server
  const [initialData, gradesData] = await Promise.all([
    getStudents({ page: 1, limit: 10 }),
    getGrades({ limit: 100, active: true }),
  ]);

  const gradesOptions = (gradesData?.data || []).map((grade) => ({
    value: grade.id,
    label: grade.name,
  }));

  return (
    <StudentsListClient
      initialData={initialData}
      gradesOptions={gradesOptions}
    />
  );
}
