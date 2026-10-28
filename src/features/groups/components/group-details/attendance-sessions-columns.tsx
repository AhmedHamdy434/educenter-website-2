"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type AttendanceSession } from "@/features/attendance/types";

interface AttendanceSessionsColumnsOptions {
  totalStudents?: number;
  onEditSession: (sessionId: string) => void;
}

export function getAttendanceSessionsColumns({
  onEditSession,
}: AttendanceSessionsColumnsOptions): ColumnDef<AttendanceSession>[] {
  return [
    {
      id: "date",
      accessorKey: "date",
      header: "تاريخ الحصة",
      enableSorting: false,
      cell: ({ row }) => {
        const formattedDate = new Date(row.original.date).toLocaleDateString(
          "ar-EG",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );
        return (
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Calendar className="size-4 text-primary shrink-0" />
            <span>{formattedDate}</span>
          </div>
        );
      },
    },
    {
      id: "attendance",
      header: "حضور الطلاب",
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <span dir="ltr">
            {row.original.attendedCount || 0} / {row.original._count?.records}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">الإجراءات</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex items-center justify-center">
            <Button
              type="button"
              onClick={() => onEditSession(session.id)}
              variant="ghost"
              size="icon"
              title="تعديل حضور الحصة"
              className="size-8 text-primary hover:text-primary hover:bg-secondary rounded-lg cursor-pointer"
            >
              <Edit3 className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
