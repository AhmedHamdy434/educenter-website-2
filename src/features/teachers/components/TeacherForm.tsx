"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/components/common/form-input";
import { FormTextarea } from "@/components/common/form-textarea";
import { FormActions } from "@/components/common/FormActions";
import { type SelectOption } from "@/components/common/form-select";
import {
  teacherSchema,
  type TeacherFormValues,
} from "../schemas/teacher-schema";
import { type Teacher } from "../types";
import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from "../hooks/mutations";
import { SubjectPicker, type SelectedSubject } from "./SubjectPicker";

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: Teacher | null;
  gradesOptions: SelectOption[];
  isGradesLoading?: boolean;
}

export function TeacherForm({
  isOpen,
  onClose,
  teacher,
  gradesOptions,
  isGradesLoading,
}: TeacherFormProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>(
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      bio: "",
      subjectIds: [],
    },
  });

  const { mutateAsync: createTeacher, isPending: isCreatePending } =
    useCreateTeacherMutation();
  const { mutateAsync: updateTeacher, isPending: isUpdatePending } =
    useUpdateTeacherMutation();

  const syncSubjectIds = (subjects: SelectedSubject[]) => {
    setValue(
      "subjectIds",
      subjects.map((s) => s.id),
      { shouldValidate: true },
    );
  };

  const handleAddSubject = (subject: SelectedSubject) => {
    const updated = [...selectedSubjects, subject];
    setSelectedSubjects(updated);
    syncSubjectIds(updated);
  };

  const handleRemoveSubject = (id: string) => {
    const updated = selectedSubjects.filter((s) => s.id !== id);
    setSelectedSubjects(updated);
    syncSubjectIds(updated);
  };

  const handleClearAll = () => {
    setSelectedSubjects([]);
    setValue("subjectIds", [], { shouldValidate: true });
  };

  const handleFormSubmit = async (values: TeacherFormValues) => {
    const mutation = teacher
      ? updateTeacher({ id: teacher.id, values })
      : createTeacher(values);

    const res = await mutation;
    if (res.success) onClose();
  };

  // Populate/reset form on open
  useEffect(() => {
    if (!isOpen) return;

    if (teacher) {
      const initialSubjects: SelectedSubject[] = (teacher.subjects || []).map(
        (s) => ({
          id: s.subject.id,
          name: s.subject.name,
          gradeName:
            s.subject.grade?.name ||
            gradesOptions.find((g) => g.value === s.subject.gradeId)?.label ||
            "",
        }),
      );

      setSelectedSubjects(initialSubjects);
      reset({
        fullName: teacher.user.fullName,
        email: teacher.user.email,
        password: "",
        phone: teacher.user.phone || "",
        bio: teacher.bio || "",
        subjectIds: initialSubjects.map((s) => s.id),
      });
    } else {
      setSelectedSubjects([]);
      reset({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        bio: "",
        subjectIds: [],
      });
    }
  }, [teacher, reset, isOpen, gradesOptions]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
      dir="rtl"
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
          placeholder="مثال: 01012345678"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <SubjectPicker
        gradesOptions={gradesOptions}
        isGradesLoading={isGradesLoading}
        selectedSubjects={selectedSubjects}
        onAdd={handleAddSubject}
        onRemove={handleRemoveSubject}
        onClearAll={handleClearAll}
        error={errors.subjectIds?.message}
        isOpen={isOpen}
      />

      <FormTextarea
        label="نبذة تعريفية أو سيرة ذاتية (اختياري)"
        id="bio"
        placeholder="معلم خبرة في تدريس المواد الدراسية..."
        error={errors.bio?.message}
        {...register("bio")}
      />

      <FormActions
        onCancel={onClose}
        isSubmitting={isCreatePending || isUpdatePending}
        submitLabel={teacher ? "حفظ التغييرات" : "إضافة المدرس"}
      />
    </form>
  );
}
