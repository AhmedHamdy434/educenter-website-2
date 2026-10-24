"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SharedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function SharedModal({
  isOpen,
  onClose,
  title,
  children,
}: SharedModalProps) {
  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          dir="rtl"
        >
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className={cn(
              "relative w-full max-w-2xl max-h-[90vh] rounded-2xl p-6 bg-card shadow-xl transition-all border border-border flex flex-col",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "duration-200 outline-none"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 shrink-0">
              <DialogPrimitive.Title className="text-lg font-bold text-foreground">
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close
                aria-label="إغلاق"
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              >
                <X className="size-5" />
              </DialogPrimitive.Close>
            </div>

            {/* Body Content */}
            <div className="mt-6 overflow-y-auto flex-1 pr-1 -mr-1">
              {children}
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
