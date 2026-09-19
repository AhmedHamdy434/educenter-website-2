"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupDetailsHeaderProps {
  groupName: string;
  isActive: boolean;
  onOpenAddModal: () => void;
  showAddButton?: boolean;
}

export function GroupDetailsHeader({
  groupName,
  isActive,
  onOpenAddModal,
  showAddButton = true,
}: GroupDetailsHeaderProps) {
  const params = useParams<{ centerSlug: string }>();
  const centerSlug = params?.centerSlug;

  return (
    <div className="space-y-4 text-right border-b border-border pb-5" dir="rtl">
      {/* Breadcrumbs Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link
          href={`/${centerSlug}/owner/groups`}
          className="hover:text-foreground transition-colors"
        >
          المجموعات الدراسية
        </Link>
        <ChevronRight className="size-3.5 text-muted-foreground/60 rotate-180" />
        <span className="text-foreground font-bold">{groupName}</span>
      </div>

      {/* Main Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              {groupName}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                isActive
                  ? "bg-emerald-50/80 text-emerald-800 border-emerald-300/80"
                  : "bg-stone-100/80 text-stone-700 border-stone-300/80"
              }`}
            >
              {isActive ? "نشطة" : "غير نشطة"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            لوحة إدارة تفاصيل المجموعة الدراسية، متابعة الحضور، وتسجيل اشتراكات الطلاب.
          </p>
        </div>

        {/* Top Action Buttons */}
        {showAddButton && (
          <Button
            type="button"
            variant="brand"
            size="brandMd"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 font-bold shadow-none"
          >
            <UserPlus className="size-4 shrink-0" />
            <span>إدراج طلاب</span>
          </Button>
        )}
      </div>
    </div>
  );
}
