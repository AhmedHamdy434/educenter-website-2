import type { Metadata } from "next";
import { Suspense } from "react";
import { getUsers } from "@/features/users/actions/users-actions";
import { UsersListClient } from "@/features/users/components/UsersListClient";
import { Loading } from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "مستخدمو المركز | مدير المركز",
  description: "عرض وتصفية جميع الحسابات التابعة للمركز التعليمي وإدارة تفعيلها.",
};

export default async function CenterUsersPage() {
  const initialData = await getUsers({ page: 1, limit: 10 });

  return (
    <Suspense fallback={<Loading message="جاري تحميل قائمة المستخدمين..." />}>
      <UsersListClient initialData={initialData} />
    </Suspense>
  );
}
