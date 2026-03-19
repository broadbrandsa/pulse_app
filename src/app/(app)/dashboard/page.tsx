"use client";

import { useState, useCallback } from "react";
import {
    business,
    todayStats,
    monthlyRevenue,
    appointments,
    clients,
    products,
    transactions,
} from "@/lib/mock-data";
import { formatCurrency, getGreeting, getCurrentDate } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { MilestoneCelebration } from "@/components/ui/milestone-celebration";
import {
    Activity,
    ArrowUp,
    Calendar,
    Users01,
    Star01,
    Plus,
    ArrowRight,
    CreditCard01,
    Trophy01,
    Target04,
    Clock,
    RefreshCcw01,
} from "@untitledui/icons";

// ── Helpers ──────────────────────────────────────────────────────────────────

const todaySessions = appointments.filter((a) => a.date === "2025-04-19");

const completedCount = 3;
const remainingCount = todaySessions.length - completedCount;

const recentClients = [...clients]
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    .slice(0, 5);

const lowStockProducts = products
    .filter((p) => p.stock <= p.reorderLevel)
    .slice(0, 2);

const revenueSparkline = monthlyRevenue.map((m) => m.total);

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.total));

// ── Milestone & Challenge Data ──────────────────────────────────────────────

const recentMilestones = [
    {
        id: "m1",
        clientName: "Thando Mbeki",
        initials: "TM",
        title: "Weight Goal Reached",
        description: "Hit her target weight after 12 weeks",
        timeAgo: "2 hours ago",
        points: 50,
    },
    {
        id: "m2",
        clientName: "Craig Williams",
        initials: "CW",
        title: "10 Sessions Completed",
        description: "Completed 10 personal training sessions",
        timeAgo: "Yesterday",
        points: 30,
    },
    {
        id: "m3",
        clientName: "Ayanda Ngcobo",
        initials: "AN",
        title: "5km Under 25 Minutes",
        description: "Ran 5km under 25 mins for the first time",
        timeAgo: "2 days ago",
        points: 40,
    },
];

const challengeLeaderboard = [
    { name: "Thando Mbeki", points: 18 },
    { name: "Craig Williams", points: 16 },
    { name: "Ayanda Ngcobo", points: 15 },
];

const attentionClients = [
    {
        id: "att1",
        name: "Zanele Jacobs",
        initials: "ZJ",
        lastSession: "4 weeks ago",
        suggestion: "Usually books Fridays at 8am",
    },
    {
        id: "att2",
        name: "Ruan du Plessis",
        initials: "RP",
        lastSession: "3 weeks ago",
        suggestion: "Prefers Tuesdays at 6pm",
    },
];

function membershipBadgeVariant(type: string) {
    switch (type) {
        case "Annual":
            return "info" as const;
        case "Monthly":
            return "violet" as const;
        case "PT Package":
            return "success" as const;
        case "Drop-in":
            return "warning" as const;
        default:
            return "default" as const;
    }
}

function statusDotColor(status: string) {
    return status === "Confirmed" ? "bg-[#22C55E]" : "bg-[#F59E0B]";
}

