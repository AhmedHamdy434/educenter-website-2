import { z } from 'zod';

export const createExtraSessionSchema = z.object({
  title: z
    .string()
    .max(100, { message: 'عنوان الحصة لا يتجاوز 100 حرف' })
    .optional()
    .or(z.literal('')),
  type: z.enum(['MAKEUP', 'REVISION', 'EXAM_PREP', 'OTHER'], {
    message: 'نوع الحصة مطلوب',
  }),
  audience: z.enum(['ALL_GROUP', 'SELECTED'], {
    message: 'فئة الطلاب المستهدفة مطلوبة',
  }),
  date: z
    .string({ message: 'تاريخ الحصة مطلوب' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'صيغة التاريخ يجب أن تكون YYYY-MM-DD' }),
  hour: z.number({ message: 'ساعة الحصة مطلوبة' }).min(0).max(23),
  minute: z.number({ message: 'دقيقة الحصة مطلوبة' }).min(0).max(59),
  isPaid: z.boolean(),
  fee: z.number().min(0),
  location: z.string().max(100).optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
  studentIds: z.array(z.string()).optional(),
});

export type CreateExtraSessionFormValues = z.infer<typeof createExtraSessionSchema>;

export const updateExtraSessionSchema = z.object({
  title: z.string().max(100).optional().or(z.literal('')),
  type: z.enum(['MAKEUP', 'REVISION', 'EXAM_PREP', 'OTHER']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  hour: z.number().min(0).max(23).optional(),
  minute: z.number().min(0).max(59).optional(),
  isPaid: z.boolean(),
  fee: z.number().min(0).optional(),
  location: z.string().max(100).optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type UpdateExtraSessionFormValues = z.infer<typeof updateExtraSessionSchema>;

export const cancelExtraSessionSchema = z.object({
  reason: z.string().max(300, { message: 'السبب لا يتجاوز 300 حرف' }).optional().or(z.literal('')),
  confirmRefundNotes: z
    .string()
    .max(500, { message: 'ملاحظة التسوية لا تتجاوز 500 حرف' })
    .optional()
    .or(z.literal('')),
});

export type CancelExtraSessionFormValues = z.infer<typeof cancelExtraSessionSchema>;

export const quickPaySchema = z.object({
  notes: z.string().max(200, { message: 'الملاحظة لا تتجاوز 200 حرف' }).optional().or(z.literal('')),
});

export type QuickPayFormValues = z.infer<typeof quickPaySchema>;

export const quickWaiveSchema = z.object({
  reason: z.string().max(200, { message: 'السبب لا يتجاوز 200 حرف' }).optional().or(z.literal('')),
});

export type QuickWaiveFormValues = z.infer<typeof quickWaiveSchema>;
