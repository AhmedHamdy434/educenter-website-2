/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta;
  code?: string;
  statusCode?: number;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = {
  method?: HttpMethod;
  url: string;
  params?: Record<string, any>;
  body?: any;
  headers?: HeadersInit;
  cache?: RequestCache;
};

export enum UserRole {
  OWNER = "OWNER",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role?: UserRole;
  centerId?: string;
  mustChangePassword?: boolean;
  center?: {
    slug: string;
    name: string;
    id: string;
  };
}

export interface LoginResponseData {
  accessToken: string;
  user: User;
  mustChangePassword?: boolean;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean | null;
}

export interface MutationOptions {
  onSuccess?: () => void;
}
