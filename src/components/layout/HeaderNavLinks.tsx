"use client";

import { useState } from "react";

interface HeaderNavLinksProps {
  navItems: { name: string; href: string }[];
}

export function HeaderNavLinks({ navItems }: HeaderNavLinksProps) {
  const [activeItem, setActiveItem] = useState("الرئيسية");

  return (
    <nav
      className="hidden md:flex items-center gap-8"
      aria-label="التنقل الرئيسي"
    >
      {navItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          onClick={() => setActiveItem(item.name)}
          className={`relative py-2 text-[15px] font-semibold transition-colors hover:text-primary ${
            activeItem === item.name
              ? "text-primary font-bold"
              : "text-muted-foreground"
          }`}
          aria-current={activeItem === item.name ? "page" : undefined}
        >
          {item.name}
          {activeItem === item.name && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
          )}
        </a>
      ))}
    </nav>
  );
}
