import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions/get-current-user";
import { DashboardLayoutClient } from "@/features/dashboard/components/DashboardLayoutClient";
import { UserRole } from "@/types";

export default async function DashboardLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ centerSlug: string }>;
}) {
  // Fetch current user from API helper
  const user = await getCurrentUser();

  // Redirect to login if unauthenticated
  if (!user) {
    redirect("/login");
  }

  const role = user.role;

  const { centerSlug } = await params;

  // Validate role and redirect if invalid
  if (!role || !Object.values(UserRole).includes(role)) {
    redirect("/login");
  }

  //if user does not have the correct slug, redirect to the correct slug
  if (user?.center?.slug !== centerSlug) {
    redirect(`/${user.center?.slug}/${role.toLowerCase()}`);
  }


  return (
    <DashboardLayoutClient user={user} role={role}>
      {children}
    </DashboardLayoutClient>
  );
}
