import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from "@/components/common/motion-wrapper";
import { getSubscriptionPlans } from "@/features/landing/api/get-subscription-plans";
import { cn } from "@/lib/utils";

export async function Pricing() {
  const data = await getSubscriptionPlans();
  const plans = data?.data || [];

  return (
    <section id="pricing" className="w-full py-20 bg-background" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn
          direction="up"
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-accent text-xs font-bold border border-border">
            <Crown className="size-3.5 fill-accent" />
            <span>اختر الباقة المناسبة لمركزك</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            باقات مرنة تناسب احتياجاتك
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed font-medium">
            جميع الباقات تشمل تحديثات مستمرة ودعم فني مميز
          </p>
        </FadeIn>

        {/* Pricing Grid */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {plans.map((plan, idx) => {
            const features = [
              plan.studentLimit === -1 || plan.studentLimit >= 999999
                ? "طلاب غير محدودين"
                : `عدد الطلاب الأقصى: ${plan.studentLimit}`,
              plan.teacherLimit === -1 || plan.teacherLimit >= 999999
                ? "مدرسين غير محدودين"
                : `عدد المدرسين الأقصى: ${plan.teacherLimit}`,
              plan.subjectLimit === -1 || plan.subjectLimit >= 999999
                ? "مواد غير محدودة"
                : `عدد المواد الأقصى: ${plan.subjectLimit}`,
              plan.canCreateExams ? "إمكانية إنشاء الاختبارات والواجبات" : null,
              plan.canExportReports ? "تصدير التقارير والتحليلات" : null,
              plan.canUploadFiles ? "رفع الملفات والمرفقات" : null,
            ].filter((f): f is string => f !== null);

            return (
              <StaggerItem key={idx} direction="up" className="h-full">
                <HoverCard
                  className={cn(
                    "relative flex flex-col justify-between h-full bg-card rounded-2xl p-8 transition-all duration-300",
                    plan.isPopular
                      ? "border-2 border-accent shadow-sm"
                      : "border border-border shadow-none hover:border-primary/40",
                  )}
                >
                  {/* Highlight Badge */}
                  {plan.isPopular && (
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-xs">
                      <Crown className="size-3.5 fill-accent-foreground" />
                      <span>الأكثر شعبية</span>
                    </div>
                  )}

                  {/* Card Top */}
                  <div className="space-y-6">
                    {/* Title & Subtitle */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-foreground mb-1">
                        {plan.name}
                      </h3>
                      {plan.description && (
                        <span className="text-xs text-muted-foreground font-medium block min-h-6">
                          {plan.description}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-center gap-1 py-4 border-y border-border">
                      <span className="text-4xl font-black text-primary">
                        {plan.price}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        ج.م / شهر
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3.5">
                      {features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3">
                          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary border border-border">
                            <Check className="size-3 stroke-3" />
                          </div>
                          <span className="text-foreground text-xs font-semibold">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Button */}
                  <div className="pt-8 mt-auto">
                    <Button
                      asChild
                      variant={plan.isPopular ? "brand" : "brandOutline"}
                      size="brandLg"
                      className="w-full font-bold shadow-none text-xs"
                    >
                      <Link href="/login">اختر الباقة</Link>
                    </Button>
                  </div>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
