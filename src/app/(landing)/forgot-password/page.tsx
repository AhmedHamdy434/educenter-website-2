import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "استعادة كلمة المرور | EduCenter",
  description: "استعادة كلمة المرور لحسابك في منصة EduCenter التعليمية.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 md:p-8 bg-background">
      <ForgotPasswordForm />
    </div>
  );
}
