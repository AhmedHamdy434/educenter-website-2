export type SettlementStatusType = "COMPLETED" | "PENDING" | "CANCELLED";
export type PaymentMethodType = "CASH" | "BANK_TRANSFER" | "WALLET" | "POS";

export interface TeacherFinancialSummary {
  totalGrossEarnings: number;
  totalRefunds: number;
  totalNetEarnings: number;
  totalSettled: number;
  totalPending: number;
  totalOutstanding: number;
  totalAvailable: number;
  teachersCount: number;
}

export interface TeacherFinancialRow {
  teacherId: string;
  name: string;
  phone?: string;
  email?: string;
  grossEarnings: number;
  refundAdjustments: number;
  netEarnings: number;
  settledAmount: number;
  pendingAmount: number;
  outstandingLiabilities: number;
  availablePayableBalance: number;
  unsettledEntriesCount: number;
}

export interface UnsettledEarningItem {
  id: string;
  entryNumber: string;
  entryDate: string;
  totalAmount: number;
  allocatedAmount: number;
  remainingUnsettledAmount: number;
  notes?: string;
  studentName: string;
  groupOrSessionName: string;
  obligationType: string;
  periodDate?: string;
  receiptNumber?: string;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface SettlementRecord {
  id: string;
  settlementNumber: string;
  teacherId: string;
  teacherName: string;
  teacherPhone?: string;
  amount: number;
  status: SettlementStatusType;
  paymentMethod: PaymentMethodType;
  referenceNumber?: string;
  notes?: string;
  settlementDate: string;
  settledAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  itemsCount: number;
  createdAt: string;
}

export interface SettlementDetailItem {
  id: string;
  allocatedAmount: number;
  earningEntryNumber?: string;
  earningDate?: string;
  studentName: string;
  groupName: string;
  receiptNumber?: string;
}

export interface SettlementDetails {
  id: string;
  settlementNumber: string;
  teacher: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
  amount: number;
  status: SettlementStatusType;
  paymentMethod: PaymentMethodType;
  referenceNumber?: string;
  notes?: string;
  settlementDate: string;
  settledAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  items: SettlementDetailItem[];
}

export interface CreateSettlementDTO {
  teacherId: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  referenceNumber?: string;
  notes?: string;
  status?: SettlementStatusType;
  allocations?: Array<{
    earningEntryId: string;
    amount: number;
  }>;
}

export interface CreateRefundDTO {
  paymentTransactionId: string;
  paymentAllocationId?: string;
  amount: number;
  reason: string;
}

