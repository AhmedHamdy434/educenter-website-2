import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGroup } from "@/features/groups/actions/groups-actions";
import { GroupDetailsClient } from "@/features/groups/components/GroupDetailsClient";
import { UserRole } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "تفاصيل المجموعة الدراسية | مدير المركز",
  description: "عرض تفاصيل المجموعة الدراسية وإدارة الطلاب والمواعيد الأسبوعية.",
};

export default async function GroupDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  const groupRes = await getGroup(id);
  
  if (!groupRes.success || !groupRes.data) {
    notFound();
  }

  return (
    <GroupDetailsClient initialGroupData={groupRes} userRole={UserRole.OWNER} />
  );
}
