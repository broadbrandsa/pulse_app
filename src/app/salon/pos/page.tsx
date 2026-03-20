"use client";

import { useState, useMemo } from "react";
import {
    CreditCard01,
    ShoppingCart01,
    Plus,
    Minus,
    XClose,
    Check,
    Star01,
} from "@untitledui/icons";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type Category = "All" | "Hair" | "Colour" | "Treatment" | "Products";
type PaymentMethod = "cash" | "card" | "eft" | "split";
type TipMode = "preset" | "percent" | "custom";

interface ServiceItem {
    id: string;
    name: string;
    price: number;
    duration: string;
    category: string;
    emoji: string;
}

interface CartItem extends ServiceItem {
    qty: number;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                           */
/* ------------------------------------------------------------------ */

const salonServices: ServiceItem[] = [
    { id: "braids", name: "Box Braids", price: 850, duration: "3h", category: "Hair", emoji: "\uD83D\uDC86\u200D\u2640\uFE0F" },
    { id: "wash", name: "Wash & Blow", price: 250, duration: "1h", category: "Hair", emoji: "\uD83D\uDCA7" },
    { id: "colour", name: "Full Colour", price: 650, duration: "2.5h", category: "Colour", emoji: "\uD83C\uDFA8" },
    { id: "highlights", name: "Highlights", price: 800, duration: "2h", category: "Colour", emoji: "\u2728" },
    { id: "relaxer", name: "Relaxer", price: 400, duration: "2h", category: "Treatment", emoji: "\uD83D\uDC86" },
    { id: "treatment", name: "Deep Treatment", price: 350, duration: "45min", category: "Treatment", emoji: "\uD83E\uDDF4" },
    { id: "trim", name: "Trim", price: 150, duration: "30min", category: "Hair", emoji: "\u2702\uFE0F" },
    { id: "silk", name: "Silk Press", price: 450, duration: "1.5h", category: "Hair", emoji: "\uD83D\uDC81\u200D\u2640\uFE0F" },
    { id: "locs", name: "Locs Retwist", price: 350, duration: "1.5h", category: "Hair", emoji: "\uD83D\uDD04" },
    { id: "wig", name: "Wig Install", price: 300, duration: "1h", category: "Hair", emoji: "\uD83D\uDC71\u200D\u2640\uFE0F" },
];

const products: ServiceItem[] = [
    { id: "p1", name: "ORS Olive Oil Relaxer", price: 120, category: "Products", emoji: "\uD83E\uDED2", duration: "" },
    { id: "p2", name: "Cantu Shea Butter", price: 95, category: "Products", emoji: "\uD83E\uDDC8", duration: "" },
    { id: "p3", name: "Dark & Lovely Colour", price: 85, category: "Products", emoji: "\uD83C\uDFA8", duration: "" },
    { id: "p4", name: "Eco Styler Gel", price: 65, category: "Products", emoji: "\uD83D\uDC85", duration: "" },
];

const allItems = [...salonServices, ...products];

const stylists = [
    { name: "Naledi", initials: "NM", color: "#D946EF" },
    { name: "Zinhle", initials: "ZN", color: "#3B82F6" },
    { name: "Buhle", initials: "BM", color: "#F59E0B" },
];

const categories: Category[] = ["All", "Hair", "Colour", "Treatment", "Products"];

const presetTips = [20, 50, 100];
const percentTips = [10, 15, 20];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatRand(amount: number): string {
    return `R${amount.toLocaleString("en-ZA")}`;
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function SalonPOSPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedStylist, setSelectedStylist] = useState(0);
    const [tipMode, setTipMode] = useState<TipMode>("preset");
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
    const [selectedPercent, setSelectedPercent] = useState<number | null>(null);
    const [customTip, setCustomTip] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

    // Filtered items
    const filteredItems = useMemo(() => {
        if (activeCategory === "All") return allItems;
        return allItems.filter((item) => item.category === activeCategory);
    }, [activeCategory]);

