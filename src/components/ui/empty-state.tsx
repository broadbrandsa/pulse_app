import type { FC, ReactNode } from "react";

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export const EmptyState: FC<EmptyStateProps> = ({ icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {icon && <div className="mb-4 text-[#52525B]">{icon}</div>}
            <h3 className="text-lg font-medium text-[#09090B]">{title}</h3>
            {description && <p className="mt-1 text-sm text-[#52525B]">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
};
