import { z } from "zod";

export const studentSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "الاسم الكامل مطلوب" })
    .max(100, { message: "الاسم لا يمكن أن يتجاوز 100 حرف" }),
  email: z
    .string()
    .min(1, { message: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صالح" }),
  password: z
    .string()
    .max(50, { message: "كلمة المرور لا يمكن أن تتجاوز 50 حرفًا" })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(1, { message: "رقم الهاتف مطلوب" }),
  parentPhone: z
    .string()
    .min(1, { message: "رقم هاتف ولي الأمر مطلوب" }),
  notes: z
    .string()
    .max(1000, { message: "الملاحظات لا يمكن أن تتجاوز 1000 حرف" })
    .optional()
    .or(z.literal("")),
  gradeId: z
    .string()
    .min(1, { message: "يجب اختيار المرحلة الدراسية" }),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
