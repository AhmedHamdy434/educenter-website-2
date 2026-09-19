import { useState, useCallback } from "react";
import { type Group } from "../types";

export function useGroupsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const openCreate = useCallback(() => {
    setSelectedGroup(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((group: Group) => {
    setSelectedGroup(group);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedGroup(null);
  }, []);

  return {
    isOpen,
    selectedGroup,
    openCreate,
    openEdit,
    close,
  };
}
