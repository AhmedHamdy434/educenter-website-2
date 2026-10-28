import type { Metadata } from "next";
import { GroupDetailsClient } from "@/features/groups/components/GroupDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export const metadata: Metadata = {
  title: "تفاصيل المجموعة والتحضير | المعلم",
  description: "عرض تفاصيل المجموعة وتسجيل حضور وغياب الطلاب.",
};

export default async function TeacherGroupDetailsPage({ params , searchParams }: PageProps) {
  const { id } = await params;
  const {tab} = await searchParams;

  return <GroupDetailsClient groupId={id} isOwner={false} tab={tab}  />;
}
