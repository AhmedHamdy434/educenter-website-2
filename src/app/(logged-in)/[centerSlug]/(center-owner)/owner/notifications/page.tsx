import type { Metadata } from "next";
import { Suspense } from "react";
import { getNotifications } from "@/features/notifications/actions/notifications-actions";
import { NotificationsListClient } from "@/features/notifications/components/NotificationsListClient";
import { Loading } from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "سجل رسائل الواتساب والإشعارات | مدير المركز",
  description: "متابعة سجل وتفاصيل رسائل الواتساب والإشعارات المرسلة من المركز.",
};

export default async function CenterNotificationsPage() {
  const initialData = await getNotifications({ page: 1, limit: 10 });

  return (
    <Suspense fallback={<Loading message="جاري تحميل سجل الإشعارات..." />}>
      <NotificationsListClient initialData={initialData} />
    </Suspense>
  );
}
