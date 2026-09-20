"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions/logout";

export function SubscriptionRequiredClient() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutAction();
      window.location.href = "/login";
    } catch {
      setIsLoggingOut(false);
      window.location.href = "/login";
    }
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
