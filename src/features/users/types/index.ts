import { QueryParams } from "@/types";

export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "OWNER" | "TEACHER" | "STUDENT";
  isActive: boolean;
  avatar?: string | null;
  createdAt: string;
}

export interface UserFilterParams extends QueryParams {
  role?: string;
}
