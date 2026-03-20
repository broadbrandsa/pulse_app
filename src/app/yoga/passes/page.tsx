"use client";

import { useState } from "react";
import {
    Plus,
    Edit05,
    Archive,
    Ticket01,
    Clock,
    Users01,
    CurrencyDollar,
    AlertTriangle,
    CheckCircle,
    ChevronDown,
} from "@untitledui/icons";

// ── Types ────────────────────────────────────────────────────────────────────

interface Pass {
    id: number;
    studentName: string;
    passType: string;
    totalClasses: number;
    usedClasses: number;
    purchaseDate: string;
    expiryDate: string;
    status: "active" | "expiring" | "expired";
}

interface PassProduct {
    id: number;
    name: string;
    classes: number | null;
    price: string;
    validDays: number;
    activePasses: number;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const passes: Pass[] = [
    { id: 1, studentName: "Lindiwe Maseko", passType: "10-Class Pass", totalClasses: 10, usedClasses: 7, purchaseDate: "2026-02-10", expiryDate: "2026-05-10", status: "active" },
    { id: 2, studentName: "James van der Berg", passType: "20-Class Pass", totalClasses: 20, usedClasses: 14, purchaseDate: "2026-01-15", expiryDate: "2026-07-15", status: "active" },
    { id: 3, studentName: "Priya Naidoo", passType: "5-Class Pass", totalClasses: 5, usedClasses: 4, purchaseDate: "2026-02-28", expiryDate: "2026-03-28", status: "expiring" },
    { id: 4, studentName: "Thabo Molefe", passType: "10-Class Pass", totalClasses: 10, usedClasses: 2, purchaseDate: "2026-03-01", expiryDate: "2026-06-01", status: "active" },
    { id: 5, studentName: "Sarah Chen", passType: "Drop-in", totalClasses: 1, usedClasses: 0, purchaseDate: "2026-03-18", expiryDate: "2026-03-25", status: "expiring" },
    { id: 6, studentName: "Zanele Dlamini", passType: "5-Class Pass", totalClasses: 5, usedClasses: 5, purchaseDate: "2026-01-05", expiryDate: "2026-02-05", status: "expired" },
    { id: 7, studentName: "Michael Botha", passType: "20-Class Pass", totalClasses: 20, usedClasses: 18, purchaseDate: "2025-12-01", expiryDate: "2026-06-01", status: "active" },
    { id: 8, studentName: "Fatima Osman", passType: "10-Class Pass", totalClasses: 10, usedClasses: 10, purchaseDate: "2025-11-15", expiryDate: "2026-02-15", status: "expired" },
    { id: 9, studentName: "Relebogile Phiri", passType: "5-Class Pass", totalClasses: 5, usedClasses: 3, purchaseDate: "2026-03-05", expiryDate: "2026-04-05", status: "active" },
    { id: 10, studentName: "David Kruger", passType: "Drop-in", totalClasses: 1, usedClasses: 1, purchaseDate: "2026-03-10", expiryDate: "2026-03-17", status: "expired" },
];

const passProducts: PassProduct[] = [
    { id: 1, name: "Drop-in", classes: 1, price: "R120", validDays: 7, activePasses: 5 },
    { id: 2, name: "5-Class Pass", classes: 5, price: "R550", validDays: 30, activePasses: 12 },
    { id: 3, name: "10-Class Pass", classes: 10, price: "R950", validDays: 90, activePasses: 22 },
    { id: 4, name: "20-Class Pass", classes: 20, price: "R1,600", validDays: 180, activePasses: 8 },
];

// ── Tab types ────────────────────────────────────────────────────────────────

type TabKey = "all" | "active" | "expiring" | "expired" | "products";

const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All Passes" },
    { key: "active", label: "Active" },
    { key: "expiring", label: "Expiring" },
    { key: "expired", label: "Expired" },
    { key: "products", label: "Pass Products" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function filterPasses(tab: TabKey): Pass[] {
    if (tab === "all" || tab === "products") return passes;
    return passes.filter((p) => p.status === tab);
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    active: { bg: "bg-[#22C55E]/15", text: "text-[#22C55E]", dot: "bg-[#22C55E]", label: "Active" },
    expiring: { bg: "bg-[#F59E0B]/15", text: "text-[#F59E0B]", dot: "bg-[#F59E0B]", label: "Expiring" },
    expired: { bg: "bg-[var(--pa-text-muted)]/15", text: "text-[var(--pa-text-muted)]", dot: "bg-[var(--pa-text-muted)]", label: "Expired" },
};

// ── Page Component ───────────────────────────────────────────────────────────

export default function YogaPassesPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("all");

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Class Passes
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Manage student passes and pass products
                        </p>
                    </div>
                    <button className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                        <Plus className="size-5" />
                        Create pass product
                    </button>
                </div>

                {/* ── Stats Row ────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                                <Ticket01 className="size-5 text-[#14B8A6]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Active Passes</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">47</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#F59E0B]/15">
                                <AlertTriangle className="size-5 text-[#F59E0B]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Expiring This Month</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">8</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#3B82F6]/15">
                                <Users01 className="size-5 text-[#3B82F6]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Avg Classes / Pass</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">6.2</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#22C55E]/15">
                                <CurrencyDollar className="size-5 text-[#22C55E]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Revenue</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">R18,050</p>
                    </div>
                </div>

                {/* ── Tab Navigation ──────────────────────────────────── */}
                <div className="flex gap-1 overflow-x-auto rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`min-h-[40px] flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                activeTab === tab.key
                                    ? "bg-[#14B8A6] text-white"
                                    : "text-[var(--pa-text-secondary)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ─────────────────────────────────────── */}
                {activeTab !== "products" && <PassListSection passes={filterPasses(activeTab)} />}
                {activeTab === "products" && <PassProductsSection />}
            </div>
        </div>
    );
}

