import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions/get-current-user";
import { UserRole } from "@/types";

export default async function DashboardIndexPage({
  params,
}: {
  params: Promise<{ centerSlug: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { centerSlug } = await params;
  const slug = user.center?.slug || centerSlug;
  const role = user.role;

  if (role === UserRole.OWNER) {
    redirect(`/${slug}/owner`);
  } else if (role === UserRole.TEACHER) {
    redirect(`/${slug}/teacher`);
  } else if (role === UserRole.STUDENT) {
    redirect(`/${slug}/student`);
  } else {
    redirect("/login");
  }
}
