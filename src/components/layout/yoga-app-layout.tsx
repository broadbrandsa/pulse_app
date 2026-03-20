"use client";

import type { FC, ReactNode } from "react";
import { YogaSidebar } from "./yoga-sidebar";
import { YogaTopbar } from "./yoga-topbar";
import { YogaBottomNav } from "./yoga-bottom-nav";
import { useYogaSidebarState } from "@/hooks/use-yoga-sidebar-state";

interface YogaAppLayoutProps {
    children: ReactNode;
}

export const YogaAppLayout: FC<YogaAppLayoutProps> = ({ children }) => {
    const { collapsed, toggle } = useYogaSidebarState();

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--pa-bg-base)" }}>
            <YogaSidebar collapsed={collapsed} onToggleCollapse={toggle} />
            <div
                className={`transition-[padding-left] duration-200 ease-in-out ${
                    collapsed ? "lg:pl-[72px]" : "lg:pl-60"
                }`}
            >
                <YogaTopbar />
                <main className="p-4 pb-24 lg:p-6 lg:pb-6">{children}</main>
            </div>
            <YogaBottomNav />
        </div>
    );
};
