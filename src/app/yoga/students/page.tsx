"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    SearchLg,
    Plus,
    Users01,
    ChevronRight,
    TrendUp01,
    RefreshCw05,
    Star01,
    FilterLines,
} from "@untitledui/icons";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface YogaStudent {
    id: string;
    name: string;
    initials: string;
    membershipType: "Monthly Unlimited" | "10-Class Pass" | "Drop-in" | "Expired";
    classesRemaining: number | null;
    expiringDays: number | null;
    lastClass: string | null;
    lastClassDate: string;
    streak: number | null;
    totalClasses: number;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const yogaStudents: YogaStudent[] = [
    { id: "1", name: "Kefilwe Sithole", initials: "KS", membershipType: "Monthly Unlimited", classesRemaining: null, expiringDays: null, lastClass: "Vinyasa Flow", lastClassDate: "2026-03-19", streak: 8, totalClasses: 34 },
    { id: "2", name: "Lerato Mahlangu", initials: "LM", membershipType: "Monthly Unlimited", classesRemaining: null, expiringDays: 3, lastClass: "Yin Yoga", lastClassDate: "2026-03-17", streak: null, totalClasses: 22 },
    { id: "3", name: "Priya Naidoo", initials: "PN", membershipType: "10-Class Pass", classesRemaining: 4, expiringDays: null, lastClass: "Hatha", lastClassDate: "2026-03-18", streak: 3, totalClasses: 18 },
    { id: "4", name: "Andile Dube", initials: "AD", membershipType: "10-Class Pass", classesRemaining: 1, expiringDays: null, lastClass: "Power Yoga", lastClassDate: "2026-03-12", streak: null, totalClasses: 9 },
    { id: "5", name: "Thabo Khumalo", initials: "TK", membershipType: "Monthly Unlimited", classesRemaining: null, expiringDays: null, lastClass: "Ashtanga", lastClassDate: "2026-03-19", streak: 7, totalClasses: 28 },
    { id: "6", name: "Fatima Moosa", initials: "FM", membershipType: "Drop-in", classesRemaining: null, expiringDays: null, lastClass: "Restorative", lastClassDate: "2026-03-10", streak: null, totalClasses: 6 },
];

const stats = [
    { label: "Total Students", value: "127", icon: Users01, change: "+8" },
    { label: "Active This Week", value: "54", icon: TrendUp01, change: "+12%" },
    { label: "Avg. Classes / Week", value: "2.4", icon: RefreshCw05, change: "+0.3" },
    { label: "Retention Rate", value: "91%", icon: Star01, change: "+3%" },
];

type FilterTab = "All" | "Active" | "Expiring Pass" | "Membership" | "New" | "Inactive";
const filterTabs: FilterTab[] = ["All", "Active", "Expiring Pass", "Membership", "New", "Inactive"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const membershipBadge: Record<string, { bg: string; text: string }> = {
    "Monthly Unlimited": { bg: "bg-blue-500/15", text: "text-blue-400" },
    "10-Class Pass": { bg: "bg-purple-400/15", text: "text-purple-400" },
    "Drop-in": { bg: "bg-gray-400/15", text: "text-[var(--pa-text-secondary)]" },
    Expired: { bg: "bg-red-500/15", text: "text-red-400" },
};

const avatarColors = [
    "bg-[#14B8A6]/20 text-[#14B8A6]",
    "bg-teal-500/20 text-teal-400",
    "bg-cyan-500/20 text-cyan-400",
    "bg-emerald-500/20 text-emerald-400",
    "bg-green-500/20 text-green-400",
    "bg-sky-500/20 text-sky-400",
];

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function filterStudents(students: YogaStudent[], tab: FilterTab, search: string): YogaStudent[] {
    let filtered = students;

    if (tab === "Active") {
        filtered = filtered.filter((s) => s.membershipType !== "Expired" && s.membershipType !== "Drop-in");
    } else if (tab === "Expiring Pass") {
        filtered = filtered.filter((s) => (s.expiringDays !== null && s.expiringDays <= 7) || (s.classesRemaining !== null && s.classesRemaining <= 2));
    } else if (tab === "Membership") {
        filtered = filtered.filter((s) => s.membershipType === "Monthly Unlimited");
    } else if (tab === "New") {
        filtered = filtered.filter((s) => s.totalClasses < 10);
    } else if (tab === "Inactive") {
        filtered = filtered.filter((s) => {
            const lastDate = new Date(s.lastClassDate);
            const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            return daysSince > 14;
        });
    }

    if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter((s) => s.name.toLowerCase().includes(q));
    }

    return filtered;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function YogaStudentsPage() {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<FilterTab>("All");

    const filteredStudents = useMemo(
        () => filterStudents(yogaStudents, activeTab, search),
        [activeTab, search],
    );

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--pa-text-primary)]">Students</h1>
                    <p className="mt-1 text-sm text-[var(--pa-text-secondary)]">
                        Manage your yoga studio student roster
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg bg-[#14B8A6] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                    <Plus className="size-4" />
                    Add Student
                </button>
            </div>

            {/* Search + Filter Row */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <SearchLg className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[var(--pa-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search students by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--pa-text-primary)] placeholder-[var(--pa-text-muted)] outline-none transition duration-100 ease-linear focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6]"
                    />
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-4 py-2.5 text-sm font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-hover)]">
                    <FilterLines className="size-4" />
                    Filter
                </button>
            </div>

            {/* Stats Row */}
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-[#14B8A6]/10">
                                    <Icon className="size-4 text-[#14B8A6]" />
                                </div>
                                <span className="text-xs font-medium text-emerald-400">
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-semibold text-[var(--pa-text-primary)]">{stat.value}</p>
                            <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filter Tabs */}
            <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-1">
                {filterTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`shrink-0 rounded-md px-4 py-1.5 text-sm font-medium transition duration-100 ease-linear ${
                            activeTab === tab
                                ? "bg-[#14B8A6] text-white"
                                : "text-[var(--pa-text-secondary)] hover:text-[var(--pa-text-primary)]"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Student Cards */}
            {filteredStudents.length === 0 && (
                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-4 py-12 text-center text-sm text-[var(--pa-text-muted)]">
                    No students found matching your search.
                </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.map((student, idx) => {
                    const badge = membershipBadge[student.membershipType];
                    const avatarColor = avatarColors[idx % avatarColors.length];
                    const isExpiring = student.expiringDays !== null && student.expiringDays <= 7;
                    const isLowClasses = student.classesRemaining !== null && student.classesRemaining <= 2;

                    return (
                        <Link
                            key={student.id}
                            href={`/yoga/students/${student.id}`}
                            className="group rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 transition duration-100 ease-linear hover:border-[#14B8A6]/40"
                        >
                            {/* Top row: avatar + name + action */}
                            <div className="mb-3 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColor}`}
                                    >
                                        {student.initials}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-[var(--pa-text-primary)]">
                                            {student.name}
                                        </p>
                                        <span
                                            className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
                                        >
                                            {student.membershipType}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-[var(--pa-text-muted)] transition duration-100 ease-linear group-hover:text-[#14B8A6]" />
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {/* Classes remaining or Unlimited */}
                                {student.classesRemaining !== null ? (
                                    <div>
                                        <p className="text-xs text-[var(--pa-text-muted)]">Classes Left</p>
                                        <p className={`text-sm font-semibold ${isLowClasses ? "text-red-400" : "text-[var(--pa-text-primary)]"}`}>
                                            {student.classesRemaining}
                                        </p>
                                    </div>
                                ) : student.membershipType === "Monthly Unlimited" ? (
                                    <div>
                                        <p className="text-xs text-[var(--pa-text-muted)]">Access</p>
                                        <p className="text-sm font-semibold text-[var(--pa-text-primary)]">Unlimited</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-xs text-[var(--pa-text-muted)]">Type</p>
                                        <p className="text-sm font-semibold text-[var(--pa-text-primary)]">Per Class</p>
                                    </div>
                                )}

                                {/* Total classes */}
                                <div>
                                    <p className="text-xs text-[var(--pa-text-muted)]">Total Classes</p>
                                    <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{student.totalClasses}</p>
                                </div>

                                {/* Last class */}
                                <div>
                                    <p className="text-xs text-[var(--pa-text-muted)]">Last Class</p>
                                    <p className="truncate text-sm text-[var(--pa-text-secondary)]">
                                        {student.lastClass ?? "N/A"}
                                    </p>
                                </div>

                                {/* Streak */}
                                <div>
                                    <p className="text-xs text-[var(--pa-text-muted)]">Streak</p>
                                    {student.streak ? (
                                        <p className="text-sm font-semibold text-[var(--pa-text-primary)]">
                                            {"\uD83D\uDD25"} {student.streak}d
                                        </p>
                                    ) : (
                                        <p className="text-sm text-[var(--pa-text-muted)]">&mdash;</p>
                                    )}
                                </div>
                            </div>

                            {/* Expiring / Low classes warning */}
                            {(isExpiring || isLowClasses) && (
                                <div className="mt-3 rounded-lg bg-red-500/10 px-3 py-1.5">
                                    <p className="text-xs font-medium text-red-400">
                                        {isExpiring
                                            ? `Membership expiring in ${student.expiringDays} day${student.expiringDays === 1 ? "" : "s"}`
                                            : `Only ${student.classesRemaining} class${student.classesRemaining === 1 ? "" : "es"} remaining`}
                                    </p>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
