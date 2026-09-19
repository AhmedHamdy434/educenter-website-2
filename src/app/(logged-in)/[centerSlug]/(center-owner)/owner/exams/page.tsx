import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الاختبارات | مدير المركز",
};

export default function OwnerExamsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground font-bold">إدارة الاختبارات</h1>
        <p className="text-muted-foreground text-sm">متابعة وإعداد الاختبارات والتقييمات للطلاب.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 shadow-none">
        <p className="text-foreground font-medium">محتوى صفحة إدارة الاختبارات</p>
      </div>
    </div>
  );
}
