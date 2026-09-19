"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/components/common/form-input";
import { FormTextarea } from "@/components/common/form-textarea";
import { FormSelect } from "@/components/common/form-select";
import { FormActions } from "@/components/common/FormActions";
import { subjectSchema, type SubjectFormValues } from "../schemas/subject-schema";
import { type Subject } from "../types";
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from "../hooks/mutations";

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: Subject | null;
  gradesOptions: { value: string; label: string }[];
}

export function SubjectForm({ isOpen, onClose, subject, gradesOptions }: SubjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      description: "",
      gradeId: "",
    },
  });

  const { mutateAsync: createSubject, isPending: isCreatePending } =
    useCreateSubjectMutation();
  const { mutateAsync: updateSubject, isPending: isUpdatePending } =
    useUpdateSubjectMutation();

  const handleFormSubmit = async (values: SubjectFormValues) => {
    if (!!subject) {
      await updateSubject(
        { id: subject.id, values },
        {
          onSuccess: (res) => {
            if (res.success) {
              onClose();
            }
          },
        },
      );
    } else {
      await createSubject(values, {
        onSuccess: (res) => {
          if (res.success) {
            onClose();
          }
        },
      });
    }
  };

  // Populate form values if editing
  useEffect(() => {
    if (subject) {
      reset({
        name: subject.name,
        description: subject.description || "",
        gradeId: subject.gradeId,
      });
    } else {
      reset({
        name: "",
        description: "",
        gradeId: "",
      });
    }
  }, [subject, reset, isOpen]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <FormInput
        label="اسم المادة الدراسية"
        id="name"
        placeholder="مثال: الرياضيات"
        error={errors.name?.message}
        {...register("name")}
      />

      {!subject && (
        <FormSelect
          label="المرحلة الدراسية"
          name="gradeId"
          control={control}
          options={gradesOptions}
          placeholder="اختر المرحلة الدراسية"
          error={errors.gradeId?.message}
        />
      )}

      <FormTextarea
        label="شرح أو وصف المادة (اختياري)"
        id="description"
        placeholder="مثال: منهج الرياضيات لطلاب الصف الأول الثانوي"
        error={errors.description?.message}
        {...register("description")}
      />

      {/* Action Buttons */}
      <FormActions
        onCancel={onClose}
        isSubmitting={isCreatePending || isUpdatePending}
        submitLabel={subject ? "حفظ التغييرات" : "إضافة المادة"}
      />
    </form>
  );
}
