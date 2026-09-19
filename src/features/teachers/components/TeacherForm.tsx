"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/components/common/form-input";
import { FormTextarea } from "@/components/common/form-textarea";
import { FormActions } from "@/components/common/FormActions";
import { FormMultiSelect } from "@/components/common/form-multi-select";
import { teacherSchema, type TeacherFormValues } from "../schemas/teacher-schema";
import { type Teacher } from "../types";
import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from "../hooks/mutations";

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: Teacher | null;
  subjectsOptions: { value: string; label: string }[];
}

export function TeacherForm({ isOpen, onClose, teacher, subjectsOptions }: TeacherFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      specialization: "",
      salary: 0,
      bio: "",
      subjectIds: [],
    },
  });

  const { mutateAsync: createTeacher, isPending: isCreatePending } =
    useCreateTeacherMutation();
  const { mutateAsync: updateTeacher, isPending: isUpdatePending } =
    useUpdateTeacherMutation();

  const handleFormSubmit = async (values: TeacherFormValues) => {
    if (!!teacher) {
      await updateTeacher(
        { id: teacher.id, values },
        {
          onSuccess: (res) => {
            if (res.success) {
              onClose();
            }
          },
        },
      );
    } else {
      await createTeacher(values, {
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
    if (teacher) {
      reset({
        fullName: teacher.user.fullName,
        email: teacher.user.email,
        password: "", // Leave blank when editing
        phone: teacher.user.phone,
        specialization: teacher.specialization,
        salary: teacher.salary,
        bio: teacher.bio || "",
        subjectIds: teacher.subjects.map((s) => s.subject.id),
      });
    } else {
      reset({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        salary: 0,
        bio: "",
        subjectIds: [],
      });
    }
  }, [teacher, reset, isOpen]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="الاسم الكامل"
          id="fullName"
          placeholder="مثال: محمد علي"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <FormInput
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="teacher@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label={teacher ? "كلمة المرور الجديدة (اختياري)" : "كلمة المرور"}
          id="password"
          type="password"
          placeholder={teacher ? "اتركها فارغة للإبقاء على الحالية" : "••••••"}
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
          label="التخصص"
          id="specialization"
          placeholder="مثال: الرياضيات والفيزياء"
          error={errors.specialization?.message}
          {...register("specialization")}
        />

        <FormInput
          label="الراتب الشهري"
          id="salary"
          type="number"
          placeholder="مثال: 5000"
          error={errors.salary?.message}
          {...register("salary", { valueAsNumber: true })}
        />
      </div>

      {/* Subjects Selection using Custom Multi-Select Dropdown */}
      <FormMultiSelect
        label="المواد الدراسية التي يدرسها"
        name="subjectIds"
        control={control}
        options={subjectsOptions}
        placeholder="اختر المواد الدراسية..."
        error={errors.subjectIds?.message}
      />

      <FormTextarea
        label="نبذة تعريفية أو سيرة ذاتية (اختياري)"
        id="bio"
        placeholder="معلم خبرة 10 سنوات في تدريس الرياضيات..."
        error={errors.bio?.message}
        {...register("bio")}
      />

      {/* Action Buttons */}
      <FormActions
        onCancel={onClose}
        isSubmitting={isCreatePending || isUpdatePending}
        submitLabel={teacher ? "حفظ التغييرات" : "إضافة المدرس"}
      />
    </form>
  );
}
