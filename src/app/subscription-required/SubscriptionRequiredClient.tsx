"use client";

import Link from "next/link";
import { LogOut, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";

export function SubscriptionRequiredClient() {
  const { logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = async () => {
    await logout({ hardRedirect: true });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm mt-8">
      <Button asChild variant="brand" size="brandMd" className="w-full sm:w-auto flex-1">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Home className="size-4" />
          <span>العودة للرئيسية</span>
        </Link>
      </Button>

      <Button
        variant="brandOutline"
        size="brandMd"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 text-destructive hover:text-destructive"
      >
        {isLoggingOut ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4" />
        )}
        <span>تسجيل الخروج</span>
      </Button>
    </div>
  );
}
