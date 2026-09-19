import { z } from "zod";

export const subjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: "اسم المادة الدراسية مطلوب" })
    .max(100, { message: "اسم المادة الدراسية لا يمكن أن يتجاوز 100 حرف" }),
  description: z
    .string()
    .max(500, { message: "الوصف لا يمكن أن يتجاوز 500 حرف" })
    .optional()
    .or(z.literal("")),
  gradeId: z
    .string()
    .min(1, { message: "يجب اختيار المرحلة الدراسية" }),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
