import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الواجبات | المعلم",
};

export default function TeacherAssignmentsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground font-bold">إدارة الواجبات</h1>
        <p className="text-muted-foreground text-sm">عرض وتصحيح واجبات الطلاب والأنشطة الدراسية.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 shadow-none">
        <p className="text-foreground font-medium">محتوى صفحة إدارة الواجبات</p>
      </div>
    </div>
  );
}
