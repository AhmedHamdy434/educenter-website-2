import React from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { AttendanceStatus, type StudentAttendanceHistoryItem } from "../types";

const STATUS_CONFIG = {
  [AttendanceStatus.PRESENT]: {
    label: "حاضر",
    className: "bg-emerald-50/80 text-emerald-800 border-emerald-300/80",
    icon: CheckCircle,
  },
  [AttendanceStatus.ABSENT]: {
    label: "غائب",
    className: "bg-rose-50/80 text-rose-800 border-rose-300/80",
    icon: XCircle,
  },
  [AttendanceStatus.LATE]: {
    label: "متأخر",
    className: "bg-amber-50/80 text-amber-900 border-amber-300/80",
    icon: Clock,
  },
  [AttendanceStatus.EXCUSED]: {
    label: "مستأذن",
    className: "bg-stone-100/80 text-stone-700 border-stone-300/80",
    icon: AlertCircle,
  },
};

export function getStudentAttendanceColumns() {
  return [
    {
      accessorKey: "date",
      header: "تاريخ الحصة",
      cell: ({ row }: { row: { original: StudentAttendanceHistoryItem } }) => (
        <span className="font-bold text-foreground">
          {new Date(row.original.date).toLocaleDateString("ar-EG", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "groupName",
      header: "المجموعة الدراسية",
      cell: ({ row }: { row: { original: StudentAttendanceHistoryItem } }) => (
        <span className="font-medium text-foreground/90">
          {row.original.groupName}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "حالة الحضور",
      cell: ({ row }: { row: { original: StudentAttendanceHistoryItem } }) => {
        const cfg = STATUS_CONFIG[row.original.status] || {
          label: row.original.status,
          className: "bg-stone-100/80 text-stone-700 border-stone-300/80",
          icon: HelpCircleIcon,
        };
        const IconComponent = cfg.icon;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.className}`}
          >
            <IconComponent className="size-3.5" />
            <span>{cfg.label}</span>
          </span>
        );
      },
    },
    {
      accessorKey: "absenceReason",
      header: "ملاحظات / عذر الغياب",
      cell: ({ row }: { row: { original: StudentAttendanceHistoryItem } }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.absenceReason || (
            <span className="text-muted-foreground/40 italic">لا توجد ملاحظات</span>
          )}
        </span>
      ),
    },
  ];
}

function HelpCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
