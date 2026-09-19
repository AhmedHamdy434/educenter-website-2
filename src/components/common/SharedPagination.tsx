"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SharedPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function SharedPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: SharedPaginationProps) {
  if (total === 0) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 2) {
        end = 3;
      } else if (page >= totalPages - 1) {
        start = totalPages - 2;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 text-muted-foreground text-sm w-full" dir="rtl">
      {/* Limit select & Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>عرض</span>
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              onLimitChange(Number(val));
            }}
          >
            <SelectTrigger className="h-9 w-20 border border-border rounded-lg text-foreground bg-card focus:ring-1 focus:ring-ring focus:border-ring focus-visible:outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border rounded-lg shadow-lg">
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()} className="cursor-pointer focus:bg-secondary">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>عناصر</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <span className="text-xs font-medium">
          إجمالي {total} عنصر (صفحة {page} من {totalPages})
        </span>
      </div>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5" dir="rtl">
          <Button
            variant="outline"
            size="icon"
            className="size-9 border-border rounded-lg bg-card text-foreground/75 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="size-4" />
          </Button>
          
          {getPageNumbers().map((p, idx) => {
            if (typeof p === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex size-9 items-center justify-center text-muted-foreground select-none text-xs"
                >
                  {p}
                </span>
              );
            }

            const isActive = p === page;

            return (
              <Button
                key={p}
                variant={isActive ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(p)}
                className={`size-9 rounded-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent"
                    : "border-border bg-card text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
              >
                {p}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="icon"
            className="size-9 border-border rounded-lg bg-card text-foreground/75 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
