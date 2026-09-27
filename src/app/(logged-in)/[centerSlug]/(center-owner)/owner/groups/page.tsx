import type { Metadata } from "next";
import { getGroups } from "@/features/groups/actions/groups-actions";
import { GroupsListClient } from "@/features/groups/components/GroupsListClient";

export const metadata: Metadata = {
  title: "المجموعات الدراسية | مدير المركز",
  description: "إدارة المجموعات والحصص الدراسية الأسبوعية وتعيين المعلمين والمراحل الدراسية لها.",
};

export default async function OwnerGroupsPage() {
  // Fetch initial page data in parallel on the server
  const [groupsData] = await Promise.all([
    getGroups({ page: 1, limit: 10 }),

  ]);



  return (
    <GroupsListClient
      initialData={groupsData}
    />
  );
}
