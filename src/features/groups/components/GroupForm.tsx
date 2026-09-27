"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/components/common/form-input";
import { FormSelect, type SelectOption } from "@/components/common/form-select";
import { FormActions } from "@/components/common/FormActions";
import { groupSchema, type GroupFormValues } from "../schemas/group-schema";
import { type Group } from "../types";
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from "../hooks/mutations";
import { useSubjectsOptionsQuery } from "@/features/subjects/hooks/queries";
import { useTeachersOptionsQuery } from "@/features/teachers/hooks/queries";
import { useResetOnChange } from "@/hooks/useResetOnChange";
import { WeeklySchedulePicker } from "./WeeklySchedulePicker";

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

  // Cascading resets: when gradeId changes, reset subjectId and teacherId
  useResetOnChange(
    selectedGradeId,
    (_current, prev) => {
      if (prev !== "") {
        setValue("subjectId", "");
        setValue("teacherId", "");
      }
    },
    group?.gradeId || "",
    group?.id
  );

  // Cascading resets: when subjectId changes, reset teacherId
  useResetOnChange(
    selectedSubjectId,
    (_current, prev) => {
      if (prev !== "") {
        setValue("teacherId", "");
      }
    },
    group?.subjectId || "",
    group?.id
  );

  // Reset form when modal opens with new group or empty
  useEffect(() => {
    if (!isOpen) return;

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
          isLoading={isSubjectsLoading}
          placeholder={selectedGradeId ? "اختر المادة..." : "اختر المرحلة أولاً"}
          disabled={!selectedGradeId}
          error={errors.subjectId?.message}
        />

        <FormSelect
          label="المعلم المسؤول"
          name="teacherId"
          control={control}
          options={teachersList}
          isLoading={isTeachersLoading}
          placeholder={selectedSubjectId ? "اختر المعلم..." : "اختر المادة أولاً"}
          disabled={!selectedSubjectId}
          error={errors.teacherId?.message}
        />
      </div>

      {/* Schedule Picker Section */}
      <WeeklySchedulePicker
        schedule={fields}
        onAdd={append}
        onRemove={remove}
        error={errors.schedule?.message}
      />

      {/* Action Buttons */}
      <FormActions
        onCancel={onClose}
        isSubmitting={isCreatePending || isUpdatePending}
        submitLabel={group ? "حفظ التغييرات" : "إضافة المجموعة"}
      />
    </form>
  );
}
