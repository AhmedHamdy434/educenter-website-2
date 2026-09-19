import { QueryParams } from "@/types";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role?: string;
  isActive: boolean;
  avatar?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAdminDTO {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
}

export interface UpdateAdminDTO {
  fullName?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

export interface AdminFilterParams extends QueryParams {
  role?: string;
}
