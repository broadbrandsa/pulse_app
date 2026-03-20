"use client";

import type { FC, ReactNode } from "react";
import { SalonSidebar } from "./salon-sidebar";
import { SalonTopbar } from "./salon-topbar";
import { SalonBottomNav } from "./salon-bottom-nav";
import { useSalonSidebarState } from "@/hooks/use-salon-sidebar-state";

interface SalonAppLayoutProps {
    children: ReactNode;
}

export const SalonAppLayout: FC<SalonAppLayoutProps> = ({ children }) => {
    const { collapsed, toggle } = useSalonSidebarState();

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--pa-bg-base)" }}>
            <SalonSidebar collapsed={collapsed} onToggleCollapse={toggle} />
            <div
                className={`transition-[padding-left] duration-200 ease-in-out ${
                    collapsed ? "lg:pl-[72px]" : "lg:pl-60"
                }`}
            >
                <SalonTopbar />
                <main className="p-4 pb-24 lg:p-6 lg:pb-6">{children}</main>
            </div>
            <SalonBottomNav />
        </div>
    );
};
