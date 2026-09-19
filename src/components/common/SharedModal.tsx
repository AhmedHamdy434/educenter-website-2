"use client";

import { X } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity" dir="rtl">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-lg max-h-[90vh] rounded-2xl p-6 bg-card shadow-xl transition-all border border-border animate-in zoom-in-95 duration-200 z-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 shrink-0">
          <h2 className="text-lg font-bold text-foreground">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="mt-6 overflow-y-auto flex-1 pr-1 -mr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
