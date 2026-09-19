"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderMobileMenuProps {
  navItems: { name: string; href: string }[];
  isAuthenticated: boolean;
  dashboardHref?: string;
}

export function HeaderMobileMenu({
  navItems,
  isAuthenticated,
  dashboardHref = "/login",
}: HeaderMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("الرئيسية");

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="flex md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/80 hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <nav
          aria-label="القائمة المتنقلة"
          className="fixed inset-x-0 top-20 z-50 border-b border-border bg-background/95 backdrop-blur-md px-6 py-6 shadow-xl md:hidden animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-4">
            <ul className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = activeItem === item.name;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setActiveItem(item.name);
                        setIsOpen(false);
                      }}
                      className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-secondary text-primary font-bold"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="h-px w-full bg-border my-2" />

            {/* Mobile Actions */}
            <div className="flex flex-col gap-3">
              <Button
                asChild
                variant="brandOutline"
                className="w-full h-11 font-semibold text-sm rounded-lg"
              >
                <Link href="#pricing" onClick={() => setIsOpen(false)}>
                  جرب مجاناً
                </Link>
              </Button>
              <Button
                asChild
                variant="brand"
                className="w-full h-11 font-bold text-sm rounded-lg shadow-none"
              >
                <Link
                  href={isAuthenticated ? dashboardHref : "/login"}
                  onClick={() => setIsOpen(false)}
                >
                  {isAuthenticated ? "لوحة التحكم" : "تسجيل الدخول"}
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
