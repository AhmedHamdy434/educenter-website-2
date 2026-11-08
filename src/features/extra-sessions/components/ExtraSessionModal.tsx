"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Edit3, Users, Coins, Info } from "lucide-react";
import { SharedModal } from "@/components/common/SharedModal";
import { ModalActions } from "@/components/common/ModalActions";
import { FormInput } from "@/components/common/form-input";
import { FormTextarea } from "@/components/common/form-textarea";
import { FormSelect } from "@/components/common/form-select";
import { FormDatePicker } from "@/components/common/form-date-picker";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  useCreateExtraSessionMutation,
  useUpdateExtraSessionMutation,
} from "../hooks/mutations";
import { useGroupStudentsQuery } from "@/features/groups/hooks/queries";
import { useSubscriptionStore } from "@/features/subscription/state/useSubscriptionStore";
import { getCairoTodayDateString } from "../utils/date-utils";
import { to24Hour } from "@/utils/time";
import {
  extraSessionSchema,
  type ExtraSessionFormValues,
} from "../schemas/extra-session-schema";
import {
  ExtraSessionItem,
  ExtraSessionDetails,
  ExtraSessionAudience,
  ExtraSessionType,
  CreateExtraSessionDTO,
  UpdateExtraSessionDTO,
} from "../types";
import {
  HOUR_OPTIONS,
  MiNUTE_OPTIONS,
  PERIOD_OPTIONS,
} from "@/constants/dropdown-options";

export interface ExtraSessionModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
  session?: ExtraSessionItem | ExtraSessionDetails | null;
}

