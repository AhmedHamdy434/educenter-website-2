"use client";

import React, { useState, useRef, useEffect } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { ChevronDown, X, Check, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormMultiSelectOption {
  value: string;
  label: string;
}

export type FormMultiSelectProps<
  TFieldValues extends FieldValues = FieldValues
> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: FormMultiSelectOption[];
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export function FormMultiSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder = "اختر من القائمة...",
  options,
  error,
  disabled = false,
  required = false,
  className,
}: FormMultiSelectProps<TFieldValues>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2 w-full text-right" dir="rtl" ref={dropdownRef}>
      {label && (
        <Label className="text-xs font-semibold text-muted-foreground block text-right select-none">
          {label}
          {required && (
            <span className="text-destructive mr-1 select-none">*</span>
          )}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues: string[] = Array.isArray(field.value)
            ? field.value
            : [];

          const handleToggleOption = (val: string) => {
            if (selectedValues.includes(val)) {
              field.onChange(selectedValues.filter((v) => v !== val));
            } else {
              field.onChange([...selectedValues, val]);
            }
          };

          const handleRemoveOption = (val: string) => {
            field.onChange(selectedValues.filter((v) => v !== val));
          };

          const selectedOptions = options.filter((opt) =>
            selectedValues.includes(opt.value)
          );

          return (
            <div className="relative">
              {/* Trigger Button */}
              <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className={cn(
                  "w-full min-h-11 px-4 py-2.5 rounded-xl border border-input bg-card text-foreground text-sm font-medium outline-none transition-all text-right flex items-center justify-between shadow-none cursor-pointer",
                  error
                    ? "border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/10"
                    : "focus:border-primary focus:ring-1 focus:ring-primary/10",
                  disabled && "opacity-50 cursor-not-allowed bg-muted",
                  className
                )}
              >
                <div className="flex flex-wrap items-center gap-1.5 flex-1 pr-1">
                  {selectedValues.length === 0 ? (
                    <span className="text-muted-foreground">{placeholder}</span>
                  ) : (
                    <span className="text-foreground text-xs font-bold bg-secondary px-2.5 py-1 rounded-md border border-border">
                      تم اختيار {selectedValues.length} عنصر
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200 shrink-0 mr-2",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </button>

              {/* Dropdown Options */}
              {isOpen && !disabled && (
                <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-card shadow-lg p-1.5 text-right animate-in fade-in-50 zoom-in-95 duration-100 flex flex-col max-h-64">
                  {/* Search inside select */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40 rounded-lg mb-1">
                    <Search className="size-4 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      placeholder="ابحث..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Options List */}
                  <div className="overflow-y-auto flex-1 py-1 max-h-48">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleToggleOption(option.value)}
                            className={cn(
                              "w-full px-3 py-2 text-right text-xs font-semibold rounded-lg transition-colors flex items-center justify-between cursor-pointer",
                              isSelected
                                ? "bg-secondary text-primary font-bold"
                                : "text-foreground hover:bg-muted"
                            )}
                          >
                            <span>{option.label}</span>
                            {isSelected && (
                              <Check className="size-4 text-primary shrink-0" />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-3 text-right text-xs text-muted-foreground">
                        لا توجد نتائج مطابقة.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Selected Options Tags */}
              {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 bg-secondary/30 p-2 border border-dashed border-border rounded-xl">
                  {selectedOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-1.5 bg-secondary text-primary border border-border px-2.5 py-1 rounded-md text-xs font-bold select-none animate-in zoom-in-95 duration-100"
                    >
                      <span>{option.label}</span>
                      <button
                        type="button"
                        aria-label={`إزالة ${option.label}`}
                        onClick={() => handleRemoveOption(option.value)}
                        className="hover:bg-primary/10 rounded p-0.5 transition-colors text-primary cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />

      {error && (
        <p className="text-xs text-destructive font-semibold text-right">
          {error}
        </p>
      )}
    </div>
  );
}
