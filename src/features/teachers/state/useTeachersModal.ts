import { useState, useCallback } from "react";
import { type Teacher } from "../types";

export function useTeachersModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const openCreate = useCallback(() => {
    setSelectedTeacher(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedTeacher(null);
  }, []);

  return {
    isOpen,
    selectedTeacher,
    openCreate,
    openEdit,
    close,
  };
}
