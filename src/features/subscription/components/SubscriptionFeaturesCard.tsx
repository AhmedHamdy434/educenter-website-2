import {
  CheckCircle2,
  XCircle,
  FileText,
  UploadCloud,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { type SubscriptionPlanDetails } from "../types";

interface SubscriptionFeaturesCardProps {
  plan?: SubscriptionPlanDetails | null;
}

export function SubscriptionFeaturesCard({
  plan,
}: SubscriptionFeaturesCardProps) {
  const features = [
    {
      title: "إنشاء الاختبارات والواجبات",
      description:
        "إمكانية إعداد اختبارات إلكترونية وواجبات وتقييم إجابات الطلاب.",
      enabled: plan?.canCreateExams ?? false,
      icon: FileText,
    },
    {
      title: "رفع الملفات والمذكرات",
      description:
        "رفع المستندات التعليمية ومشاركتها مباشرة مع المجموعات والطلاب.",
      enabled: plan?.canUploadFiles ?? false,
      icon: UploadCloud,
    },
    {
      title: "تصدير التقارير المتقدمة",
      description: "استخراج كشوف الحضور وتقارير المدفوعات والنتائج بصيغ رقمية.",
      enabled: plan?.canExportReports ?? false,
      icon: BarChart3,
    },
  ];

  return (
    <Card className="p-6 border border-border bg-card rounded-xl shadow-none space-y-5 text-right">
      <div className="flex items-center gap-2.5 border-b border-border pb-3">
        <div>
          <h3 className="text-base font-bold text-foreground">
            مزايا وصلاحيات الباقة
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            الخدمات الإضافية المتاحة لمركزك ضمن الخطة الحالية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                item.enabled
                  ? "bg-secondary/40 border-border"
                  : "bg-muted/20 border-dashed border-border/70 opacity-75"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="size-8 rounded-lg bg-card border border-border flex items-center justify-center text-primary">
                  <Icon className="size-4" />
                </div>
                {item.enabled ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="size-3" />
                    مفعلة
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-300">
                    <XCircle className="size-3" />
                    غير مفعلة
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground mb-0.5">
                  {item.title}
                </h4>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
