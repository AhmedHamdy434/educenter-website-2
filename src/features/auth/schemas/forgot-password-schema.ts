import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صالح"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
