"use client";

import { useState } from "react";

export function useCrudModal<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openCreate = () => {
    setSelectedItem(null);
    setIsOpen(true);
  };

  const openEdit = (item: T) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  return {
    isOpen,
    selectedItem,
    openCreate,
    openEdit,
    close,
  };
}