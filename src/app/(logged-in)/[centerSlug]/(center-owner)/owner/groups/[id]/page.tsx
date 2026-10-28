import type { Metadata } from "next";
import { GroupDetailsClient } from "@/features/groups/components/GroupDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export const metadata: Metadata = {
  title: "تفاصيل المجموعة الدراسية | مدير المركز",
  description:
    "عرض تفاصيل المجموعة الدراسية وإدارة الطلاب والمواعيد الأسبوعية.",
};

export default async function GroupDetailsPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { tab } = await searchParams;

  return <GroupDetailsClient groupId={id} isOwner tab={tab} />;
}
