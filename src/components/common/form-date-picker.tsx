"use client";

import * as React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type FormDatePickerProps<TFieldValues extends FieldValues = FieldValues> = {
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
} & (
  | {
      name: Path<TFieldValues>;
      control: Control<TFieldValues>;
      value?: never;
      onChange?: never;
    }
  | {
      name?: never;
      control?: never;
      value: string;
      onChange: (value: string) => void;
    }
);

export function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder = "اختر تاريخاً...",
  error,
  className,
  required = false,
  value,
  onChange,
}: FormDatePickerProps<TFieldValues>) {
  const renderDatePicker = (currentValue: string, handleChange: (val: string) => void) => {
    const selectedDate = currentValue ? new Date(currentValue) : undefined;
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full h-11 px-4 py-3 rounded-xl border border-input bg-card text-foreground text-sm font-medium outline-none transition-all text-right flex items-center justify-between shadow-none",
              error
                ? "border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/10"
                : "focus:border-primary focus:ring-1 focus:ring-primary/10",
              !currentValue && "text-muted-foreground",
              className
            )}
          >
            <span>
              {currentValue
                ? format(selectedDate!, "PPP", { locale: ar })
                : placeholder}
            </span>
            <CalendarIcon className="size-4 text-muted-foreground shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border border-border bg-card shadow-lg" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                handleChange(`${yyyy}-${mm}-${dd}`);
              } else {
                handleChange("");
              }
            }}
            locale={ar}
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-2 w-full text-right" dir="rtl">
      {label && (
        <Label className="text-xs font-semibold text-muted-foreground block text-right select-none">
          {label}
          {required && <span className="text-destructive mr-1 select-none">*</span>}
        </Label>
      )}
      {control && name ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => renderDatePicker(field.value, field.onChange)}
        />
      ) : (
        renderDatePicker(value || "", onChange!)
      )}
      {error && (
        <p className="text-xs text-destructive font-semibold text-right">{error}</p>
      )}
    </div>
  );
}
