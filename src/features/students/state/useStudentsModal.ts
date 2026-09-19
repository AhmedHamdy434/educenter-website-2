import { useState, useCallback } from "react";
import { type Student } from "../types";

export function useStudentsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const openCreate = useCallback(() => {
    setSelectedStudent(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedStudent(null);
  }, []);

  return {
    isOpen,
    selectedStudent,
    openCreate,
    openEdit,
    close,
  };
}
