"use client";

import { useState, useMemo } from "react";
import {
    CreditCard01,
    ShoppingCart01,
    Plus,
    Minus,
    XClose,
    Check,
    Users01,
    Zap,
} from "@untitledui/icons";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type PaymentMethod = "card" | "eft" | "snapscan" | "zapper" | "cash" | "payfast";

interface QuickSellItem {
    id: string;
    name: string;
    price: number;
    emoji: string;
}

interface CartItem extends QuickSellItem {
    qty: number;
}

interface Student {
    name: string;
    initials: string;
    membership: string;
    membershipColor: string;
    classesLeft: number | null;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                           */
/* ------------------------------------------------------------------ */

const quickSellItems: QuickSellItem[] = [
    { id: "dropin", name: "Drop-in", price: 120, emoji: "\u{1F9D8}" },
    { id: "5class", name: "5-Class Pass", price: 550, emoji: "\u{1F3AB}" },
    { id: "10class", name: "10-Class Pass", price: 950, emoji: "\u{1F3AB}" },
    { id: "monthly", name: "Monthly Unlimited", price: 1099, emoji: "\u{267E}\uFE0F" },
    { id: "workshop", name: "Workshop: Sound Bath", price: 280, emoji: "\u{1F514}" },
];

const students: Student[] = [
    { name: "Kefilwe", initials: "KM", membershipColor: "#14B8A6", membership: "Monthly Unlimited", classesLeft: null },
    { name: "Lerato", initials: "LP", membershipColor: "#F59E0B", membership: "10-Class Pass", classesLeft: 4 },
    { name: "Priya", initials: "PN", membershipColor: "#EF4444", membership: "5-Class Pass", classesLeft: 1 },
];

const paymentMethods: { id: PaymentMethod; label: string }[] = [
    { id: "card", label: "Card" },
    { id: "eft", label: "EFT" },
    { id: "snapscan", label: "SnapScan" },
    { id: "zapper", label: "Zapper" },
    { id: "cash", label: "Cash" },
    { id: "payfast", label: "PayFast" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatRand(amount: number): string {
    return `R${amount.toLocaleString("en-ZA")}`;
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function YogaPOSPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedStudent, setSelectedStudent] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [quickCheckin, setQuickCheckin] = useState(false);

    // Cart helpers
    function addToCart(item: QuickSellItem) {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === item.id);
            if (existing) {
                return prev.map((c) =>
                    c.id === item.id ? { ...c, qty: c.qty + 1 } : c
                );
            }
            return [...prev, { ...item, qty: 1 }];
        });
    }

    function updateQty(id: string, delta: number) {
        setCart((prev) =>
            prev
                .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
                .filter((c) => c.qty > 0)
        );
    }

    function removeItem(id: string) {
        setCart((prev) => prev.filter((c) => c.id !== id));
    }

    // Totals
    const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    const vat = Math.round(subtotal * 0.15);
    const grandTotal = subtotal + vat;

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px]">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Point of Sale
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Sell passes, memberships and check in students
                        </p>
                    </div>
                    {/* Quick Check-in toggle */}
                    <button
                        onClick={() => setQuickCheckin(!quickCheckin)}
                        className={`inline-flex items-center gap-2 self-start rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-100 ease-linear ${
                            quickCheckin
                                ? "bg-[#14B8A6] text-white"
                                : "border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] text-[var(--pa-text-secondary)] hover:border-[#14B8A6]/50"
                        }`}
                    >
                        <Zap className="size-4" />
                        Quick Check-in
                    </button>
                </div>

                {/* Quick Check-in Mode */}
                {quickCheckin && (
                    <div className="mb-6 rounded-2xl border-2 border-[#14B8A6]/30 bg-[#14B8A6]/5 p-5">
                        <div className="mb-3 flex items-center gap-2">
                            <Zap className="size-5 text-[#14B8A6]" />
                            <h2 className="text-base font-semibold text-[var(--pa-text-primary)]">
                                Quick Check-in
                            </h2>
                        </div>
                        <p className="mb-4 text-sm text-[var(--pa-text-secondary)]">
                            Select student, confirm class, and deduct from their pass or membership.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {students.map((s, idx) => (
                                <button
                                    key={s.name}
                                    onClick={() => setSelectedStudent(idx)}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition duration-100 ease-linear ${
                                        selectedStudent === idx
                                            ? "border-2 border-[#14B8A6] bg-[#14B8A6]/10"
                                            : "border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] hover:border-[#14B8A6]/30"
                                    }`}
                                >
                                    <div
                                        className="flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                                        style={{ backgroundColor: s.membershipColor }}
                                    >
                                        {s.initials}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">{s.name}</p>
                                        <p className="text-xs text-[var(--pa-text-muted)]">
                                            {s.membership}
                                            {s.classesLeft !== null && ` \u00B7 ${s.classesLeft} left`}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button className="mt-4 flex items-center gap-2 rounded-xl bg-[#14B8A6] px-5 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                            <Check className="size-4" />
                            Check In {students[selectedStudent].name}
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Left Column -- Quick Sell Buttons */}
                    <div className="flex-1 space-y-4">
                        <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--pa-text-secondary)]">
                            Quick Sell
                        </h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                            {quickSellItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => addToCart(item)}
                                    className="group flex flex-col items-start rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 text-left transition duration-100 ease-linear hover:border-[#14B8A6]/50 hover:bg-[var(--pa-bg-elevated)]"
                                >
                                    <span className="text-2xl">{item.emoji}</span>
                                    <p className="mt-2 text-sm font-medium text-[var(--pa-text-primary)]">
                                        {item.name}
                                    </p>
                                    <span className="mt-1 text-sm font-semibold text-[#14B8A6]">
                                        {formatRand(item.price)}
                                    </span>
                                    <div className="mt-2 flex size-6 items-center justify-center rounded-full bg-[#14B8A6]/10 text-[#14B8A6] opacity-0 transition duration-100 ease-linear group-hover:opacity-100">
                                        <Plus className="size-3.5" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Student selector */}
                        <div className="mt-6">
                            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--pa-text-secondary)]">
                                Student
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {students.map((s, idx) => (
                                    <button
                                        key={s.name}
                                        onClick={() => setSelectedStudent(idx)}
                                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition duration-100 ease-linear ${
                                            selectedStudent === idx
                                                ? "border-2 border-[#14B8A6] bg-[#14B8A6]/10 text-[var(--pa-text-primary)]"
                                                : "border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] text-[var(--pa-text-secondary)] hover:border-[#14B8A6]/30"
                                        }`}
                                    >
                                        <div
                                            className="flex size-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                                            style={{ backgroundColor: s.membershipColor }}
                                        >
                                            {s.initials}
                                        </div>
                                        <span>{s.name}</span>
                                        {s.classesLeft !== null && (
                                            <span className="rounded-md bg-[var(--pa-bg-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--pa-text-muted)]">
                                                {s.classesLeft} left
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {/* Membership status */}
                            <div className="mt-3 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3">
                                <div className="flex items-center gap-2">
                                    <Users01 className="size-4 text-[#14B8A6]" />
                                    <span className="text-sm font-medium text-[var(--pa-text-primary)]">
                                        {students[selectedStudent].name}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-[var(--pa-text-secondary)]">
                                    {students[selectedStudent].membership}
                                    {students[selectedStudent].classesLeft !== null
                                        ? ` \u2014 ${students[selectedStudent].classesLeft} classes remaining`
                                        : " \u2014 Unlimited access"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column -- Order Summary */}
                    <div className="w-full lg:sticky lg:top-6 lg:w-[400px] lg:self-start">
                        <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <ShoppingCart01 className="size-5 text-[#14B8A6]" />
                                <h2 className="text-base font-semibold text-[var(--pa-text-primary)]">
                                    Order Summary
                                </h2>
                                {cart.length > 0 && (
                                    <span className="ml-auto rounded-full bg-[#14B8A6] px-2 py-0.5 text-xs font-medium text-white">
                                        {cart.reduce((s, c) => s + c.qty, 0)}
                                    </span>
                                )}
                            </div>

                            {/* Cart items */}
                            {cart.length === 0 ? (
                                <div className="py-8 text-center text-sm text-[var(--pa-text-muted)]">
                                    No items added yet. Tap a product to add it.
                                </div>
                            ) : (
                                <div className="max-h-[240px] space-y-2 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5"
                                        >
                                            <span className="text-lg">{item.emoji}</span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm text-[var(--pa-text-primary)]">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-[var(--pa-text-secondary)]">
                                                    {formatRand(item.price)} each
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => updateQty(item.id, -1)}
                                                    className="flex size-6 items-center justify-center rounded-md border border-[var(--pa-border-default)] text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)]"
                                                >
                                                    <Minus className="size-3" />
                                                </button>
                                                <span className="w-5 text-center text-sm font-medium text-[var(--pa-text-primary)]">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.id, 1)}
                                                    className="flex size-6 items-center justify-center rounded-md border border-[var(--pa-border-default)] text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)]"
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>
                                            <span className="w-16 text-right text-sm font-medium text-[var(--pa-text-primary)]">
                                                {formatRand(item.price * item.qty)}
                                            </span>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="flex size-5 items-center justify-center text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:text-[#DC2626]"
                                            >
                                                <XClose className="size-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Totals */}
                            <div className="mt-4 space-y-2 border-t border-[var(--pa-border-default)] pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--pa-text-secondary)]">Subtotal</span>
                                    <span className="text-[var(--pa-text-primary)]">{formatRand(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--pa-text-secondary)]">VAT (15%)</span>
                                    <span className="text-[var(--pa-text-primary)]">{formatRand(vat)}</span>
                                </div>
                                <div className="flex justify-between border-t border-[var(--pa-border-default)] pt-2 text-base font-semibold">
                                    <span className="text-[var(--pa-text-primary)]">Total</span>
                                    <span className="text-[#14B8A6]">{formatRand(grandTotal)}</span>
                                </div>
                            </div>

                            {/* Payment method */}
                            <div className="mt-4 border-t border-[var(--pa-border-default)] pt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--pa-text-secondary)]">
                                    Payment Method
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {paymentMethods.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setPaymentMethod(m.id)}
                                            className={`rounded-xl px-2 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                                paymentMethod === m.id
                                                    ? "bg-[#14B8A6] text-white"
                                                    : "border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] text-[var(--pa-text-secondary)] hover:border-[#14B8A6]/30"
                                            }`}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Process button */}
                            <button
                                disabled={cart.length === 0}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-3 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#0D9488] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <CreditCard01 className="size-4" />
                                Process Payment &middot; {formatRand(grandTotal)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
