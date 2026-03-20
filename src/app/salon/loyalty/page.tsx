"use client";

import { useState } from "react";
import {
    Star01,
    Gift01,
    Users01,
    Calendar,
    ShoppingBag01,
    TrendUp01,
    ArrowUp,
    ArrowDown,
    Trophy01,
} from "@untitledui/icons";

// ── Brand Accent ────────────────────────────────────────────────────────────
const BRAND = "#D946EF";

// ── Mock Data ───────────────────────────────────────────────────────────────

const tiers = [
    {
        name: "Bronze",
        members: 142,
        minPoints: 0,
        benefits: ["1 point per R10 spent", "Birthday 10% off"],
        color: "#CD7F32",
    },
    {
        name: "Silver",
        members: 98,
        minPoints: 500,
        benefits: ["1.5 points per R10", "Free treatment quarterly", "Priority booking"],
        color: "#C0C0C0",
    },
    {
        name: "Gold",
        members: 45,
        minPoints: 1500,
        benefits: [
            "2 points per R10",
            "Free monthly treatment",
            "VIP lounge",
            "Exclusive products",
        ],
        color: "#FFD700",
    },
];

const pointsRules: { action: string; points: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { action: "Service booking", points: "R10 = 1 point", icon: Calendar },
    { action: "Product purchase", points: "R10 = 1 point", icon: ShoppingBag01 },
    { action: "Referral signup", points: "100 bonus points", icon: Users01 },
    { action: "Birthday month", points: "2x points", icon: Gift01 },
    { action: "Review posted", points: "25 points", icon: Star01 },
];

const topEarners = [
    { rank: 1, name: "Thandi Mokoena", points: 2450, tier: "Gold" as const, spent: "R18,450" },
    { rank: 2, name: "Precious Ndlovu", points: 2280, tier: "Gold" as const, spent: "R17,100" },
    { rank: 3, name: "Ayanda Khumalo", points: 2100, tier: "Gold" as const, spent: "R15,750" },
    { rank: 4, name: "Zanele Wezi", points: 1650, tier: "Silver" as const, spent: "R12,375" },
    { rank: 5, name: "Nompilo Sithole", points: 1420, tier: "Silver" as const, spent: "R10,650" },
    { rank: 6, name: "Khanyi Langa", points: 980, tier: "Silver" as const, spent: "R7,350" },
    { rank: 7, name: "Lerato Phiri", points: 620, tier: "Bronze" as const, spent: "R4,650" },
    { rank: 8, name: "Sibongile Dube", points: 340, tier: "Bronze" as const, spent: "R2,550" },
];

const rewards = [
    { name: "Free Wash & Blow", cost: 200, redeemed: 34 },
    { name: "Free Deep Treatment", cost: 300, redeemed: 18 },
    { name: "R100 off Colour", cost: 150, redeemed: 22 },
    { name: "Free Product (up to R150)", cost: 400, redeemed: 8 },
    { name: "Free Braids Upgrade", cost: 500, redeemed: 5 },
];

const activity = [
    { type: "earned" as const, client: "Thandi M.", points: 85, action: "Box Braids service", time: "2h ago" },
    { type: "redeemed" as const, client: "Zanele W.", points: 200, action: "Free Wash & Blow", time: "3h ago" },
    { type: "earned" as const, client: "Ayanda K.", points: 45, action: "Silk Press service", time: "5h ago" },
    { type: "tier-up" as const, client: "Nompilo S.", points: 0, action: "Upgraded to Silver", time: "1d ago" },
    { type: "earned" as const, client: "Khanyi L.", points: 100, action: "Referral bonus", time: "2d ago" },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const tierColors: Record<string, string> = {
    Gold: "#FFD700",
    Silver: "#C0C0C0",
    Bronze: "#CD7F32",
};

function tierBadge(tier: string) {
    const color = tierColors[tier] ?? "#A1A1AA";
    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
        >
            <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
            {tier}
        </span>
    );
}

function activityIcon(type: string) {
    switch (type) {
        case "earned":
            return (
                <div className="flex size-8 items-center justify-center rounded-full bg-[#22C55E]/15">
                    <ArrowUp className="size-4 text-[#22C55E]" />
                </div>
            );
        case "redeemed":
            return (
                <div className="flex size-8 items-center justify-center rounded-full bg-[#F59E0B]/15">
                    <Gift01 className="size-4 text-[#F59E0B]" />
                </div>
            );
        case "tier-up":
            return (
                <div className="flex size-8 items-center justify-center rounded-full bg-[#D946EF]/15">
                    <TrendUp01 className="size-4 text-[#D946EF]" />
                </div>
            );
        default:
            return (
                <div className="flex size-8 items-center justify-center rounded-full bg-[#A1A1AA]/15">
                    <Star01 className="size-4 text-[var(--pa-text-secondary)]" />
                </div>
            );
    }
}

