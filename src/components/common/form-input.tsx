import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface FormInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
}

export function FormInput({
  className,
  label,
  error,
  id,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <Label
          htmlFor={id}
          className="text-xs font-semibold text-muted-foreground block text-right"
        >
          {label}
        </Label>
      )}
      <Input
        id={id}
        aria-invalid={!!error}
        className={cn(
          "w-full h-11 px-4 py-3 rounded-xl border border-input bg-card text-foreground text-sm font-medium outline-none transition-all",
          error
            ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10"
            : "focus-visible:border-primary focus-visible:ring-primary/10",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive font-semibold text-right">
          {error}
        </p>
      )}
    </div>
  );
}
