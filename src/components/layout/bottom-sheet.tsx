"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "@untitledui/icons";

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            <div
                className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition duration-200 ease-linear ${
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`fixed bottom-0 left-0 right-0 z-[70] rounded-t-2xl transition-transform duration-200 ease-linear ${
                    isOpen ? "translate-y-0" : "translate-y-full"
                }`}
                style={{ background: "var(--pa-bg-surface)" }}
                role="dialog"
                aria-modal="true"
                aria-label={title ?? "Bottom sheet"}
            >
                <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full" style={{ background: "var(--pa-border-emphasis)" }} />

                {title && (
                    <div className="mb-2 flex items-center justify-between px-4">
                        <h2 className="text-lg font-semibold" style={{ color: "var(--pa-text-primary)" }}>{title}</h2>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 transition duration-100 ease-linear active:scale-95"
                            style={{ color: "var(--pa-text-muted)" }}
                            aria-label="Close"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                )}

                <div className="px-4 pb-6" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
                    {children}
                </div>
            </div>
        </>
    );
}
