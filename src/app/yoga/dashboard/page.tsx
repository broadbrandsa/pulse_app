"use client";

import { useState } from "react";

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

// ── Types ────────────────────────────────────────────────────────────────────

type ClassStatus = "complete" | "active" | "upcoming";

interface YogaClass {
    id: number;
    time: string;
    name: string;
    style: string;
    styleColor: string;
    instructor: string;
    initials: string;
    instructorColor: string;
    room: string;
    enrolled: number;
    capacity: number;
    status: ClassStatus;
    statusNote?: string;
    waitlist?: number;
}

interface Instructor {
    name: string;
    initials: string;
    color: string;
    role: string;
    classesComplete: number;
    classesTotal: number;
    students: number;
    revenue: string;
    styles: string[];
}

interface Student {
    id: number;
    name: string;
    initials: string;
    membershipType: string;
    classesAttended: number;
    lastClass: string;
    passesLeft?: number;
}

interface Milestone {
    id: number;
    student: string;
    initials: string;
    achievement: string;
    detail: string;
    color: string;
}

interface Alert {
    id: number;
    type: "blue" | "amber" | "red";
    message: string;
    action: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const todayClasses: YogaClass[] = [
    { id: 1, time: "07:00", name: "Early Morning Vinyasa", style: "Vinyasa", styleColor: "#5A4EFF", instructor: "Ravi", initials: "RK", instructorColor: "#EEA0FF", room: "Flow Room", enrolled: 18, capacity: 20, status: "complete" },
    { id: 2, time: "08:30", name: "Sunrise Hatha", style: "Hatha", styleColor: "#EEA0FF", instructor: "Candice", initials: "CW", instructorColor: "#F59E0B", room: "Yin Room", enrolled: 11, capacity: 12, status: "complete" },
    { id: 3, time: "09:30", name: "Hot Yoga Flow", style: "Hot", styleColor: "#EF4444", instructor: "Amahle", initials: "AN", instructorColor: "#5A4EFF", room: "Flow Room", enrolled: 20, capacity: 20, status: "active", statusNote: "ends 32 min" },
    { id: 4, time: "10:30", name: "Gentle Restorative", style: "Restorative", styleColor: "#0D9488", instructor: "Candice", initials: "CW", instructorColor: "#F59E0B", room: "Yin Room", enrolled: 8, capacity: 12, status: "active", statusNote: "ends 45 min" },
    { id: 5, time: "12:00", name: "Lunchtime Power Vinyasa", style: "Power", styleColor: "#F59E0B", instructor: "Ravi", initials: "RK", instructorColor: "#EEA0FF", room: "Flow Room", enrolled: 15, capacity: 20, status: "upcoming" },
    { id: 6, time: "18:00", name: "Evening Yin Yoga", style: "Yin", styleColor: "#0D9488", instructor: "Sipho", initials: "SM", instructorColor: "#E2F4A6", room: "Yin Room", enrolled: 12, capacity: 12, status: "upcoming", waitlist: 4 },
];

const instructors: Instructor[] = [
    { name: "Amahle", initials: "AN", color: "#5A4EFF", role: "Owner", classesComplete: 1, classesTotal: 2, students: 20, revenue: "R2,400", styles: ["Vinyasa", "Hot Yoga"] },
    { name: "Ravi", initials: "RK", color: "#EEA0FF", role: "Instructor", classesComplete: 1, classesTotal: 2, students: 18, revenue: "R2,160", styles: ["Vinyasa", "Power"] },
    { name: "Candice", initials: "CW", color: "#F59E0B", role: "Instructor", classesComplete: 2, classesTotal: 2, students: 19, revenue: "R2,280", styles: ["Hatha", "Restorative", "Yin"] },
    { name: "Sipho", initials: "SM", color: "#E2F4A6", role: "Instructor", classesComplete: 0, classesTotal: 1, students: 0, revenue: "R0", styles: ["Yin", "Meditation"] },
];

const recentStudents: Student[] = [
    { id: 1, name: "Lerato Mahlangu", initials: "LM", membershipType: "Unlimited", classesAttended: 48, lastClass: "Hot Yoga Flow" },
    { id: 2, name: "Thabo Ndlovu", initials: "TN", membershipType: "10-Class Pass", classesAttended: 22, lastClass: "Early Morning Vinyasa", passesLeft: 3 },
    { id: 3, name: "Sarah Chen", initials: "SC", membershipType: "Unlimited", classesAttended: 65, lastClass: "Sunrise Hatha" },
    { id: 4, name: "Priya Naidoo", initials: "PN", membershipType: "5-Class Pass", classesAttended: 14, lastClass: "Evening Yin Yoga", passesLeft: 1 },
    { id: 5, name: "James Wilson", initials: "JW", membershipType: "Unlimited", classesAttended: 31, lastClass: "Power Vinyasa" },
    { id: 6, name: "Zanele Khumalo", initials: "ZK", membershipType: "10-Class Pass", classesAttended: 9, lastClass: "Gentle Restorative", passesLeft: 1 },
];

const milestones: Milestone[] = [
    { id: 1, student: "Sarah Chen", initials: "SC", achievement: "100 Classes", detail: "Reached 100 classes this week!", color: "#14B8A6" },
    { id: 2, student: "Lerato Mahlangu", initials: "LM", achievement: "1 Year Member", detail: "Anniversary on 22 March", color: "#5A4EFF" },
    { id: 3, student: "James Wilson", initials: "JW", achievement: "30-Day Streak", detail: "Practised every day this month", color: "#F59E0B" },
];

const alerts: Alert[] = [
    { id: 1, type: "blue", message: "4 students waitlisted for 18:00 Yin \u2014 class is full", action: "Open another session" },
    { id: 2, type: "amber", message: "3 students have 1 class pass remaining \u2014 due to expire", action: "Send reminder" },
    { id: 3, type: "amber", message: "Lerato Mahlangu\u2019s membership expires in 3 days", action: "Send renewal" },
    { id: 4, type: "red", message: "Ravi Kumar unavailable Wed 26 Mar \u2014 Vinyasa Flow needs a sub", action: "Find substitute" },
];

const weeklyRevenue = [
    { day: "Mon", amount: 2800 },
    { day: "Tue", amount: 3400 },
    { day: "Wed", amount: 2100 },
    { day: "Thu", amount: 3800 },
    { day: "Fri", amount: 4200 },
    { day: "Sat", amount: 5100 },
    { day: "Sun", amount: 1900 },
];

const revenueByClassType = [
    { type: "Vinyasa", amount: 12400, color: "#5A4EFF" },
    { type: "Hot Yoga", amount: 9800, color: "#EF4444" },
    { type: "Hatha", amount: 7200, color: "#EEA0FF" },
    { type: "Yin", amount: 6500, color: "#0D9488" },
    { type: "Power", amount: 5800, color: "#F59E0B" },
    { type: "Restorative", amount: 3400, color: "#14B8A6" },
];

// ── Status Helpers ───────────────────────────────────────────────────────────

function classStatusPill(cls: YogaClass) {
    switch (cls.status) {
        case "complete":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: "rgba(226,244,166,0.25)", color: "#6B7A2E" }}>
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: "#A3B844" }} />
                    Complete
                </span>
            );
        case "active":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#14B8A6]/15 px-2.5 py-0.5 text-xs font-medium text-[#14B8A6]">
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#14B8A6] opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-[#14B8A6]" />
                    </span>
                    Active{cls.statusNote ? ` \u00b7 ${cls.statusNote}` : ""}
                </span>
            );
        case "upcoming":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B82F6]/15 px-2.5 py-0.5 text-xs font-medium text-[#3B82F6]">
                    <span className="size-1.5 rounded-full bg-[#3B82F6]" />
                    Upcoming{cls.waitlist ? ` \u00b7 WL: ${cls.waitlist}` : ""}
                </span>
            );
    }
}

