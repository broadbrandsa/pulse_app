import type { FC } from "react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
}

const sizes: Record<string, string> = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
};

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = "md" }) => {
    return (
        <div className={`animate-spin rounded-full border-2 border-[#D4D4D8] border-t-[#7C3AED] ${sizes[size]}`} />
    );
};
