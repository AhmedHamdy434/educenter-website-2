import type { Metadata } from "next";
import { OwnerDashboardClient } from "@/features/dashboard/components/owner-dashboard/OwnerDashboardClient";
import { PageHeader } from "@/components/common/PageHeader";
import { LayoutDashboard } from "lucide-react";

export const metadata: Metadata = {
  title: "لوحة التحكم | مدير المركز",
  description:
    "لوحة تحكم إدارة المركز التعليمي ومتابعة العمليات والأداء المالي",
};

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-6 text-right pb-12">
      <PageHeader
        title="لوحة التحكم"
        description="نظرة شاملة ومباشرة على العمليات التشغيلية، وصحة الاشتراك، والأداء المالي للمركز."
        icon={LayoutDashboard}
      />{" "}
      <OwnerDashboardClient />;
    </div>
  );
}
