"use client";

import { useState } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [open, setOpen] = useState(false);

  const isDisabled = disabled || isLoading;
  const defaultPlaceholder = isLoading
    ? "جاري التحميل..."
    : !disabled && options.length === 0
      ? "لا يوجد"
      : (allOptionLabel || placeholder || "الكل");
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn("min-w-35 space-y-2", className)}>
      {label && (
        <Label className="text-xs font-semibold text-muted-foreground block text-right">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={isDisabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            className={cn(
              "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none transition-all hover:bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary shadow-none cursor-pointer",
              isDisabled && "cursor-not-allowed opacity-60 hover:bg-card"
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
                  open && "rotate-180 text-primary"
                )}
              />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          className="z-60 w-(--radix-popover-trigger-width) min-w-40 p-1 rounded-xl border border-border bg-card shadow-lg ring-0"
          dir="rtl"
        >
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
                        setOpen(false);
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
                          setOpen(false);
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
