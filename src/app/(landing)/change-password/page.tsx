import type { Metadata } from "next";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";

export const metadata: Metadata = {
  title: "تغيير كلمة المرور الإلزامية | EduCenter",
  description: "تغيير كلمة المرور الافتراضية لمنصة EduCenter التعليمية.",
};

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 md:p-8 bg-background">
      <ChangePasswordForm />
    </div>
  );
}
