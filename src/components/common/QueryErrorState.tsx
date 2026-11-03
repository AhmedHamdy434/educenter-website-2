"use client";

import React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QueryErrorStateProps {
  title?: string;
  error?: Error | unknown;
  errorMessage?: string;
  onRetry?: () => void;
  compact?: boolean;
  className?: string;
}

function resolveErrorMessage(error?: Error | unknown, customMessage?: string): string {
  if (customMessage) return customMessage;
  if (!error) return "تعذر الاتصال بالخادم أو حدث خطأ غير متوقع أثناء معالجة الطلب.";

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;
    if (typeof errObj.message === "string" && errObj.message) {
      return errObj.message;
    }
    const response = errObj.response as Record<string, unknown> | undefined;
    if (response && typeof response === "object") {
      const data = response.data as Record<string, unknown> | undefined;
      if (data && typeof data.message === "string" && data.message) {
        return data.message;
      }
    }
    const data = errObj.data as Record<string, unknown> | undefined;
    if (data && typeof data.message === "string" && data.message) {
      return data.message;
    }
  }

  return "تعذر الاتصال بالخادم أو حدث خطأ غير متوقع أثناء معالجة الطلب.";
}

export function QueryErrorState({
  title = "حدث خطأ أثناء تحميل البيانات",
  error,
  errorMessage,
  onRetry,
  compact = false,
  className,
}: QueryErrorStateProps) {
  const displayError = resolveErrorMessage(error, errorMessage);

  return (
    <div
      role="alert"
      dir="rtl"
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-2xl border border-rose-200/80 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20 text-foreground transition-all",
        compact ? "p-4 gap-2" : "p-8 gap-3.5 my-2 max-w-xl mx-auto shadow-2xs",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 shrink-0",
          compact ? "size-8.5" : "size-12 rounded-2xl",
        )}
      >
        <AlertTriangle
          className={cn(
            "stroke-[2]",
            compact ? "size-4.5" : "size-6",
          )}
        />
      </div>

      <div className="space-y-1 max-w-md">
        <h3
          className={cn(
            "font-extrabold text-rose-950 dark:text-rose-100 tracking-tight",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {title}
        </h3>

        {/* Displaying the exact error details as requested */}
        <div className="pt-0.5">
          <p
            dir="auto"
            className={cn(
              "font-mono font-medium text-rose-800 dark:text-rose-300/90 bg-background/80 dark:bg-card/80 border border-rose-200/60 dark:border-rose-900/50 rounded-lg inline-block text-right break-words leading-relaxed",
              compact
                ? "text-[10px] px-2.5 py-1 max-w-xs"
                : "text-xs px-3 py-1.5 max-w-sm",
            )}
            title={displayError}
          >
            {displayError}
          </p>
        </div>
      </div>

      {onRetry && (
        <div className={compact ? "mt-1" : "mt-2"}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className={cn(
              "rounded-lg font-bold border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 hover:bg-rose-100/70 dark:hover:bg-rose-950/40 cursor-pointer shadow-none transition-colors",
              compact ? "h-7 px-2.5 text-[11px] gap-1.5" : "h-8.5 px-3.5 text-xs gap-2",
            )}
          >
            <RotateCw className={cn(compact ? "size-3" : "size-3.5")} />
            <span>إعادة المحاولة</span>
          </Button>
        </div>
      )}
    </div>
  );
}

