import { QueryParams } from "@/types";

export interface NotificationLog {
  id: string;
  recipient?: string;
  recipientPhone?: string;
  type?: string;
  channel?: string;
  status: "DELIVERED" | "SENT" | "PENDING" | "FAILED" | string;
  title?: string;
  content?: string;
  message?: string;
  error?: string | null;
  sentAt?: string;
  createdAt: string;
}

export interface NotificationFilterParams extends QueryParams {
  status?: string;
  type?: string;
}
