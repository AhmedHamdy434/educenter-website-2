"use client";

import { Menu, Bell, Search, User as UserIcon } from "lucide-react";
import { User, UserRole } from "@/types";

interface DashboardHeaderProps {
  user: User;
  onMenuToggle: () => void;
}

const roleTranslations: Record<UserRole, string> = {
  [UserRole.OWNER]: "مدير المركز",
  [UserRole.TEACHER]: "معلم",
  [UserRole.STUDENT]: "طالب",
};

export function DashboardHeader({ user, onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-border bg-card/90 px-6 backdrop-blur-md">
      {/* Right Side: Menu Toggle (Mobile only) & Search (Optional) */}
      <div className="flex flex-1 items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={onMenuToggle}
          aria-label="افتح القائمة الجانبية"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground/75 hover:bg-muted md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="size-5" />
        </button>

        {/* Visual Search Bar */}
        <div className="relative hidden max-w-xs flex-1 sm:block">
          <label htmlFor="search-input" className="sr-only">
            البحث في النظام
          </label>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="size-4 text-muted-foreground" />
          </div>
          <input
            id="search-input"
            type="text"
            placeholder="ابحث عن الطلاب، المجموعات..."
            className="h-10 w-full rounded-lg border border-border bg-muted/40 pr-10 pl-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary focus-visible:outline-none"
          />
        </div>
      </div>

      {/* Left Side: Notifications & User profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <button
          aria-label="التنبيهات"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground/75 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bell className="size-5" />
          <span className="absolute top-1.5 left-1.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent"></span>
          </span>
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-border" />

        {/* User profile dropdown trigger/avatar */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary border border-border font-bold">
            <UserIcon className="size-5" />
          </div>
          <div className="hidden flex-col items-start md:flex text-right">
            <span className="text-sm font-bold text-foreground">
              {user.name || "مستخدم"}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold -mt-0.5">
              {user.role ? roleTranslations[user.role] : "صلاحية غير معروفة"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
