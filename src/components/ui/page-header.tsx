import type { FC, ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, action }) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold text-[#09090B]">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-[#52525B]">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
};
