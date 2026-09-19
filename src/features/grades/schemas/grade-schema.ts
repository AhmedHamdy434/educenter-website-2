import { z } from "zod";

export const gradeSchema = z.object({
  name: z
    .string()
    .min(1, { message: "اسم المرحلة الدراسية مطلوب" })
    .max(100, { message: "اسم المرحلة الدراسية لا يمكن أن يتجاوز 100 حرف" }),
  description: z
    .string()
    .max(500, { message: "الوصف لا يمكن أن يتجاوز 500 حرف" })
    .optional()
    .or(z.literal("")),
  order: z
    .number({ message: "يجب إدخال رقم ترتيب صالح" })
    .int({ message: "الترتيب يجب أن يكون رقماً صحيحاً" })
    .positive({ message: "الترتيب يجب أن يكون رقماً موجباً" })
    .min(1, { message: "الترتيب يجب أن يكون 1 أو أكثر" }),
});

export type GradeFormValues = z.infer<typeof gradeSchema>;
