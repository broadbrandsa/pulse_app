"use client";

import { useState, useEffect, useMemo } from "react";

interface MilestoneCelebrationProps {
    title: string;
    description: string;
    clientName: string;
    points?: number;
    onDismiss: () => void;
}

interface ConfettiPiece {
    id: number;
    left: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
    rotation: number;
}

const BRAND_COLORS = ["#5A4EFF", "#E2F4A6", "#EEA0FF", "#FAFAFA"];

function generateConfetti(): ConfettiPiece[] {
    return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
        delay: Math.random() * 1.2,
        duration: 1.8 + Math.random() * 1.4,
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
    }));
}

export function MilestoneCelebration({
    title,
    description,
    clientName,
    points = 0,
    onDismiss,
}: MilestoneCelebrationProps) {
    const [visible, setVisible] = useState(true);
    const confetti = useMemo(() => generateConfetti(), []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onDismiss();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={() => {
                    setVisible(false);
                    onDismiss();
                }}
            />

            {/* Confetti keyframes */}
            <style>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-20px) rotate(0deg);
                        opacity: 1;
                    }
                    80% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>

            {/* Confetti pieces */}
            {confetti.map((piece) => (
                <div
                    key={piece.id}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: `${piece.left}%`,
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                        backgroundColor: piece.color,
                        borderRadius: piece.size > 7 ? "2px" : "50%",
                        animation: `confetti-fall ${piece.duration}s ${piece.delay}s ease-in forwards`,
                        transform: `rotate(${piece.rotation}deg)`,
                        opacity: 0,
                        pointerEvents: "none",
                    }}
                />
            ))}

            {/* Card */}
            <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-[#262626] bg-[#111111] p-6 text-center">
                {/* Star icon */}
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#1A1A1A]">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            fill="#F59E0B"
                            stroke="#F59E0B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <p className="text-sm font-medium text-[#E2F4A6]">
                    Milestone unlocked!
                </p>
                <h3 className="mt-1 text-xl font-bold text-[#FAFAFA]">{title}</h3>
                <p className="mt-1 text-sm text-[#A1A1AA]">
                    {clientName} &mdash; {description}
                </p>

                {points > 0 && (
                    <div className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#5A4EFF]/15 px-3 py-1 text-sm font-medium text-[#5A4EFF]">
                        +{points} pts
                    </div>
                )}

                <div className="mt-5 flex gap-3">
                    <button className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-[#262626] bg-transparent px-4 py-2.5 text-sm font-medium text-[#FAFAFA] transition duration-100 ease-linear hover:bg-[#1A1A1A]">
                        Share
                    </button>
                    <button
                        onClick={() => {
                            setVisible(false);
                            onDismiss();
                        }}
                        className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8]"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
