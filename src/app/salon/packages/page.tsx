"use client";

import { useState } from "react";
import {
    Gift01,
    Plus,
    Edit05,
    Trash01,
    Star01,
    Clock,
    CreditCard01,
    Tag01,
    XClose,
    ChevronDown,
    CheckCircle,
} from "@untitledui/icons";

// ── Types ────────────────────────────────────────────────────────────────────

interface ServiceItem {
    id: number;
    name: string;
    category: string;
    price: string;
    duration: string;
    description: string;
}

interface PackageItem {
    id: number;
    name: string;
    price: string;
    includes: string[];
    validDays: number;
    sold: number;
}

interface GiftCard {
    id: number;
    value: string;
    sold: number;
    redeemed: number;
    status: "active" | "inactive";
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const serviceMenu: ServiceItem[] = [
    { id: 1, name: "Box Braids", category: "Braiding", price: "R850", duration: "3h", description: "Classic box braids, any length" },
    { id: 2, name: "Knotless Braids", category: "Braiding", price: "R950", duration: "3.5h", description: "Knotless feed-in braids" },
    { id: 3, name: "Wash & Blow", category: "Styling", price: "R250", duration: "1h", description: "Shampoo, condition, and blow dry" },
    { id: 4, name: "Silk Press", category: "Styling", price: "R450", duration: "1.5h", description: "Flat iron press for natural hair" },
    { id: 5, name: "Full Colour", category: "Colour", price: "R650", duration: "2.5h", description: "Full head colour application" },
    { id: 6, name: "Highlights", category: "Colour", price: "R800", duration: "2h", description: "Foil highlights or balayage" },
    { id: 7, name: "Relaxer", category: "Treatment", price: "R400", duration: "2h", description: "Chemical relaxer application" },
    { id: 8, name: "Deep Treatment", category: "Treatment", price: "R350", duration: "45min", description: "Protein or moisture treatment" },
    { id: 9, name: "Locs Retwist", category: "Locs", price: "R350", duration: "1.5h", description: "Loc maintenance and retwist" },
    { id: 10, name: "Wig Install", category: "Styling", price: "R300", duration: "1h", description: "Wig fitting and styling" },
    { id: 11, name: "Trim", category: "Styling", price: "R150", duration: "30min", description: "Ends trim and shape" },
    { id: 12, name: "Cornrows", category: "Braiding", price: "R500", duration: "2h", description: "Straight-back or design cornrows" },
];

const packages: PackageItem[] = [
    { id: 1, name: "Bridal Package", price: "R2,500", includes: ["Trial Styling", "Wedding Day Hair", "2 Bridesmaid Styles"], validDays: 30, sold: 8 },
    { id: 2, name: "Monthly Maintenance", price: "R800/month", includes: ["1 Wash & Blow", "1 Treatment", "10% off products"], validDays: 30, sold: 24 },
    { id: 3, name: "New Client Special", price: "R500", includes: ["Wash & Blow", "Deep Treatment", "Style Consultation"], validDays: 14, sold: 42 },
    { id: 4, name: "Colour Package", price: "R1,200", includes: ["Full Colour", "Treatment", "Toner Refresh (4 weeks)"], validDays: 60, sold: 15 },
];

const giftCards: GiftCard[] = [
    { id: 1, value: "R500", sold: 12, redeemed: 8, status: "active" },
    { id: 2, value: "R1,000", sold: 6, redeemed: 4, status: "active" },
    { id: 3, value: "R2,000", sold: 3, redeemed: 1, status: "active" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const serviceCategories = Array.from(new Set(serviceMenu.map((s) => s.category)));

function groupByCategory(services: ServiceItem[]): Record<string, ServiceItem[]> {
    return services.reduce<Record<string, ServiceItem[]>>((acc, service) => {
        if (!acc[service.category]) acc[service.category] = [];
        acc[service.category].push(service);
        return acc;
    }, {});
}

const categoryColors: Record<string, string> = {
    Braiding: "#D946EF",
    Styling: "#3B82F6",
    Colour: "#F59E0B",
    Treatment: "#22C55E",
    Locs: "#8B5CF6",
};

// ── Tab types ────────────────────────────────────────────────────────────────

type TabKey = "services" | "packages" | "gift-cards";

const tabs: { key: TabKey; label: string }[] = [
    { key: "services", label: "Services" },
    { key: "packages", label: "Packages" },
    { key: "gift-cards", label: "Gift Cards" },
];

// ── Page Component ───────────────────────────────────────────────────────────

export default function SalonPackagesPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("services");

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Services &amp; Packages
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Manage your service menu, packages, and gift cards
                        </p>
                    </div>
                    <button className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#D946EF] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#C026D3]">
                        <Plus className="size-5" />
                        {activeTab === "services" && "Add Service"}
                        {activeTab === "packages" && "Add Package"}
                        {activeTab === "gift-cards" && "Create Gift Card"}
                    </button>
                </div>

                {/* ── Tab Navigation ──────────────────────────────────── */}
                <div className="flex gap-1 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`min-h-[40px] flex-1 rounded-lg px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                activeTab === tab.key
                                    ? "bg-[#D946EF] text-white"
                                    : "text-[var(--pa-text-secondary)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Services Tab ────────────────────────────────────── */}
                {activeTab === "services" && <ServicesSection />}

                {/* ── Packages Tab ────────────────────────────────────── */}
                {activeTab === "packages" && <PackagesSection />}

                {/* ── Gift Cards Tab ──────────────────────────────────── */}
                {activeTab === "gift-cards" && <GiftCardsSection />}
            </div>
        </div>
    );
}

// ── Services Section ─────────────────────────────────────────────────────────

function ServicesSection() {
    const grouped = groupByCategory(serviceMenu);

    return (
        <div className="space-y-6">
            {serviceCategories.map((category) => {
                const services = grouped[category];
                if (!services) return null;
                const catColor = categoryColors[category] ?? "#D946EF";

                return (
                    <div key={category}>
                        <div className="mb-3 flex items-center gap-2">
                            <span
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: catColor }}
                            />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--pa-text-secondary)]">
                                {category}
                            </h3>
                            <span className="text-xs text-[var(--pa-text-muted)]">
                                ({services.length})
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="group rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5 transition duration-100 ease-linear hover:border-[#3A3A3A]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-semibold text-[var(--pa-text-primary)]">
                                                {service.name}
                                            </h4>
                                            <p className="mt-1 text-xs text-[var(--pa-text-muted)]">
                                                {service.description}
                                            </p>
                                        </div>
                                        <div className="ml-3 flex items-center gap-1 opacity-0 transition duration-100 ease-linear group-hover:opacity-100">
                                            <button className="rounded-lg p-1.5 text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[#262626] hover:text-[var(--pa-text-primary)]">
                                                <Edit05 className="size-4" />
                                            </button>
                                            <button className="rounded-lg p-1.5 text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[#EF4444]/15 hover:text-[#EF4444]">
                                                <Trash01 className="size-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-3">
                                        <span
                                            className="text-lg font-bold"
                                            style={{ color: catColor }}
                                        >
                                            {service.price}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-[var(--pa-text-muted)]">
                                            <Clock className="size-3.5" />
                                            {service.duration}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Packages Section ─────────────────────────────────────────────────────────

function PackagesSection() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {packages.map((pkg) => (
                <div
                    key={pkg.id}
                    className="relative overflow-hidden rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]"
                >
                    {/* Gradient top border */}
                    <div className="h-1 w-full bg-gradient-to-r from-[#D946EF] via-[#A855F7] to-[#6366F1]" />

                    <div className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Star01 className="size-5 text-[#D946EF]" />
                                    <h3 className="text-base font-semibold text-[var(--pa-text-primary)]">
                                        {pkg.name}
                                    </h3>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-[#D946EF]">
                                    {pkg.price}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="rounded-lg p-2 text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[#262626] hover:text-[var(--pa-text-primary)]">
                                    <Edit05 className="size-4" />
                                </button>
                                <button className="rounded-lg p-2 text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[#EF4444]/15 hover:text-[#EF4444]">
                                    <Trash01 className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Includes */}
                        <div className="mt-4 space-y-2">
                            {pkg.includes.map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle className="size-4 flex-shrink-0 text-[#22C55E]" />
                                    <span className="text-sm text-[var(--pa-text-secondary)]">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer meta */}
                        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[var(--pa-border-default)] pt-4">
                            <span className="flex items-center gap-1 text-xs text-[var(--pa-text-muted)]">
                                <Clock className="size-3.5" />
                                Valid for {pkg.validDays} days
                            </span>
                            <span className="flex items-center gap-1 text-xs text-[var(--pa-text-muted)]">
                                <Tag01 className="size-3.5" />
                                {pkg.sold} sold
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Gift Cards Section ───────────────────────────────────────────────────────

function GiftCardsSection() {
    return (
        <div className="space-y-4">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#D946EF]/15">
                            <Gift01 className="size-5 text-[#D946EF]" />
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Total Sold</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">
                        {giftCards.reduce((sum, gc) => sum + gc.sold, 0)}
                    </p>
                </div>

                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#22C55E]/15">
                            <CheckCircle className="size-5 text-[#22C55E]" />
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Redeemed</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">
                        {giftCards.reduce((sum, gc) => sum + gc.redeemed, 0)}
                    </p>
                </div>

                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#3B82F6]/15">
                            <CreditCard01 className="size-5 text-[#3B82F6]" />
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Outstanding</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">
                        {giftCards.reduce((sum, gc) => sum + gc.sold - gc.redeemed, 0)}
                    </p>
                </div>
            </div>

            {/* Gift card denominations */}
            <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                    Gift Card Denominations
                </h2>

                <div className="mt-4 space-y-3">
                    {giftCards.map((gc) => {
                        const outstanding = gc.sold - gc.redeemed;
                        const redemptionRate = gc.sold > 0 ? Math.round((gc.redeemed / gc.sold) * 100) : 0;

                        return (
                            <div
                                key={gc.id}
                                className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-4"
                            >
                                {/* Value */}
                                <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#D946EF] to-[#A855F7]">
                                    <Gift01 className="size-6 text-white" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-lg font-bold text-[var(--pa-text-primary)]">
                                        {gc.value}
                                    </p>
                                    <p className="text-xs text-[var(--pa-text-muted)]">Gift Card</p>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-[var(--pa-text-primary)]">
                                            {gc.sold}
                                        </p>
                                        <p className="text-xs text-[var(--pa-text-muted)]">Sold</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-[#22C55E]">
                                            {gc.redeemed}
                                        </p>
                                        <p className="text-xs text-[var(--pa-text-muted)]">Redeemed</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-[#F59E0B]">
                                            {outstanding}
                                        </p>
                                        <p className="text-xs text-[var(--pa-text-muted)]">Outstanding</p>
                                    </div>
                                </div>

                                {/* Redemption bar */}
                                <div className="w-28">
                                    <div className="flex items-center justify-between text-xs text-[var(--pa-text-muted)]">
                                        <span>Redeemed</span>
                                        <span>{redemptionRate}%</span>
                                    </div>
                                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#262626]">
                                        <div
                                            className="h-full rounded-full bg-[#22C55E] transition-all duration-300"
                                            style={{ width: `${redemptionRate}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/15 px-2.5 py-0.5 text-xs font-medium text-[#22C55E]">
                                    <span className="size-1.5 rounded-full bg-[#22C55E]" />
                                    Active
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
