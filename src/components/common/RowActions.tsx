"use client";

import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  editLabel?: string;
  deleteLabel?: string;
  deleteVariant?: "icon" | "button";
  className?: string;
}

export function RowActions({
  onEdit,
  onDelete,
  isDeleting = false,
  editLabel = "تعديل",
  deleteLabel = "حذف",
  deleteVariant = "icon",
  className = "flex items-center gap-2",
}: RowActionsProps) {
  return (
    <div className={className}>
      {onEdit && (
        <Button
          type="button"
          onClick={onEdit}
          variant="brandOutline"
          size="sm"
          className="h-8 rounded-lg font-semibold cursor-pointer"
        >
          {editLabel}
        </Button>
      )}

      {onDelete &&
        (deleteVariant === "icon" ? (
          <Button
            type="button"
            onClick={onDelete}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
            disabled={isDeleting}
            title={deleteLabel}
            aria-label={deleteLabel}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin text-destructive" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onDelete}
            variant="outline"
            size="sm"
            className="h-8 rounded-lg font-semibold text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive hover:text-destructive cursor-pointer gap-1.5"
            disabled={isDeleting}
          >
            {isDeleting && (
              <Loader2 className="size-3.5 animate-spin text-destructive" />
            )}
            <span>{deleteLabel}</span>
          </Button>
        ))}
    </div>
  );
}
