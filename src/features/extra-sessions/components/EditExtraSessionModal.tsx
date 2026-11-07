'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Edit3,
  Info,
  Coins,
} from 'lucide-react';
import { SharedModal } from '@/components/common/SharedModal';
import { ModalActions } from '@/components/common/ModalActions';
import { FormInput } from '@/components/common/form-input';
import { FormTextarea } from '@/components/common/form-textarea';
import { FormSelect } from '@/components/common/form-select';
import { FormDatePicker } from '@/components/common/form-date-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUpdateExtraSessionMutation } from '../hooks/mutations';
import { useSubscriptionStore } from '@/features/subscription/state/useSubscriptionStore';
import { to24Hour } from '@/utils/time';
import {
  updateExtraSessionSchema,
  UpdateExtraSessionFormValues,
} from '../schemas/extra-session-schema';
import {
  ExtraSessionItem,
  ExtraSessionDetails,
  ExtraSessionType,
} from '../types';

interface EditExtraSessionModalProps {
  session: ExtraSessionItem | ExtraSessionDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditExtraSessionModal({
  session,
  isOpen,
  onClose,
}: EditExtraSessionModalProps) {
  const isExpired = useSubscriptionStore((state) => state.isExpired);
  const updateMutation = useUpdateExtraSessionMutation();

  const [timeState, setTimeState] = useState({
    hour: '4',
    minute: '00',
    period: 'PM',
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateExtraSessionFormValues>({
    resolver: zodResolver(updateExtraSessionSchema),
  });

  const isPaid = watch('isPaid');
  const selectedDate = watch('date') || '';
  const sessionType = watch('type');

  useEffect(() => {
    if (session) {
      const h24 = session.hour;
      const period = h24 >= 12 ? 'PM' : 'AM';
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
      const mStr = session.minute.toString().padStart(2, '0');

      setTimeState({
        hour: h12.toString(),
        minute: mStr,
        period,
      });

      const feeNum = Number(session.fee) || 0;

      reset({
        title: session.title || '',
        type: session.type,
        date: session.date,
        hour: session.hour,
        minute: session.minute,
        isPaid: feeNum > 0,
        fee: feeNum,
        location: session.location || '',
        notes: session.notes || '',
      });
    }
  }, [session, reset]);

  if (!session) return null;

  const handleTimeChange = (field: 'hour' | 'minute' | 'period', val: string) => {
    const updated = { ...timeState, [field]: val };
    setTimeState(updated);
    const hour24 = to24Hour(updated.hour, updated.period);
    setValue('hour', hour24);
    setValue('minute', parseInt(updated.minute, 10));
  };

  const onSubmit = async (values: UpdateExtraSessionFormValues) => {
    const hour24 = to24Hour(timeState.hour, timeState.period);
    const minuteNum = parseInt(timeState.minute, 10);

    const payload = {
      title: values.title?.trim() || undefined,
      type: values.type,
      date: values.date,
      hour: hour24,
      minute: minuteNum,
      location: values.location?.trim() || undefined,
      fee: values.isPaid ? Number(values.fee) : 0,
      notes: values.notes?.trim() || undefined,
    };

    const res = await updateMutation.mutateAsync({
      id: session.id,
      data: payload,
    });

    if (res.success) {
      onClose();
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="تعديل بيانات الحصة الإضافية"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 text-right"
        dir="rtl"
      >
        {/* Row 1: Title & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="عنوان الحصة الإضافية"
            placeholder="مثال: مراجعة الباب الأول"
            error={errors.title?.message}
            {...register('title')}
          />

          <FormSelect
            label="نوع الحصة"
            value={sessionType}
            onValueChange={(val: string) => setValue('type', val as ExtraSessionType)}
            options={[
              { value: 'REVISION', label: 'مراجعة (Revision)' },
              { value: 'MAKEUP', label: 'تعويضية (Makeup)' },
              { value: 'EXAM_PREP', label: 'ليلة امتحان (Exam Prep)' },
              { value: 'OTHER', label: 'أخرى (Other)' },
            ]}
          />
        </div>

        {/* Row 2: Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <FormDatePicker
            label="تاريخ الحصة (بتوقيت القاهرة)"
            value={selectedDate}
            onChange={(val: string) => setValue('date', val)}
            error={errors.date?.message}
            required
          />

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground block text-right">
              توقيت البدء
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={timeState.hour}
                onChange={(e) => handleTimeChange('hour', e.target.value)}
                className="h-11 px-2 rounded-xl border border-input bg-card text-foreground text-sm font-bold text-center outline-none focus:ring-1 focus:ring-primary"
                aria-label="الساعة"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h.toString()}>
                    {h}
                  </option>
                ))}
              </select>

              <select
                value={timeState.minute}
                onChange={(e) => handleTimeChange('minute', e.target.value)}
                className="h-11 px-2 rounded-xl border border-input bg-card text-foreground text-sm font-bold text-center outline-none focus:ring-1 focus:ring-primary"
                aria-label="الدقيقة"
              >
                {['00', '15', '30', '45'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={timeState.period}
                onChange={(e) => handleTimeChange('period', e.target.value)}
                className="h-11 px-2 rounded-xl border border-input bg-card text-foreground text-sm font-bold text-center outline-none focus:ring-1 focus:ring-primary"
                aria-label="الفترة"
              >
                <option value="PM">مساءً (م)</option>
                <option value="AM">صباحاً (ص)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Location */}
        <div>
          <FormInput
            label="مكان الانعقاد (القاعة)"
            placeholder="مثال: قاعة 3"
            error={errors.location?.message}
            {...register('location')}
          />
        </div>

        {/* Fee Section */}
        <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold text-foreground flex items-center gap-1.5 cursor-pointer">
                <Coins className="size-4 text-primary" />
                <span>رسوم الحصة الإضافية</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                تبديل بين حصة مجانية أو مدفوعة.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {isPaid ? 'مدفوعة' : 'مجانية'}
              </span>
              <Switch
                checked={isPaid}
                onCheckedChange={(checked) => {
                  setValue('isPaid', checked);
                  if (!checked) setValue('fee', 0);
                }}
              />
            </div>
          </div>

          {isPaid && (
            <div className="pt-2 border-t border-border/60 space-y-2">
              <FormInput
                type="number"
                min="0"
                step="5"
                label="المبلغ المطلوب من كل طالب (ج.م)"
                placeholder="مثال: 50"
                error={errors.fee?.message}
                value={watch('fee') || ''}
                onChange={(e) => setValue('fee', Number(e.target.value) || 0)}
              />
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-card p-2 rounded-lg border border-border/60">
                <Info className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>
                  ملاحظة: تعديل الرسوم يسري فقط على الطلاب غير المسددين وغير المعفيين. الطلاب الذين دفعوا بالفعل أو تم إعفاؤهم لن تتأثر سجلاتهم.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <FormTextarea
          label="ملاحظات الحصة"
          placeholder="أي توجيهات إضافية..."
          error={errors.notes?.message}
          {...register('notes')}
        />

        {/* Action Buttons */}
        <ModalActions
          onCancel={onClose}
          isSubmitting={updateMutation.isPending}
          disabled={isExpired}
          submitLabel="حفظ التعديلات"
          loadingLabel="جاري الحفظ..."
          icon={Edit3}
          className="pt-3"
        />
      </form>
    </SharedModal>
  );
}
