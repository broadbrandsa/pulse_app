import Image from "next/image";
import type { FC } from "react";

interface InitialsAvatarProps {
    initials: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    color?: string;
    src?: string | null;
}

const sizeClasses: Record<string, string> = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
};

const pixelSizes: Record<string, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
};

export const InitialsAvatar: FC<InitialsAvatarProps> = ({ initials, size = "md", color, src }) => {
    if (src) {
        return (
            <div className={`relative overflow-hidden rounded-full ${sizeClasses[size]}`}>
                <Image
                    src={src}
                    alt={initials}
                    width={pixelSizes[size]}
                    height={pixelSizes[size]}
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    const bgColor = color || "bg-[#5A4EFF]/10";
    const textColor = color ? "text-white" : "text-[#5A4EFF]";
    return (
        <div
            className={`flex items-center justify-center rounded-full font-semibold ${sizeClasses[size]} ${color ? "" : bgColor} ${textColor}`}
            style={color ? { backgroundColor: color } : undefined}
        >
            {initials}
        </div>
    );
};
