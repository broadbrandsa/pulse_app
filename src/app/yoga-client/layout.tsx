"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home01, Calendar, Activity, CalendarPlus01, User01, Zap, Bell01 } from "@untitledui/icons";
import type { FC, ReactNode } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: FC<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/yoga-client", icon: Home01 },
  { name: "Schedule", href: "/yoga-client/schedule", icon: Calendar },
  { name: "Practice", href: "/yoga-client/practice", icon: Activity },
  { name: "Book", href: "/yoga-client/book", icon: CalendarPlus01 },
  { name: "Me", href: "/yoga-client/profile", icon: User01 },
];

export default function YogaClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--pa-bg-base)]">
      {/* Topbar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)] px-4">
        <Link href="/yoga-client" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#14B8A6]">
            <Zap className="size-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-[var(--pa-text-primary)]">Ubuntu Yoga</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/yoga-client/profile" className="relative rounded-lg p-2 text-[var(--pa-text-secondary)] transition hover:bg-[var(--pa-bg-hover)] hover:text-[var(--pa-text-primary)]">
            <Bell01 className="size-5" />
          </Link>
          <Link href="/yoga-client/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14B8A6]/20 text-xs font-semibold text-[#14B8A6] ring-2 ring-[#14B8A6]/30">
            KS
          </Link>
        </div>
      </header>

      <main className="pb-20">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/yoga-client" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors duration-150 ${isActive ? "text-[#14B8A6]" : "text-[var(--pa-text-muted)]"}`}>
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
