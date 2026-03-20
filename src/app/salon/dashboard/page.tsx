"use client";

import { useState } from "react";
import {
    Calendar,
    Users01,
    ShoppingCart01,
    CreditCard01,
    Plus,
    AlertTriangle,
    TrendUp01,
    Star01,
    Clock,
    ArrowRight,
    UserPlus01,
    Scissors01,
} from "@untitledui/icons";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

function getCurrentDate(): string {
    return new Date().toLocaleDateString("en-ZA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatRand(amount: number): string {
    return `R${amount.toLocaleString("en-ZA")}`;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const todayAppointments = [
    { id: 1, time: "08:00", client: "Thandi M.", service: "Braids", stylist: "Naledi", duration: "3h", status: "in-progress" as const, color: "#D946EF" },
    { id: 2, time: "08:30", client: "Khanyi L.", service: "Wash & Blow", stylist: "Zinhle", duration: "1h", status: "confirmed" as const, color: "#3B82F6" },
    { id: 3, time: "09:00", client: "Precious N.", service: "Colour", stylist: "Buhle", duration: "2.5h", status: "confirmed" as const, color: "#F59E0B" },
    { id: 4, time: "10:00", client: "Walk-in", service: "Trim", stylist: "Naledi", duration: "30min", status: "walk-in" as const, color: "#14B8A6" },
    { id: 5, time: "11:00", client: "Lerato P.", service: "Relaxer", stylist: "Zinhle", duration: "2h", status: "confirmed" as const, color: "#EF4444" },
    { id: 6, time: "13:00", client: "Nompilo S.", service: "Locs Retwist", stylist: "Buhle", duration: "1.5h", status: "pending" as const, color: "#8B5CF6" },
    { id: 7, time: "14:00", client: "Ayanda K.", service: "Silk Press", stylist: "Naledi", duration: "1.5h", status: "confirmed" as const, color: "#EC4899" },
    { id: 8, time: "15:30", client: "Sibongile D.", service: "Wig Install", stylist: "Zinhle", duration: "1h", status: "confirmed" as const, color: "#06B6D4" },
];

const stylists = [
    { name: "Naledi", avatar: "NM", clients: 5, revenue: "R3,200", rating: 4.9 },
    { name: "Zinhle", avatar: "ZN", clients: 5, revenue: "R2,850", rating: 4.8 },
    { name: "Buhle", avatar: "BM", clients: 4, revenue: "R2,400", rating: 4.7 },
];

const walkInQueue = [
    { id: 1, name: "Walk-in #1", waitTime: "15 min", service: "Trim" },
    { id: 2, name: "Walk-in #2", waitTime: "25 min", service: "Wash & Style" },
];

const monthlyRevenue = [
    { month: "Oct", total: 45000 },
    { month: "Nov", total: 52000 },
    { month: "Dec", total: 68000 },
    { month: "Jan", total: 41000 },
    { month: "Feb", total: 55000 },
    { month: "Mar", total: 58000 },
];

const lowStockItems = [
    { name: "ORS Olive Oil Relaxer", stock: 2, reorder: 10 },
    { name: "Cantu Shea Butter", stock: 3, reorder: 8 },
    { name: "Dark & Lovely Hair Colour", stock: 1, reorder: 5 },
];

const recentTransactions = [
    { client: "Thandi M.", service: "Box Braids", amount: "R850", method: "Card", time: "08:45" },
    { client: "Khanyi L.", service: "Wash & Blow + Products", amount: "R420", method: "Cash", time: "09:30" },
    { client: "Walk-in", service: "Trim", amount: "R150", method: "Card", time: "10:20" },
];

// ── Status helpers ───────────────────────────────────────────────────────────

type AppointmentStatus = "in-progress" | "confirmed" | "pending" | "walk-in";

function statusPill(status: AppointmentStatus) {
    switch (status) {
        case "in-progress":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/15 px-2.5 py-0.5 text-xs font-medium text-[#22C55E]">
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22C55E] opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-[#22C55E]" />
                    </span>
                    In Progress
                </span>
            );
        case "confirmed":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/15 px-2.5 py-0.5 text-xs font-medium text-[#22C55E]">
                    <span className="size-1.5 rounded-full bg-[#22C55E]" />
                    Confirmed
                </span>
            );
        case "pending":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/15 px-2.5 py-0.5 text-xs font-medium text-[#F59E0B]">
                    <span className="size-1.5 rounded-full bg-[#F59E0B]" />
                    Pending
                </span>
            );
        case "walk-in":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#14B8A6]/15 px-2.5 py-0.5 text-xs font-medium text-[#14B8A6]">
                    <span className="size-1.5 rounded-full bg-[#14B8A6]" />
                    Walk-in
                </span>
            );
    }
}

// ── Page Component ───────────────────────────────────────────────────────────

export default function SalonDashboardPage() {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

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
    const yMax = 80000;
    const yTicks = [0, 20000, 40000, 60000, 80000];

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── SECTION 1 — Greeting Header ──────────────────────────── */}
                <div>
                    <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                        {greeting}, Naledi
                    </h1>
                    <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">{currentDate}</p>
                    <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                        Naledi&apos;s Hair Studio &middot; Johannesburg
                    </p>
                </div>

                {/* ── SECTION 2 — 4 KPI Stat Cards ─────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                    {/* Today's Revenue */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#D946EF]/15">
                                <TrendUp01 className="size-5 text-[#D946EF]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Today&apos;s Revenue</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">R8,450</p>
                        <p className="mt-1 text-xs text-[#22C55E]">+12% from yesterday</p>
                    </div>

                    {/* Appointments Today */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#3B82F6]/15">
                                <Calendar className="size-5 text-[#3B82F6]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Appointments Today</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">14</p>
                        <p className="mt-1 text-xs text-[var(--pa-text-secondary)]">3 walk-ins</p>
                    </div>

                    {/* Active Clients */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#22C55E]/15">
                                <Users01 className="size-5 text-[#22C55E]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Active Clients</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">342</p>
                        <p className="mt-1 text-xs text-[#22C55E]">+8 this week</p>
                    </div>

                    {/* Product Sales */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#F59E0B]/15">
                                <ShoppingCart01 className="size-5 text-[#F59E0B]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Product Sales</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">R2,130</p>
                        <p className="mt-1 text-xs text-[var(--pa-text-secondary)]">7 items today</p>
                    </div>
                </div>

                {/* ── SECTION 3 — Today's Schedule ─────────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                            Today&apos;s Schedule
                        </h2>
                        <span className="text-xs text-[var(--pa-text-secondary)]">
                            {todayAppointments.length} appointments
                        </span>
                    </div>
                    <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto lg:mt-4 lg:space-y-3">
                        {todayAppointments.map((appt) => (
                            <div
                                key={appt.id}
                                className="flex min-h-[44px] flex-wrap items-center gap-3 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-3"
                            >
                                {/* Time */}
                                <span className="w-12 flex-shrink-0 text-sm font-semibold text-[var(--pa-text-primary)]">
                                    {appt.time}
                                </span>

                                {/* Colored dot */}
                                <span
                                    className="size-2.5 flex-shrink-0 rounded-full"
                                    style={{ backgroundColor: appt.color }}
                                />

                                {/* Client name */}
                                <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--pa-text-primary)]">
                                    {appt.client}
                                </span>

                                {/* Service badge */}
                                <span className="rounded-md bg-[var(--pa-bg-elevated)] px-2 py-0.5 text-xs font-medium text-[#D946EF]">
                                    {appt.service}
                                </span>

                                {/* Stylist tag */}
                                <span className="hidden text-xs text-[var(--pa-text-muted)] sm:inline">
                                    {appt.stylist} &middot; {appt.duration}
                                </span>

                                {/* Status pill */}
                                {statusPill(appt.status)}
                            </div>
                        ))}
                    </div>
                    <a
                        href="/salon/calendar"
                        className="mt-3 flex min-h-[44px] items-center gap-1 text-sm font-medium text-[#D946EF] transition duration-100 ease-linear hover:text-[#C026D3] lg:mt-4"
                    >
                        View full calendar <ArrowRight className="size-4" />
                    </a>
                </div>

                {/* ── SECTION 4 — Stylist Performance + Walk-in Queue ──────── */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                    {/* Left: Stylist Performance */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                            Stylist Performance
                        </h2>
                        <div className="mt-3 space-y-3 lg:mt-4">
                            {stylists.map((stylist) => (
                                <div
                                    key={stylist.name}
                                    className="flex items-center gap-3 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3"
                                >
                                    {/* Avatar */}
                                    <div className="flex size-10 items-center justify-center rounded-full bg-[#D946EF]/15 text-sm font-semibold text-[#D946EF]">
                                        {stylist.avatar}
                                    </div>
                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                            {stylist.name}
                                        </p>
                                        <p className="text-xs text-[var(--pa-text-secondary)]">
                                            {stylist.clients} clients &middot; {stylist.revenue}
                                        </p>
                                    </div>
                                    {/* Rating */}
                                    <div className="flex items-center gap-1">
                                        <Star01 className="size-4 text-[#F59E0B]" />
                                        <span className="text-sm font-medium text-[var(--pa-text-primary)]">
                                            {stylist.rating}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Walk-in Queue */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                                Walk-in Queue
                            </h2>
                            <span className="rounded-full bg-[#14B8A6]/15 px-2.5 py-0.5 text-xs font-medium text-[#14B8A6]">
                                {walkInQueue.length} waiting
                            </span>
                        </div>
                        <div className="mt-3 space-y-2 lg:mt-4">
                            {walkInQueue.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3"
                                >
                                    <div className="flex size-8 items-center justify-center rounded-full bg-[var(--pa-bg-elevated)]">
                                        <Clock className="size-4 text-[var(--pa-text-secondary)]" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-[var(--pa-text-secondary)]">{item.service}</p>
                                    </div>
                                    <span className="text-xs text-[#F59E0B]">
                                        {item.waitTime}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-3 text-xs text-[var(--pa-text-muted)]">
                            Avg. wait: ~20 min
                        </p>
                        <button className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#14B8A6] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                            <Plus className="size-4" /> Add Walk-in
                        </button>
                    </div>
                </div>

                {/* ── SECTION 5 — Revenue Overview (SVG Bar Chart) ─────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                        Revenue Overview
                    </h2>

                    <div className="mt-4 lg:mt-6">
                        <svg
                            viewBox={`0 0 ${chartWidth} 210`}
                            className="h-[180px] w-full lg:h-[280px]"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <defs>
                                <linearGradient id="salonBarGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#D946EF" />
                                    <stop offset="100%" stopColor="#A21CAF" />
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
                                            stroke="var(--pa-border-default)"
                                            strokeWidth={1}
                                        />
                                        <text
                                            x={chartPadLeft - 6}
                                            y={y + 4}
                                            textAnchor="end"
                                            fill="var(--pa-text-secondary)"
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
                                            fill="url(#salonBarGrad)"
                                            opacity={isHovered ? 1 : 0.75}
                                            className="transition-opacity duration-100 ease-linear"
                                        />
                                        {/* X-axis label */}
                                        <text
                                            x={x + barWidth / 2}
                                            y={210 - 6}
                                            textAnchor="middle"
                                            fill="var(--pa-text-secondary)"
                                            fontSize={10}
                                        >
                                            {m.month}
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
                                                    fill="var(--pa-bg-surface)"
                                                    stroke="var(--pa-border-emphasis)"
                                                    strokeWidth={1}
                                                />
                                                <text
                                                    x={x + barWidth / 2}
                                                    y={y - 13}
                                                    textAnchor="middle"
                                                    fill="var(--pa-text-primary)"
                                                    fontSize={11}
                                                    fontWeight={600}
                                                >
                                                    {formatRand(m.total)}
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                {/* ── SECTION 6 — Quick Actions + Low Stock ────────────────── */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                    {/* Left: Quick Actions */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                            Quick Actions
                        </h2>
                        <div className="mt-3 grid grid-cols-2 gap-2 lg:mt-4">
                            <a
                                href="/salon/bookings/new"
                                className="flex min-h-[44px] flex-col items-center justify-center gap-2 rounded-lg bg-[#D946EF] px-4 py-4 text-center text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#C026D3]"
                            >
                                <Calendar className="size-5" />
                                New Booking
                            </a>
                            <a
                                href="/salon/walk-in"
                                className="flex min-h-[44px] flex-col items-center justify-center gap-2 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-4 text-center text-sm font-medium text-[var(--pa-text-primary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)]"
                            >
                                <Scissors01 className="size-5 text-[#14B8A6]" />
                                Walk-in
                            </a>
                            <a
                                href="/salon/clients/new"
                                className="flex min-h-[44px] flex-col items-center justify-center gap-2 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-4 text-center text-sm font-medium text-[var(--pa-text-primary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)]"
                            >
                                <UserPlus01 className="size-5 text-[#3B82F6]" />
                                New Client
                            </a>
                            <a
                                href="/salon/payments"
                                className="flex min-h-[44px] flex-col items-center justify-center gap-2 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-4 text-center text-sm font-medium text-[var(--pa-text-primary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)]"
                            >
                                <CreditCard01 className="size-5 text-[#F59E0B]" />
                                Process Payment
                            </a>
                        </div>
                    </div>

                    {/* Right: Low Stock Alerts */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="size-5 text-[#F59E0B]" />
                            <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                                Low Stock Alerts
                            </h2>
                        </div>
                        <div className="mt-3 space-y-2 lg:mt-4">
                            {lowStockItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-[var(--pa-text-primary)]">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-[var(--pa-text-muted)]">
                                            Reorder level: {item.reorder}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            item.stock <= 2
                                                ? "bg-[#EF4444]/15 text-[#EF4444]"
                                                : "bg-[#F59E0B]/15 text-[#F59E0B]"
                                        }`}
                                    >
                                        {item.stock} left
                                    </span>
                                </div>
                            ))}
                        </div>
                        <a
                            href="/salon/inventory"
                            className="mt-3 flex min-h-[44px] items-center gap-1 text-sm font-medium text-[#D946EF] transition duration-100 ease-linear hover:text-[#C026D3] lg:mt-4"
                        >
                            Manage inventory <ArrowRight className="size-4" />
                        </a>
                    </div>
                </div>

                {/* ── SECTION 7 — Recent Transactions ──────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                        Recent Transactions
                    </h2>
                    <div className="mt-3 space-y-2 lg:mt-4">
                        {recentTransactions.map((tx, idx) => (
                            <div
                                key={idx}
                                className="flex min-h-[44px] items-center gap-3 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-3"
                            >
                                <div className="flex size-8 items-center justify-center rounded-full bg-[#D946EF]/15">
                                    <CreditCard01 className="size-4 text-[#D946EF]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[var(--pa-text-primary)]">
                                        {tx.client}
                                    </p>
                                    <p className="text-xs text-[var(--pa-text-secondary)]">{tx.service}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-[var(--pa-text-primary)]">
                                        {tx.amount}
                                    </p>
                                    <p className="text-xs text-[var(--pa-text-muted)]">
                                        {tx.method} &middot; {tx.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <a
                        href="/salon/transactions"
                        className="mt-3 flex min-h-[44px] items-center gap-1 text-sm font-medium text-[#D946EF] transition duration-100 ease-linear hover:text-[#C026D3] lg:mt-4"
                    >
                        View all transactions <ArrowRight className="size-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
