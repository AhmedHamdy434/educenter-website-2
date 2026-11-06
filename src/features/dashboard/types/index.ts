export interface SubscriptionQuota {
  current: number;
  limit: number;
  usagePercent: number;
}

export interface SubscriptionHealth {
  planName: string;
  planType: string;
  status: "ACTIVE" | "GRACE_PERIOD" | "EXPIRED";
  startDate: string;
  endDate: string;
  daysRemaining: number;
  isGracePeriod: boolean;
  remainingGraceDays: number;
  canCreateExams: boolean;
  studentQuota: SubscriptionQuota;
  teacherQuota: SubscriptionQuota;
}

export interface OperationalStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalGroups: number;
  activeGroups: number;
  totalSubjects: number;
  totalGrades: number;
}

export interface FinancialMetrics {
  collectedRevenue: number;
  totalRefunds: number;
  netCollectedRevenue: number;
  teacherGrossEarnings: number;
  teacherNetEarnings: number;
  centerGrossShare: number;
  settledPayouts: number;
  currentPendingReserve: number;
  outstandingTeacherLiabilities: number;
  outstandingStudentReceivables: number;
  studentCreditBalances: number;
}

export interface RecentPaymentItem {
  id: string;
  receiptNumber: string;
  studentName: string;
  studentPhone?: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
}

export interface RecentSettlementItem {
  id: string;
  settlementNumber: string;
  teacherName: string;
  teacherPhone?: string;
  amount: number;
  status: string;
  settlementDate: string;
}

export interface RecentUserItem {
  id: string;
  name: string;
  phone?: string;
  createdAt: string;
}

export interface RecentActivity {
  payments: RecentPaymentItem[];
  settlements: RecentSettlementItem[];
  students: RecentUserItem[];
  teachers: RecentUserItem[];
}

export interface OwnerDashboardData {
  period: string;
  dateRange: { from?: string; to?: string };
  subscriptionHealth: SubscriptionHealth | null;
  operationalStats: OperationalStats;
  financialMetrics: FinancialMetrics;
  recentActivity: RecentActivity;
}

