"use client";

import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import type { FC, ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    title?: string;
}

export const Modal: FC<ModalProps> = ({ isOpen, onOpenChange, children, title }) => {
    return (
        <AriaModalOverlay
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
            <AriaModal className="w-full max-w-lg">
                <AriaDialog className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-2xl outline-none">
                    {title && <h2 className="mb-4 text-lg font-semibold text-[#09090B]">{title}</h2>}
                    {children}
                </AriaDialog>
            </AriaModal>
        </AriaModalOverlay>
    );
};

export { AriaDialogTrigger as DialogTrigger };
