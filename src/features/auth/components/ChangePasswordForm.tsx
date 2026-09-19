"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";

import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/change-password-schema";
import { changePasswordAction } from "../actions/change-password";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { FadeIn } from "@/components/common/motion-wrapper";
import { handleResponseToast } from "@/lib/api/handleResponseToast";

export function ChangePasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const result = await changePasswordAction(data);

    handleResponseToast(result);
    if (result.success) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <FadeIn direction="up" duration={0.6}>
        <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-none">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:opacity-90 transition-opacity"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary border border-border">
                <GraduationCap className="size-6 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                EduCenter
              </span>
            </Link>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              تغيير كلمة المرور الافتراضية
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              لدواعي الأمان، يجب عليك تغيير كلمة المرور المؤقتة لمتابعة استخدام المنصة
            </p>

            <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-right text-xs text-amber-950 dark:text-amber-300 mt-3">
              <ShieldAlert className="size-4 shrink-0 text-amber-600" />
              <span>
                تم تسجيل دخولك لأول مرة ببيانات افتراضية. يرجى تعيين كلمة مرور قوية وخاصة بك.
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormInput
                type="password"
                id="currentPassword"
                label="كلمة المرور الحالية (المؤقتة)"
                placeholder="••••••••"
                error={errors.currentPassword?.message}
                disabled={isSubmitting}
                {...register("currentPassword")}
              />

              <FormInput
                type="password"
                id="newPassword"
                label="كلمة المرور الجديدة"
                placeholder="••••••••"
                error={errors.newPassword?.message}
                disabled={isSubmitting}
                {...register("newPassword")}
              />

              <FormInput
                type="password"
                id="confirmPassword"
                label="تأكيد كلمة المرور الجديدة"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                disabled={isSubmitting}
                {...register("confirmPassword")}
              />
            </div>

            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting}
              className="w-full py-6 font-bold flex items-center justify-center gap-2 rounded-xl shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>جاري تحديث كلمة المرور...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-5" />
                  <span>تأكيد ومتابعة للدخول</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </FadeIn>
    </div>
  );
}
