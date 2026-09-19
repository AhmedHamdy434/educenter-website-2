import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
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
        <Card className="p-12 text-center text-muted-foreground bg-card border border-border rounded-2xl shadow-none">
          <AlertCircle className="size-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-bold text-foreground text-sm">
            تعذر تحميل بيانات اشتراك المركز
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            يرجى التأكد من اتصالك بالإنترنت أو إعادة المحاولة لاحقاً.
          </p>
        </Card>
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
