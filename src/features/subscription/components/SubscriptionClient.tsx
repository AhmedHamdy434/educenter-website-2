import { QueryErrorState } from "@/components/common/QueryErrorState";
import { SubscriptionHeroCard } from "./SubscriptionHeroCard";
import { SubscriptionUsageSection } from "./SubscriptionUsageSection";
import { SubscriptionFeaturesCard } from "./SubscriptionFeaturesCard";
import { type ApiResponse } from "@/types";
import { type SubscriptionOverviewData } from "../types";

interface SubscriptionClientProps {
  initialData: ApiResponse<SubscriptionOverviewData>;
}

export function SubscriptionClient({ initialData }: SubscriptionClientProps) {
  const overview = initialData.data;
  const center = overview?.center;
  const activeSubscription = center?.subscriptions?.[0] || null;
  const plan = activeSubscription?.subscriptionPlan || null;
  const usage = overview?.usage || {
    studentsCount: 0,
    teachersCount: 0,
    subjectsCount: 0,
  };

  if (!center) {
    return (
      <div className="space-y-6 text-right">
        <QueryErrorState
          title="تعذر تحميل بيانات اشتراك المركز"
          errorMessage="يرجى التأكد من اتصالك بالإنترنت أو إعادة المحاولة لاحقاً."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right animate-fade-in">
      <SubscriptionHeroCard
        subscription={activeSubscription}
        centerName={center.name}
      />
      <SubscriptionUsageSection usage={usage} plan={plan} />
      <SubscriptionFeaturesCard plan={plan} />
    </div>
  );
}
