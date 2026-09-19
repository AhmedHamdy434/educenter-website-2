import type { Metadata } from "next";
import { getGroups } from "@/features/groups/actions/groups-actions";
import { getGrades } from "@/features/grades/actions/grades-actions";
import { getSubjectsOptions } from "@/features/subjects/actions/subjects-actions";
import { GroupsListClient } from "@/features/groups/components/GroupsListClient";

export const metadata: Metadata = {
  title: "المجموعات الدراسية | مدير المركز",
  description: "إدارة المجموعات والحصص الدراسية الأسبوعية وتعيين المعلمين والمراحل الدراسية لها.",
};

export default async function OwnerGroupsPage() {
  // Fetch initial page data in parallel on the server
  const [groupsData, gradesData, subjectsData] = await Promise.all([
    getGroups({ page: 1, limit: 10 }),
    getGrades({ limit: 100, active: true }),
    getSubjectsOptions(),
  ]);

  // Format options for the select dropdowns
  const gradesOptions = (gradesData?.data || []).map((grade) => ({
    value: grade.id,
    label: grade.name,
  }));

  const subjectsOptions = (subjectsData?.data || []).map((subject) => ({
    value: subject.id,
    label: `${subject.name} (${subject.grade.name})`,
  }));

  return (
    <GroupsListClient
      initialData={groupsData}
      gradesOptions={gradesOptions}
      subjectsOptions={subjectsOptions}
    />
  );
}
