import { QueryParams } from "@/types";

export interface AuditLogUser {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  user?: AuditLogUser | null;
  action: string;
  entity?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown> | string | null;
  createdAt: string;
}

export interface AuditLogFilterParams extends QueryParams {
  action?: string;
  entity?: string;
}
