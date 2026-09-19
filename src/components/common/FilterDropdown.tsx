"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
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
}

export function FilterDropdown({
  label,
  placeholder,
  allOptionLabel,
  options,
  value,
  onChange,
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const defaultPlaceholder = allOptionLabel || placeholder || "الكل";
  const selectedOption = options.find((opt) => opt.value === value);

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

  return (
    <div className={cn("relative min-w-[140px]", className)} ref={dropdownRef}>
      {label && (
        <span className="mb-1 block text-xs font-semibold text-muted-foreground">
          {label}
        </span>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none transition-all hover:bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary shadow-none cursor-pointer"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : defaultPlaceholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {/* Options Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[160px] rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in-50 zoom-in-95 duration-100">
          <ul role="listbox" className="space-y-0.5 max-h-60 overflow-y-auto">
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
          </ul>
        </div>
      )}
    </div>
  );
}
