import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type ResourceUsageStats, type SubscriptionPlanDetails } from "../types";

interface SubscriptionUsageSectionProps {
  usage: ResourceUsageStats;
  plan?: SubscriptionPlanDetails | null;
}

const isUnlimited = (limit?: number) =>
  limit === undefined || limit === null || limit === -1 || limit >= 999999;

const calculateUsage = (current: number, limit?: number) => {
  if (isUnlimited(limit)) {
    return {
      percentage: 0,
      isUnlimited: true,
      limitText: "غير محدود",
      isNearMax: false,
      isMaxed: false,
      indicatorColor: "bg-emerald-600",
    };
  }

  const max = limit || 1;
  const percentage = Math.min(Math.round((current / max) * 100), 100);
  const maxed = current >= max;
  const nearMax = !maxed && percentage >= 80;

  let indicatorColor = "bg-primary";
  if (maxed) indicatorColor = "bg-rose-600";
  else if (nearMax) indicatorColor = "bg-amber-600";

  return {
    percentage,
    isUnlimited: false,
    limitText: `${max}`,
    isNearMax: nearMax,
    isMaxed: maxed,
    indicatorColor,
  };
};

export function SubscriptionUsageSection({
  usage,
  plan,
}: SubscriptionUsageSectionProps) {

  const studentUsage = calculateUsage(usage.studentsCount, plan?.studentLimit);

  const teacherUsage = calculateUsage(usage.teachersCount, plan?.teacherLimit);

  const subjectUsage = calculateUsage(usage.subjectsCount, plan?.subjectLimit);

  const metrics = [
    {
      title: "الطلاب المقيدون",
      current: usage.studentsCount,
      stats: studentUsage,
      accentBorder: "border-r-3 border-r-emerald-600",
      unit: "طالب",
    },
    {
      title: "المعلمون المسجلون",
      current: usage.teachersCount,
      stats: teacherUsage,
      accentBorder: "border-r-3 border-r-primary",
      unit: "معلم",
    },
    {
      title: "المواد الدراسية",
      current: usage.subjectsCount,
      stats: subjectUsage,
      accentBorder: "border-r-3 border-r-amber-600",
      unit: "مادة",
    },
  ];

  return (
    <div className="space-y-4 text-right">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">
            استهلاك موارد الباقة
          </h3>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            متابعة الحد الأقصى المتاح والمستهلك الفعلي للطلاب والمعلمين والمواد.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {metrics.map((metric) => {
          const { percentage, isUnlimited, limitText, isMaxed, isNearMax, indicatorColor } =
            metric.stats;

          return (
            <Card
              key={metric.title}
              className={`p-5 flex flex-col justify-between border border-border bg-card rounded-xl shadow-none space-y-4 ${metric.accentBorder}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground">
                    {metric.title}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-foreground">
                      {metric.current}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      / {isUnlimited ? "غير محدود" : `${limitText} ${metric.unit}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Sub-text */}
              <div className="space-y-2">
                {isUnlimited ? (
                  <div className="h-2.5 w-full rounded-full bg-emerald-50 border border-emerald-200 overflow-hidden">
                    <div className="h-full w-full bg-emerald-500/30" />
                  </div>
                ) : (
                  <Progress
                    value={percentage}
                    max={100}
                    indicatorClassName={indicatorColor}
                  />
                )}

                <div className="flex items-center justify-between text-[11px] font-bold">
                  {isUnlimited ? (
                    <span className="text-emerald-800 font-bold">
                      مفتوح بالكامل في باقتك
                    </span>
                  ) : (
                    <>
                      <span className="text-muted-foreground">
                        نسبة الاستهلاك: {percentage}%
                      </span>
                      {isMaxed ? (
                        <span className="text-rose-800 flex items-center gap-1 font-bold">
                          <AlertCircle className="size-3" />
                          وصلت للحد الأقصى
                        </span>
                      ) : isNearMax ? (
                        <span className="text-amber-800 font-bold">
                          اقتربت من الحد الأقصى
                        </span>
                      ) : (
                        <span className="text-emerald-800 font-medium">مستوى آمن</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
