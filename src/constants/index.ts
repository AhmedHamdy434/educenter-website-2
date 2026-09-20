import { UserRole } from "@/types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://educenter-saas.com";

export const ROLE_TRANSLATIONS: Record<UserRole, string> = {
  [UserRole.OWNER]: "مدير المركز",
  [UserRole.TEACHER]: "معلم",
  [UserRole.STUDENT]: "طالب",
};