import type { Metadata } from "next";
import { getTeachers } from "@/features/teachers/actions/teachers-actions";
import { getSubjectsOptions } from "@/features/subjects/actions/subjects-actions";
import { TeachersListClient } from "@/features/teachers/components/TeachersListClient";

export const metadata: Metadata = {
  title: "المدرسون | مدير المركز",
  description: "إدارة حسابات وبيانات معلمي المركز التعليمي والمواد الموكلة إليهم.",
};

export default async function OwnerTeachersPage() {
  // Fetch initial teachers and subjects options in parallel on the server
  const [initialData, subjectsData] = await Promise.all([
    getTeachers({ page: 1, limit: 10 }),
    getSubjectsOptions(),
  ]);

  const subjectsOptions = (subjectsData?.data || []).map((subject) => ({
    value: subject.id,
    label: `${subject.name} (${subject.grade.name})`,
  }));

  return (
    <TeachersListClient
      initialData={initialData}
      subjectsOptions={subjectsOptions}
    />
  );
}
