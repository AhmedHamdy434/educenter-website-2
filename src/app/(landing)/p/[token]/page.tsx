import type { Metadata } from "next";
import { getParentReport } from "@/features/parent-portal/actions/parent-portal-actions";
import { ParentReportView } from "@/features/parent-portal/components/ParentReportView";
import { Card } from "@/components/ui/card";
import { AlertCircle, GraduationCap } from "lucide-react";
import Link from "next/link";

interface ParentPortalPageProps {
  params: Promise<{
    token: string;
  }>;
}

export const metadata: Metadata = {
  title: "تقرير ولي الأمر | EduCenter",
  description: "تقرير متابعة الحضور والغياب والمدفوعات الدراسية للطالب.",
};

export default async function ParentPortalPage({ params }: ParentPortalPageProps) {
  const { token } = await params;
  const result = await getParentReport(token);

  if (!result || !result.success || !result.data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <Card className="max-w-md w-full p-8 text-center bg-card border border-border rounded-2xl space-y-4 shadow-xs">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary mx-auto border border-border">
            <GraduationCap className="size-8 stroke-[2.25]" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-rose-700 font-bold">
              <AlertCircle className="size-5" />
              <h1 className="text-lg">رابط التقرير غير صالح أو منتهي</h1>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {result?.message ||
                "نعتذر، يبدو أن صلاحية هذا الرابط قد انتهت (صالح لمدة 30 يوماً فقط) أو تم إدخاله بشكل غير صحيح. يرجى مراجعة إدارة المركز أو معلم المادة للحصول على رابط محدث."}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-block text-xs font-bold text-primary hover:underline"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <ParentReportView data={result.data} />;
}