function alertColors(type: Alert["type"]) {
    switch (type) {
        case "blue":
            return { bg: "bg-[#3B82F6]/10", border: "border-[#3B82F6]/30", text: "text-[#3B82F6]", btn: "bg-[#3B82F6]" };
        case "amber":
            return { bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/30", text: "text-[#F59E0B]", btn: "bg-[#F59E0B]" };
        case "red":
            return { bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/30", text: "text-[#EF4444]", btn: "bg-[#EF4444]" };
    }
}

// ── Page Component ───────────────────────────────────────────────────────────

export default function YogaDashboardPage() {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const [reportsOpen, setReportsOpen] = useState(false);
    const [celebratedIds, setCelebratedIds] = useState<number[]>([]);

    const greeting = getGreeting();
    const currentDate = getCurrentDate();

    // SVG Bar Chart dimensions
    const chartWidth = 600;
    const chartPadTop = 20;
    const chartPadBottom = 30;
    const chartPadLeft = 50;
    const chartPadRight = 10;
    const barCount = weeklyRevenue.length;
    const barGap = 10;
    const yMax = 6000;
    const yTicks = [0, 1500, 3000, 4500, 6000];

    const handleCelebrate = (id: number) => {
        if (!celebratedIds.includes(id)) {
            setCelebratedIds((prev) => [...prev, id]);
        }
    };

    // Reports data
    const revenueMax = Math.max(...revenueByClassType.map((r) => r.amount));

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">

                {/* ── SECTION 1 — Greeting ──────────────────────────────────── */}
                <div>
                    <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                        {greeting}, Amahle {"\uD83D\uDE4F"}
                    </h1>
                    <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">{currentDate}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {[
                            { label: "Classes today", value: "6" },
                            { label: "Students expected", value: "84" },
                            { label: "Revenue today", value: "R3,240" },
                            { label: "Instructors on", value: "3" },
                            { label: "Waitlisted", value: "4 students" },
                        ].map((chip) => (
                            <span
                                key={chip.label}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--pa-text-secondary)]"
                            >
                                <span className="font-semibold text-[var(--pa-text-primary)]">{chip.value}</span>
                                {chip.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 2 — Live Right Now ────────────────────────────── */}
                <div className="rounded-2xl border border-[#14B8A6]/30 bg-[#14B8A6]/5 p-4 lg:p-5">
                    <div className="flex items-center gap-2">
                        <span className="relative flex size-2.5">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#14B8A6] opacity-75" />
                            <span className="relative inline-flex size-2.5 rounded-full bg-[#14B8A6]" />
                        </span>
                        <h2 className="text-sm font-semibold text-[#14B8A6]">LIVE RIGHT NOW</h2>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                        {[
                            { label: "Classes active", value: "2" },
                            { label: "Students on mat", value: "28" },
                            { label: "Next class", value: "10:30 \u2014 Gentle Restorative" },
                            { label: "Waitlist alerts", value: "4 for 18:00 Yin" },
                            { label: "Low pass stock", value: "3 with 1 class left" },
                        ].map((item) => (
                            <div key={item.label} className="rounded-lg bg-[var(--pa-bg-surface)] px-3 py-2.5 border border-[var(--pa-border-subtle)]">
                                <p className="text-xs text-[var(--pa-text-muted)]">{item.label}</p>
                                <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 3 — KPI Cards ─────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                    {/* Today's Revenue */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                            <svg className="size-5 text-[#14B8A6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Today&apos;s Revenue</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">R3,240</p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-[var(--pa-text-muted)]">Target: R4,500 (72%)</span>
                            <span className="text-xs font-medium text-[#14B8A6]">+8%</span>
                        </div>
                    </div>

                    {/* Classes Today */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#5A4EFF]/15">
                            <svg className="size-5 text-[#5A4EFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Classes Today</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">6</p>
                        <p className="mt-1 text-xs text-[var(--pa-text-muted)]">2 complete &middot; 2 active &middot; 2 upcoming</p>
                    </div>

                    {/* Active Memberships */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#EEA0FF]/15">
                            <svg className="size-5 text-[#EEA0FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Active Memberships</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">94</p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-[var(--pa-text-muted)]">12 unlimited &middot; 82 passes</span>
                            <span className="text-xs font-medium text-[#14B8A6]">+3</span>
                        </div>
                    </div>

                    {/* Studio Utilisation */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                            <svg className="size-5 text-[#14B8A6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Studio Utilisation</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">71%</p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-[var(--pa-text-muted)]">Flow 85% &middot; Yin 58%</span>
                            <span className="text-xs font-medium text-[#14B8A6]">+4%</span>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 4 — Schedule + Revenue Chart ──────────────────── */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
                    {/* Left: Today's Class Schedule (3 cols) */}
                    <div className="lg:col-span-3 rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                                Today&apos;s Class Schedule
                            </h2>
                            <span className="text-xs text-[var(--pa-text-secondary)]">6 classes</span>
                        </div>
                        <div className="mt-3 space-y-2 lg:mt-4">
                            {todayClasses.map((cls) => {
                                const isFull = cls.enrolled >= cls.capacity;
                                const fillPct = Math.min((cls.enrolled / cls.capacity) * 100, 100);
                                return (
                                    <div
                                        key={cls.id}
                                        className="flex min-h-[48px] flex-wrap items-center gap-2.5 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5 lg:gap-3"
                                    >
                                        {/* Time */}
                                        <span className="w-11 flex-shrink-0 text-sm font-semibold text-[var(--pa-text-primary)]">{cls.time}</span>

                                        {/* Name + Style badge */}
                                        <div className="flex min-w-0 flex-1 items-center gap-2">
                                            <span className="truncate text-sm font-medium text-[var(--pa-text-primary)]">{cls.name}</span>
                                            <span
                                                className="hidden flex-shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white sm:inline"
                                                style={{ backgroundColor: cls.styleColor }}
                                            >
                                                {cls.style}
                                            </span>
                                        </div>

                                        {/* Instructor initials */}
                                        <span
                                            className="flex size-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                                            style={{ backgroundColor: cls.instructorColor }}
                                        >
                                            {cls.initials}
                                        </span>

                                        {/* Room badge */}
                                        <span className="hidden rounded-md bg-[var(--pa-bg-elevated)] px-2 py-0.5 text-xs text-[var(--pa-text-muted)] md:inline">
                                            {cls.room}
                                        </span>

                                        {/* Attendance bar */}
                                        <div className="hidden w-20 flex-shrink-0 items-center gap-1.5 sm:flex">
                                            <div className="h-1.5 flex-1 rounded-full bg-[var(--pa-bg-elevated)]">
                                                <div
                                                    className="h-full rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${fillPct}%`,
                                                        backgroundColor: isFull ? "#EF4444" : "#14B8A6",
                                                    }}
                                                />
                                            </div>
                                            <span className={`text-[10px] font-medium ${isFull ? "text-[#EF4444]" : "text-[var(--pa-text-muted)]"}`}>
                                                {cls.enrolled}/{cls.capacity}
                                                {isFull && " FULL"}
                                            </span>
                                        </div>

                                        {/* Status pill */}
                                        {classStatusPill(cls)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Revenue Bar Chart (2 cols) */}
                    <div className="lg:col-span-2 rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                            Weekly Revenue
                        </h2>
                        <p className="mt-0.5 text-xs text-[var(--pa-text-muted)]">This week &middot; R23,300 total</p>

                        <div className="mt-4">
                            <svg
                                viewBox={`0 0 ${chartWidth} 210`}
                                className="h-[200px] w-full lg:h-[260px]"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <defs>
                                    <linearGradient id="yogaBarGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#14B8A6" />
                                        <stop offset="100%" stopColor="#0D9488" />
                                    </linearGradient>
                                </defs>

                                {/* Y-axis grid lines */}
                                {yTicks.map((tick) => {
                                    const barAreaHeight = 210 - chartPadTop - chartPadBottom;
                                    const y = chartPadTop + barAreaHeight - (tick / yMax) * barAreaHeight;
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
                                                {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Bars */}
                                {weeklyRevenue.map((d, i) => {
                                    const barAreaWidth = chartWidth - chartPadLeft - chartPadRight;
                                    const barAreaHeight = 210 - chartPadTop - chartPadBottom;
                                    const barWidth = (barAreaWidth - barGap * (barCount - 1)) / barCount;
                                    const barH = (d.amount / yMax) * barAreaHeight;
                                    const x = chartPadLeft + i * (barWidth + barGap);
                                    const y = chartPadTop + barAreaHeight - barH;
                                    const isHovered = hoveredBar === i;

                                    return (
                                        <g
                                            key={d.day}
                                            onMouseEnter={() => setHoveredBar(i)}
                                            onMouseLeave={() => setHoveredBar(null)}
                                            className="cursor-pointer"
                                        >
                                            <rect x={x} y={chartPadTop} width={barWidth} height={barAreaHeight} fill="transparent" />
                                            <rect
                                                x={x}
                                                y={y}
                                                width={barWidth}
                                                height={barH}
                                                rx={4}
                                                fill="url(#yogaBarGrad)"
                                                opacity={isHovered ? 1 : 0.75}
                                                className="transition-opacity duration-100 ease-linear"
                                            />
                                            <text
                                                x={x + barWidth / 2}
                                                y={210 - 6}
                                                textAnchor="middle"
                                                fill="var(--pa-text-secondary)"
                                                fontSize={10}
                                            >
                                                {d.day}
                                            </text>
                                            {isHovered && (
                                                <g>
                                                    <rect
                                                        x={x + barWidth / 2 - 32}
                                                        y={y - 26}
                                                        width={64}
                                                        height={20}
                                                        rx={4}
                                                        fill="var(--pa-bg-surface)"
                                                        stroke="var(--pa-border-default)"
                                                        strokeWidth={1}
                                                    />
                                                    <text
                                                        x={x + barWidth / 2}
                                                        y={y - 12}
                                                        textAnchor="middle"
                                                        fill="var(--pa-text-primary)"
                                                        fontSize={11}
                                                        fontWeight={600}
                                                    >
                                                        R{d.amount.toLocaleString("en-ZA")}
                                                    </text>
                                                </g>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 5 — Attention Needed ──────────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                        Attention Needed
                    </h2>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-4">
                        {alerts.map((alert) => {
                            const colors = alertColors(alert.type);
                            return (
                                <div
                                    key={alert.id}
                                    className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}
                                >
                                    <p className={`text-sm font-medium ${colors.text}`}>{alert.message}</p>
                                    <button
                                        className={`mt-3 rounded-lg ${colors.btn} px-3 py-1.5 text-xs font-medium text-white transition duration-100 ease-linear hover:opacity-90`}
                                    >
                                        {alert.action}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── SECTION 6 — Today's Instructors ───────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                        Today&apos;s Instructors
                    </h2>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-4">
                        {instructors.map((inst) => (
                            <div
                                key={inst.name}
                                className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex size-10 items-center justify-center rounded-full text-sm font-bold text-white"
                                        style={{ backgroundColor: inst.color }}
                                    >
                                        {inst.initials}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{inst.name}</p>
                                        <p className="text-xs text-[var(--pa-text-muted)]">{inst.role}</p>
                                    </div>
                                    <span className="rounded-full bg-[var(--pa-bg-elevated)] px-2 py-0.5 text-xs font-medium text-[var(--pa-text-secondary)]">
                                        {inst.classesComplete}/{inst.classesTotal} classes
                                    </span>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="rounded-lg bg-[var(--pa-bg-elevated)] px-2.5 py-1.5">
                                        <p className="text-[10px] text-[var(--pa-text-muted)]">Students</p>
                                        <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{inst.students}</p>
                                    </div>
                                    <div className="rounded-lg bg-[var(--pa-bg-elevated)] px-2.5 py-1.5">
                                        <p className="text-[10px] text-[var(--pa-text-muted)]">Revenue</p>
                                        <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{inst.revenue}</p>
                                    </div>
                                </div>
                                <div className="mt-2.5 flex flex-wrap gap-1.5">
                                    {inst.styles.map((s) => (
                                        <span
                                            key={s}
                                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                                            style={{ backgroundColor: `${inst.color}20`, color: inst.color }}
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 7 — Studio Capacity ───────────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                        Studio Capacity
                    </h2>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-4">
                        {/* Flow Room */}
                        <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--pa-text-primary)]">Flow Room</p>
                                    <p className="text-xs text-[var(--pa-text-muted)]">Hot Yoga Flow</p>
                                </div>
                                <span className="rounded-full bg-[#EF4444]/15 px-2.5 py-0.5 text-xs font-semibold text-[#EF4444]">
                                    20/20 FULL
                                </span>
                            </div>
                            <div className="mt-3 h-2.5 rounded-full bg-[var(--pa-bg-elevated)]">
                                <div className="h-full w-full rounded-full bg-[#EF4444] transition-all duration-300" />
                            </div>
                            <p className="mt-1.5 text-right text-xs text-[var(--pa-text-muted)]">100% capacity</p>
                        </div>

                        {/* Yin Room */}
                        <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--pa-text-primary)]">Yin Room</p>
                                    <p className="text-xs text-[var(--pa-text-muted)]">Gentle Restorative</p>
                                </div>
                                <span className="rounded-full bg-[#14B8A6]/15 px-2.5 py-0.5 text-xs font-semibold text-[#14B8A6]">
                                    8/12
                                </span>
                            </div>
                            <div className="mt-3 h-2.5 rounded-full bg-[var(--pa-bg-elevated)]">
                                <div className="h-full rounded-full bg-[#14B8A6] transition-all duration-300" style={{ width: "67%" }} />
                            </div>
                            <p className="mt-1.5 text-right text-xs text-[var(--pa-text-muted)]">67% capacity</p>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 8 — Recent Students ───────────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                        Recent Students
                    </h2>
                    <div className="mt-3 space-y-2 lg:mt-4">
                        {recentStudents.map((student) => (
                            <div
                                key={student.id}
                                className="flex min-h-[48px] items-center gap-3 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5"
                            >
                                <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-[#14B8A6]/15 text-xs font-bold text-[#14B8A6]">
                                    {student.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[var(--pa-text-primary)]">{student.name}</p>
                                    <p className="text-xs text-[var(--pa-text-muted)]">
                                        {student.membershipType} &middot; {student.classesAttended} classes &middot; Last: {student.lastClass}
                                    </p>
                                </div>
                                {student.passesLeft !== undefined && (
                                    <span
                                        className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            student.passesLeft <= 1
                                                ? "bg-[#F59E0B]/15 text-[#F59E0B]"
                                                : "bg-[var(--pa-bg-elevated)] text-[var(--pa-text-secondary)]"
                                        }`}
                                    >
                                        {student.passesLeft} pass{student.passesLeft !== 1 ? "es" : ""} left
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 9 — Practice Milestones ───────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                        Practice Milestones
                    </h2>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-4">
                        {milestones.map((m) => {
                            const celebrated = celebratedIds.includes(m.id);
                            return (
                                <div
                                    key={m.id}
                                    className="relative overflow-hidden rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4"
                                >
                                    {celebrated && (
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-3xl opacity-30 animate-bounce">
                                            {"\uD83C\uDF89"}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex size-10 items-center justify-center rounded-full text-sm font-bold text-white"
                                            style={{ backgroundColor: m.color }}
                                        >
                                            {m.initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{m.student}</p>
                                            <p className="text-xs font-medium" style={{ color: m.color }}>{m.achievement}</p>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-[var(--pa-text-muted)]">{m.detail}</p>
                                    <button
                                        onClick={() => handleCelebrate(m.id)}
                                        disabled={celebrated}
                                        className={`mt-3 w-full rounded-lg px-3 py-2 text-xs font-medium transition duration-100 ease-linear ${
                                            celebrated
                                                ? "cursor-default bg-[var(--pa-bg-elevated)] text-[var(--pa-text-muted)]"
                                                : "bg-[#14B8A6] text-white hover:bg-[#0D9488]"
                                        }`}
                                    >
                                        {celebrated ? "Celebrated! \uD83C\uDF89" : "Celebrate \uD83C\uDF8A"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── SECTION 10 — Reports (Collapsible) ────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                    <button
                        onClick={() => setReportsOpen(!reportsOpen)}
                        className="flex w-full items-center justify-between rounded-2xl p-4 text-left transition duration-100 ease-linear hover:bg-[var(--pa-bg-hover)] lg:p-6"
                    >
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                            Reports &amp; Analytics
                        </h2>
                        <svg
                            className={`size-5 text-[var(--pa-text-secondary)] transition-transform duration-200 ${reportsOpen ? "rotate-180" : ""}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    {reportsOpen && (
                        <div className="space-y-6 border-t border-[var(--pa-border-default)] p-4 lg:p-6">
                            {/* Revenue by Class Type — Horizontal Bar Chart */}
                            <div>
                                <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">Revenue by Class Type</h3>
                                <div className="mt-3 space-y-2.5">
                                    {revenueByClassType.map((item) => {
                                        const pct = (item.amount / revenueMax) * 100;
                                        return (
                                            <div key={item.type} className="flex items-center gap-3">
                                                <span className="w-24 flex-shrink-0 text-xs font-medium text-[var(--pa-text-secondary)]">{item.type}</span>
                                                <div className="h-3 flex-1 rounded-full bg-[var(--pa-bg-elevated)]">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-300"
                                                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                                                    />
                                                </div>
                                                <span className="w-16 flex-shrink-0 text-right text-xs font-semibold text-[var(--pa-text-primary)]">
                                                    R{item.amount.toLocaleString("en-ZA")}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Metrics Cards */}
                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                {[
                                    { label: "Monthly Revenue", value: "R45,100", change: "+12%", positive: true },
                                    { label: "Avg Class Size", value: "14.2", change: "+0.8", positive: true },
                                    { label: "Retention Rate", value: "87%", change: "+2%", positive: true },
                                    { label: "No-Show Rate", value: "6%", change: "-1%", positive: true },
                                ].map((metric) => (
                                    <div key={metric.label} className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-3.5">
                                        <p className="text-xs text-[var(--pa-text-muted)]">{metric.label}</p>
                                        <p className="mt-1 text-lg font-semibold text-[var(--pa-text-primary)]">{metric.value}</p>
                                        <span className={`text-xs font-medium ${metric.positive ? "text-[#14B8A6]" : "text-[#EF4444]"}`}>
                                            {metric.change}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Top Classes Table */}
                            <div>
                                <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">Top Classes This Month</h3>
                                <div className="mt-3 overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-[var(--pa-border-default)]">
                                                <th className="pb-2 text-xs font-medium text-[var(--pa-text-muted)]">Class</th>
                                                <th className="pb-2 text-xs font-medium text-[var(--pa-text-muted)]">Instructor</th>
                                                <th className="pb-2 text-right text-xs font-medium text-[var(--pa-text-muted)]">Sessions</th>
                                                <th className="pb-2 text-right text-xs font-medium text-[var(--pa-text-muted)]">Avg Fill</th>
                                                <th className="pb-2 text-right text-xs font-medium text-[var(--pa-text-muted)]">Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { cls: "Hot Yoga Flow", instructor: "Amahle", sessions: 20, avgFill: "95%", revenue: "R9,800" },
                                                { cls: "Early Morning Vinyasa", instructor: "Ravi", sessions: 22, avgFill: "88%", revenue: "R8,400" },
                                                { cls: "Evening Yin Yoga", instructor: "Sipho", sessions: 20, avgFill: "92%", revenue: "R6,500" },
                                                { cls: "Sunrise Hatha", instructor: "Candice", sessions: 22, avgFill: "82%", revenue: "R7,200" },
                                                { cls: "Power Vinyasa", instructor: "Ravi", sessions: 18, avgFill: "78%", revenue: "R5,800" },
                                            ].map((row, idx) => (
                                                <tr key={idx} className="border-b border-[var(--pa-border-subtle)]">
                                                    <td className="py-2.5 font-medium text-[var(--pa-text-primary)]">{row.cls}</td>
                                                    <td className="py-2.5 text-[var(--pa-text-secondary)]">{row.instructor}</td>
                                                    <td className="py-2.5 text-right text-[var(--pa-text-secondary)]">{row.sessions}</td>
                                                    <td className="py-2.5 text-right text-[var(--pa-text-secondary)]">{row.avgFill}</td>
                                                    <td className="py-2.5 text-right font-semibold text-[var(--pa-text-primary)]">{row.revenue}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
