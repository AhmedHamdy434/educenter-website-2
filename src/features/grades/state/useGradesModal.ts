import { useState, useCallback } from "react";
import { type Grade } from "../types";

export function useGradesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const openCreate = useCallback(() => {
    setSelectedGrade(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((grade: Grade) => {
    setSelectedGrade(grade);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedGrade(null);
  }, []);

  return {
    isOpen,
    selectedGrade,
    openCreate,
    openEdit,
    close,
  };
}
