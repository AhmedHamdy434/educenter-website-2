import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { Loading } from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "تعيين كلمة المرور الجديدة | EduCenter",
  description: "إعادة تعيين كلمة المرور لحسابك في منصة EduCenter.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 md:p-8 bg-background">
      <Suspense fallback={<Loading message="جاري تحميل الصفحة..." />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
