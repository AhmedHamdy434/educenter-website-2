import * as React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FormSelectOption {
  value: string;
  label: string;
}

export type SelectOption = FormSelectOption;

export type FormSelectProps<
  TFieldValues extends FieldValues = FieldValues
> = {
  label?: string;
  error?: string;
  placeholder?: string;
  options: FormSelectOption[];
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
} & (
  | {
      name: Path<TFieldValues>;
      control: Control<TFieldValues>;
      value?: never;
      defaultValue?: never;
      onValueChange?: never;
    }
  | {
      name?: string;
      control?: never;
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
    }
);

export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
  label,
  error,
  placeholder = "اختر من القائمة...",
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  name,
  control,
  id,
  className,
}: FormSelectProps<TFieldValues>) {
  const renderSelect = (currentVal: string | undefined, handleValChange: (val: string) => void) => (
    <Select
      value={currentVal}
      defaultValue={defaultValue}
      onValueChange={handleValChange}
      disabled={disabled}
      name={name}
    >
      <SelectTrigger
        id={id}
        aria-invalid={!!error}
        className={cn(
          "w-full h-11 px-4 py-3 rounded-xl border border-input bg-card text-foreground text-sm font-medium outline-none transition-all text-right flex items-center justify-between shadow-none",
          error
            ? "border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/10"
            : "focus:border-primary focus:ring-1 focus:ring-primary/10",
          !currentVal && !defaultValue && "text-muted-foreground",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className="rounded-xl border border-border bg-card shadow-lg z-50 text-right"
        dir="rtl"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-foreground text-xs font-semibold hover:bg-muted py-2 rounded-lg cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-2 w-full text-right" dir="rtl">
      {label && (
        <Label
          htmlFor={id}
          className="text-xs font-semibold text-muted-foreground block text-right select-none"
        >
          {label}
          {required && (
            <span className="text-destructive mr-1 select-none">*</span>
          )}
        </Label>
      )}
      {control && name ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => renderSelect(field.value, field.onChange)}
        />
      ) : (
        renderSelect(value, onValueChange || (() => {}))
      )}
      {error && (
        <p className="text-xs text-destructive font-semibold text-right">
          {error}
        </p>
      )}
    </div>
  );
}
