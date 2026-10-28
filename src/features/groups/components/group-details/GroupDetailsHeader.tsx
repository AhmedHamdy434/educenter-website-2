"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddStudentsModal } from "./AddStudentsModal";
import { useGroupQuery } from "../../hooks/queries";
import { DetailsHeaderSkeleton } from "@/components/common/DetailsHeaderSkeleton";

interface GroupDetailsHeaderProps {
  groupId: string;
  showAddButton?: boolean;
}

export function GroupDetailsHeader({
  groupId,
  showAddButton = true,
}: GroupDetailsHeaderProps) {
  const params = useParams<{ centerSlug: string }>();
  const centerSlug = params?.centerSlug;
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const { data: groupResponse, isLoading, isError } = useGroupQuery(groupId);

  // 3. Loading & Error guards
  if (isLoading || !groupResponse) {
    return <DetailsHeaderSkeleton hasActionButton={showAddButton} />;
  }

  if (isError || !groupResponse.data) {
    return notFound();
  }

  const group = groupResponse.data;

  return (
    <>
      <div className="space-y-4 text-right border-b border-border pb-5">
        {/* Breadcrumbs Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Link
            href={`/${centerSlug}/owner/groups`}
            className="hover:text-foreground transition-colors"
          >
            المجموعات الدراسية
          </Link>
          <ChevronRight className="size-3.5 text-muted-foreground/60 rotate-180" />
          <span className="text-foreground font-bold">{group.name}</span>
        </div>

        {/* Main Header Container */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                {group.name}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  group.isActive
                    ? "bg-emerald-50/80 text-emerald-800 border-emerald-300/80"
                    : "bg-stone-100/80 text-stone-700 border-stone-300/80"
                }`}
              >
                {group.isActive ? "نشطة" : "غير نشطة"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              لوحة إدارة تفاصيل المجموعة الدراسية، متابعة الحضور، وتسجيل
              اشتراكات الطلاب.
            </p>
          </div>

          {/* Top Action Buttons */}
          {showAddButton && (
            <Button
              type="button"
              variant="brand"
              size="brandMd"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 font-bold shadow-none"
            >
              <UserPlus className="size-4 shrink-0" />
              <span>إدراج طلاب</span>
            </Button>
          )}
        </div>
      </div>
      <AddStudentsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        groupId={groupId}
      />
    </>
  );
}
