import type { Metadata } from "next";
import { getSubscriptionOverviewAction } from "@/features/subscription/actions/subscription-actions";
import { SubscriptionClient } from "@/features/subscription/components/SubscriptionClient";
import { PageHeader } from "@/components/common/PageHeader";
import { CreditCard } from "lucide-react";
import { Suspense } from "react";
import { Loading } from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "تفاصيل الاشتراك والفوترة | مدير المركز",
  description:
    "متابعة خطة اشتراك المركز التعليمي، سعة الموارد المستهلكة، وموعد التجديد القادم.",
};

export default async function OwnerSubscriptionPage() {
  return (
    <>
      <PageHeader
        title="تفاصيل الاشتراك والفوترة"
        description="متابعة خطة اشتراك المركز التعليمي، سعة الموارد المستهلكة، وموعد التجديد القادم."
        icon={CreditCard}
      />
      <Suspense
        fallback={<Loading message="جاري تحميل بيانات الاشتراك والفوترة..." />}
      >
        <SubscriptionPage />;
      </Suspense>
    </>
  );
}

const SubscriptionPage = async () => {
  const initialData = await getSubscriptionOverviewAction();
  return <SubscriptionClient initialData={initialData} />;
};
