"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Mail01,
    Phone01,
    Calendar,
    ArrowLeft,
    Edit01,
    Star01,
    Activity,
    Check,
} from "@untitledui/icons";
import { clients, loyaltyTiers } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { MembershipStatus, LoyaltyTier } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { InitialsAvatar } from "@/components/ui/initials-avatar";

const membershipStatusVariant: Record<MembershipStatus, "success" | "warning" | "danger" | "info"> = {
    Active: "success",
    "Expiring Soon": "warning",
    Lapsed: "danger",
    Trial: "info",
};

const loyaltyTierVariant: Record<LoyaltyTier, "bronze" | "silver" | "gold" | "platinum"> = {
    Bronze: "bronze",
    Silver: "silver",
    Gold: "gold",
    Platinum: "platinum",
};

type TabKey = "overview" | "sessions" | "payments" | "progress" | "notes";

const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "sessions", label: "Sessions" },
    { key: "payments", label: "Payments" },
    { key: "progress", label: "Progress" },
    { key: "notes", label: "Notes" },
];

const mockSessions = [
    { date: "2025-04-18", service: "Personal Training", duration: 60, status: "Completed" },
    { date: "2025-04-15", service: "Group HIIT", duration: 45, status: "Completed" },
    { date: "2025-04-12", service: "Personal Training", duration: 60, status: "Completed" },
    { date: "2025-04-10", service: "Yoga Flow", duration: 60, status: "Completed" },
    { date: "2025-04-07", service: "Personal Training", duration: 60, status: "Completed" },
    { date: "2025-04-04", service: "Boxing Conditioning", duration: 60, status: "Completed" },
    { date: "2025-04-01", service: "Personal Training", duration: 60, status: "Cancelled" },
    { date: "2025-03-28", service: "Fitness Assessment", duration: 90, status: "Completed" },
];

const mockPayments = [
    { date: "2025-04-18", description: "Personal Training Session", amount: 350, method: "Card", receipt: "INV-0412" },
    { date: "2025-04-15", description: "Group HIIT Class", amount: 120, method: "SnapScan", receipt: "INV-0398" },
    { date: "2025-04-12", description: "Personal Training Session", amount: 350, method: "Card", receipt: "INV-0385" },
    { date: "2025-04-01", description: "Monthly Membership", amount: 800, method: "EFT / Ozow", receipt: "INV-0361" },
    { date: "2025-03-15", description: "Whey Protein 2kg", amount: 599, method: "Card", receipt: "INV-0340" },
    { date: "2025-03-01", description: "Monthly Membership", amount: 800, method: "EFT / Ozow", receipt: "INV-0318" },
];

