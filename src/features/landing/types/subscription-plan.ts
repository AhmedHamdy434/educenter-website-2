export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  durationInDays: number;
  studentLimit: number;
  teacherLimit: number;
  subjectLimit: number;
  canCreateExams: boolean;
  canUploadFiles: boolean;
  canExportReports: boolean;
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

