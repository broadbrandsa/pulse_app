"use client";

import { useState } from "react";
import {
    Plus,
    Edit05,
    Users01,
    CurrencyDollar,
    RefreshCw01,
    TrendDown01,
    CheckCircle,
    Clock,
    Settings01,
    PauseCircle,
    XCircle,
} from "@untitledui/icons";

// ── Types ────────────────────────────────────────────────────────────────────

interface Membership {
    id: number;
    studentName: string;
    plan: string;
    monthlyFee: string;
    started: string;
    nextRenewal: string;
    status: "active" | "paused" | "cancelled";
}

interface MembershipPlan {
    id: number;
    name: string;
    price: string;
    billing: string;
    perks: string[];
    activeMembers: number;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const memberships: Membership[] = [
    { id: 1, studentName: "Lindiwe Maseko", plan: "Monthly Unlimited", monthlyFee: "R1,099", started: "2025-06-01", nextRenewal: "2026-04-01", status: "active" },
    { id: 2, studentName: "James van der Berg", plan: "Annual", monthlyFee: "R825", started: "2025-09-15", nextRenewal: "2026-09-15", status: "active" },
    { id: 3, studentName: "Priya Naidoo", plan: "Student", monthlyFee: "R699", started: "2026-01-10", nextRenewal: "2026-04-10", status: "active" },
    { id: 4, studentName: "Thabo Molefe", plan: "Monthly Unlimited", monthlyFee: "R1,099", started: "2025-11-01", nextRenewal: "2026-04-01", status: "active" },
    { id: 5, studentName: "Sarah Chen", plan: "Monthly Unlimited", monthlyFee: "R1,099", started: "2025-08-15", nextRenewal: "—", status: "paused" },
    { id: 6, studentName: "Zanele Dlamini", plan: "Student", monthlyFee: "R699", started: "2025-07-01", nextRenewal: "—", status: "cancelled" },
    { id: 7, studentName: "Michael Botha", plan: "Annual", monthlyFee: "R825", started: "2025-04-01", nextRenewal: "2026-04-01", status: "active" },
    { id: 8, studentName: "Fatima Osman", plan: "Monthly Unlimited", monthlyFee: "R1,099", started: "2026-02-01", nextRenewal: "2026-04-01", status: "active" },
];

const membershipPlans: MembershipPlan[] = [
    {
        id: 1,
        name: "Monthly Unlimited",
        price: "R1,099",
        billing: "per month",
        perks: ["Unlimited classes", "Priority booking (48h advance)", "1 free guest pass/month", "10% off workshops", "Mat storage included"],
        activeMembers: 28,
    },
    {
        id: 2,
        name: "Annual",
        price: "R9,900",
        billing: "per year (R825/mo)",
        perks: ["Unlimited classes", "Priority booking (72h advance)", "2 free guest passes/month", "20% off workshops", "Mat storage included", "1 free private session/quarter"],
        activeMembers: 12,
    },
    {
        id: 3,
        name: "Student",
        price: "R699",
        billing: "per month",
        perks: ["Unlimited classes", "Valid student ID required", "5% off workshops", "Access to all regular classes"],
        activeMembers: 7,
    },
];

// ── Tab types ────────────────────────────────────────────────────────────────

type TabKey = "active" | "paused" | "cancelled" | "plans";

const tabs: { key: TabKey; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "paused", label: "Paused" },
    { key: "cancelled", label: "Cancelled" },
    { key: "plans", label: "Membership Plans" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
    if (dateStr === "—") return "—";
    return new Date(dateStr).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function filterMemberships(tab: TabKey): Membership[] {
    if (tab === "plans") return [];
    return memberships.filter((m) => m.status === tab);
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string; icon: typeof CheckCircle }> = {
    active: { bg: "bg-[#22C55E]/15", text: "text-[#22C55E]", dot: "bg-[#22C55E]", label: "Active", icon: CheckCircle },
    paused: { bg: "bg-[#F59E0B]/15", text: "text-[#F59E0B]", dot: "bg-[#F59E0B]", label: "Paused", icon: PauseCircle },
    cancelled: { bg: "bg-[var(--pa-text-muted)]/15", text: "text-[var(--pa-text-muted)]", dot: "bg-[var(--pa-text-muted)]", label: "Cancelled", icon: XCircle },
};

// ── Page Component ───────────────────────────────────────────────────────────

export default function YogaMembershipsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("active");

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Memberships
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Manage student memberships and plan configurations
                        </p>
                    </div>
                    <button className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                        <Plus className="size-5" />
                        Add membership
                    </button>
                </div>

                {/* ── Stats Row ────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                                <Users01 className="size-5 text-[#14B8A6]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Active Members</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">47</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#22C55E]/15">
                                <CurrencyDollar className="size-5 text-[#22C55E]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">MRR</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">R51,653</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#3B82F6]/15">
                                <RefreshCw01 className="size-5 text-[#3B82F6]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Renewing This Month</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">12</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#EF4444]/15">
                                <TrendDown01 className="size-5 text-[#EF4444]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Churned</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">2</p>
                    </div>
                </div>

                {/* ── Tab Navigation ──────────────────────────────────── */}
                <div className="flex gap-1 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-1">
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
                {activeTab !== "plans" && <MembershipTableSection memberships={filterMemberships(activeTab)} />}
                {activeTab === "plans" && <MembershipPlansSection />}
            </div>
        </div>
    );
}

