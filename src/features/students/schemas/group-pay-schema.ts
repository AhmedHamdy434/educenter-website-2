import { z } from "zod";

export const studentPaySchema = z.object({
  subscriptionDate: z.string().min(1, { message: "شهر الاشتراك مطلوب" }),

  amount: z
    .number({ message: "يجب إدخال مبلغ صحيح" })
    .positive({ message: "المبلغ يجب أن يكون أكبر من صفر" }),

  notes: z
    .string()
    .max(500, { message: "الملاحظات لا يمكن أن تتجاوز 500 حرف" })
    .optional()
    .or(z.literal("")),

  markAsFullPayment: z.boolean(),

  paymentMethod: z.string().optional(),
});

export type StudentPayFormValues = z.infer<typeof studentPaySchema>;
