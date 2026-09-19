import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "البريد الإلكتروني أو رقم الهاتف مطلوب" })
    .refine(
      (val) => {
        // Validate either as a valid email or a valid Egyptian phone number (11 digits starting with 01)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const egPhoneRegex = /^01[0125][0-9]{8}$/;
        return emailRegex.test(val) || egPhoneRegex.test(val);
      },
      {
        message: "يرجى إدخال بريد إلكتروني صحيح أو رقم هاتف مصري صالح (11 رقم يبدأ بـ 01)",
      }
    ),
  password: z
    .string()
    .min(1, { message: "كلمة المرور مطلوبة" })
    .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
