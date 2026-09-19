"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { FormInput } from "@/components/common/form-input";
import { FormSelect, type SelectOption } from "@/components/common/form-select";
import { FormActions } from "@/components/common/FormActions";
import { groupSchema, type GroupFormValues } from "../schemas/group-schema";
import { type Group, type DayOfWeek } from "../types";
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from "../hooks/mutations";
import { useSubjectsOptionsQuery } from "@/features/subjects/hooks/queries";
import { useTeachersOptionsQuery } from "@/features/teachers/hooks/queries";
import {
  DAY_NAMES_AR,
  formatTime,
  DAYS_OPTIONS,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  PERIOD_OPTIONS,
} from "@/utils/time";

interface GroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  group?: Group | null;
  gradesOptions: SelectOption[];
}

export function GroupForm({
  isOpen,
  onClose,
  group,
  gradesOptions,
}: GroupFormProps) {
  // Time picker temporary state
  const [tempDay, setTempDay] = useState<string>("SATURDAY");
  const [tempHour, setTempHour] = useState<string>("4");
  const [tempMinute, setTempMinute] = useState<string>("30");
  const [tempPeriod, setTempPeriod] = useState<string>("PM");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group?.name || "",
      gradeId: group?.gradeId || "",
      subjectId: group?.subjectId || "",
      teacherId: group?.teacherId || "",
      capacity: group?.capacity ?? null,
      monthlyFee: group?.monthlyFee ?? 0,
      startDate: group?.startDate ? group.startDate.split("T")[0] : "",
      monthsCount: group?.monthsCount ?? 1,
      schedule: group?.schedule.map((item) => ({
        day: item.day,
        hour: item.hour,
        minute: item.minute,
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  const { mutateAsync: createGroup, isPending: isCreatePending } =
    useCreateGroupMutation();
  const { mutateAsync: updateGroup, isPending: isUpdatePending } =
    useUpdateGroupMutation();

  const selectedGradeId = useWatch({ control, name: "gradeId" });
  const selectedSubjectId = useWatch({ control, name: "subjectId" });

  // Fetch subjects options via React Query
  const { data: subjectsOptions = [], isLoading: isSubjectsLoading } =
    useSubjectsOptionsQuery(selectedGradeId, isOpen);

  // Fetch teachers options via React Query
  const { data: teachersList = [], isLoading: isTeachersLoading } =
    useTeachersOptionsQuery(selectedSubjectId, isOpen);

  // Keep track of previous values to handle cascading resets only on user change
  const prevGradeIdRef = useRef(group?.gradeId || "");
  const prevSubjectIdRef = useRef(group?.subjectId || "");

  useEffect(() => {
    if (selectedGradeId && selectedGradeId !== prevGradeIdRef.current) {
      if (prevGradeIdRef.current !== "") {
        setValue("subjectId", "");
        setValue("teacherId", "");
      }
      prevGradeIdRef.current = selectedGradeId;
    }
  }, [selectedGradeId, setValue]);

  useEffect(() => {
    if (selectedSubjectId && selectedSubjectId !== prevSubjectIdRef.current) {
      if (prevSubjectIdRef.current !== "") {
        setValue("teacherId", "");
      }
      prevSubjectIdRef.current = selectedSubjectId;
    }
  }, [selectedSubjectId, setValue]);

  // Reset form when modal opens with new group or empty
  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        gradeId: group.gradeId,
        subjectId: group.subjectId,
        teacherId: group.teacherId,
        capacity: group.capacity,
        monthlyFee: group.monthlyFee,
        startDate: group.startDate ? group.startDate.split("T")[0] : "",
        monthsCount: group.monthsCount,
        schedule: group.schedule.map((item) => ({
          day: item.day,
          hour: item.hour,
          minute: item.minute,
        })),
      });
    } else {
      reset({
        name: "",
        gradeId: "",
        subjectId: "",
        teacherId: "",
        capacity: null,
        monthlyFee: 0,
        startDate: "",
        monthsCount: 1,
        schedule: [],
      });
    }
  }, [group, reset, isOpen]);

  const handleFormSubmit = async (values: GroupFormValues) => {
    if (!!group) {
      await updateGroup(
        { id: group.id, values },
        {
          onSuccess: (res) => {
            if (res.success) {
              onClose();
            }
          },
        }
      );
    } else {
      await createGroup(values, {
        onSuccess: (res) => {
          if (res.success) {
            onClose();
          }
        },
      });
    }
  };

  const handleAddScheduleItem = () => {
    let hour24 = parseInt(tempHour);
    const minuteVal = parseInt(tempMinute);

    if (tempPeriod === "PM" && hour24 < 12) {
      hour24 += 12;
    } else if (tempPeriod === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    // Check if duplicate schedule exists
    const hasDuplicate = fields.some(
      (item) =>
        item.day === tempDay && item.hour === hour24 && item.minute === minuteVal
    );

    if (!hasDuplicate) {
      append({
        day: tempDay as DayOfWeek,
        hour: hour24,
        minute: minuteVal,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="اسم المجموعة الدراسية"
          id="name"
          placeholder="مثال: مجموعة أ - الصف الأول الثانوي"
          error={errors.name?.message}
          {...register("name")}
        />

        <FormInput
          label="السعة الاستيعابية للطلاب (اختياري)"
          id="capacity"
          type="number"
          placeholder="اتركه فارغاً لسعة غير محدودة"
          error={errors.capacity?.message}
          {...register("capacity", {
            valueAsNumber: true,
            setValueAs: (val) => (val === "" || isNaN(Number(val)) ? null : Number(val)),
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="سعر الاشتراك الشهري (ج.م)"
          id="monthlyFee"
          type="number"
          step="0.01"
          placeholder="مثال: 500"
          error={errors.monthlyFee?.message}
          {...register("monthlyFee", {
            valueAsNumber: true,
            setValueAs: (val) => (val === "" || isNaN(Number(val)) ? 0 : Number(val)),
          })}
        />

        <FormInput
          label="تاريخ بداية المجموعة"
          id="startDate"
          type="date"
          error={errors.startDate?.message}
          {...register("startDate")}
        />

        <FormInput
          label="مدة المجموعة بالشهور"
          id="monthsCount"
          type="number"
          placeholder="مثال: 3"
          error={errors.monthsCount?.message}
          {...register("monthsCount", {
            valueAsNumber: true,
            setValueAs: (val) => (val === "" || isNaN(Number(val)) ? 1 : Number(val)),
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="المرحلة الدراسية"
          name="gradeId"
          control={control}
          options={gradesOptions}
          placeholder="اختر المرحلة..."
          error={errors.gradeId?.message}
        />

        <FormSelect
          label="المادة الدراسية"
          name="subjectId"
          control={control}
          options={subjectsOptions}
          placeholder={
            isSubjectsLoading
              ? "جاري التحميل..."
              : selectedGradeId
              ? "اختر المادة..."
              : "اختر المرحلة أولاً"
          }
          error={errors.subjectId?.message}
        />

        <FormSelect
          label="المعلم المسؤول"
          name="teacherId"
          control={control}
          options={teachersList}
          placeholder={
            isTeachersLoading
              ? "جاري التحميل..."
              : selectedSubjectId
              ? "اختر المعلم..."
              : "اختر المادة أولاً"
          }
          error={errors.teacherId?.message}
        />
      </div>

      {/* Schedule Picker Section */}
      <div className="border border-border rounded-xl p-4 space-y-4 bg-secondary/20">
        <h3 className="text-sm font-bold text-foreground">
          جدول المواعيد الأسبوعية للمجموعة
        </h3>

        {/* Temporary inputs to build a schedule item */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <FormSelect
            label="اليوم"
            value={tempDay}
            onValueChange={setTempDay}
            options={DAYS_OPTIONS}
          />

          <FormSelect
            label="الساعة"
            value={tempHour}
            onValueChange={setTempHour}
            options={HOUR_OPTIONS}
          />

          <FormSelect
            label="الدقيقة"
            value={tempMinute}
            onValueChange={setTempMinute}
            options={MINUTE_OPTIONS}
          />

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <FormSelect
                label="الفترة"
                value={tempPeriod}
                onValueChange={setTempPeriod}
                options={PERIOD_OPTIONS}
              />
            </div>

            <button
              type="button"
              onClick={handleAddScheduleItem}
              className="h-11 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="إضافة موعد"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* Selected schedule list */}
        {fields.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-lg text-xs font-bold text-foreground shadow-none"
              >
                <span>
                  {DAY_NAMES_AR[item.day]} {formatTime(item.hour, item.minute)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-destructive hover:bg-destructive/10 p-1 rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground py-2">
            لم يتم تحديد أي مواعيد بعد. يرجى إضافة موعد واحد على الأقل.
          </div>
        )}

        {errors.schedule && (
          <p className="text-xs text-destructive font-semibold pt-1">
            {errors.schedule.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <FormActions
        onCancel={onClose}
        isSubmitting={isCreatePending || isUpdatePending}
        submitLabel={group ? "حفظ التغييرات" : "إضافة المجموعة"}
      />
    </form>
  );
}
