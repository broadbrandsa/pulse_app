"use client";

import { useState } from "react";
import {
    Star01,
    Gift01,
    Users01,
    Calendar,
    Trophy01,
    TrendUp01,
    ArrowUp,
    Heart,
    Target04,
    Zap,
} from "@untitledui/icons";

// -- Brand Accent ----------------------------------------------------------------
const BRAND = "#14B8A6";

// -- Mock Data --------------------------------------------------------------------

const tiers = [
    {
        name: "Seedling",
        members: 120,
        minPoints: 0,
        benefits: ["1 point per class", "Birthday bonus"],
        color: "#86EFAC",
        emoji: "\u{1F331}",
    },
    {
        name: "Practitioner",
        members: 78,
        minPoints: 500,
        benefits: ["1.5x points", "Free mat rental", "Priority booking"],
        color: "#14B8A6",
        emoji: "\u{1F9D8}",
    },
    {
        name: "Yogi",
        members: 34,
        minPoints: 1500,
        benefits: ["2x points", "Free workshop quarterly", "Guest passes", "Retail discount 10%"],
        color: "#7C3AED",
        emoji: "\u{1F54A}\uFE0F",
    },
    {
        name: "Master",
        members: 12,
        minPoints: 4000,
        benefits: ["3x points", "Free monthly workshop", "Unlimited guest passes", "20% retail", "Private session yearly"],
        color: "#F59E0B",
        emoji: "\u{1F451}",
    },
];

const earningRules: { action: string; points: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { action: "Attend class", points: "+10 pts", icon: Calendar },
    { action: "5 classes in a week", points: "+25 bonus", icon: Zap },
    { action: "Attend workshop", points: "+50 pts", icon: Star01 },
    { action: "Refer a friend", points: "+150 pts", icon: Users01 },
    { action: "Leave a review", points: "+50 pts", icon: Heart },
    { action: "Try a new style", points: "+20 pts", icon: TrendUp01 },
    { action: "Birthday bonus", points: "+100 pts", icon: Gift01 },
    { action: "7-day streak", points: "+50 pts", icon: Target04 },
    { action: "30-day streak", points: "+200 pts", icon: Trophy01 },
];

const redemptions = [
    { name: "Free class", cost: 500, redeemed: 42 },
    { name: "R100 off any pass", cost: 1000, redeemed: 18 },
    { name: "5-Class Pass", cost: 2000, redeemed: 9 },
    { name: "Workshop ticket", cost: 3000, redeemed: 5 },
    { name: "Free month unlimited", cost: 5000, redeemed: 2 },
];

const topEarners = [
    { rank: 1, name: "Kefilwe Molefe", points: 4800, tier: "Master" as const, streak: "32 days" },
    { rank: 2, name: "Amahle Nkosi", points: 4200, tier: "Master" as const, streak: "28 days" },
    { rank: 3, name: "Priya Chetty", points: 3600, tier: "Yogi" as const, streak: "21 days" },
    { rank: 4, name: "Lerato Phiri", points: 2100, tier: "Yogi" as const, streak: "14 days" },
    { rank: 5, name: "Zanele Mthembu", points: 1200, tier: "Practitioner" as const, streak: "7 days" },
    { rank: 6, name: "Thandi Ndaba", points: 980, tier: "Practitioner" as const, streak: "5 days" },
    { rank: 7, name: "Sibongile Khumalo", points: 420, tier: "Seedling" as const, streak: "3 days" },
    { rank: 8, name: "Nomsa Dlamini", points: 180, tier: "Seedling" as const, streak: "1 day" },
];

const challenges = [
    { name: "30-Day Challenge", description: "Attend 30 classes in 30 days", participants: 24, daysLeft: 12, prize: "Free month + 500 pts" },
];

const referralCodes = [
    { code: "UBUNTU30", uses: 14, discount: "30% off first month" },
    { code: "NAMASTE", uses: 8, discount: "Free drop-in class" },
];