// ── Page Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
    const [revenueView, setRevenueView] = useState<"Monthly" | "Weekly">("Monthly");
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const [celebratingMilestone, setCelebratingMilestone] = useState<(typeof recentMilestones)[number] | null>(null);

    const handleDismissCelebration = useCallback(() => {
        setCelebratingMilestone(null);
    }, []);

    const greeting = getGreeting();
    const currentDate = getCurrentDate();

    // ── SVG Bar Chart dimensions ─────────────────────────────────────────────
    const chartWidth = 600;
    const chartPadTop = 20;
    const chartPadBottom = 30;
    const chartPadLeft = 50;
    const chartPadRight = 10;
    const barCount = monthlyRevenue.length;
    const barGap = 8;

    // Y-axis ticks for bar chart
    const yTicks = [0, 5000, 10000, 15000, 20000, 25000];
    const yMax = 25000;

    return (
        <div className="min-h-screen bg-[#0A0A0A] px-4 py-6 lg:px-6 lg:py-8">
            {/* Milestone Celebration Overlay */}
            {celebratingMilestone && (
                <MilestoneCelebration
                    title={celebratingMilestone.title}
                    description={celebratingMilestone.description}
                    clientName={celebratingMilestone.clientName}
                    points={celebratingMilestone.points}
                    onDismiss={handleDismissCelebration}
                />
            )}

            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── SECTION 1 — Greeting Header ──────────────────────────── */}
                <div>
                    <h1 className="text-xl font-semibold text-[#FAFAFA] lg:text-2xl">
                        {greeting}, Sipho
                    </h1>
                    <p className="mt-0.5 text-sm text-[#A1A1AA]">{currentDate}</p>
                    <p className="mt-0.5 text-sm text-[#A1A1AA]">
                        Here&apos;s your day at a glance
                    </p>
                </div>

                {/* ── SECTION 2 — 4 KPI Stat Cards ─────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                    <StatCard
                        title="Today's Revenue"
                        value={formatCurrency(todayStats.revenueToday)}
                        change="+8% vs yesterday"
                        changeType="positive"
                        icon={<Activity className="size-5" />}
                        sparkline={revenueSparkline.slice(-7)}
                    />
                    <StatCard
                        title="Active Clients"
                        value={String(todayStats.activeMembers)}
                        change="+3 this month"
                        changeType="positive"
                        icon={<Users01 className="size-5" />}
                    />
                    <StatCard
                        title="Sessions Today"
                        value={String(todayStats.sessionsToday)}
                        subtitle={`${completedCount} completed \u00b7 ${remainingCount} remaining`}
                        icon={<Calendar className="size-5" />}
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value={formatCurrency(todayStats.monthlyRecurringRevenue)}
                        change="+5.2% vs last month"
                        changeType="positive"
                        icon={<ArrowUp className="size-5" />}
                    />
                </div>

                {/* ── SECTION 3 — Today's Schedule ─────────────────────────── */}
                <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[#FAFAFA] lg:text-lg">
                        Today&apos;s Schedule
                    </h2>
                    <div className="mt-3 space-y-2 lg:mt-4 lg:space-y-3">
                        {todaySessions.map((appt) => (
                            <div
                                key={appt.id}
                                className="flex min-h-[44px] items-center gap-3 rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-3"
                            >
                                <span className="w-12 flex-shrink-0 text-sm font-semibold text-[#FAFAFA]">
                                    {appt.time}
                                </span>
                                <InitialsAvatar initials={appt.clientInitials} src={appt.clientAvatarUrl} size="sm" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate text-sm font-medium text-[#FAFAFA]">
                                            {appt.clientName}
                                        </span>
                                        <span
                                            className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${statusDotColor(appt.status)}`}
                                        />
                                    </div>
                                </div>
                                <StatusBadge variant="violet">{appt.service}</StatusBadge>
                            </div>
                        ))}
                    </div>
                    <a href="/calendar" className="mt-3 flex min-h-[44px] items-center gap-1 text-sm font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:text-[#4840E8] lg:mt-4">
                        View calendar <ArrowRight className="size-4" />
                    </a>
                </div>

                {/* ── SECTION 4 — Revenue Chart ────────────────────────────── */}
                <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-[#FAFAFA] lg:text-lg">
                            Revenue overview
                        </h2>
                        <div className="flex gap-1 rounded-lg bg-[#1A1A1A] p-1">
                            {(["Monthly", "Weekly"] as const).map((view) => (
                                <button
                                    key={view}
                                    onClick={() => setRevenueView(view)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear ${
                                        revenueView === view
                                            ? "bg-[#5A4EFF] text-white"
                                            : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                                    }`}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 lg:mt-6">
                        <svg
                            viewBox={`0 0 ${chartWidth} 210`}
                            className="h-[180px] w-full lg:h-[280px]"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#5A4EFF" />
                                    <stop offset="100%" stopColor="#4840E8" />
                                </linearGradient>
                            </defs>

                            {/* Y-axis grid lines */}
                            {yTicks.map((tick) => {
                                const barAreaHeight = 210 - chartPadTop - chartPadBottom;
                                const y =
                                    chartPadTop + barAreaHeight - (tick / yMax) * barAreaHeight;
                                return (
                                    <g key={tick}>
                                        <line
                                            x1={chartPadLeft}
                                            y1={y}
                                            x2={chartWidth - chartPadRight}
                                            y2={y}
                                            stroke="#262626"
                                            strokeWidth={1}
                                        />
                                        <text
                                            x={chartPadLeft - 6}
                                            y={y + 4}
                                            textAnchor="end"
                                            fill="#A1A1AA"
                                            fontSize={10}
                                        >
                                            {tick >= 1000 ? `${tick / 1000}k` : tick}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Bars */}
                            {monthlyRevenue.map((m, i) => {
                                const barAreaWidth = chartWidth - chartPadLeft - chartPadRight;
                                const barAreaHeight = 210 - chartPadTop - chartPadBottom;
                                const barWidth =
                                    (barAreaWidth - barGap * (barCount - 1)) / barCount;
                                const barH = (m.total / yMax) * barAreaHeight;
                                const x = chartPadLeft + i * (barWidth + barGap);
                                const y = chartPadTop + barAreaHeight - barH;
                                const label = m.month.split(" ")[0].slice(0, 3);
                                const isHovered = hoveredBar === i;

                                return (
                                    <g
                                        key={m.month}
                                        onMouseEnter={() => setHoveredBar(i)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                        className="cursor-pointer"
                                    >
                                        {/* Invisible hover target */}
                                        <rect
                                            x={x}
                                            y={chartPadTop}
                                            width={barWidth}
                                            height={barAreaHeight}
                                            fill="transparent"
                                        />
                                        {/* Bar */}
                                        <rect
                                            x={x}
                                            y={y}
                                            width={barWidth}
                                            height={barH}
                                            rx={3}
                                            fill="url(#barGrad)"
                                            opacity={isHovered ? 1 : 0.75}
                                            className="transition-opacity duration-100 ease-linear"
                                        />
                                        {/* X-axis label */}
                                        <text
                                            x={x + barWidth / 2}
                                            y={210 - 6}
                                            textAnchor="middle"
                                            fill="#A1A1AA"
                                            fontSize={10}
                                        >
                                            {label}
                                        </text>
                                        {/* Tooltip */}
                                        {isHovered && (
                                            <g>
                                                <rect
                                                    x={x + barWidth / 2 - 36}
                                                    y={y - 28}
                                                    width={72}
                                                    height={22}
                                                    rx={4}
                                                    fill="#111111"
                                                    stroke="#333333"
                                                    strokeWidth={1}
                                                />
                                                <text
                                                    x={x + barWidth / 2}
                                                    y={y - 13}
                                                    textAnchor="middle"
                                                    fill="#FAFAFA"
                                                    fontSize={11}
                                                    fontWeight={600}
                                                >
                                                    {formatCurrency(m.total)}
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                {/* ── SECTION 5 — Recent Clients + Quick Actions ───────────── */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                    {/* Left: Recent Clients */}
                    <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                        <h2 className="text-base font-semibold text-[#FAFAFA] lg:text-lg">
                            Recent Clients
                        </h2>
                        <div className="mt-3 space-y-3 lg:mt-4">
                            {recentClients.map((client) => (
                                <div key={client.id} className="flex items-center gap-3">
                                    <InitialsAvatar initials={client.initials} src={client.avatarUrl} size="sm" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-[#FAFAFA]">
                                            {client.name}
                                        </p>
                                        <p className="text-xs text-[#A1A1AA]">
                                            Last visit:{" "}
                                            {new Date(client.lastVisit).toLocaleDateString(
                                                "en-ZA",
                                                { day: "numeric", month: "short" },
                                            )}
                                        </p>
                                    </div>
                                    <StatusBadge
                                        variant={membershipBadgeVariant(client.membershipType)}
                                    >
                                        {client.membershipType}
                                    </StatusBadge>
                                </div>
                            ))}
                        </div>
                        <button className="mt-3 flex min-h-[44px] items-center gap-1 text-sm font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:text-[#4840E8] lg:mt-4">
                            View all clients <ArrowRight className="size-4" />
                        </button>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                        <h2 className="text-base font-semibold text-[#FAFAFA] lg:text-lg">
                            Quick Actions
                        </h2>
                        <div className="mt-3 space-y-2 lg:mt-4">
                            <button className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8]">
                                <Plus className="size-4" /> Book Session
                            </button>
                            <button className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#262626] bg-transparent px-4 py-2.5 text-sm font-medium text-[#FAFAFA] transition duration-100 ease-linear hover:bg-[#1A1A1A]">
                                <Plus className="size-4" /> Add Client
                            </button>
                            <button className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#262626] bg-transparent px-4 py-2.5 text-sm font-medium text-[#FAFAFA] transition duration-100 ease-linear hover:bg-[#1A1A1A]">
                                <CreditCard01 className="size-4" /> Process Payment
                            </button>
                        </div>

                        {/* Low Stock Alerts */}
                        {lowStockProducts.length > 0 && (
                            <div className="mt-5">
                                <h3 className="text-sm font-semibold text-[#A1A1AA]">
                                    Low Stock Alerts
                                </h3>
                                <div className="mt-2 space-y-2">
                                    {lowStockProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between rounded-lg border border-[#262626] bg-[#0A0A0A] p-3"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-[#FAFAFA]">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-[#EF4444]">
                                                    {product.stock} left (min {product.reorderLevel})
                                                </p>
                                            </div>
                                            <button className="rounded-md border border-[#262626] px-3 py-1 text-xs font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:border-[#5A4EFF] hover:text-[#5A4EFF]">
                                                Reorder
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── SECTION 5b — Recent Milestones + Active Challenge ───── */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                    {/* Left: Recent Milestones */}
                    <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                        <div className="flex items-center gap-2">
                            <Trophy01 className="size-5 text-[#E2F4A6]" />
                            <h2 className="text-base font-semibold text-[#FAFAFA] lg:text-lg">
                                Recent Milestones
                            </h2>
                        </div>
                        <div className="mt-3 space-y-3 lg:mt-4">
                            {recentMilestones.map((milestone) => (
                                <div
                                    key={milestone.id}
                                    className="flex items-center gap-3 rounded-lg border border-[#262626] bg-[#0A0A0A] p-3"
                                >
                                    <InitialsAvatar initials={milestone.initials} size="sm" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-[#FAFAFA]">
                                            {milestone.clientName}{" "}
                                            <span className="font-normal text-[#A1A1AA]">
                                                &mdash;{" "}
                                                {milestone.id === "m1"
                                                    ? "hit her weight goal!"
                                                    : milestone.id === "m2"
                                                      ? "completed 10 sessions"
                                                      : "ran 5km under 25 mins"}
                                            </span>
                                        </p>
                                        <p className="text-xs text-[#71717A]">{milestone.timeAgo}</p>
                                    </div>
                                    <button
                                        onClick={() => setCelebratingMilestone(milestone)}
                                        className="flex-shrink-0 rounded-lg bg-[#5A4EFF]/10 px-3 py-1.5 text-xs font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:bg-[#5A4EFF]/20"
                                    >
                                        Celebrate
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Active Challenge + Trial Conversions */}
                    <div className="space-y-4 lg:space-y-6">
                        {/* Active Challenge */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Target04 className="size-5 text-[#EEA0FF]" />
                                    <h2 className="text-base font-semibold text-[#FAFAFA] lg:text-lg">
                                        Active Challenge
                                    </h2>
                                </div>
                                <span className="rounded-full bg-[#EEA0FF]/10 px-2.5 py-0.5 text-xs font-medium text-[#EEA0FF]">
                                    Competitive
                                </span>
                            </div>
                            <p className="mt-2 text-sm font-medium text-[#FAFAFA]">
                                April Step Challenge
                            </p>
                            <div className="mt-3 space-y-2">
                                {challengeLeaderboard.map((entry, i) => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                        <span
                                            className={`flex size-5 items-center justify-center rounded-full text-xs font-bold ${
                                                i === 0
                                                    ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                                                    : i === 1
                                                      ? "bg-[#A1A1AA]/20 text-[#A1A1AA]"
                                                      : "bg-[#92400E]/20 text-[#D97706]"
                                            }`}
                                        >
                                            {i + 1}
                                        </span>
                                        <span className="flex-1 text-sm text-[#FAFAFA]">
                                            {entry.name}
                                        </span>
                                        <span className="text-sm font-semibold text-[#E2F4A6]">
                                            {entry.points}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-xs text-[#71717A]">Ends in 12 days</p>
                            <a
                                href="/challenges"
                                className="mt-2 flex items-center gap-1 text-sm font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:text-[#4840E8]"
                            >
                                View leaderboard <ArrowRight className="size-4" />
                            </a>
                        </div>

                        {/* Trial Conversions */}
                        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                            <h3 className="text-sm font-semibold text-[#A1A1AA]">
                                Trial Conversions
                            </h3>
                            <div className="mt-3 flex items-end gap-6">
                                <div>
                                    <p className="text-2xl font-bold text-[#FAFAFA]">5</p>
                                    <p className="text-xs text-[#71717A]">Trials this month</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#22C55E]">3</p>
                                    <p className="text-xs text-[#71717A]">Converted (60%)</p>
                                </div>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1A1A1A]">
                                <div
                                    className="h-full rounded-full bg-[#22C55E]"
                                    style={{ width: "60%" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 5c — Attention Needed / Smart Scheduling ────── */}
                <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                    <div className="flex items-center gap-2">
                        <Clock className="size-5 text-[#F59E0B]" />
                        <h2 className="text-base font-semibold text-[#FAFAFA] lg:text-lg">
                            Attention Needed
                        </h2>
                    </div>
                    <div className="mt-3 space-y-3 lg:mt-4">
                        {attentionClients.map((client) => (
                            <div
                                key={client.id}
                                className="flex flex-col gap-3 rounded-lg border border-[#262626] bg-[#0A0A0A] p-3 sm:flex-row sm:items-center"
                            >
                                <InitialsAvatar initials={client.initials} size="sm" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-[#FAFAFA]">
                                        {client.name}{" "}
                                        <span className="font-normal text-[#A1A1AA]">
                                            &mdash; Last session {client.lastSession}
                                        </span>
                                    </p>
                                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#F59E0B]/10 px-2.5 py-0.5 text-xs font-medium text-[#F59E0B]">
                                        <Calendar className="size-3" />
                                        {client.suggestion}
                                    </span>
                                </div>
                                <button className="flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg bg-[#5A4EFF] px-3 py-1.5 text-xs font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8]">
                                    <RefreshCcw01 className="size-3.5" />
                                    Quick rebook
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 6 — Recent Transactions ──────────────────────── */}
                <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[#FAFAFA] lg:text-lg">
                        Recent Transactions
                    </h2>
                    <div className="mt-3 space-y-2 lg:mt-4 lg:space-y-3">
                        {transactions.slice(0, 5).map((tx) => (
                            <div
                                key={tx.id}
                                className="flex min-h-[44px] items-center gap-3 rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[#FAFAFA]">
                                        {tx.clientName}
                                    </p>
                                    <p className="truncate text-xs text-[#A1A1AA]">
                                        {tx.service}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-[#FAFAFA]">
                                        {formatCurrency(tx.amount)}
                                    </p>
                                    <p className="text-xs text-[#A1A1AA]">
                                        {tx.timestamp.split(" ")[1]}
                                    </p>
                                </div>
                                <StatusBadge variant="default">{tx.paymentMethod}</StatusBadge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
