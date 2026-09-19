import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "النتائج | الطالب",
};

export default function StudentResultsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground font-bold">نتائج التقييمات</h1>
        <p className="text-muted-foreground text-sm">عرض درجاتك في الاختبارات السابقة والتقارير الأكاديمية.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 shadow-none">
        <p className="text-foreground font-medium">محتوى صفحة نتائج التقييمات</p>
      </div>
    </div>
  );
}
