import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  phone: z
    .string()
    .min(10, { message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل" })
    .regex(/^(01[0-2,5]\d{8}|\+?2?01[0-2,5]\d{8})$/, {
      message: "رقم الهاتف غير صالح، يجب أن يكون رقم هاتف مصري",
    }),
  subject: z.string().min(1, { message: "الرجاء اختيار موضوع الرسالة" }),
  message: z.string().min(10, { message: "الرسالة يجب أن تكون 10 أحرف على الأقل" }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
