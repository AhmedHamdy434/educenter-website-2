import type { Metadata } from "next";
import { GroupsListClient } from "@/features/groups/components/GroupsListClient";

export const metadata: Metadata = {
  title: "المجموعات الدراسية | مدير المركز",
  description: "إدارة المجموعات والحصص الدراسية الأسبوعية وتعيين المعلمين والمراحل الدراسية لها.",
};

export default function OwnerGroupsPage() {
  return <GroupsListClient />;
}
