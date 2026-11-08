"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/components/common/form-input";
import { FormSelect } from "@/components/common/form-select";
import { FormTextarea } from "@/components/common/form-textarea";
import { FormActions } from "@/components/common/FormActions";
import {
  studentSchema,
  type StudentFormValues,
} from "../schemas/student-schema";
import { type Student } from "../types";
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from "../hooks/mutations";
import { cn } from "@/lib/utils";

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
  gradesOptions: { value: string; label: string }[];
  isGradesLoading?: boolean;
}

export function StudentForm({
  isOpen,
  onClose,
  student,
  gradesOptions,
  isGradesLoading,
}: StudentFormProps) {
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
      code: "",
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
      console.log("bbbbbbbbbbbbb", student);
      // Find active grade ID from enrollments
      const activeEnrollment =
        student.enrollments.find((e) => e.isActive) ?? student.enrollments[0];
      const gradeId =
        String(activeEnrollment?.grade?.id) ||
        String(activeEnrollment?.gradeId);

      reset({
        fullName: student.user.fullName,
        email: student.user.email,
        password: "", // Leave blank when editing
        phone: student.user.phone,
        parentPhone: student.parentPhone,
        notes: student.notes || "",
        gradeId,
        code: student.code || "",
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
        code: "",
      });
    }
  }, [student, reset, isOpen, isGradesLoading]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div
        className={cn(`grid grid-cols-1 gap-4`, !student && "md:grid-cols-2")}
      >
        <FormInput
          label="الاسم الكامل"
          id="fullName"
          placeholder="أدخل اسم الطالب..."
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        {!student && (
          <FormInput
            label="كود الطالب"
            id="code"
            placeholder="أدخل كود الطالب أو اتركه للتوليد التلقائي..."
            error={errors.code?.message}
            {...register("code")}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="أدخل البريد الإلكتروني..."
          error={errors.email?.message}
          {...register("email")}
        />

        <FormInput
          label={student ? "كلمة المرور الجديدة (اختياري)" : "كلمة المرور"}
          id="password"
          type="password"
          placeholder={student ? "اتركها فارغة للإبقاء على الحالية" : "••••••"}
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="رقم الهاتف"
          id="phone"
          placeholder="أدخل رقم هاتف الطالب..."
          error={errors.phone?.message}
          {...register("phone")}
        />

        <FormInput
          label="رقم هاتف ولي الأمر"
          id="parentPhone"
          placeholder="أدخل رقم هاتف ولي الأمر..."
          error={errors.parentPhone?.message}
          {...register("parentPhone")}
        />
      </div>

      <div>
        <FormSelect
          label="المرحلة الدراسية"
          name="gradeId"
          control={control}
          options={gradesOptions}
          isLoading={isGradesLoading}
          placeholder="اختر المرحلة الدراسية"
          error={errors.gradeId?.message}
        />
      </div>

      <FormTextarea
        label="ملاحظات حول الطالب"
        id="notes"
        placeholder="أدخل أي ملاحظات خاصة بالطالب..."
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
