import { fmt } from "@/utils/time";
import { StudentPaymentMonthItem } from "../types";
import { PaymentStatus } from "@/types";

export const getMonthStatusText = (m: StudentPaymentMonthItem) => {
  if (m.isWaived) return "(معفى)";
  if (m.status === PaymentStatus.PAID) return `(✓) (${m.amountDue} ج.م)`;
  if (m.status === PaymentStatus.PARTIALLY_PAID) {
    return `(مدفوع ${fmt(m.paidAmount)} ج.م - متبقي ${fmt(m.remainingAmount)} ج.م)`;
  }
  return "";
};
