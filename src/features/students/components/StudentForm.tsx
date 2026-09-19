"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/components/common/form-input";
import { FormSelect } from "@/components/common/form-select";
import { FormTextarea } from "@/components/common/form-textarea";
import { FormActions } from "@/components/common/FormActions";
import { studentSchema, type StudentFormValues } from "../schemas/student-schema";
import { type Student } from "../types";
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from "../hooks/mutations";

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
  gradesOptions: { value: string; label: string }[];
}

export function StudentForm({ isOpen, onClose, student, gradesOptions }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      parentPhone: "",
      notes: "",
      gradeId: "",
    },
  });

  const { mutateAsync: createStudent, isPending: isCreatePending } =
    useCreateStudentMutation();
  const { mutateAsync: updateStudent, isPending: isUpdatePending } =
    useUpdateStudentMutation();

  const handleFormSubmit = async (values: StudentFormValues) => {
    if (!!student) {
      await updateStudent(
        { id: student.id, values },
        {
          onSuccess: (res) => {
            if (res.success) {
              onClose();
            }
          },
        },
      );
    } else {
      await createStudent(values, {
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
    if (student) {
      // Find active grade ID from enrollments
      const activeEnrollment = student.enrollments.find((e) => e.isActive);
      const gradeId = activeEnrollment?.grade.id || "";

      reset({
        fullName: student.user.fullName,
        email: student.user.email,
        password: "", // Leave blank when editing
        phone: student.user.phone,
        parentPhone: student.parentPhone,
        notes: student.notes || "",
        gradeId,
      });
    } else {
      reset({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        parentPhone: "",
        notes: "",
        gradeId: "",
      });
    }
  }, [student, reset, isOpen]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="الاسم الكامل"
          id="fullName"
          placeholder="مثال: أحمد محمد"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <FormInput
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="student@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label={student ? "كلمة المرور الجديدة (اختياري)" : "كلمة المرور"}
          id="password"
          type="password"
          placeholder={student ? "اتركها فارغة للإبقاء على الحالية" : "••••••"}
          error={errors.password?.message}
          {...register("password")}
        />

        <FormInput
          label="رقم الهاتف"
          id="phone"
          placeholder="مثال: +966500000000"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="رقم هاتف ولي الأمر"
          id="parentPhone"
          placeholder="مثال: +966511111111"
          error={errors.parentPhone?.message}
          {...register("parentPhone")}
        />

        <FormSelect
          label="المرحلة الدراسية"
          name="gradeId"
          control={control}
          options={gradesOptions}
          placeholder="اختر المرحلة الدراسية"
          error={errors.gradeId?.message}
        />
      </div>

      <FormTextarea
        label="ملاحظات حول الطالب (اختياري)"
        id="notes"
        placeholder="مثال: يحتاج لمتابعة خاصة في مادة الرياضيات"
        error={errors.notes?.message}
        {...register("notes")}
      />

      {/* Action Buttons */}
      <FormActions
        onCancel={onClose}
        isSubmitting={isCreatePending || isUpdatePending}
        submitLabel={student ? "حفظ التغييرات" : "إضافة الطالب"}
      />
    </form>
  );
}