// ── Page Component ──────────────────────────────────────────────────────────

export default function SalonLoyaltyPage() {
    const [expandedTier, setExpandedTier] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Loyalty Programme
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Manage rewards, tiers, and member activity
                        </p>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear"
                        style={{ backgroundColor: BRAND }}
                    >
                        <Star01 className="size-4" />
                        Edit Programme
                    </button>
                </div>

                {/* ── SECTION 1 — Programme Overview ──────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex size-10 items-center justify-center rounded-full"
                            style={{ backgroundColor: `${BRAND}26` }}
                        >
                            <Trophy01 className="size-5" style={{ color: BRAND }} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                                Naledi&apos;s Rewards
                            </h2>
                            <p className="text-xs text-[var(--pa-text-secondary)]">Programme Overview</p>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                        <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4">
                            <p className="text-xs text-[var(--pa-text-secondary)]">Total Members</p>
                            <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">285</p>
                        </div>
                        <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4">
                            <p className="text-xs text-[var(--pa-text-secondary)]">Points Issued (Month)</p>
                            <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">12,450</p>
                        </div>
                        <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4">
                            <p className="text-xs text-[var(--pa-text-secondary)]">Redemptions (Month)</p>
                            <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">R8,200</p>
                        </div>
                        <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4">
                            <p className="text-xs text-[var(--pa-text-secondary)]">Avg Points / Member</p>
                            <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">
                                {Math.round(12450 / 285).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 2 — Tier Breakdown ─────────────────────────── */}
                <div>
                    <h2 className="mb-3 text-base font-semibold text-[var(--pa-text-primary)] lg:mb-4 lg:text-lg">
                        Tier Breakdown
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
                        {tiers.map((tier) => (
                            <button
                                key={tier.name}
                                onClick={() =>
                                    setExpandedTier(expandedTier === tier.name ? null : tier.name)
                                }
                                className="w-full rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 text-left transition duration-100 ease-linear hover:border-[#3F3F46] lg:p-5"
                                style={{ borderTopColor: tier.color, borderTopWidth: 3 }}
                            >
                                <div className="flex items-center justify-between">
                                    <h3
                                        className="text-base font-semibold lg:text-lg"
                                        style={{ color: tier.color }}
                                    >
                                        {tier.name}
                                    </h3>
                                    <span className="text-xs text-[var(--pa-text-secondary)]">
                                        {tier.minPoints > 0 ? `${tier.minPoints.toLocaleString()}+ pts` : "Entry"}
                                    </span>
                                </div>
                                <p className="mt-2 text-2xl font-semibold text-[var(--pa-text-primary)]">
                                    {tier.members}
                                </p>
                                <p className="text-xs text-[var(--pa-text-secondary)]">members</p>

                                <div className="mt-3 space-y-1.5">
                                    {tier.benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-start gap-2">
                                            <Star01
                                                className="mt-0.5 size-3.5 flex-shrink-0"
                                                style={{ color: tier.color }}
                                            />
                                            <span className="text-xs text-[#D4D4D8]">{benefit}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Progress bar showing member share */}
                                <div className="mt-4">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#262626]">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${(tier.members / 285) * 100}%`,
                                                backgroundColor: tier.color,
                                            }}
                                        />
                                    </div>
                                    <p className="mt-1 text-right text-[10px] text-[var(--pa-text-muted)]">
                                        {Math.round((tier.members / 285) * 100)}% of members
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 3 — Points Rules ───────────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                        Points Rules
                    </h2>
                    <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">How clients earn points</p>

                    <div className="mt-4 space-y-2">
                        {pointsRules.map((rule) => {
                            const Icon = rule.icon;
                            return (
                                <div
                                    key={rule.action}
                                    className="flex items-center gap-4 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3"
                                >
                                    <div
                                        className="flex size-9 items-center justify-center rounded-lg"
                                        style={{ backgroundColor: `${BRAND}20` }}
                                    >
                                        <Icon className="size-4.5" style={{ color: BRAND }} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                            {rule.action}
                                        </p>
                                    </div>
                                    <span
                                        className="rounded-md px-2.5 py-1 text-xs font-semibold"
                                        style={{
                                            backgroundColor: `${BRAND}15`,
                                            color: BRAND,
                                        }}
                                    >
                                        {rule.points}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Two-column: Top Earners + Redemptions ──────────────── */}
                <div className="grid gap-4 lg:grid-cols-5 lg:gap-6">
                    {/* ── SECTION 4 — Top Earners Table ──────────────────── */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:col-span-3 lg:p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                                Top Earners
                            </h2>
                            <span className="text-xs text-[var(--pa-text-secondary)]">By lifetime points</span>
                        </div>

                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[480px]">
                                <thead>
                                    <tr className="border-b border-[var(--pa-border-default)]">
                                        <th className="pb-2.5 text-left text-xs font-medium text-[var(--pa-text-muted)]">
                                            #
                                        </th>
                                        <th className="pb-2.5 text-left text-xs font-medium text-[var(--pa-text-muted)]">
                                            Client
                                        </th>
                                        <th className="pb-2.5 text-right text-xs font-medium text-[var(--pa-text-muted)]">
                                            Points
                                        </th>
                                        <th className="pb-2.5 text-left text-xs font-medium text-[var(--pa-text-muted)]">
                                            Tier
                                        </th>
                                        <th className="pb-2.5 text-right text-xs font-medium text-[var(--pa-text-muted)]">
                                            Spent
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topEarners.map((earner) => (
                                        <tr
                                            key={earner.rank}
                                            className="border-b border-[var(--pa-border-default)]/50 transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)]"
                                        >
                                            <td className="py-3 text-sm font-medium text-[var(--pa-text-muted)]">
                                                {earner.rank <= 3 ? (
                                                    <span
                                                        className="inline-flex size-6 items-center justify-center rounded-full text-xs font-bold"
                                                        style={{
                                                            backgroundColor: `${tierColors[earner.tier]}20`,
                                                            color: tierColors[earner.tier],
                                                        }}
                                                    >
                                                        {earner.rank}
                                                    </span>
                                                ) : (
                                                    earner.rank
                                                )}
                                            </td>
                                            <td className="py-3 text-sm font-medium text-[var(--pa-text-primary)]">
                                                {earner.name}
                                            </td>
                                            <td className="py-3 text-right text-sm font-semibold text-[var(--pa-text-primary)]">
                                                {earner.points.toLocaleString()}
                                            </td>
                                            <td className="py-3">{tierBadge(earner.tier)}</td>
                                            <td className="py-3 text-right text-sm text-[var(--pa-text-secondary)]">
                                                {earner.spent}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── SECTION 5 — Redemption Options ─────────────────── */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:col-span-2 lg:p-6">
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                            Redemption Options
                        </h2>
                        <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">Available rewards</p>

                        <div className="mt-4 space-y-2.5">
                            {rewards.map((reward) => (
                                <div
                                    key={reward.name}
                                    className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-3.5"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                            {reward.name}
                                        </p>
                                        <span
                                            className="flex-shrink-0 rounded-md px-2 py-0.5 text-xs font-bold"
                                            style={{
                                                backgroundColor: `${BRAND}20`,
                                                color: BRAND,
                                            }}
                                        >
                                            {reward.cost} pts
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-xs text-[var(--pa-text-muted)]">
                                            Redeemed {reward.redeemed} times
                                        </span>
                                        <div className="h-1 w-20 overflow-hidden rounded-full bg-[#262626]">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.min((reward.redeemed / 40) * 100, 100)}%`,
                                                    backgroundColor: BRAND,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── SECTION 6 — Recent Activity Feed ───────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                            Recent Activity
                        </h2>
                        <span className="text-xs text-[var(--pa-text-secondary)]">Last 7 days</span>
                    </div>

                    <div className="mt-4 space-y-2">
                        {activity.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3"
                            >
                                {activityIcon(item.type)}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-[var(--pa-text-primary)]">
                                        <span className="font-medium">{item.client}</span>
                                        {" "}
                                        <span className="text-[var(--pa-text-secondary)]">
                                            {item.type === "earned" && "earned"}
                                            {item.type === "redeemed" && "redeemed"}
                                            {item.type === "tier-up" && ""}
                                        </span>
                                        {item.points > 0 && (
                                            <span
                                                className="font-semibold"
                                                style={{
                                                    color:
                                                        item.type === "earned"
                                                            ? "#22C55E"
                                                            : item.type === "redeemed"
                                                              ? "#F59E0B"
                                                              : BRAND,
                                                }}
                                            >
                                                {" "}
                                                {item.type === "earned" ? "+" : "-"}
                                                {item.points} pts
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-[var(--pa-text-muted)]">{item.action}</p>
                                </div>
                                <span className="flex-shrink-0 text-xs text-[var(--pa-text-muted)]">
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