export function ExtraSessionModal({
  groupId,
  isOpen,
  onClose,
  session,
}: ExtraSessionModalProps) {
  const isEditing = Boolean(session);
  const isExpired = useSubscriptionStore((state) => state.isExpired);

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [timeState, setTimeState] = useState({
    hour: "4",
    minute: "00",
    period: "PM",
  });

  const createMutation = useCreateExtraSessionMutation();
  const updateMutation = useUpdateExtraSessionMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExtraSessionFormValues>({
    resolver: zodResolver(extraSessionSchema),
    defaultValues: {
      title: "",
      type: "REVISION",
      audience: "ALL_GROUP",
      date: getCairoTodayDateString(),
      hour: 16,
      minute: 0,
      isPaid: false,
      fee: 0,
      location: "",
      notes: "",
      studentIds: [],
    },
  });

  const isPaid = watch("isPaid");
  const audience = watch("audience");
  const selectedDate = watch("date");
  const sessionType = watch("type");

  // مزامنة حالة النموذج عند الفتح أو التبديل بين الإنشاء والتعديل
  useEffect(() => {
    if (!isOpen) return;

    if (session) {
      const h24 = session.hour;
      const period = h24 >= 12 ? "PM" : "AM";
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
      const mStr = (session.minute ?? 0).toString().padStart(2, "0");

      setTimeState({
        hour: h12.toString(),
        minute: mStr,
        period,
      });

      const feeNum = Number(session.fee) || 0;

      reset({
        title: session.title || "",
        type: session.type,
        audience: session.audience || "ALL_GROUP",
        date: session.date,
        hour: session.hour,
        minute: session.minute,
        isPaid: feeNum > 0,
        fee: feeNum,
        location: session.location || "",
        notes: session.notes || "",
        studentIds: [],
      });
    } else {
      setTimeState({
        hour: "4",
        minute: "00",
        period: "PM",
      });
      setSelectedStudentIds([]);
      reset({
        title: "",
        type: "REVISION",
        audience: "ALL_GROUP",
        date: getCairoTodayDateString(),
        hour: 16,
        minute: 0,
        isPaid: false,
        fee: 0,
        location: "",
        notes: "",
        studentIds: [],
      });
    }
  }, [isOpen, session, reset]);

  const { data: studentsResponse, isLoading: isStudentsLoading } =
    useGroupStudentsQuery(
      groupId,
      { limit: 100 },
      isOpen && !isEditing && audience === "SELECTED",
    );
  const enrolledStudents = studentsResponse?.data || [];

  const handleTimeChange = (
    field: "hour" | "minute" | "period",
    val: string,
  ) => {
    const updated = { ...timeState, [field]: val };
    setTimeState(updated);
    const hour24 = to24Hour(updated.hour, updated.period);
    setValue("hour", hour24, { shouldValidate: true });
    setValue("minute", parseInt(updated.minute, 10), { shouldValidate: true });
  };

  const handleAudienceChange = (val: string) => {
    const aud = val as ExtraSessionAudience;
    setValue("audience", aud);
    if (aud === "ALL_GROUP") {
      setSelectedStudentIds([]);
      setValue("studentIds", []);
    }
  };

  const toggleSelectAllStudents = () => {
    if (selectedStudentIds.length === enrolledStudents.length) {
      setSelectedStudentIds([]);
      setValue("studentIds", []);
    } else {
      const allIds = enrolledStudents.map((s) => s.student.id);
      setSelectedStudentIds(allIds);
      setValue("studentIds", allIds);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    const updated = selectedStudentIds.includes(studentId)
      ? selectedStudentIds.filter((id) => id !== studentId)
      : [...selectedStudentIds, studentId];
    setSelectedStudentIds(updated);
    setValue("studentIds", updated);
  };

  const submitForm = async (values: ExtraSessionFormValues) => {
    const hour24 = to24Hour(timeState.hour, timeState.period);
    const minuteNum = parseInt(timeState.minute, 10);

    if (session) {
      // تعديل حصة موجودة
      const payload: UpdateExtraSessionDTO = {
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
        handleClose();
      }
    } else {
      // إنشاء حصة جديدة
      const payload: CreateExtraSessionDTO = {
        title: values.title?.trim() || undefined,
        type: values.type,
        audience: values.audience,
        date: values.date,
        hour: hour24,
        minute: minuteNum,
        location: values.location?.trim() || undefined,
        fee: values.isPaid ? Number(values.fee) : 0,
        notes: values.notes?.trim() || undefined,
        studentIds:
          values.audience === "SELECTED" ? selectedStudentIds : undefined,
      };

      const res = await createMutation.mutateAsync({
        groupId,
        data: payload,
      });

      if (res.success) {
        handleClose();
      }
    }
  };

  const handleClose = () => {
    reset();
    setSelectedStudentIds([]);
    onClose();
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "تعديل بيانات الحصة الإضافية" : "إنشاء حصة إضافية جديدة"}
    >
      <form
        onSubmit={handleSubmit((values) => submitForm(values))}
        className="space-y-5 text-right"
        dir="rtl"
      >
        {/* Row 1: Title & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="عنوان الحصة الإضافية"
            placeholder="أدخل عنوان الحصة الإضافية..."
            error={errors.title?.message}
            {...register("title")}
          />

          <FormSelect
            label="نوع الحصة"
            value={sessionType}
            onValueChange={(val: string) =>
              setValue("type", val as ExtraSessionType)
            }
            options={[
              { value: "REVISION", label: "مراجعة (Revision)" },
              { value: "MAKEUP", label: "تعويضية (Makeup)" },
              { value: "EXAM_PREP", label: "ليلة امتحان (Exam Prep)" },
              { value: "OTHER", label: "أخرى (Other)" },
            ]}
          />
        </div>

        {/* Row 2: Date & Time Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <FormDatePicker
            label="تاريخ الحصة"
            value={selectedDate}
            onChange={(val: string) => setValue("date", val)}
            error={errors.date?.message}
            required
          />

          {/* Time Picker */}
          <div className="grid grid-cols-3 gap-2">
            <FormSelect
              label="الساعة"
              value={timeState.hour}
              onValueChange={(val: string) => handleTimeChange("hour", val)}
              options={HOUR_OPTIONS}
            />
            <FormSelect
              label="الدقيقة"
              value={timeState.minute}
              onValueChange={(val: string) => handleTimeChange("minute", val)}
              options={MiNUTE_OPTIONS}
            />
            <FormSelect
              label="الفترة"
              value={timeState.period}
              onValueChange={(val: string) => handleTimeChange("period", val)}
              options={PERIOD_OPTIONS}
            />
          </div>
        </div>

        {/* Fee Section (Free vs Paid) */}
        <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold text-foreground flex items-center gap-1.5 cursor-pointer">
                <Coins className="size-4 text-primary" />
                <span>رسوم الحصة الإضافية</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                حدد إذا كانت الحصة مجانية بالكامل أو تتطلب رسوماً نقدية إضافية تُحصّل كاش.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {isPaid ? "مدفوعة" : "مجانية"}
              </span>
              <Switch
                checked={isPaid}
                onCheckedChange={(checked) => {
                  setValue("isPaid", checked);
                  if (!checked) setValue("fee", 0);
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
                placeholder="أدخل قيمة رسوم الحصة..."
                error={errors.fee?.message}
                value={watch("fee") || ""}
                onChange={(e) => setValue("fee", Number(e.target.value) || 0)}
              />
              {isEditing && (
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-card p-2 rounded-lg border border-border/60">
                  <Info className="size-3.5 text-primary shrink-0 mt-0.5" />
                  <span>
                    ملاحظة: تعديل الرسوم يسري فقط على الطلاب غير المسددين وغير المعفيين. الطلاب الذين دفعوا بالفعل أو تم إعفاؤهم لن تتأثر سجلاتهم.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Audience Section (فقط في وضع الإنشاء) */}
        {!isEditing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Users className="size-3.5 text-primary" />
                <span>الطلاب المستهدفون بالحصة</span>
              </Label>

              <div className="flex items-center gap-4 text-xs font-medium">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="audienceRadio"
                    value="ALL_GROUP"
                    checked={audience === "ALL_GROUP"}
                    onChange={() => handleAudienceChange("ALL_GROUP")}
                    className="accent-primary"
                  />
                  <span>جميع طلاب المجموعة</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="audienceRadio"
                    value="SELECTED"
                    checked={audience === "SELECTED"}
                    onChange={() => handleAudienceChange("SELECTED")}
                    className="accent-primary"
                  />
                  <span>تحديد طلاب معينين</span>
                </label>
              </div>
            </div>

            {audience === "SELECTED" && (
              <div className="p-3 border border-border rounded-xl bg-card space-y-2 max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
                  <span className="font-semibold text-muted-foreground">
                    المحدد: {selectedStudentIds.length} من {enrolledStudents.length}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleSelectAllStudents}
                    className="h-6 px-2 text-xs text-primary hover:text-primary font-bold cursor-pointer"
                  >
                    {selectedStudentIds.length === enrolledStudents.length
                      ? "إلغاء تحديد الكل"
                      : "تحديد الكل"}
                  </Button>
                </div>

                {isStudentsLoading ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    جاري تحميل قائمة الطلاب...
                  </div>
                ) : enrolledStudents.length === 0 ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    لا يوجد طلاب مسجلون في هذه المجموعة حالياً.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {enrolledStudents.map((item) => {
                      const stuId = item.student.id;
                      const isChecked = selectedStudentIds.includes(stuId);
                      return (
                        <label
                          key={stuId}
                          className="flex items-center gap-2 p-2 rounded-lg border border-border/50 hover:bg-secondary/40 cursor-pointer text-xs transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleStudentSelection(stuId)}
                            className="accent-primary size-3.5 rounded"
                          />
                          <div className="truncate">
                            <span className="font-bold text-foreground">
                              {item.student.user.fullName}
                            </span>
                            {item.student.code && (
                              <span className="text-[10px] text-muted-foreground mr-1">
                                ({item.student.code})
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <FormTextarea
          label="ملاحظات أو توجيهات للطلاب"
          placeholder="أدخل أي ملاحظات أو توجيهات للطلاب..."
          error={errors.notes?.message}
          {...register("notes")}
        />

        {/* Action Buttons */}
        <ModalActions
          onCancel={handleClose}
          isSubmitting={isPending}
          disabled={isExpired}
          submitLabel={isEditing ? "حفظ التعديلات" : "إنشاء الحصة الإضافية"}
          loadingLabel={isEditing ? "جاري الحفظ..." : "جاري الإنشاء..."}
          icon={isEditing ? Edit3 : Sparkles}
          className="pt-4"
        />
      </form>
    </SharedModal>
  );
}
