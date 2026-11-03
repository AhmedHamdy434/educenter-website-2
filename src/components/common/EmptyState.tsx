"use client";

import React from "react";
import Link from "next/link";
import { type LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon;
  variant?: "brand" | "brandOutline" | "outline" | "default";
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: EmptyStateAction;
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title = "لا توجد بيانات لعرضها",
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  const ActionIcon = action?.icon;

  const renderActionButton = () => {
    if (!action) return null;

    const buttonContent = (
      <>
        {ActionIcon && <ActionIcon className="size-3.5" />}
        <span>{action.label}</span>
      </>
    );

    if (action.href) {
      return (
        <Button
          asChild
          variant={action.variant || "brand"}
          size={compact ? "sm" : "default"}
          className={cn(
            "rounded-lg font-bold shadow-none",
            compact ? "h-8 px-3 text-xs gap-1.5" : "h-9 px-4 text-xs gap-2",
          )}
        >
          <Link href={action.href}>{buttonContent}</Link>
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant={action.variant || "brand"}
        size={compact ? "sm" : "default"}
        onClick={action.onClick}
        className={cn(
          "rounded-lg font-bold shadow-none cursor-pointer",
          compact ? "h-8 px-3 text-xs gap-1.5" : "h-9 px-4 text-xs gap-2",
        )}
      >
        {buttonContent}
      </Button>
    );
  };

  return (
    <div
      role="status"
      dir="rtl"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-6 px-4" : "py-12 px-6",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center text-muted-foreground shrink-0 transition-transform",
          compact
            ? "size-10 rounded-xl bg-secondary/80 border border-border/80 mb-2.5"
            : "size-14 rounded-2xl bg-secondary/80 border border-border mb-4 shadow-2xs",
        )}
      >
        <Icon
          className={cn(
            "stroke-[1.75]",
            compact ? "size-5 text-muted-foreground/80" : "size-7 text-muted-foreground/80",
          )}
        />
      </div>

      <h3
        className={cn(
          "font-bold text-foreground tracking-tight",
          compact ? "text-xs" : "text-base",
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "text-muted-foreground leading-relaxed",
            compact ? "text-[11px] max-w-xs mt-1" : "text-xs max-w-sm mt-1.5",
          )}
        >
          {description}
        </p>
      )}

      {action && (
        <div className={compact ? "mt-3" : "mt-4"}>
          {renderActionButton()}
        </div>
      )}
    </div>
  );
}