// ── Pass List Section ────────────────────────────────────────────────────────

function PassListSection({ passes: filteredPasses }: { passes: Pass[] }) {
    return (
        <div className="space-y-3">
            {filteredPasses.map((pass) => {
                const remaining = pass.totalClasses - pass.usedClasses;
                const pct = Math.round((pass.usedClasses / pass.totalClasses) * 100);
                const sc = statusConfig[pass.status];

                return (
                    <div
                        key={pass.id}
                        className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5 transition duration-100 ease-linear hover:border-[var(--pa-border-subtle)]"
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            {/* Left: student + pass info */}
                            <div className="flex items-center gap-4">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#14B8A6]/15 text-sm font-semibold text-[#14B8A6]">
                                    {pass.studentName.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[var(--pa-text-primary)]">
                                        {pass.studentName}
                                    </p>
                                    <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">
                                        {pass.passType}
                                    </p>
                                </div>
                            </div>

                            {/* Middle: progress bar */}
                            <div className="flex-1 lg:max-w-xs lg:px-4">
                                <div className="flex items-center justify-between text-xs text-[var(--pa-text-muted)]">
                                    <span>{remaining} class{remaining !== 1 ? "es" : ""} remaining</span>
                                    <span>{pass.usedClasses}/{pass.totalClasses} used</span>
                                </div>
                                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--pa-bg-elevated)]">
                                    <div
                                        className="h-full rounded-full bg-[#14B8A6] transition-all duration-300"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>

                            {/* Right: dates + status */}
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="text-right text-xs text-[var(--pa-text-muted)]">
                                    <p>Purchased {formatDate(pass.purchaseDate)}</p>
                                    <p>Expires {formatDate(pass.expiryDate)}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}>
                                    <span className={`size-1.5 rounded-full ${sc.dot}`} />
                                    {sc.label}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {filteredPasses.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-12 text-center">
                    <Ticket01 className="mx-auto size-8 text-[var(--pa-text-muted)]" />
                    <p className="mt-3 text-sm text-[var(--pa-text-muted)]">No passes found</p>
                </div>
            )}
        </div>
    );
}

// ── Pass Products Section ────────────────────────────────────────────────────

function PassProductsSection() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {passProducts.map((product) => (
                <div
                    key={product.id}
                    className="relative overflow-hidden rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]"
                >
                    {/* Gradient top border */}
                    <div className="h-1 w-full bg-gradient-to-r from-[#14B8A6] via-[#0EA5E9] to-[#6366F1]" />

                    <div className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Ticket01 className="size-5 text-[#14B8A6]" />
                                    <h3 className="text-base font-semibold text-[var(--pa-text-primary)]">
                                        {product.name}
                                    </h3>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-[#14B8A6]">
                                    {product.price}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="rounded-lg p-2 text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-hover)] hover:text-[var(--pa-text-primary)]">
                                    <Edit05 className="size-4" />
                                </button>
                                <button className="rounded-lg p-2 text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[#F59E0B]/15 hover:text-[#F59E0B]">
                                    <Archive className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="size-4 flex-shrink-0 text-[#22C55E]" />
                                <span className="text-sm text-[var(--pa-text-secondary)]">
                                    {product.classes === 1 ? "Single class" : `${product.classes} classes included`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="size-4 flex-shrink-0 text-[var(--pa-text-muted)]" />
                                <span className="text-sm text-[var(--pa-text-secondary)]">
                                    Valid for {product.validDays} days
                                </span>
                            </div>
                        </div>

                        {/* Footer meta */}
                        <div className="mt-4 flex items-center gap-4 border-t border-[var(--pa-border-default)] pt-4">
                            <span className="flex items-center gap-1 text-xs text-[var(--pa-text-muted)]">
                                <Users01 className="size-3.5" />
                                {product.activePasses} active passes
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
