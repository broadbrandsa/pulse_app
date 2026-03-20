"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home01, Calendar, Star01, ShoppingBag01, User01, Zap, Bell01 } from "@untitledui/icons";
import type { FC, ReactNode } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: FC<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/salon-client", icon: Home01 },
  { name: "Book", href: "/salon-client/book", icon: Calendar },
  { name: "Rewards", href: "/salon-client/rewards", icon: Star01 },
  { name: "Shop", href: "/salon-client/shop", icon: ShoppingBag01 },
  { name: "Me", href: "/salon-client/profile", icon: User01 },
];

export default function SalonClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--pa-bg-base)]">
      {/* Topbar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)] px-4">
        <Link href="/salon-client" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D946EF]">
            <Zap className="size-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-[var(--pa-text-primary)]">Naledi&apos;s Studio</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/salon-client/notifications" className="relative rounded-lg p-2 text-[var(--pa-text-secondary)] transition hover:bg-[var(--pa-bg-hover)] hover:text-[var(--pa-text-primary)]">
            <Bell01 className="size-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D946EF] text-[8px] font-bold text-white">3</span>
          </Link>
          <Link href="/salon-client/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D946EF]/20 text-xs font-semibold text-[#D946EF] ring-2 ring-[#D946EF]/30">
            TM
          </Link>
        </div>
      </header>

      <main className="pb-20">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/salon-client" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors duration-150 ${isActive ? "text-[#D946EF]" : "text-[var(--pa-text-muted)]"}`}>
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
