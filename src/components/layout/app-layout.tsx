"use client";

import type { FC, ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { BottomNav } from "./bottom-nav";
import { useSidebarState } from "@/hooks/use-sidebar-state";

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
    const { collapsed, toggle } = useSidebarState();

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--pa-bg-base)" }}>
            <Sidebar collapsed={collapsed} onToggleCollapse={toggle} />
            <div
                className={`transition-[padding-left] duration-200 ease-in-out ${
                    collapsed ? "lg:pl-[72px]" : "lg:pl-60"
                }`}
            >
                <Topbar />
                <main className="p-4 pb-24 lg:p-6 lg:pb-6">{children}</main>
            </div>
            <BottomNav />
        </div>
    );
};
