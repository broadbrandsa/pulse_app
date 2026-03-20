"use client";

import { useState, type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home01,
    Calendar,
    Users01,
    MessageSquare01,
    DotsVertical,
    CreditCard01,
    FileCheck02,
    Star01,
    Settings01,
    Heart,
    Award01,
    UserCheck01,
    ShoppingBag01,
} from "@untitledui/icons";
import { BottomSheet } from "./bottom-sheet";

interface NavItem {
    name: string;
    href: string;
    icon: FC<{ className?: string }>;
}

const mainItems: NavItem[] = [
    { name: "Today", href: "/yoga/dashboard", icon: Home01 },
    { name: "Schedule", href: "/yoga/schedule", icon: Calendar },
    { name: "Students", href: "/yoga/students", icon: Users01 },
    { name: "Messages", href: "/yoga/messages", icon: MessageSquare01 },
];

const moreItems: NavItem[] = [
    { name: "Passes", href: "/yoga/passes", icon: Star01 },
    { name: "Memberships", href: "/yoga/memberships", icon: Heart },
    { name: "Workshops", href: "/yoga/workshops", icon: Award01 },
    { name: "Instructors", href: "/yoga/instructors", icon: UserCheck01 },
    { name: "Loyalty", href: "/yoga/loyalty", icon: Heart },
    { name: "Checkout", href: "/yoga/pos", icon: CreditCard01 },
    { name: "Store", href: "/yoga/store", icon: ShoppingBag01 },
    { name: "Documents", href: "/yoga/documents", icon: FileCheck02 },
    { name: "Invoices", href: "/yoga/invoices", icon: FileCheck02 },
    { name: "Settings", href: "/yoga/settings", icon: Settings01 },
];

export function YogaBottomNav() {
    const pathname = usePathname();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
    const isMoreActive = moreItems.some((item) => isActive(item.href));

    return (
        <>
            <nav
                className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around lg:hidden"
                style={{ borderTop: "1px solid var(--pa-border-subtle)", background: "var(--pa-bg-topbar)", paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                {mainItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 transition duration-100 ease-linear active:scale-95 ${
                                active ? "text-[#14B8A6]" : "text-[var(--pa-text-muted)]"
                            }`}
                        >
                            <item.icon className="size-5" aria-hidden="true" />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}

                <button
                    onClick={() => setIsMoreOpen(true)}
                    className={`flex flex-col items-center gap-1 transition duration-100 ease-linear active:scale-95 ${
                        isMoreActive ? "text-[#14B8A6]" : "text-[var(--pa-text-muted)]"
                    }`}
                >
                    <DotsVertical className="size-5" aria-hidden="true" />
                    <span className="text-[10px] font-medium">More</span>
                </button>
            </nav>

            <BottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} title="More">
                <div className="flex flex-col gap-1">
                    {moreItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMoreOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-4 transition duration-100 ease-linear active:scale-[0.98] ${
                                    active
                                        ? "bg-[#14B8A6]/10 text-[#14B8A6]"
                                        : "text-[var(--pa-text-secondary)] hover:bg-[var(--pa-bg-elevated)]"
                                }`}
                            >
                                <item.icon className="size-5" aria-hidden="true" />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </BottomSheet>
        </>
    );
}
