"use client";

import { useState, useCallback } from "react";

export function useCrudModal<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openCreate = useCallback(() => {
    setSelectedItem(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((item: T) => {
    setSelectedItem(item);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
  }, []);

  return {
    isOpen,
    selectedItem,
    openCreate,
    openEdit,
    close,
  };
}