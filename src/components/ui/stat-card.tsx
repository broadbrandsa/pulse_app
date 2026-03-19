"use client";

import type { FC, ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    subtitle?: string;
    icon?: ReactNode;
    sparkline?: number[];
}

export const StatCard: FC<StatCardProps> = ({ title, value, change, changeType = "positive", subtitle, icon, sparkline }) => {
    return (
        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-[#A1A1AA]">{title}</p>
                    <p className="mt-2 text-2xl font-semibold text-[#FAFAFA]">{value}</p>
                    {change && (
                        <div className="mt-1 flex items-center gap-1">
                            <span className={`text-sm font-medium ${changeType === "positive" ? "text-[#E2F4A6]" : changeType === "negative" ? "text-[#EF4444]" : "text-[#A1A1AA]"}`}>
                                {change}
                            </span>
                        </div>
                    )}
                    {subtitle && <p className="mt-1 text-sm text-[#71717A]">{subtitle}</p>}
                </div>
                {icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5A4EFF]/10 text-[#5A4EFF]">
                        {icon}
                    </div>
                )}
            </div>
            {sparkline && sparkline.length > 0 && (
                <div className="mt-4 flex items-end gap-1">
                    {sparkline.map((val, i) => {
                        const max = Math.max(...sparkline);
                        const height = max > 0 ? (val / max) * 32 : 0;
                        return (
                            <div
                                key={i}
                                className="flex-1 rounded-sm bg-[#5A4EFF]/30"
                                style={{ height: `${Math.max(height, 2)}px` }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};
