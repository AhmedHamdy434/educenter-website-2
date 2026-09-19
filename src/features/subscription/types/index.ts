export interface SubscriptionPlanDetails {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  durationInDays: number;
  studentLimit: number;
  teacherLimit: number;
  subjectLimit: number;
  canCreateExams: boolean;
  canUploadFiles: boolean;
  canExportReports: boolean;
  isPopular: boolean;
  isActive: boolean;
}

export interface CenterActiveSubscription {
  id: string;
  price: number | string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELED";
  subscriptionPlan: SubscriptionPlanDetails;
}

export interface CenterSubscriptionData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  email: string;
  phone: string;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subscriptions: CenterActiveSubscription[];
}

export interface ResourceUsageStats {
  studentsCount: number;
  teachersCount: number;
  subjectsCount: number;
}

export interface SubscriptionOverviewData {
  center: CenterSubscriptionData;
  usage: ResourceUsageStats;
}
