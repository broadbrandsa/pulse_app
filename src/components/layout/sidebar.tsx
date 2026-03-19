"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home01,
    Calendar,
    Users01,
    MessageSquare01,
    CreditCard01,
    ShoppingBag01,
    Activity,
    File06,
    FileCheck02,
    TrendUp01,
    Settings01,
    Zap,
    ChevronLeft,
    ChevronRight,
} from "@untitledui/icons";
import type { FC } from "react";

interface NavItem {
    name: string;
    href: string;
    icon: FC<{ className?: string }>;
    badge?: number;
}

const navSections: { label: string; items: NavItem[] }[] = [
    {
        label: "TODAY",
        items: [
            { name: "Today", href: "/dashboard", icon: Home01 },
            { name: "Calendar", href: "/calendar", icon: Calendar },
            { name: "Clients", href: "/clients", icon: Users01 },
            { name: "Messages", href: "/messages", icon: MessageSquare01, badge: 3 },
        ],
    },
    {
        label: "DELIVER",
        items: [
            { name: "Coaching", href: "/coaching", icon: Activity },
            { name: "Documents", href: "/documents", icon: File06 },
        ],
    },
    {
        label: "EARN",
        items: [
            { name: "Checkout", href: "/pos", icon: CreditCard01 },
            { name: "Invoices", href: "/invoices", icon: FileCheck02 },
            { name: "Store", href: "/store", icon: ShoppingBag01 },
        ],
    },
    {
        label: "GROW",
        items: [
            { name: "Grow", href: "/grow", icon: TrendUp01 },
        ],
    },
];

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
    const pathname = usePathname();
    const showLabel = !collapsed;

    return (
        <div
            className={`fixed top-0 left-0 bottom-0 z-30 hidden lg:flex flex-col transition-[width] duration-200 ease-in-out ${
                collapsed ? "w-[72px]" : "w-60"
            }`}
            style={{ background: "var(--pa-bg-base)", padding: "12px 0 12px 12px" }}
        >
            <div
                className="flex-1 flex flex-col overflow-hidden"
                style={{
                    borderRadius: "20px",
                    background: "var(--pa-bg-sidebar)",
                    border: "1px solid var(--pa-border-subtle)",
                }}
            >
                <div className={`flex items-center py-5 px-4 ${showLabel ? "justify-between" : "justify-center"}`}>
                    {showLabel && (
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--pa-brand)" }}>
                                <Zap className="size-4 text-white" />
                            </div>
                            <span className="text-base font-bold whitespace-nowrap overflow-hidden" style={{ color: "var(--pa-text-primary)" }}>
                                PulseApp
                            </span>
                        </div>
                    )}
                    {!showLabel && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--pa-brand)" }}>
                            <Zap className="size-4 text-white" />
                        </div>
                    )}
                    <button
                        onClick={onToggleCollapse}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150"
                        style={{ color: "var(--pa-text-secondary)" }}
                    >
                        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-1">
                    {navSections.map((section) => (
                        <div key={section.label} className="mb-5">
                            {showLabel && (
                                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--pa-text-muted)" }}>
                                    {section.label}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const isActive =
                                        pathname === item.href || pathname.startsWith(item.href + "/");
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.href} className="relative group/item">
                                            <Link
                                                href={item.href}
                                                className={`flex items-center h-10 rounded-lg transition-colors duration-150 ${
                                                    showLabel ? "px-2 gap-2.5" : "justify-center px-2"
                                                }`}
                                                style={
                                                    isActive
                                                        ? { background: "var(--pa-bg-active)", color: "var(--pa-brand)" }
                                                        : { color: "var(--pa-text-secondary)" }
                                                }
                                            >
                                                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5">
                                                    <Icon className="size-[18px]" />
                                                </span>
                                                {showLabel && (
                                                    <span
                                                        className={`text-sm whitespace-nowrap overflow-hidden flex-1 ${
                                                            isActive ? "font-semibold" : "font-medium"
                                                        }`}
                                                    >
                                                        {item.name}
                                                    </span>
                                                )}
                                                {showLabel && item.badge && (
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: "var(--pa-brand)" }}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                                {!showLabel && item.badge && (
                                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: "var(--pa-brand)" }}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                            {!showLabel && (
                                                <div
                                                    role="tooltip"
                                                    className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-150"
                                                    style={{
                                                        background: "var(--pa-bg-elevated)",
                                                        border: "1px solid var(--pa-border-default)",
                                                        color: "var(--pa-text-primary)",
                                                    }}
                                                >
                                                    {item.name}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="px-3 py-3" style={{ borderTop: "1px solid var(--pa-border-subtle)" }}>
                    <Link
                        href="/profile"
                        className={`flex items-center rounded-lg p-1.5 transition-colors ${
                            showLabel ? "gap-2.5" : "justify-center"
                        }`}
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{ background: "var(--pa-bg-active)", color: "var(--pa-brand)" }}>
                            SD
                        </div>
                        {showLabel && (
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate" style={{ color: "var(--pa-text-primary)" }}>Sipho Dlamini</p>
                                <p className="text-xs truncate" style={{ color: "var(--pa-text-muted)" }}>Personal Training</p>
                            </div>
                        )}
                        {showLabel && <Settings01 className="size-4 flex-shrink-0" style={{ color: "var(--pa-text-muted)" }} />}
                    </Link>
                </div>
            </div>
        </div>
    );
};
