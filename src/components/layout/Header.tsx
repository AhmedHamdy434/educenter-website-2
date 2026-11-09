import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/actions/get-current-user";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { HeaderNavLinks } from "./HeaderNavLinks";

export async function Header() {
  const user = await getCurrentUser();
  const isAuthenticated = !!user;

  const dashboardHref = user?.center?.slug
    ? `/${user.center.slug}/${user.role?.toLowerCase()}`
    : "/login";

  const navItems = [
    { name: "الرئيسية", href: "/" },
    { name: "المميزات", href: "/#features" },
    { name: "الباقات", href: "/#pricing" },
    { name: "آراء العملاء", href: "/#testimonials" },
    { name: "تواصل معنا", href: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Right Side: Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo.png"
                alt="EduCenter - منصة مراكز التعليم"
                width={170}
                height={50}
                priority
                className="h-11 w-auto object-contain transition-transform group-hover:scale-102"
              />
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <HeaderNavLinks navItems={navItems} />

          {/* Left Side: Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="brandOutline" size="brandMd">
              <Link href="#pricing">
                جرب مجاناً
              </Link>
            </Button>
            <Button asChild variant="brand" size="brandMd">
              <Link href={isAuthenticated ? dashboardHref : "/login"}>
                {isAuthenticated ? "لوحة التحكم" : "تسجيل الدخول"}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <HeaderMobileMenu
            navItems={navItems}
            isAuthenticated={isAuthenticated}
            dashboardHref={dashboardHref}
          />
        </div>
      </div>
    </header>
  );
}
