"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, BookOpen, LogOut, HelpCircle } from "lucide-react";

import { logoutAction } from "@/features/auth/actions/logout";
import { User, UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { ROLE_TRANSLATIONS } from "@/constants";
import { dashboardRoutes } from "../constants/routes-config";
import Image from "next/image";

interface SidebarProps {
  role: UserRole;
  user: User;
  onClose?: () => void;
}

export function Sidebar({ role, user, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const centerSlug =  user.center?.slug || "";

  // Filter routes based on user role
  const filteredRoutes = dashboardRoutes.filter((route) =>
    route.roles.includes(role),
  );

  const handleLogout = async () => {
    const result = await logoutAction();
    if (result.success) {
      // Redirect to login
      router.push("/login");
      router.refresh();
      if (onClose) onClose();
    }
  };

  return (
    <aside className="flex h-full w-64 flex-col border-l border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg shadow-black/10">
      {/* Brand Header Area - Distinct Solid Color Block (#0E211C) */}
      <div className="flex h-20 items-center gap-3 px-6 bg-[#0E211C] border-b border-sidebar-border/80">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-400 border border-white/15 shadow-inner">
          {user.center?.logo ? 
          <Image width={80} height={80} className="size-5 relative z-10 stroke-[2.25]" src={user.center.logo} alt={centerSlug} /> 
          : <GraduationCap className="size-5 relative z-10 stroke-[2.25]" />}
          <BookOpen className="size-3.5 absolute bottom-1 left-1 opacity-50" />
        </div>
        <div className="flex flex-col">
          <span className="font-sans text-lg font-black tracking-tight text-white">
            {user.center?.name}
          </span>
          <span className="text-[11px] text-sidebar-foreground/70 font-semibold -mt-0.5">
            لوحة إدارة المنصة
          </span>
        </div>
      </div>

      {/* Navigation List Area */}
      <nav
        className="flex-1 overflow-y-auto px-3.5 py-5"
        aria-label="القائمة الجانبية"
      >
        {/* Micro-Label: Main Navigation */}
        <span className="text-[11px] font-bold tracking-widest text-sidebar-foreground/50 uppercase block px-3 py-1 mb-1.5 select-none">
          التنقل الرئيسي
        </span>

        <ul className="space-y-1.5">
          {filteredRoutes.map((item, index) => {
            const fullHref = `/${centerSlug}${item.href}`;
            const Icon = item.icon;
            const isActive =
              index === 0
                ? pathname === fullHref
                : pathname.startsWith(fullHref);
            return (
              <li key={item.href}>
                <Link
                  href={fullHref}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[14px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
                    isActive
                      ? "bg-white/15 text-white font-bold border-r-4 border-amber-500 pr-3 shadow-xs"
                      : "text-sidebar-foreground/80 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md transition-colors",
                      isActive
                        ? "bg-amber-500/20 text-amber-400"
                        : "text-sidebar-foreground/70",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive && "stroke-[2.5]",
                      )}
                    />
                  </div>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <hr className="my-5 border-sidebar-border" />

        {/* Secondary Support Link */}
        <ul>
          <li>
            <Link
              href={`/${centerSlug}/support`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[14px] font-medium text-sidebar-foreground/80 hover:bg-white/8 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
            >
              <div className="flex size-6 items-center justify-center rounded-md text-sidebar-foreground/70">
                <HelpCircle className="size-4 shrink-0" />
              </div>
              <span>الدعم الفني</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Card & Logout - Grounded Solid Contrast Base */}
      <div className="p-4 bg-[#0E211C] border-t border-sidebar-border/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/12 text-amber-400 font-bold border border-white/15">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "م"}
            </div>
            <div className="flex flex-col overflow-hidden text-right">
              <span
                className="text-sm font-bold text-white truncate"
                title={user.fullName}
              >
                {user.fullName || "مستخدم"}
              </span>
              <span className="text-xs text-sidebar-foreground/65 truncate font-medium">
                {ROLE_TRANSLATIONS[role] || "صلاحية غير معروفة"}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            aria-label="تسجيل الخروج"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/70 hover:bg-rose-500/20 hover:text-rose-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar cursor-pointer"
          >
            <LogOut className="size-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
