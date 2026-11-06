import { fmt } from "@/utils/time";
import { StudentPaymentMonthItem } from "../types";

export const getMonthStatusText = (m: StudentPaymentMonthItem) => {
  if (m.isWaived) return "(معفى)";
  if (m.status === "PAID") return "(تم السداد بالكامل ✓)";
  if (m.status === "PARTIALLY_PAID") {
    return `(مسدد جزئياً: مدفوع ${fmt(m.paidAmount)} ج.م - متبقي ${fmt(m.remainingAmount)} ج.م)`;
  }
  return "(مستحق الدفع)";
};