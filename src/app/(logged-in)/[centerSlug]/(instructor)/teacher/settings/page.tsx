import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الإعدادات | المعلم",
};

export default function TeacherSettingsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground font-bold">الإعدادات</h1>
        <p className="text-muted-foreground text-sm">تحديث ملفك الشخصي وإعدادات الحساب وكلمة المرور.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 shadow-none">
        <p className="text-foreground font-medium">محتوى صفحة الإعدادات والملف الشخصي</p>
      </div>
    </div>
  );
}
