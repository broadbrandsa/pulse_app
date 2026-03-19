import type { FC, ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default" | "violet" | "bronze" | "silver" | "gold" | "platinum";

interface StatusBadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
    dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-[#E2F4A6]/15 text-[#E2F4A6] border-[#E2F4A6]/20",
    warning: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20",
    danger: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/20",
    info: "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/20",
    default: "bg-[#1A1A1A] text-[#A1A1AA] border-[#333333]",
    violet: "bg-[#5A4EFF]/15 text-[#5A4EFF] border-[#5A4EFF]/20",
    bronze: "bg-[#F97316]/15 text-[#F97316] border-[#F97316]/20",
    silver: "bg-[#A1A1AA]/15 text-[#A1A1AA] border-[#A1A1AA]/20",
    gold: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20",
    platinum: "bg-[#5A4EFF]/15 text-[#5A4EFF] border-[#5A4EFF]/20",
};

const dotStyles: Record<BadgeVariant, string> = {
    success: "bg-[#E2F4A6]",
    warning: "bg-[#F59E0B]",
    danger: "bg-[#EF4444]",
    info: "bg-[#3B82F6]",
    default: "bg-[#71717A]",
    violet: "bg-[#5A4EFF]",
    bronze: "bg-[#F97316]",
    silver: "bg-[#A1A1AA]",
    gold: "bg-[#F59E0B]",
    platinum: "bg-[#5A4EFF]",
};

export const StatusBadge: FC<StatusBadgeProps> = ({ variant = "default", children, dot }) => {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}>
            {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[variant]}`} />}
            {children}
        </span>
    );
};
