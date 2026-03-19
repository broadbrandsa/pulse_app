"use client";

import { useState, useMemo } from "react";
import { Plus, X, Check, SearchLg, CreditCard01, ShoppingCart01, Gift01, Activity } from "@untitledui/icons";
import { services, packages, products, clients } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { BottomSheet } from "@/components/layout/bottom-sheet";

type Tab = "services" | "packages" | "products" | "gift-cards";
type PaymentMethodType = "Card" | "EFT / Ozow" | "Cash" | "SnapScan";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    type: "service" | "package" | "product" | "gift-card";
}

const giftCards = [
    { name: "R250 Gift Card", price: 250 },
    { name: "R500 Gift Card", price: 500 },
    { name: "R1,000 Gift Card", price: 1000 },
    { name: "R2,000 Gift Card", price: 2000 },
];

export default function POSPage() {
    const [activeTab, setActiveTab] = useState<Tab>("services");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [showOrderSheet, setShowOrderSheet] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [clientSearch, setClientSearch] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [referralApplied, setReferralApplied] = useState<string | null>(null);
    const [referralError, setReferralError] = useState(false);
    const [paymentPlanEnabled, setPaymentPlanEnabled] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<2 | 3 | null>(null);

    const validReferralCodes = ["THANDO10", "PIETER22", "NALEDI5", "JACQUES7", "ZANELE9", "RUAN15", "AMAHLE3", "GERHARD8"];
    const referralDiscount = referralApplied ? 100 : 0;

    const tabs: { key: Tab; label: string }[] = [
        { key: "services", label: "Services" },
        { key: "packages", label: "Packages" },
        { key: "products", label: "Products" },
        { key: "gift-cards", label: "Gift Cards" },
    ];

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vat = Math.round(subtotal * 0.15);
    const totalBeforeDiscount = subtotal + vat;
    const total = Math.max(0, totalBeforeDiscount - referralDiscount);
    const loyaltyPointsEarned = Math.floor(total / 10);
    const firstInstallment = selectedPlan ? Math.ceil(total / selectedPlan) : total;

    const filteredClients = useMemo(() => {
        if (!clientSearch) return clients.slice(0, 8);
        return clients.filter((c) =>
            c.name.toLowerCase().includes(clientSearch.toLowerCase())
        );
    }, [clientSearch]);

    function addToCart(name: string, price: number, type: CartItem["type"]) {
        setCart((prev) => {
            const existing = prev.find((item) => item.name === name);
            if (existing) {
                return prev.map((item) =>
                    item.name === name ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { id: `cart-${Date.now()}`, name, price, quantity: 1, type }];
        });
    }

    function updateQuantity(name: string, delta: number) {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.name === name ? { ...item, quantity: item.quantity + delta } : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeFromCart(name: string) {
        setCart((prev) => prev.filter((item) => item.name !== name));
    }

    function processPayment() {
        if (!paymentMethod || cart.length === 0) return;
        setShowSuccess(true);
        setShowOrderSheet(false);
    }

    function resetTransaction() {
        setCart([]);
        setSelectedClient(null);
        setPaymentMethod(null);
        setShowSuccess(false);
        setSearchQuery("");
        setClientSearch("");
        setReferralCode("");
        setReferralApplied(null);
        setReferralError(false);
        setPaymentPlanEnabled(false);
        setSelectedPlan(null);
    }

    // Success state
    if (showSuccess) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E2F4A6]/10">
                    <Check className="size-10 text-[#E2F4A6]" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-[#FAFAFA]">Payment successful</h2>
                <p className="mt-2 text-lg text-[#A1A1AA]">{formatCurrency(total)}</p>
                {selectedClient && (
                    <p className="mt-1 text-sm text-[#A1A1AA]">
                        +{loyaltyPointsEarned} loyalty points earned
                    </p>
                )}
                <button
                    onClick={resetTransaction}
                    className="mt-8 rounded-2xl bg-[#5A4EFF] px-8 py-3 text-base font-medium text-white transition duration-100 ease-linear active:scale-95"
                >
                    New Transaction
                </button>
            </div>
        );
    }

    // Order summary content (shared between BottomSheet and desktop panel)
    const orderSummaryContent = (
        <div className="flex flex-col gap-4">
            {/* Client selector */}
            <div>
                <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Client</label>
                <div className="relative">
                    <SearchLg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A1A1AA]" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="w-full rounded-lg border border-[#262626] bg-[#111111] py-2.5 pl-9 pr-3 text-sm text-[#FAFAFA] placeholder:text-[#A1A1AA] focus:border-[#5A4EFF] focus:outline-none focus:ring-1 focus:ring-[#5A4EFF]"
                    />
                </div>
                {clientSearch && filteredClients.length > 0 && !selectedClient && (
                    <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-[#262626] bg-[#111111]">
                        {filteredClients.map((client) => (
                            <button
                                key={client.id}
                                onClick={() => {
                                    setSelectedClient(client.id);
                                    setClientSearch(client.name);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition duration-100 ease-linear hover:bg-[#161616]"
                            >
                                <InitialsAvatar initials={client.initials} src={client.avatarUrl} size="xs" />
                                <span className="text-[#FAFAFA]">{client.name}</span>
                                <StatusBadge variant={client.loyaltyTier.toLowerCase() as "bronze" | "silver" | "gold" | "platinum"}>
                                    {client.loyaltyTier}
                                </StatusBadge>
                            </button>
                        ))}
                    </div>
                )}
                {selectedClient && (
                    <div className="mt-2 flex items-center gap-2">
                        <InitialsAvatar
                            initials={clients.find((c) => c.id === selectedClient)?.initials || ""}
                            src={clients.find((c) => c.id === selectedClient)?.avatarUrl}
                            size="sm"
                        />
                        <span className="text-sm font-medium text-[#FAFAFA]">
                            {clients.find((c) => c.id === selectedClient)?.name}
                        </span>
                        <button
                            onClick={() => {
                                setSelectedClient(null);
                                setClientSearch("");
                            }}
                            className="ml-auto text-[#A1A1AA] transition duration-100 ease-linear hover:text-[#EF4444]"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Cart items */}
            <div>
                <h3 className="mb-2 text-sm font-medium text-[#FAFAFA]">Items ({cartCount})</h3>
                {cart.length === 0 ? (
                    <p className="py-4 text-center text-sm text-[#A1A1AA]">No items in cart</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {cart.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between rounded-lg border border-[#262626] bg-[#111111] px-3 py-2"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-[#FAFAFA]">{item.name}</p>
                                    <p className="text-xs text-[#A1A1AA]">{formatCurrency(item.price)} each</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.name, -1)}
                                        className="flex h-7 w-7 items-center justify-center rounded-md border border-[#262626] text-sm font-medium text-[#A1A1AA] transition duration-100 ease-linear active:scale-95"
                                    >
                                        -
                                    </button>
                                    <span className="w-6 text-center text-sm font-medium text-[#FAFAFA]">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.name, 1)}
                                        className="flex h-7 w-7 items-center justify-center rounded-md border border-[#262626] text-sm font-medium text-[#A1A1AA] transition duration-100 ease-linear active:scale-95"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.name)}
                                        className="ml-1 text-[#A1A1AA] transition duration-100 ease-linear hover:text-[#EF4444]"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Totals */}
            {cart.length > 0 && (
                <div className="border-t border-[#262626] pt-3">
                    <div className="flex justify-between text-sm text-[#A1A1AA]">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-sm text-[#A1A1AA]">
                        <span>VAT (15%)</span>
                        <span>{formatCurrency(vat)}</span>
                    </div>
                    {referralApplied && (
                        <div className="mt-1 flex justify-between text-sm text-[#E2F4A6]">
                            <span>Referral discount</span>
                            <span>-{formatCurrency(referralDiscount)}</span>
                        </div>
                    )}
                    <div className="mt-2 flex justify-between text-base font-semibold text-[#FAFAFA]">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    {selectedClient && (
                        <p className="mt-1 text-xs text-[#5A4EFF]">
                            +{loyaltyPointsEarned} loyalty points earned
                        </p>
                    )}
                </div>
            )}

            {/* Referral code */}
            {cart.length > 0 && (
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Referral Code</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. THANDO10"
                            value={referralCode}
                            onChange={(e) => {
                                setReferralCode(e.target.value.toUpperCase());
                                setReferralError(false);
                            }}
                            disabled={!!referralApplied}
                            className="flex-1 rounded-lg border border-[#262626] bg-[#111111] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#A1A1AA] focus:border-[#5A4EFF] focus:outline-none focus:ring-1 focus:ring-[#5A4EFF] disabled:opacity-50"
                        />
                        {referralApplied ? (
                            <button
                                onClick={() => {
                                    setReferralApplied(null);
                                    setReferralCode("");
                                }}
                                className="rounded-lg border border-[#262626] px-3 py-2.5 text-sm font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A]"
                            >
                                Remove
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (validReferralCodes.includes(referralCode.trim())) {
                                        setReferralApplied(referralCode.trim());
                                        setReferralError(false);
                                    } else {
                                        setReferralError(true);
                                    }
                                }}
                                disabled={!referralCode.trim()}
                                className="rounded-lg bg-[#5A4EFF] px-3 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Apply
                            </button>
                        )}
                    </div>
                    {referralApplied && (
                        <p className="mt-1.5 text-xs font-medium text-[#E2F4A6]">
                            Code {referralApplied} &mdash; R100 new client discount applied
                        </p>
                    )}
                    {referralError && (
                        <p className="mt-1.5 text-xs font-medium text-[#EF4444]">
                            Code not found
                        </p>
                    )}
                </div>
            )}

            {/* Payment methods */}
            {cart.length > 0 && (
                <div>
                    <h3 className="mb-2 text-sm font-medium text-[#FAFAFA]">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {(["Card", "EFT / Ozow", "Cash", "SnapScan"] as PaymentMethodType[]).map(
                            (method) => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-sm font-medium transition duration-100 ease-linear active:scale-95 ${
                                        paymentMethod === method
                                            ? "border-[#5A4EFF] bg-[#5A4EFF]/10 text-[#5A4EFF]"
                                            : "border-[#262626] bg-[#111111] text-[#A1A1AA] hover:border-[#333333]"
                                    }`}
                                >
                                    {method === "Card" && <CreditCard01 className="size-5" />}
                                    {method === "EFT / Ozow" && <Activity className="size-5" />}
                                    {method === "Cash" && <ShoppingCart01 className="size-5" />}
                                    {method === "SnapScan" && <Gift01 className="size-5" />}
                                    {method}
                                </button>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Payment plan */}
            {cart.length > 0 && total > 999 && (
                <div>
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-[#FAFAFA]">Payment Plan</h3>
                        <button
                            onClick={() => {
                                setPaymentPlanEnabled(!paymentPlanEnabled);
                                if (paymentPlanEnabled) setSelectedPlan(null);
                            }}
                            className={`relative h-6 w-11 rounded-full transition duration-100 ease-linear ${
                                paymentPlanEnabled ? "bg-[#5A4EFF]" : "bg-[#262626]"
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-100 ease-linear ${
                                    paymentPlanEnabled ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>
                    {paymentPlanEnabled && (
                        <div className="mt-2 flex flex-col gap-2">
                            <button
                                onClick={() => setSelectedPlan(2)}
                                className={`rounded-2xl border-2 px-4 py-3 text-left text-sm transition duration-100 ease-linear ${
                                    selectedPlan === 2
                                        ? "border-[#5A4EFF] bg-[#5A4EFF]/10 text-[#FAFAFA]"
                                        : "border-[#262626] bg-[#111111] text-[#A1A1AA] hover:border-[#333333]"
                                }`}
                            >
                                <span className="font-medium">2 payments:</span>{" "}
                                {formatCurrency(Math.ceil(total / 2))} now + {formatCurrency(Math.floor(total / 2))} in 30 days
                            </button>
                            <button
                                onClick={() => setSelectedPlan(3)}
                                className={`rounded-2xl border-2 px-4 py-3 text-left text-sm transition duration-100 ease-linear ${
                                    selectedPlan === 3
                                        ? "border-[#5A4EFF] bg-[#5A4EFF]/10 text-[#FAFAFA]"
                                        : "border-[#262626] bg-[#111111] text-[#A1A1AA] hover:border-[#333333]"
                                }`}
                            >
                                <span className="font-medium">3 payments:</span>{" "}
                                {formatCurrency(Math.ceil(total / 3))} now + {formatCurrency(Math.ceil(total / 3))} in 30 + 60 days
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Process payment button */}
            {cart.length > 0 && (
                <button
                    onClick={processPayment}
                    disabled={!paymentMethod}
                    className={`w-full rounded-2xl py-3.5 text-base font-medium transition duration-100 ease-linear active:scale-[0.98] ${
                        paymentMethod
                            ? "bg-[#5A4EFF] text-white hover:bg-[#4840E8]"
                            : "bg-[#262626] text-[#A1A1AA] cursor-not-allowed"
                    }`}
                >
                    {selectedPlan
                        ? `Process Payment \u2014 ${formatCurrency(firstInstallment)} (1st instalment)`
                        : `Process Payment${paymentMethod ? ` \u2014 ${formatCurrency(total)}` : ""}`
                    }
                </button>
            )}
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Left: service/product selection */}
            <div className="flex-1 lg:w-[60%]">
                {/* Search */}
                <div className="relative mb-4">
                    <SearchLg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A1A1AA]" />
                    <input
                        type="text"
                        placeholder="Search services, packages, products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-2xl border border-[#262626] bg-[#111111] py-2.5 pl-9 pr-3 text-sm text-[#FAFAFA] placeholder:text-[#A1A1AA] focus:border-[#5A4EFF] focus:outline-none focus:ring-1 focus:ring-[#5A4EFF]"
                    />
                </div>

                {/* Tab row */}
                <div className="mb-4 flex gap-1 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                activeTab === tab.key
                                    ? "bg-[#5A4EFF] text-white"
                                    : "bg-[#1A1A1A] text-[#A1A1AA] hover:bg-[#262626]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Services grid */}
                {activeTab === "services" && (
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                        {services
                            .filter((s) =>
                                s.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((service) => (
                                <button
                                    key={service.name}
                                    onClick={() => addToCart(service.name, service.price, "service")}
                                    className="flex min-h-[80px] flex-col items-start justify-between rounded-2xl border border-[#262626] bg-[#111111] p-3 text-left transition duration-100 ease-linear active:scale-[0.97] hover:border-[#5A4EFF]/30 hover:shadow-sm"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-[#FAFAFA]">{service.name}</p>
                                        <p className="mt-0.5 text-sm font-semibold text-[#5A4EFF]">
                                            {formatCurrency(service.price)}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex h-7 w-7 items-center justify-center self-end rounded-full bg-[#5A4EFF]/10 text-[#5A4EFF]">
                                        <Plus className="size-4" />
                                    </div>
                                </button>
                            ))}
                    </div>
                )}

                {/* Packages grid */}
                {activeTab === "packages" && (
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        {packages
                            .filter((p) =>
                                p.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((pkg) => (
                                <button
                                    key={pkg.name}
                                    onClick={() => addToCart(pkg.name, pkg.price, "package")}
                                    className="flex min-h-[80px] items-center justify-between rounded-2xl border border-[#262626] bg-[#111111] p-4 text-left transition duration-100 ease-linear active:scale-[0.97] hover:border-[#5A4EFF]/30 hover:shadow-sm"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-[#FAFAFA]">{pkg.name}</p>
                                        <p className="mt-0.5 text-xs text-[#A1A1AA]">{pkg.description}</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-sm font-semibold text-[#5A4EFF]">
                                                {formatCurrency(pkg.price)}
                                            </span>
                                            {pkg.originalPrice > pkg.price && (
                                                <span className="text-xs text-[#A1A1AA] line-through">
                                                    {formatCurrency(pkg.originalPrice)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#5A4EFF]/10 text-[#5A4EFF]">
                                        <Plus className="size-4" />
                                    </div>
                                </button>
                            ))}
                    </div>
                )}

                {/* Products list */}
                {activeTab === "products" && (
                    <div className="flex flex-col gap-2">
                        {products
                            .filter((p) =>
                                p.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between rounded-2xl border border-[#262626] bg-[#111111] px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-[#FAFAFA]">{product.name}</p>
                                        <div className="mt-0.5 flex items-center gap-2">
                                            <span className="text-sm font-semibold text-[#5A4EFF]">
                                                {formatCurrency(product.price)}
                                            </span>
                                            <StatusBadge variant={product.stock > product.reorderLevel ? "success" : "warning"}>
                                                {product.stock} in stock
                                            </StatusBadge>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product.name, product.price, "product")}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5A4EFF]/10 text-[#5A4EFF] transition duration-100 ease-linear active:scale-95"
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                </div>
                            ))}
                    </div>
                )}

                {/* Gift cards grid */}
                {activeTab === "gift-cards" && (
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                        {giftCards.map((gc) => (
                            <button
                                key={gc.name}
                                onClick={() => addToCart(gc.name, gc.price, "gift-card")}
                                className="flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-2xl border border-[#262626] bg-[#111111] p-4 text-center transition duration-100 ease-linear active:scale-[0.97] hover:border-[#5A4EFF]/30 hover:shadow-sm"
                            >
                                <Gift01 className="size-6 text-[#5A4EFF]" />
                                <p className="text-sm font-semibold text-[#FAFAFA]">{gc.name}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Order summary (desktop only) */}
            <div className="hidden lg:block lg:w-[40%]">
                <div className="sticky top-4 rounded-2xl border border-[#262626] bg-[#111111] p-5">
                    <h2 className="mb-4 text-lg font-semibold text-[#FAFAFA]">Order Summary</h2>
                    {orderSummaryContent}
                </div>
            </div>

            {/* Mobile persistent order bar */}
            {cart.length > 0 && (
                <button
                    onClick={() => setShowOrderSheet(true)}
                    className="fixed bottom-16 left-0 right-0 z-40 flex items-center justify-between bg-[#5A4EFF] px-4 py-3 text-white rounded-t-xl lg:hidden"
                >
                    <div className="flex items-center gap-2">
                        <ShoppingCart01 className="size-5" />
                        <span className="text-sm font-medium">
                            {cartCount} {cartCount === 1 ? "item" : "items"} &middot; {formatCurrency(total)}
                        </span>
                    </div>
                    <span className="text-sm font-medium">Checkout &rarr;</span>
                </button>
            )}

            {/* Mobile order summary BottomSheet */}
            <BottomSheet
                isOpen={showOrderSheet}
                onClose={() => setShowOrderSheet(false)}
                title="Order Summary"
            >
                <div className="max-h-[70vh] overflow-y-auto">
                    {orderSummaryContent}
                </div>
            </BottomSheet>
        </div>
    );
}
