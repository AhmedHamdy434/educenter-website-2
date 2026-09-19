import type { Metadata } from "next";
import { Suspense } from "react";
import { getAuditLogs } from "@/features/audit-logs/actions/audit-logs-actions";
import { AuditLogsListClient } from "@/features/audit-logs/components/AuditLogsListClient";
import { Loading } from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "سجل العمليات والتدقيق | مدير المركز",
  description: "عرض وتدقيق سجل العمليات الإدارية والأمنية التابعة للمركز التعليمي.",
};

export default async function CenterAuditLogsPage() {
  const initialData = await getAuditLogs({ page: 1, limit: 10 });

  return (
    <Suspense fallback={<Loading message="جاري تحميل سجل العمليات..." />}>
      <AuditLogsListClient initialData={initialData} />
    </Suspense>
  );
}
