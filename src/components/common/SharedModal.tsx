"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface SharedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const MODAL_SIZES: Record<NonNullable<SharedModalProps["size"]>, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-2xl",
  lg: "sm:max-w-3xl",
  xl: "sm:max-w-4xl",
  "2xl": "sm:max-w-5xl",
  full: "sm:max-w-[95vw]",
};

export function SharedModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  closeOnOutsideClick = false,
  size = "md",
}: SharedModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className={cn(MODAL_SIZES[size], className)}
        onPointerDownOutside={(e) => {
          if (!closeOnOutsideClick) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 min-w-0 w-full overflow-x-hidden flex-1">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
