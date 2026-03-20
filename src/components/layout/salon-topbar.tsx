"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Bell01, Plus, Zap, Sun, Moon01, ChevronDown, Calendar, Users01, FileCheck02, MessageSquare01, Gift01 } from "@untitledui/icons";
import type { FC } from "react";

/* eslint-disable @typescript-eslint/no-unused-vars */
const pageTitles: Record<string, string> = {
    "/salon/dashboard": "Today",
    "/salon/calendar": "Calendar",
    "/salon/clients": "Clients",
    "/salon/messages": "Messages",
    "/salon/team": "Team",
    "/salon/packages": "Services & Packages",
    "/salon/pos": "Checkout",
    "/salon/invoices": "Invoices",
    "/salon/inventory": "Inventory",
    "/salon/loyalty": "Loyalty",
    "/salon/grow": "Grow",
    "/salon/profile": "Settings",
    "/salon/notifications": "Notifications",
    "/salon/settings": "Settings",
};
/* eslint-enable @typescript-eslint/no-unused-vars */

const quickMenuItems = [
    { name: "New Booking", href: "/salon/calendar", icon: Calendar },
    { name: "New Client", href: "/salon/clients", icon: Users01 },
    { name: "New Invoice", href: "/salon/invoices", icon: FileCheck02 },
    { name: "New Package", href: "/salon/packages", icon: Gift01 },
    { name: "New Message", href: "/salon/messages", icon: MessageSquare01 },
];

export const SalonTopbar: FC = () => {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [showQuickMenu, setShowQuickMenu] = useState(false);
    const quickMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (quickMenuRef.current && !quickMenuRef.current.contains(e.target as Node)) {
                setShowQuickMenu(false);
            }
        };
        if (showQuickMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showQuickMenu]);

    const getTitle = () => {
        if (pathname.startsWith("/salon/clients/") && pathname !== "/salon/clients") return "Client Profile";
        if (pathname.startsWith("/salon/team/") && pathname !== "/salon/team") return "Team Member";
        return pageTitles[pathname] || "PulseApp";
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header
            className="flex h-14 items-center justify-between px-4 lg:h-16 lg:px-6"
            style={{
                backgroundColor: "var(--pa-bg-topbar)",
                borderBottom: "1px solid var(--pa-border-subtle)",
            }}
        >
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 lg:hidden">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#D946EF]">
                        <Zap className="size-3.5 text-white" />
                    </div>
                    <span className="text-base font-bold" style={{ color: "var(--pa-text-primary)" }}>PulseApp</span>
                </div>
                <h2 className="hidden text-lg font-semibold lg:block" style={{ color: "var(--pa-text-primary)" }}>{getTitle()}</h2>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
                <Link
                    href="/salon/notifications"
                    className="relative rounded-lg p-2 transition duration-100 ease-linear"
                    style={{ color: "var(--pa-text-secondary)" }}
                >
                    <Bell01 className="size-5" />
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white">
                        3
                    </span>
                </Link>
                {mounted && (
                    <button
                        onClick={toggleTheme}
                        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        className="rounded-lg p-2 transition duration-100 ease-linear"
                        style={{ color: "var(--pa-text-secondary)" }}
                    >
                        {theme === "dark" ? <Sun className="size-5" /> : <Moon01 className="size-5" />}
                    </button>
                )}
                <div className="relative hidden lg:block" ref={quickMenuRef}>
                    <div className="flex items-center rounded-lg text-sm font-medium text-white bg-[#D946EF]">
                        <Link
                            href="/salon/calendar"
                            className="flex items-center gap-2 px-4 py-2 transition duration-100 ease-linear"
                        >
                            <Plus className="size-4" />
                            New
                        </Link>
                        <button
                            onClick={() => setShowQuickMenu((prev) => !prev)}
                            className="flex items-center px-2 py-2 border-l border-white/20 transition duration-100 ease-linear"
                            aria-label="Quick actions menu"
                        >
                            <ChevronDown className="size-4" />
                        </button>
                    </div>
                    {showQuickMenu && (
                        <div
                            className="absolute right-0 top-full mt-2 w-52 rounded-lg py-1 shadow-lg z-50"
                            style={{
                                background: "var(--pa-bg-topbar)",
                                border: "1px solid var(--pa-border-default, var(--pa-border-subtle))",
                            }}
                        >
                            {quickMenuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setShowQuickMenu(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition duration-100 ease-linear hover:opacity-80"
                                        style={{ color: "var(--pa-text-secondary)" }}
                                    >
                                        <Icon className="size-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold" style={{ background: "rgba(217, 70, 239, 0.10)", color: "#D946EF" }}>
                    NM
                </div>
            </div>
        </header>
    );
};