    // Cart helpers
    function addToCart(item: ServiceItem) {
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

    const tipAmount = useMemo(() => {
        if (tipMode === "preset" && selectedPreset !== null) return selectedPreset;
        if (tipMode === "percent" && selectedPercent !== null)
            return Math.round(subtotal * (selectedPercent / 100));
        if (tipMode === "custom" && customTip) return Number(customTip) || 0;
        return 0;
    }, [tipMode, selectedPreset, selectedPercent, customTip, subtotal]);

    const vat = Math.round(subtotal * 0.15);
    const grandTotal = subtotal + vat + tipAmount;

    const paymentMethods: { id: PaymentMethod; label: string }[] = [
        { id: "cash", label: "Cash" },
        { id: "card", label: "Card" },
        { id: "eft", label: "EFT" },
        { id: "split", label: "Split" },
    ];

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px]">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                        Point of Sale
                    </h1>
                    <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                        Ring up services and products
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* ── Left Column — Service Selection ─────────────────── */}
                    <div className="flex-1 space-y-4">
                        {/* Category pills */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition duration-100 ease-linear ${
                                        activeCategory === cat
                                            ? "bg-[#D946EF] text-white"
                                            : "border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] text-[var(--pa-text-secondary)] hover:border-[#D946EF]/50 hover:text-[var(--pa-text-primary)]"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Service grid */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                            {filteredItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => addToCart(item)}
                                    className="group flex flex-col items-start rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 text-left transition duration-100 ease-linear hover:border-[#D946EF]/50 hover:bg-[var(--pa-bg-elevated)]"
                                >
                                    <span className="text-2xl">{item.emoji}</span>
                                    <p className="mt-2 text-sm font-medium text-[var(--pa-text-primary)]">
                                        {item.name}
                                    </p>
                                    <div className="mt-1 flex w-full items-center justify-between">
                                        <span className="text-sm font-semibold text-[#D946EF]">
                                            {formatRand(item.price)}
                                        </span>
                                        {item.duration && (
                                            <span className="text-xs text-[var(--pa-text-muted)]">
                                                {item.duration}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex size-6 items-center justify-center rounded-full bg-[#D946EF]/10 text-[#D946EF] opacity-0 transition duration-100 ease-linear group-hover:opacity-100">
                                        <Plus className="size-3.5" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Right Column — Order Summary ────────────────────── */}
                    <div className="w-full lg:sticky lg:top-6 lg:w-[400px] lg:self-start">
                        <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <ShoppingCart01 className="size-5 text-[#D946EF]" />
                                <h2 className="text-base font-semibold text-[var(--pa-text-primary)]">
                                    Order Summary
                                </h2>
                                {cart.length > 0 && (
                                    <span className="ml-auto rounded-full bg-[#D946EF] px-2 py-0.5 text-xs font-medium text-white">
                                        {cart.reduce((s, c) => s + c.qty, 0)}
                                    </span>
                                )}
                            </div>

                            {/* Cart items */}
                            {cart.length === 0 ? (
                                <div className="py-8 text-center text-sm text-[var(--pa-text-muted)]">
                                    No items added yet. Tap a service to add it.
                                </div>
                            ) : (
                                <div className="max-h-[240px] space-y-2 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5"
                                        >
                                            <span className="text-lg">{item.emoji}</span>
                                            <div className="flex-1 min-w-0">
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

                            {/* Stylist selector */}
                            <div className="mt-4 border-t border-[var(--pa-border-default)] pt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--pa-text-secondary)]">
                                    Stylist
                                </p>
                                <div className="flex gap-2">
                                    {stylists.map((s, idx) => (
                                        <button
                                            key={s.name}
                                            onClick={() => setSelectedStylist(idx)}
                                            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition duration-100 ease-linear ${
                                                selectedStylist === idx
                                                    ? "border-2 border-[#D946EF] bg-[#D946EF]/10 text-[var(--pa-text-primary)]"
                                                    : "border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] text-[var(--pa-text-secondary)] hover:border-[#D946EF]/30"
                                            }`}
                                        >
                                            <div
                                                className="flex size-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                                                style={{ backgroundColor: s.color }}
                                            >
                                                {s.initials}
                                            </div>
                                            {s.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tip section */}
                            <div className="mt-4 border-t border-[var(--pa-border-default)] pt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--pa-text-secondary)]">
                                    Tip for {stylists[selectedStylist].name}
                                </p>

                                {/* Tip mode toggle */}
                                <div className="mb-3 flex gap-1 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-0.5">
                                    <button
                                        onClick={() => {
                                            setTipMode("preset");
                                            setSelectedPercent(null);
                                            setCustomTip("");
                                        }}
                                        className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition duration-100 ease-linear ${
                                            tipMode === "preset"
                                                ? "bg-[var(--pa-border-default)] text-[var(--pa-text-primary)]"
                                                : "text-[var(--pa-text-muted)]"
                                        }`}
                                    >
                                        Amount
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTipMode("percent");
                                            setSelectedPreset(null);
                                            setCustomTip("");
                                        }}
                                        className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition duration-100 ease-linear ${
                                            tipMode === "percent"
                                                ? "bg-[var(--pa-border-default)] text-[var(--pa-text-primary)]"
                                                : "text-[var(--pa-text-muted)]"
                                        }`}
                                    >
                                        Percent
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTipMode("custom");
                                            setSelectedPreset(null);
                                            setSelectedPercent(null);
                                        }}
                                        className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition duration-100 ease-linear ${
                                            tipMode === "custom"
                                                ? "bg-[var(--pa-border-default)] text-[var(--pa-text-primary)]"
                                                : "text-[var(--pa-text-muted)]"
                                        }`}
                                    >
                                        Custom
                                    </button>
                                </div>

                                {/* Tip options */}
                                {tipMode === "preset" && (
                                    <div className="flex gap-2">
                                        {presetTips.map((amount) => (
                                            <button
                                                key={amount}
                                                onClick={() =>
                                                    setSelectedPreset(
                                                        selectedPreset === amount ? null : amount
                                                    )
                                                }
                                                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                                    selectedPreset === amount
                                                        ? "bg-[#D946EF] text-white"
                                                        : "border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] text-[var(--pa-text-secondary)] hover:border-[#D946EF]/30"
                                                }`}
                                            >
                                                R{amount}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {tipMode === "percent" && (
                                    <div className="flex gap-2">
                                        {percentTips.map((pct) => (
                                            <button
                                                key={pct}
                                                onClick={() =>
                                                    setSelectedPercent(
                                                        selectedPercent === pct ? null : pct
                                                    )
                                                }
                                                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                                    selectedPercent === pct
                                                        ? "bg-[#D946EF] text-white"
                                                        : "border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] text-[var(--pa-text-secondary)] hover:border-[#D946EF]/30"
                                                }`}
                                            >
                                                {pct}%
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {tipMode === "custom" && (
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--pa-text-muted)]">
                                            R
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={customTip}
                                            onChange={(e) => setCustomTip(e.target.value)}
                                            placeholder="0"
                                            className="w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] py-2 pl-7 pr-3 text-sm text-[var(--pa-text-primary)] outline-none placeholder:text-[var(--pa-text-muted)] focus:border-[#D946EF]"
                                        />
                                    </div>
                                )}
                            </div>

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
                                {tipAmount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--pa-text-secondary)]">
                                            Tip ({stylists[selectedStylist].name})
                                        </span>
                                        <span className="text-[#22C55E]">
                                            {formatRand(tipAmount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-[var(--pa-border-default)] pt-2 text-base font-semibold">
                                    <span className="text-[var(--pa-text-primary)]">Grand Total</span>
                                    <span className="text-[#D946EF]">
                                        {formatRand(grandTotal)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment method */}
                            <div className="mt-4 border-t border-[var(--pa-border-default)] pt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--pa-text-secondary)]">
                                    Payment Method
                                </p>
                                <div className="grid grid-cols-4 gap-2">
                                    {paymentMethods.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setPaymentMethod(m.id)}
                                            className={`rounded-xl px-2 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                                paymentMethod === m.id
                                                    ? "bg-[#D946EF] text-white"
                                                    : "border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] text-[var(--pa-text-secondary)] hover:border-[#D946EF]/30"
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
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D946EF] px-4 py-3 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#C026D3] disabled:cursor-not-allowed disabled:opacity-40"
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
