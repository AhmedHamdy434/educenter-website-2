import { type SelectOption } from "@/components/common/form-select";

export type DayOfWeek =
  | "SATURDAY"
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY";

export const DAY_NAMES_AR: Record<DayOfWeek, string> = {
  SATURDAY: "السبت",
  SUNDAY: "الأحد",
  MONDAY: "الإثنين",
  TUESDAY: "الثلاثاء",
  WEDNESDAY: "الأربعاء",
  THURSDAY: "الخميس",
  FRIDAY: "الجمعة",
};

export const DAYS_OPTIONS: SelectOption[] = Object.entries(DAY_NAMES_AR).map(
  ([key, val]) => ({
    value: key,
    label: val,
  }),
);

export const HOUR_OPTIONS: SelectOption[] = Array.from(
  { length: 12 },
  (_, i) => {
    const h = i + 1;
    return { value: h.toString(), label: h.toString() };
  },
);

export const MINUTE_OPTIONS: SelectOption[] = Array.from(
  { length: 12 },
  (_, i) => {
    const m = i * 5;
    const mStr = m.toString().padStart(2, "0");
    return { value: mStr, label: mStr };
  },
);

export const PERIOD_OPTIONS: SelectOption[] = [
  { value: "AM", label: "صباحاً (ص)" },
  { value: "PM", label: "مساءً (م)" },
];

export const formatTime = (hour: number, minute: number): string => {
  const minStr = minute.toString().padStart(2, "0");
  const ampm = hour >= 12 ? "م" : "ص";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minStr} ${ampm}`;
};

export const formatFullDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })} ${date.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const calculateDaysRemaining = (endDateStr: string): number => {
  if (!endDateStr) return 0;
  const end = new Date(endDateStr).getTime();
  const now = Date.now();
  const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const getSubscriptionStatusDetails = (
  subscription?: { status?: string; endDate?: string } | null,
) => {
  if (!subscription || !subscription.endDate) {
    return {
      daysRemaining: 0,
      isExpired: true,
      isNearExpiry: false,
    };
  }

  const end = new Date(subscription.endDate).getTime();
  const now = Date.now();
  const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  const expired = subscription.status === "EXPIRED" || diffDays <= 0;
  const nearExpiry = !expired && diffDays <= 5;
  return {
    daysRemaining: Math.max(diffDays, 0),
    isExpired: expired,
    isNearExpiry: nearExpiry,
  };
};

export const formatMonthName = (monthStr: string): string => {
  if (!monthStr) return "";
  const parts = monthStr.split("-");
  if (parts.length >= 2) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const date = new Date(year, month, 1);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
    });
  }
  const date = new Date(monthStr);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
  });
};

/**
 * Converts a 12-hour format hour (1-12) and period ("AM" | "PM") into 24-hour format (0-23).
 */
export const to24Hour = (hour: number | string, period: string): number => {
  let h = typeof hour === "string" ? parseInt(hour, 10) : hour;
  if (isNaN(h)) return 0;
  if (period === "PM" && h < 12) {
    h += 12;
  } else if (period === "AM" && h === 12) {
    h = 0;
  }
  return h;
};

export const getTodayDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Returns today's date formatted as YYYY-MM-DD strictly in the Africa/Cairo timezone.
 */
export const getCairoTodayDateString = (): string => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
};

/**
 * Formats a YYYY-MM-DD date string to a localized Arabic date with weekday, strictly in Africa/Cairo.
 */
export const formatCairoDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return dateStr;
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return d.toLocaleDateString("ar-EG", {
    timeZone: "Africa/Cairo",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats an ISO datetime string into Arabic date and time strictly in Africa/Cairo.
 */
export const formatCairoDateTime = (isoString: string | null | undefined): string => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("ar-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export const fmt = (n: number) =>
  Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });