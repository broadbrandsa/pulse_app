"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home01, Activity, BarChartSquare01, Calendar, User01, Zap, Bell01 } from "@untitledui/icons";
import type { FC, ReactNode } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: FC<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/client", icon: Home01 },
  { name: "My Plan", href: "/client/plan", icon: Activity },
  { name: "Progress", href: "/client/progress", icon: BarChartSquare01 },
  { name: "Book", href: "/client/book", icon: Calendar },
  { name: "Me", href: "/client/profile", icon: User01 },
];

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Topbar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#262626] bg-[#0D0D0D] px-4">
        <Link href="/client" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5A4EFF]">
            <Zap className="size-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-[#FAFAFA]">PulseApp</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/client/notifications" className="relative rounded-lg p-2 text-[#A1A1AA] transition hover:bg-[#161616] hover:text-[#FAFAFA]">
            <Bell01 className="size-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#5A4EFF] text-[8px] font-bold text-white">2</span>
          </Link>
          <Link href="/client/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-xs font-semibold text-amber-400 ring-2 ring-amber-400/30">
            KS
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-20">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[#262626] bg-[#0D0D0D]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/client" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors duration-150 ${isActive ? "text-[#5A4EFF]" : "text-zinc-500"}`}>
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
