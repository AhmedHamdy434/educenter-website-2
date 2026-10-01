"use client";

import { useState, useRef } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label?: string;
  placeholder?: string;
  allOptionLabel?: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function FilterDropdown({
  label,
  placeholder,
  allOptionLabel,
  options,
  value,
  onChange,
  className,
  isLoading = false,
  disabled = false,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDisabled = disabled || isLoading;
  const defaultPlaceholder = isLoading
    ? "جاري التحميل..."
    : !disabled && options.length === 0
      ? "لا يوجد"
      : (allOptionLabel || placeholder || "الكل");
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className={cn("relative min-w-35", className)} ref={dropdownRef}>
      {label && (
        <span className="mb-1 block text-xs font-semibold text-muted-foreground">
          {label}
        </span>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none transition-all hover:bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary shadow-none cursor-pointer",
          isDisabled && "cursor-not-allowed opacity-60 hover:bg-card",
          className
        )}
      >
        <span className="truncate text-xs">
          {selectedOption ? selectedOption.label : defaultPlaceholder}
        </span>
        {isLoading ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200 shrink-0",
              isOpen && "rotate-180 text-primary"
            )}
          />
        )}
      </button>

      {/* Options Dropdown */}
      {isOpen && !isDisabled && (
        <div className="absolute z-50 mt-1.5 w-full min-w-40 rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in-50 zoom-in-95 duration-100">
          <ul role="listbox" className="space-y-0.5 max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <li className="px-3 py-2 text-center text-xs text-muted-foreground select-none">
                لا يوجد
              </li>
            ) : (
              <>
                {allOptionLabel && !options.some((opt) => opt.value === "") && (
                  <li>
                    <button
                      type="button"
                      role="option"
                      aria-selected={!value}
                      onClick={() => {
                        onChange("");
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-right text-xs font-semibold transition-colors cursor-pointer",
                        !value
                          ? "bg-secondary text-primary font-bold"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <span>{allOptionLabel}</span>
                      {!value && (
                        <Check className="size-3.5 text-primary shrink-0" />
                      )}
                    </button>
                  </li>
                )}
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-right text-xs font-semibold transition-colors cursor-pointer",
                          isSelected
                            ? "bg-secondary text-primary font-bold"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <Check className="size-3.5 text-primary shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