const weightData = [92, 90, 88, 87, 86, 85];
const weightMonths = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [activeTab, setActiveTab] = useState<TabKey>("overview");

    const client = clients.find((c) => c.id === id);

    if (!client) {
        return (
            <div className="flex min-h-[400px] items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-lg font-semibold text-[#FAFAFA]">Client not found</p>
                    <p className="mt-1 text-sm text-[#A1A1AA]">The client you are looking for does not exist.</p>
                    <button
                        onClick={() => router.push("/clients")}
                        className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8]"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Clients
                    </button>
                </div>
            </div>
        );
    }

    const currentTier = loyaltyTiers.find((t) => t.name === client.loyaltyTier);
    const nextTierIndex = loyaltyTiers.findIndex((t) => t.name === client.loyaltyTier) + 1;
    const nextTier = nextTierIndex < loyaltyTiers.length ? loyaltyTiers[nextTierIndex] : null;
    const loyaltyProgress = nextTier
        ? Math.min(100, ((client.loyaltyPoints - (currentTier?.minPoints ?? 0)) / (nextTier.minPoints - (currentTier?.minPoints ?? 0))) * 100)
        : 100;

    return (
        <div className="min-h-screen bg-[#111111] pb-36 lg:pb-6">
            {/* Back button */}
            <div className="px-4 pt-4 lg:px-6">
                <button
                    onClick={() => router.push("/clients")}
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-[#A1A1AA] transition duration-100 ease-linear hover:text-[#FAFAFA]"
                >
                    <ArrowLeft className="size-4" />
                    Back to Clients
                </button>
            </div>

            {/* Top Section */}
            <div className="mt-4 px-4 lg:px-6">
                <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                    {/* Mobile: centered stack / Desktop: horizontal */}
                    <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left">
                        <InitialsAvatar initials={client.initials} src={client.avatarUrl} size="xl" />

                        <div className="mt-3 lg:ml-4 lg:mt-0 lg:flex-1">
                            <h1 className="text-xl font-semibold text-[#FAFAFA] lg:text-2xl">{client.name}</h1>
                            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
                                <StatusBadge variant={membershipStatusVariant[client.membershipStatus]} dot>
                                    {client.membershipStatus}
                                </StatusBadge>
                                <StatusBadge variant="info">{client.membershipType}</StatusBadge>
                                <StatusBadge variant={loyaltyTierVariant[client.loyaltyTier]}>
                                    {client.loyaltyTier}
                                </StatusBadge>
                            </div>
                            <div className="mt-3 flex flex-col items-center gap-2 text-sm text-[#A1A1AA] lg:flex-row lg:gap-4">
                                <span className="inline-flex items-center gap-1.5">
                                    <Mail01 className="size-4 text-[#A1A1AA]" />
                                    {client.email}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Phone01 className="size-4 text-[#A1A1AA]" />
                                    {client.phone}
                                </span>
                            </div>
                        </div>

                        {/* Desktop-only action buttons */}
                        <div className="hidden items-center gap-2 lg:flex">
                            <button className="inline-flex items-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#4840E8]">
                                <Calendar className="size-4" />
                                Book Session
                            </button>
                            <button className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#111111] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] transition duration-100 ease-linear hover:bg-[#1A1A1A]">
                                <Mail01 className="size-4" />
                                Message
                            </button>
                        </div>
                    </div>

                    {/* Stats Strip */}
                    <div className="mt-5 flex gap-3 overflow-x-auto pb-1 snap-x lg:grid lg:grid-cols-4 lg:overflow-visible">
                        <div className="min-w-[120px] snap-start rounded-lg bg-[#0A0A0A] p-3 lg:min-w-0">
                            <p className="text-xs text-[#A1A1AA]">Total Sessions</p>
                            <p className="mt-1 text-lg font-semibold text-[#FAFAFA]">42</p>
                        </div>
                        <div className="min-w-[120px] snap-start rounded-lg bg-[#0A0A0A] p-3 lg:min-w-0">
                            <p className="text-xs text-[#A1A1AA]">Total Spend</p>
                            <p className="mt-1 text-lg font-semibold text-[#FAFAFA]">{formatCurrency(client.totalSpend)}</p>
                        </div>
                        <div className="min-w-[120px] snap-start rounded-lg bg-[#0A0A0A] p-3 lg:min-w-0">
                            <p className="text-xs text-[#A1A1AA]">Member Since</p>
                            <p className="mt-1 text-lg font-semibold text-[#FAFAFA]">{formatDate(client.joinDate)}</p>
                        </div>
                        <div className="min-w-[120px] snap-start rounded-lg bg-[#0A0A0A] p-3 lg:min-w-0">
                            <p className="text-xs text-[#A1A1AA]">Last Visit</p>
                            <p className="mt-1 text-lg font-semibold text-[#FAFAFA]">{formatDate(client.lastVisit)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-4 border-b border-[#262626] px-4 lg:px-6">
                <div className="flex gap-0 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`min-h-[44px] whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition duration-100 ease-linear ${
                                activeTab === tab.key
                                    ? "border-[#5A4EFF] text-[#FAFAFA]"
                                    : "border-transparent text-[#A1A1AA] hover:text-[#A1A1AA]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="mt-4 px-4 lg:px-6">
                {/* ===== OVERVIEW ===== */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                        {/* Goals */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-sm font-medium text-[#A1A1AA]">Goals</h3>
                            <ul className="mt-3 space-y-2">
                                {client.goals.map((goal, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-[#FAFAFA]">
                                        <Check className="size-4 shrink-0 text-[#5A4EFF]" />
                                        {goal}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Membership Details */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-sm font-medium text-[#A1A1AA]">Membership Details</h3>
                            <div className="mt-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#A1A1AA]">Type</span>
                                    <span className="text-sm font-medium text-[#FAFAFA]">{client.membershipType}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#A1A1AA]">Status</span>
                                    <StatusBadge variant={membershipStatusVariant[client.membershipStatus]} dot>
                                        {client.membershipStatus}
                                    </StatusBadge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#A1A1AA]">Member Since</span>
                                    <span className="text-sm font-medium text-[#FAFAFA]">{formatDate(client.joinDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Loyalty */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:col-span-2 lg:p-6">
                            <h3 className="text-sm font-medium text-[#A1A1AA]">Loyalty Programme</h3>
                            <div className="mt-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#A1A1AA]">Points</span>
                                    <span className="text-sm font-semibold text-[#FAFAFA]">{client.loyaltyPoints.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#A1A1AA]">Tier</span>
                                    <StatusBadge variant={loyaltyTierVariant[client.loyaltyTier]}>
                                        {client.loyaltyTier}
                                    </StatusBadge>
                                </div>
                                {nextTier && (
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                                            <span>Progress to {nextTier.name}</span>
                                            <span>{Math.round(loyaltyProgress)}%</span>
                                        </div>
                                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#1A1A1A]">
                                            <div
                                                className="h-full rounded-full bg-[#5A4EFF] transition-all duration-300"
                                                style={{ width: `${loyaltyProgress}%` }}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-[#A1A1AA]">
                                            {nextTier.minPoints - client.loyaltyPoints} points to {nextTier.name}
                                        </p>
                                    </div>
                                )}
                                {!nextTier && (
                                    <p className="text-xs text-[#5A4EFF]">Maximum tier reached</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== SESSIONS ===== */}
                {activeTab === "sessions" && (
                    <>
                        {/* Mobile cards */}
                        <div className="space-y-3 lg:hidden">
                            {mockSessions.map((session, i) => (
                                <div key={i} className="rounded-2xl border border-[#262626] bg-[#111111] p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#FAFAFA]">{session.service}</span>
                                        <StatusBadge variant={session.status === "Completed" ? "success" : "danger"} dot>
                                            {session.status}
                                        </StatusBadge>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-xs text-[#A1A1AA]">
                                        <span>{formatDate(session.date)}</span>
                                        <span>{session.duration} min</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto rounded-2xl border border-[#262626] lg:block">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#262626] bg-[#0A0A0A]">
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Service</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Duration</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockSessions.map((session, i) => (
                                        <tr key={i} className="border-b border-[#262626] bg-[#111111]">
                                            <td className="px-4 py-3 text-sm text-[#FAFAFA]">{formatDate(session.date)}</td>
                                            <td className="px-4 py-3 text-sm text-[#A1A1AA]">{session.service}</td>
                                            <td className="px-4 py-3 text-sm text-[#A1A1AA]">{session.duration} min</td>
                                            <td className="px-4 py-3">
                                                <StatusBadge variant={session.status === "Completed" ? "success" : "danger"} dot>
                                                    {session.status}
                                                </StatusBadge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ===== PAYMENTS ===== */}
                {activeTab === "payments" && (
                    <div className="space-y-4">
                        {/* Mobile cards */}
                        <div className="space-y-3 lg:hidden">
                            {mockPayments.map((payment, i) => (
                                <div key={i} className="rounded-2xl border border-[#262626] bg-[#111111] p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#FAFAFA]">{payment.description}</span>
                                        <span className="text-sm font-semibold text-[#FAFAFA]">{formatCurrency(payment.amount)}</span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-xs text-[#A1A1AA]">
                                        <span>{formatDate(payment.date)}</span>
                                        <span>{payment.method}</span>
                                    </div>
                                    <div className="mt-1 text-xs text-[#5A4EFF]">{payment.receipt}</div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto rounded-2xl border border-[#262626] lg:block">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#262626] bg-[#0A0A0A]">
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Description</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Method</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockPayments.map((payment, i) => (
                                        <tr key={i} className="border-b border-[#262626] bg-[#111111]">
                                            <td className="px-4 py-3 text-sm text-[#FAFAFA]">{formatDate(payment.date)}</td>
                                            <td className="px-4 py-3 text-sm text-[#A1A1AA]">{payment.description}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-[#FAFAFA]">{formatCurrency(payment.amount)}</td>
                                            <td className="px-4 py-3 text-sm text-[#A1A1AA]">{payment.method}</td>
                                            <td className="px-4 py-3">
                                                <button className="text-sm text-[#5A4EFF] transition duration-100 ease-linear hover:underline">
                                                    {payment.receipt}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Total Spend card */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#A1A1AA]">Total Spend (All Time)</span>
                                <span className="text-xl font-semibold text-[#FAFAFA]">{formatCurrency(client.totalSpend)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== PROGRESS ===== */}
                {activeTab === "progress" && (
                    <div className="space-y-4 lg:space-y-6">
                        {/* Fitness Metrics */}
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
                            <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4">
                                <p className="text-xs text-[#A1A1AA]">Weight</p>
                                <p className="mt-1 text-xl font-semibold text-[#FAFAFA] lg:text-2xl">85 kg</p>
                                <p className="mt-1 text-xs text-[#E2F4A6]">-7 kg from start</p>
                            </div>
                            <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4">
                                <p className="text-xs text-[#A1A1AA]">Body Fat</p>
                                <p className="mt-1 text-xl font-semibold text-[#FAFAFA] lg:text-2xl">18%</p>
                                <p className="mt-1 text-xs text-[#E2F4A6]">-4% from start</p>
                            </div>
                            <div className="col-span-2 rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:col-span-1">
                                <p className="text-xs text-[#A1A1AA]">Resting HR</p>
                                <p className="mt-1 text-xl font-semibold text-[#FAFAFA] lg:text-2xl">62 bpm</p>
                                <p className="mt-1 text-xs text-[#E2F4A6]">-8 bpm from start</p>
                            </div>
                        </div>

                        {/* Weight Chart */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-sm font-medium text-[#A1A1AA]">Weight Over Time</h3>
                            <div className="mt-4">
                                <svg viewBox="0 0 600 200" className="w-full" preserveAspectRatio="xMidYMid meet">
                                    {/* Grid lines */}
                                    {[0, 1, 2, 3, 4].map((i) => {
                                        const y = 20 + i * 40;
                                        const weight = 95 - i * 3;
                                        return (
                                            <g key={i}>
                                                <line x1="50" y1={y} x2="570" y2={y} stroke="#262626" strokeWidth="1" />
                                                <text x="40" y={y + 4} textAnchor="end" fill="#A1A1AA" fontSize="11">
                                                    {weight}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* X-axis labels */}
                                    {weightMonths.map((month, i) => {
                                        const x = 80 + i * 96;
                                        return (
                                            <text key={month} x={x} y="195" textAnchor="middle" fill="#A1A1AA" fontSize="11">
                                                {month}
                                            </text>
                                        );
                                    })}

                                    {/* Line */}
                                    <polyline
                                        fill="none"
                                        stroke="#5A4EFF"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={weightData
                                            .map((w, i) => {
                                                const x = 80 + i * 96;
                                                const y = 20 + ((95 - w) / 12) * 160;
                                                return `${x},${y}`;
                                            })
                                            .join(" ")}
                                    />

                                    {/* Area fill */}
                                    <polygon
                                        fill="url(#chartGradientProfile)"
                                        opacity="0.15"
                                        points={[
                                            ...weightData.map((w, i) => {
                                                const x = 80 + i * 96;
                                                const y = 20 + ((95 - w) / 12) * 160;
                                                return `${x},${y}`;
                                            }),
                                            `${80 + 5 * 96},180`,
                                            `80,180`,
                                        ].join(" ")}
                                    />

                                    <defs>
                                        <linearGradient id="chartGradientProfile" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#5A4EFF" />
                                            <stop offset="100%" stopColor="#5A4EFF" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Data points */}
                                    {weightData.map((w, i) => {
                                        const x = 80 + i * 96;
                                        const y = 20 + ((95 - w) / 12) * 160;
                                        return (
                                            <g key={i}>
                                                <circle cx={x} cy={y} r="5" fill="#111111" stroke="#5A4EFF" strokeWidth="2.5" />
                                                <text x={x} y={y - 12} textAnchor="middle" fill="#FAFAFA" fontSize="11" fontWeight="500">
                                                    {w}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== NOTES ===== */}
                {activeTab === "notes" && (
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-sm font-medium text-[#A1A1AA]">Client Notes</h3>
                            <div className="mt-3 min-h-[120px] rounded-lg border border-[#262626] bg-[#0A0A0A] p-4 text-sm leading-relaxed text-[#FAFAFA]">
                                {client.notes}
                            </div>
                            <p className="mt-3 text-xs text-[#A1A1AA]">Last edited: 3 days ago</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile fixed bottom action bar */}
            <div className="fixed bottom-[64px] left-0 right-0 z-40 flex gap-2 border-t border-[#262626] bg-[#111111] px-4 py-3 lg:hidden">
                <button className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#5A4EFF] text-sm font-semibold text-white transition duration-100 ease-linear active:bg-[#4840E8]">
                    <Calendar className="size-4" />
                    Book Session
                </button>
                <button className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-[#262626] bg-[#111111] text-sm font-medium text-[#FAFAFA] transition duration-100 ease-linear active:bg-[#1A1A1A]">
                    <Mail01 className="size-4" />
                    Message
                </button>
            </div>
        </div>
    );
}