// ── Membership Table Section ─────────────────────────────────────────────────

function MembershipTableSection({ memberships: filtered }: { memberships: Membership[] }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
            {filtered.length > 0 ? (
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[var(--pa-border-default)] text-[var(--pa-text-secondary)]">
                            <th className="px-5 py-3.5 font-medium">Student</th>
                            <th className="px-5 py-3.5 font-medium">Plan</th>
                            <th className="px-5 py-3.5 font-medium">Monthly Fee</th>
                            <th className="px-5 py-3.5 font-medium">Started</th>
                            <th className="px-5 py-3.5 font-medium">Next Renewal</th>
                            <th className="px-5 py-3.5 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((m) => {
                            const sc = statusConfig[m.status];
                            return (
                                <tr
                                    key={m.id}
                                    className="border-b border-[var(--pa-border-default)] last:border-b-0"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex size-8 items-center justify-center rounded-full bg-[#14B8A6]/15 text-xs font-semibold text-[#14B8A6]">
                                                {m.studentName.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <span className="font-medium text-[var(--pa-text-primary)]">
                                                {m.studentName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-[#14B8A6]/10 px-2.5 py-0.5 text-xs font-medium text-[#14B8A6]">
                                            {m.plan}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-[var(--pa-text-primary)]">{m.monthlyFee}</td>
                                    <td className="px-5 py-4 text-[var(--pa-text-secondary)]">{formatDate(m.started)}</td>
                                    <td className="px-5 py-4 text-[var(--pa-text-secondary)]">{formatDate(m.nextRenewal)}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}>
                                            <span className={`size-1.5 rounded-full ${sc.dot}`} />
                                            {sc.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <div className="p-12 text-center">
                    <Users01 className="mx-auto size-8 text-[var(--pa-text-muted)]" />
                    <p className="mt-3 text-sm text-[var(--pa-text-muted)]">No memberships found</p>
                </div>
            )}
        </div>
    );
}

// ── Membership Plans Section ─────────────────────────────────────────────────

function MembershipPlansSection() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {membershipPlans.map((plan) => (
                    <div
                        key={plan.id}
                        className="relative overflow-hidden rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]"
                    >
                        <div className="h-1 w-full bg-gradient-to-r from-[#14B8A6] via-[#0EA5E9] to-[#6366F1]" />

                        <div className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-[var(--pa-text-primary)]">
                                        {plan.name}
                                    </h3>
                                    <p className="mt-1">
                                        <span className="text-2xl font-bold text-[#14B8A6]">{plan.price}</span>
                                        <span className="ml-1 text-xs text-[var(--pa-text-muted)]">{plan.billing}</span>
                                    </p>
                                </div>
                                <button className="rounded-lg p-2 text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-hover)] hover:text-[var(--pa-text-primary)]">
                                    <Edit05 className="size-4" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-2">
                                {plan.perks.map((perk, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle className="size-4 flex-shrink-0 text-[#22C55E]" />
                                        <span className="text-sm text-[var(--pa-text-secondary)]">{perk}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center gap-4 border-t border-[var(--pa-border-default)] pt-4">
                                <span className="flex items-center gap-1 text-xs text-[var(--pa-text-muted)]">
                                    <Users01 className="size-3.5" />
                                    {plan.activeMembers} active members
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Auto-renewal settings card */}
            <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                <div className="flex items-start gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                        <Settings01 className="size-5 text-[#14B8A6]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-[var(--pa-text-primary)]">
                            Auto-Renewal Settings
                        </h3>
                        <p className="mt-1 text-sm text-[var(--pa-text-secondary)]">
                            Memberships automatically renew 3 days before expiry. Students receive an email reminder 7 days and 1 day before renewal.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3">
                                <Clock className="size-4 text-[var(--pa-text-muted)]" />
                                <div>
                                    <p className="text-xs text-[var(--pa-text-muted)]">Renewal Window</p>
                                    <p className="text-sm font-medium text-[var(--pa-text-primary)]">3 days before expiry</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3">
                                <RefreshCw01 className="size-4 text-[var(--pa-text-muted)]" />
                                <div>
                                    <p className="text-xs text-[var(--pa-text-muted)]">Failed Payment Retries</p>
                                    <p className="text-sm font-medium text-[var(--pa-text-primary)]">3 attempts over 7 days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