const activity = [
    { type: "earned" as const, client: "Kefilwe M.", points: 10, action: "Morning Vinyasa class", time: "1h ago" },
    { type: "redeemed" as const, client: "Priya C.", points: 500, action: "Free class redeemed", time: "3h ago" },
    { type: "earned" as const, client: "Lerato P.", points: 50, action: "7-day streak bonus", time: "5h ago" },
    { type: "tier-up" as const, client: "Amahle N.", points: 0, action: "Upgraded to Master", time: "1d ago" },
    { type: "earned" as const, client: "Zanele M.", points: 150, action: "Referral bonus", time: "2d ago" },
];

// -- Helpers ----------------------------------------------------------------------

const tierColors: Record<string, string> = {
    Master: "#F59E0B",
    Yogi: "#7C3AED",
    Practitioner: "#14B8A6",
    Seedling: "#86EFAC",
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
                <div className="flex size-8 items-center justify-center rounded-full bg-[#14B8A6]/15">
                    <TrendUp01 className="size-4 text-[#14B8A6]" />
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

const totalMembers = tiers.reduce((s, t) => s + t.members, 0);

// -- Page Component ---------------------------------------------------------------

export default function YogaLoyaltyPage() {
    const [expandedTier, setExpandedTier] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Loyalty Programme
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Manage rewards, tiers, and student activity
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

                {/* Programme Overview */}
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
                                Ubuntu Yoga Rewards
                            </h2>
                            <p className="text-xs text-[var(--pa-text-secondary)]">Programme Overview</p>
                        </div>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                        <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4">
                            <p className="text-xs text-[var(--pa-text-secondary)]">Total Members</p>
                            <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">{totalMembers}</p>
                        </div>
                        <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4">
                            <p className="text-xs text-[var(--pa-text-secondary)]">Points Issued (Month)</p>
                            <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">8,640</p>
                        </div>
                        <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4">
                            <p className="text-xs text-[var(--pa-text-secondary)]">Redemptions (Month)</p>
                            <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">R6,400</p>
                        </div>
                        <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4">
                            <p className="text-xs text-[var(--pa-text-secondary)]">Avg Points / Member</p>
                            <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">
                                {Math.round(8640 / totalMembers).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tier Breakdown */}
                <div>
                    <h2 className="mb-3 text-base font-semibold text-[var(--pa-text-primary)] lg:mb-4 lg:text-lg">
                        Tier Breakdown
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                        {tiers.map((tier) => (
                            <button
                                key={tier.name}
                                onClick={() => setExpandedTier(expandedTier === tier.name ? null : tier.name)}
                                className="w-full rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 text-left transition duration-100 ease-linear hover:border-[#3F3F46] lg:p-5"
                                style={{ borderTopColor: tier.color, borderTopWidth: 3 }}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-base font-semibold lg:text-lg" style={{ color: tier.color }}>
                                        <span>{tier.emoji}</span> {tier.name}
                                    </h3>
                                    <span className="text-xs text-[var(--pa-text-secondary)]">
                                        {tier.minPoints > 0 ? `${tier.minPoints.toLocaleString()}+ pts` : "Entry"}
                                    </span>
                                </div>
                                <p className="mt-2 text-2xl font-semibold text-[var(--pa-text-primary)]">{tier.members}</p>
                                <p className="text-xs text-[var(--pa-text-secondary)]">members</p>
                                <div className="mt-3 space-y-1.5">
                                    {tier.benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-start gap-2">
                                            <Star01 className="mt-0.5 size-3.5 shrink-0" style={{ color: tier.color }} />
                                            <span className="text-xs text-[var(--pa-text-muted)]">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--pa-bg-elevated)]">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{ width: `${(tier.members / totalMembers) * 100}%`, backgroundColor: tier.color }}
                                        />
                                    </div>
                                    <p className="mt-1 text-right text-[10px] text-[var(--pa-text-muted)]">
                                        {Math.round((tier.members / totalMembers) * 100)}% of members
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Earning Rules */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                        Earning Rules
                    </h2>
                    <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">How students earn points</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {earningRules.map((rule) => {
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
                                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">{rule.action}</p>
                                    </div>
                                    <span
                                        className="shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold"
                                        style={{ backgroundColor: `${BRAND}15`, color: BRAND }}
                                    >
                                        {rule.points}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Two-column: Top Earners + Redemptions */}
                <div className="grid gap-4 lg:grid-cols-5 lg:gap-6">
                    {/* Top Earners / Leaderboard */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:col-span-3 lg:p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                                Leaderboard
                            </h2>
                            <span className="text-xs text-[var(--pa-text-secondary)]">By lifetime points</span>
                        </div>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[480px]">
                                <thead>
                                    <tr className="border-b border-[var(--pa-border-default)]">
                                        <th className="pb-2.5 text-left text-xs font-medium text-[var(--pa-text-muted)]">#</th>
                                        <th className="pb-2.5 text-left text-xs font-medium text-[var(--pa-text-muted)]">Student</th>
                                        <th className="pb-2.5 text-right text-xs font-medium text-[var(--pa-text-muted)]">Points</th>
                                        <th className="pb-2.5 text-left text-xs font-medium text-[var(--pa-text-muted)]">Tier</th>
                                        <th className="pb-2.5 text-right text-xs font-medium text-[var(--pa-text-muted)]">Streak</th>
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
                                            <td className="py-3 text-sm font-medium text-[var(--pa-text-primary)]">{earner.name}</td>
                                            <td className="py-3 text-right text-sm font-semibold text-[var(--pa-text-primary)]">
                                                {earner.points.toLocaleString()}
                                            </td>
                                            <td className="py-3">{tierBadge(earner.tier)}</td>
                                            <td className="py-3 text-right text-sm text-[var(--pa-text-secondary)]">{earner.streak}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Redemption Options */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:col-span-2 lg:p-6">
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                            Redemption Options
                        </h2>
                        <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">Available rewards</p>
                        <div className="mt-4 space-y-2.5">
                            {redemptions.map((reward) => (
                                <div
                                    key={reward.name}
                                    className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-3.5"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">{reward.name}</p>
                                        <span
                                            className="shrink-0 rounded-md px-2 py-0.5 text-xs font-bold"
                                            style={{ backgroundColor: `${BRAND}20`, color: BRAND }}
                                        >
                                            {reward.cost.toLocaleString()} pts
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-xs text-[var(--pa-text-muted)]">
                                            Redeemed {reward.redeemed} times
                                        </span>
                                        <div className="h-1 w-20 overflow-hidden rounded-full bg-[var(--pa-bg-elevated)]">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.min((reward.redeemed / 50) * 100, 100)}%`,
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

                {/* Referral Codes + Challenges */}
                <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                    {/* Referral Codes */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                            Referral Codes
                        </h2>
                        <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">Active referral promotions</p>
                        <div className="mt-4 space-y-2.5">
                            {referralCodes.map((ref) => (
                                <div
                                    key={ref.code}
                                    className="flex items-center justify-between rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3"
                                >
                                    <div>
                                        <p className="font-mono text-sm font-semibold text-[#14B8A6]">{ref.code}</p>
                                        <p className="mt-0.5 text-xs text-[var(--pa-text-muted)]">{ref.discount}</p>
                                    </div>
                                    <span className="rounded-full bg-[#14B8A6]/15 px-2.5 py-0.5 text-xs font-medium text-[#14B8A6]">
                                        {ref.uses} uses
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Challenges */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                            Active Challenges
                        </h2>
                        <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">Ongoing studio challenges</p>
                        <div className="mt-4 space-y-3">
                            {challenges.map((ch) => (
                                <div
                                    key={ch.name}
                                    className="rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/5 p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">{ch.name}</h3>
                                        <span className="rounded-full bg-[#F59E0B]/15 px-2.5 py-0.5 text-xs font-medium text-[#F59E0B]">
                                            {ch.daysLeft} days left
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-[var(--pa-text-secondary)]">{ch.description}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-[var(--pa-text-muted)]">{ch.participants} participants</span>
                                        <span className="text-xs font-medium text-[#14B8A6]">{ch.prize}</span>
                                    </div>
                                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--pa-bg-elevated)]">
                                        <div
                                            className="h-full rounded-full bg-[#14B8A6]"
                                            style={{ width: `${((30 - ch.daysLeft) / 30) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity Feed */}
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
                                        <span className="font-medium">{item.client}</span>{" "}
                                        <span className="text-[var(--pa-text-secondary)]">
                                            {item.type === "earned" && "earned"}
                                            {item.type === "redeemed" && "redeemed"}
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
                                <span className="shrink-0 text-xs text-[var(--pa-text-muted)]">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
