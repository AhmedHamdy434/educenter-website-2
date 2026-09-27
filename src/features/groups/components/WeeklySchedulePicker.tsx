"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FormSelect } from "@/components/common/form-select";
import {
  DAY_NAMES_AR,
  DAYS_OPTIONS,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  PERIOD_OPTIONS,
  formatTime,
  to24Hour,
  type DayOfWeek,
} from "@/utils/time";

export interface ScheduleItem {
  id?: string;
  day: DayOfWeek;
  hour: number;
  minute: number;
}

interface WeeklySchedulePickerProps {
  schedule: ScheduleItem[];
  onAdd: (item: { day: DayOfWeek; hour: number; minute: number }) => void;
  onRemove: (index: number) => void;
  error?: string;
}

export function WeeklySchedulePicker({
  schedule,
  onAdd,
  onRemove,
  error,
}: WeeklySchedulePickerProps) {
  // Time picker temporary state
  const [tempDay, setTempDay] = useState<string>("SATURDAY");
  const [tempHour, setTempHour] = useState<string>("4");
  const [tempMinute, setTempMinute] = useState<string>("30");
  const [tempPeriod, setTempPeriod] = useState<string>("PM");

  const handleAddScheduleItem = () => {
    const hour24 = to24Hour(tempHour, tempPeriod);
    const minuteVal = parseInt(tempMinute, 10);

    // Check if duplicate schedule exists
    const hasDuplicate = schedule.some(
      (item) =>
        item.day === tempDay && item.hour === hour24 && item.minute === minuteVal
    );

    if (hasDuplicate) {
      toast.error("هذا الموعد مضاف بالفعل في جدول المجموعة.");
      return;
    }

    onAdd({
      day: tempDay as DayOfWeek,
      hour: hour24,
      minute: minuteVal,
    });
  };

  return (
    <div className="border border-border rounded-xl p-4 space-y-4 bg-secondary/20">
      <h3 className="text-sm font-bold text-foreground">
        جدول المواعيد الأسبوعية للمجموعة
      </h3>

      {/* Temporary inputs to build a schedule item */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <FormSelect
          label="اليوم"
          value={tempDay}
          onValueChange={setTempDay}
          options={DAYS_OPTIONS}
        />

        <FormSelect
          label="الساعة"
          value={tempHour}
          onValueChange={setTempHour}
          options={HOUR_OPTIONS}
        />

        <FormSelect
          label="الدقيقة"
          value={tempMinute}
          onValueChange={setTempMinute}
          options={MINUTE_OPTIONS}
        />

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <FormSelect
              label="الفترة"
              value={tempPeriod}
              onValueChange={setTempPeriod}
              options={PERIOD_OPTIONS}
            />
          </div>

          <button
            type="button"
            onClick={handleAddScheduleItem}
            className="h-11 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title="إضافة موعد"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Selected schedule list */}
      {schedule.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {schedule.map((item, index) => (
            <div
              key={item.id ?? `${item.day}-${item.hour}-${item.minute}-${index}`}
              className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-lg text-xs font-bold text-foreground shadow-none"
            >
              <span>
                {DAY_NAMES_AR[item.day]} {formatTime(item.hour, item.minute)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-destructive hover:bg-destructive/10 p-1 rounded-md transition-colors cursor-pointer"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground py-2">
          لم يتم تحديد أي مواعيد بعد. يرجى إضافة موعد واحد على الأقل.
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive font-semibold pt-1">
          {error}
        </p>
      )}
    </div>
  );
}
