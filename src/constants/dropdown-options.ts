export const DEFAULT_LIMIT = 10;
export const LIMITS = [5, 10, 15, 20, 50];

export const STATUSES = [
  {
    label: "الكل",
    value: "",
  },
  {
    label: "نشط",
    value: "1",
  },
  {
    label: "غير نشط",
    value: "0",
  },
];

export const PAYMENT_METHOD_OPTIONS = [
  {
    label: "نقداً",
    value: "CASH",
  },
  {
    label: "انستا باى",
    value: "INSTAPAY",
  },
  {
    label: "تحويل بنكي",
    value: "BANK_TRANSFER",
  },
  {
    label: "محفظة إلكترونية",
    value: "WALLET",
  },
  {
    label: "أخرى",
    value: "OTHER",
  },
];

export const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1).map(
  (v) => {
    return {
      label: String(v),
      value: String(v),
    };
  },
);
export const MiNUTE_OPTIONS = ["00", "15", "30", "45"].map((v) => {
  return {
    label: String(v),
    value: String(v),
  };
});

export const PERIOD_OPTIONS = [
  {
    label: "صباحاً (ص)",
    value: "AM",
  },
  {
    label: "مساءً (م)",
    value: "PM",
  },
];
