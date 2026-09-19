"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { User, UserRole } from "@/types";

import { SubscriptionWarningBanner } from "@/features/subscription/components/SubscriptionWarningBanner";

interface DashboardLayoutClientProps {
  user: User;
  role: UserRole;
  children: React.ReactNode;
}

export function DashboardLayoutClient({
  user,
  role,
  children,
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground" dir="rtl">
      {/* Desktop Sidebar (Fixed on right) */}
      <div className="hidden md:block shrink-0">
        <Sidebar role={role} user={user} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-xs transition-opacity">
          {/* Backdrop Click */}
          <div
            className="absolute inset-0"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative mr-0 ml-auto h-full w-64 shadow-2xl transition-transform animate-in slide-in-from-right duration-250">
            <Sidebar
              role={role}
              user={user}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Workspace (Takes remaining width on left) */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Grace Period Warning Banner (OWNER ONLY) */}
        {role === UserRole.OWNER && <SubscriptionWarningBanner />}

        {/* Dashboard Header */}
        <DashboardHeader
          user={user}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
