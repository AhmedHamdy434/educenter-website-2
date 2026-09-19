import type { Metadata } from "next";
import { getGroups } from "@/features/groups/actions/groups-actions";
import { TeacherGroupsList } from "@/features/groups/components/TeacherGroupsList";

export const metadata: Metadata = {
  title: "مجموعاتي الدراسية | المعلم",
  description: "عرض المجموعات الدراسية المسؤولة عنها ومتابعة حضور وغياب الطلاب.",
};

export default async function TeacherGroupsPage() {
  // Fetch initial group list for the logged-in teacher (filtered by role at backend)
  const initialGroups = await getGroups({ limit: 100 });

  return <TeacherGroupsList initialData={initialGroups} />;
}
