import type { Metadata } from "next";
import { OwnerSettingsClient } from "@/features/settings/components/OwnerSettingsClient";

export const metadata: Metadata = {
  title: "إعدادات المركز | مدير المركز",
  description: "إدارة إعدادات ونسب التوزيع والسياسات المالية للمركز التعليمي",
};

export default function OwnerSettingsPage() {
  return <OwnerSettingsClient />;
}
