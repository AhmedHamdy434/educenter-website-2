"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Users, Coins } from "lucide-react";
import { SharedModal } from "@/components/common/SharedModal";
import { ModalActions } from "@/components/common/ModalActions";
import { FormInput } from "@/components/common/form-input";
import { FormTextarea } from "@/components/common/form-textarea";
import { FormSelect } from "@/components/common/form-select";
import { FormDatePicker } from "@/components/common/form-date-picker";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCreateExtraSessionMutation } from "../hooks/mutations";
import { useGroupStudentsQuery } from "@/features/groups/hooks/queries";
import { getCairoTodayDateString } from "../utils/date-utils";
import { to24Hour } from "@/utils/time";
import {
  createExtraSessionSchema,
  CreateExtraSessionFormValues,
} from "../schemas/extra-session-schema";
import { ExtraSessionAudience, ExtraSessionType } from "../types";

interface CreateExtraSessionModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateExtraSessionModal({
  groupId,
  isOpen,
  onClose,
}: CreateExtraSessionModalProps) {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateExtraSessionFormValues>({
    resolver: zodResolver(createExtraSessionSchema),
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

  const { data: studentsResponse, isLoading: isStudentsLoading } =
    useGroupStudentsQuery(
      groupId,
      { limit: 100 },
      isOpen && audience === "SELECTED",
    );
  const enrolledStudents = studentsResponse?.data || [];

  const createMutation = useCreateExtraSessionMutation();

  const [timeState, setTimeState] = useState({
    hour: "4",
    minute: "00",
    period: "PM",
  });

  const handleTimeChange = (
    field: "hour" | "minute" | "period",
    val: string,
  ) => {
    const updated = { ...timeState, [field]: val };
    setTimeState(updated);
    const hour24 = to24Hour(updated.hour, updated.period);
    setValue("hour", hour24);
    setValue("minute", parseInt(updated.minute, 10));
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

  const submitForm = async (values: CreateExtraSessionFormValues) => {
    const hour24 = to24Hour(timeState.hour, timeState.period);
    const minuteNum = parseInt(timeState.minute, 10);

    const payload = {
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
      title="إنشاء حصة إضافية جديدة"
    >
      <form
        onSubmit={handleSubmit((vals) => submitForm(vals))}
        className="space-y-5"
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
            label="تاريخ الحصة (بتوقيت القاهرة)"
            value={selectedDate}
            onChange={(val: string) => setValue("date", val)}
            error={errors.date?.message}
            required
          />

          {/* Time Picker */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground block text-right">
              توقيت البدء
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={timeState.hour}
                onChange={(e) => handleTimeChange("hour", e.target.value)}
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
                onChange={(e) => handleTimeChange("minute", e.target.value)}
                className="h-11 px-2 rounded-xl border border-input bg-card text-foreground text-sm font-bold text-center outline-none focus:ring-1 focus:ring-primary"
                aria-label="الدقيقة"
              >
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={timeState.period}
                onChange={(e) => handleTimeChange("period", e.target.value)}
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
            label="مكان الانعقاد"
            placeholder="أدخل مكان الانعقاد..."
            error={errors.location?.message}
            {...register("location")}
          />
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
                حدد إذا كانت الحصة مجانية بالكامل أو تتطلب رسوماً نقدية إضافية
                تُحصّل كاش.
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
            <div className="pt-2 border-t border-border/60">
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
            </div>
          )}
        </div>

        {/* Audience Section */}
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
                <span>جميع طلاب المجموعة ({enrolledStudents.length})</span>
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
                  المحدد: {selectedStudentIds.length} من{" "}
                  {enrolledStudents.length}
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
          isSubmitting={createMutation.isPending}
          submitLabel="إنشاء الحصة الإضافية"
          loadingLabel="جاري الإنشاء..."
          icon={Sparkles}
          className="pt-4"
        />
      </form>
    </SharedModal>
  );
}
