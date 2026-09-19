import { useState, useCallback } from "react";
import { type Subject } from "../types";

export function useSubjectsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const openCreate = useCallback(() => {
    setSelectedSubject(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((subject: Subject) => {
    setSelectedSubject(subject);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedSubject(null);
  }, []);

  return {
    isOpen,
    selectedSubject,
    openCreate,
    openEdit,
    close,
  };
}
