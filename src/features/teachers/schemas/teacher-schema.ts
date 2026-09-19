import { z } from "zod";

export const teacherSchema = z.object({
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
  specialization: z
    .string()
    .min(1, { message: "التخصص مطلوب" }),
  salary: z
    .number({ message: "يجب إدخال راتب صحيح" })
    .min(0, { message: "الراتب يجب أن يكون 0 أو أكثر" }),
  bio: z
    .string()
    .max(1000, { message: "السيرة الذاتية لا يمكن أن تتجاوز 1000 حرف" })
    .optional()
    .or(z.literal("")),
  subjectIds: z
    .array(z.string())
    .min(1, { message: "يجب اختيار مادة واحدة على الأقل" }),
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;
