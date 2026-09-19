import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGroup } from "@/features/groups/actions/groups-actions";
import { GroupDetailsClient } from "@/features/groups/components/GroupDetailsClient";
import { UserRole } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "تفاصيل المجموعة والتحضير | المعلم",
  description: "عرض تفاصيل المجموعة وتسجيل حضور وغياب الطلاب.",
};

export default async function TeacherGroupDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  const groupRes = await getGroup(id);
  
  if (!groupRes.success || !groupRes.data) {
    notFound();
  }

  return (
    <GroupDetailsClient initialGroupData={groupRes} userRole={UserRole.TEACHER} />
  );
}
