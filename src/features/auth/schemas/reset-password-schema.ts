import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("يرجى إدخال بريد إلكتروني صالح"),
    otp: z
      .string()
      .min(1, "رمز التحقق مطلوب")
      .length(6, "يجب أن يتكون رمز التحقق من 6 أرقام"),
    newPassword: z
      .string()
      .min(6, "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
