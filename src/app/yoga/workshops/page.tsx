"use client";

import { useState } from "react";
import {
    Plus,
    Calendar,
    Clock,
    Users01,
    CurrencyDollar,
    MarkerPin01,
    ChevronDown,
    ChevronUp,
    Globe01,
    Star01,
} from "@untitledui/icons";

// ── Types ────────────────────────────────────────────────────────────────────

interface Workshop {
    id: number;
    title: string;
    subtitle: string;
    date: string;
    time: string;
    instructor: string;
    instructorInitials: string;
    instructorColor: string;
    location: string;
    locationType: "in-person" | "online";
    spotsBooked: number;
    spotsTotal: number;
    price: string;
    featured: boolean;
}

interface Registration {
    id: number;
    workshopId: number;
    studentName: string;
    registeredDate: string;
    paid: boolean;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const workshops: Workshop[] = [
    {
        id: 1,
        title: "Yin Yoga & Sound Bath",
        subtitle: "Full Moon",
        date: "Fri 28 Mar 2026",
        time: "19:00 – 21:00",
        instructor: "Sipho",
        instructorInitials: "S",
        instructorColor: "#E2F4A6",
        location: "Flow Room",
        locationType: "in-person",
        spotsBooked: 25,
        spotsTotal: 30,
        price: "R280",
        featured: true,
    },
    {
        id: 2,
        title: "30-Day Morning Sadhana",
        subtitle: "April Challenge",
        date: "1 – 30 Apr 2026",
        time: "06:00 – 07:00 daily",
        instructor: "Amahle",
        instructorInitials: "A",
        instructorColor: "#5A4EFF",
        location: "Online (Zoom)",
        locationType: "online",
        spotsBooked: 18,
        spotsTotal: 50,
        price: "R450",
        featured: true,
    },
];

const pastWorkshops: Workshop[] = [
    {
        id: 3,
        title: "Inversions Workshop",
        subtitle: "Headstand & Handstand Prep",
        date: "Sat 15 Mar 2026",
        time: "10:00 – 12:00",
        instructor: "Amahle",
        instructorInitials: "A",
        instructorColor: "#5A4EFF",
        location: "Flow Room",
        locationType: "in-person",
        spotsBooked: 20,
        spotsTotal: 20,
        price: "R250",
        featured: false,
    },
    {
        id: 4,
        title: "Breathwork & Meditation",
        subtitle: "Pranayama Deep Dive",
        date: "Sat 1 Mar 2026",
        time: "09:00 – 11:00",
        instructor: "Sipho",
        instructorInitials: "S",
        instructorColor: "#E2F4A6",
        location: "Zen Room",
        locationType: "in-person",
        spotsBooked: 15,
        spotsTotal: 20,
        price: "R200",
        featured: false,
    },
    {
        id: 5,
        title: "Yoga for Runners",
        subtitle: "Recovery & Flexibility",
        date: "Sun 23 Feb 2026",
        time: "08:00 – 09:30",
        instructor: "Ravi",
        instructorInitials: "R",
        instructorColor: "#EEA0FF",
        location: "Flow Room",
        locationType: "in-person",
        spotsBooked: 22,
        spotsTotal: 25,
        price: "R220",
        featured: false,
    },
];

const registrations: Registration[] = [
    { id: 1, workshopId: 1, studentName: "Lindiwe Maseko", registeredDate: "2026-03-10", paid: true },
    { id: 2, workshopId: 1, studentName: "James van der Berg", registeredDate: "2026-03-11", paid: true },
    { id: 3, workshopId: 1, studentName: "Priya Naidoo", registeredDate: "2026-03-12", paid: true },
    { id: 4, workshopId: 1, studentName: "Thabo Molefe", registeredDate: "2026-03-13", paid: false },
    { id: 5, workshopId: 2, studentName: "Fatima Osman", registeredDate: "2026-03-15", paid: true },
    { id: 6, workshopId: 2, studentName: "Michael Botha", registeredDate: "2026-03-16", paid: true },
    { id: 7, workshopId: 2, studentName: "Sarah Chen", registeredDate: "2026-03-17", paid: true },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
    });
}

// ── Page Component ───────────────────────────────────────────────────────────

export default function YogaWorkshopsPage() {
    const [showPast, setShowPast] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState<number | null>(1);

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Workshops &amp; Events
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Manage special workshops, retreats, and events
                        </p>
                    </div>
                    <button className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                        <Plus className="size-5" />
                        Create Workshop
                    </button>
                </div>

                {/* ── Upcoming Workshops (Featured Cards) ─────────────── */}
                <div>
                    <h2 className="mb-3 text-lg font-semibold text-[var(--pa-text-primary)]">
                        Upcoming Workshops
                    </h2>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {workshops.map((ws) => {
                            const spotsLeft = ws.spotsTotal - ws.spotsBooked;
                            const pct = Math.round((ws.spotsBooked / ws.spotsTotal) * 100);

                            return (
                                <div
                                    key={ws.id}
                                    className="relative overflow-hidden rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]"
                                >
                                    <div className="h-1 w-full bg-gradient-to-r from-[#14B8A6] via-[#0EA5E9] to-[#6366F1]" />

                                    <div className="p-5">
                                        {/* Title + badge */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Star01 className="size-5 text-[#14B8A6]" />
                                                    <h3 className="text-base font-semibold text-[var(--pa-text-primary)]">
                                                        {ws.title}
                                                    </h3>
                                                </div>
                                                <p className="mt-0.5 text-sm text-[#14B8A6]">{ws.subtitle}</p>
                                            </div>
                                            <span className="shrink-0 text-xl font-bold text-[#14B8A6]">{ws.price}</span>
                                        </div>

                                        {/* Details grid */}
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2 text-sm text-[var(--pa-text-secondary)]">
                                                <Calendar className="size-4 text-[var(--pa-text-muted)]" />
                                                {ws.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[var(--pa-text-secondary)]">
                                                <Clock className="size-4 text-[var(--pa-text-muted)]" />
                                                {ws.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[var(--pa-text-secondary)]">
                                                <div
                                                    className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold"
                                                    style={{
                                                        backgroundColor: ws.instructorColor,
                                                        color: ws.instructorColor === "#E2F4A6" || ws.instructorColor === "#EEA0FF" ? "#1a1a1a" : "#fff",
                                                    }}
                                                >
                                                    {ws.instructorInitials}
                                                </div>
                                                {ws.instructor}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[var(--pa-text-secondary)]">
                                                {ws.locationType === "online" ? (
                                                    <Globe01 className="size-4 text-[var(--pa-text-muted)]" />
                                                ) : (
                                                    <MarkerPin01 className="size-4 text-[var(--pa-text-muted)]" />
                                                )}
                                                {ws.location}
                                            </div>
                                        </div>

                                        {/* Booking progress */}
                                        <div className="mt-4 border-t border-[var(--pa-border-default)] pt-4">
                                            <div className="flex items-center justify-between text-xs text-[var(--pa-text-muted)]">
                                                <span>{ws.spotsBooked}/{ws.spotsTotal} booked</span>
                                                <span className={spotsLeft <= 5 ? "font-medium text-[#F59E0B]" : ""}>
                                                    {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                                                </span>
                                            </div>
                                            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--pa-bg-elevated)]">
                                                <div
                                                    className="h-full rounded-full bg-[#14B8A6] transition-all duration-300"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Registration Table ──────────────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                    <div className="flex items-center justify-between border-b border-[var(--pa-border-default)] p-5">
                        <h2 className="text-base font-semibold text-[var(--pa-text-primary)]">
                            Registrations
                        </h2>
                        <div className="flex gap-1 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-0.5">
                            {workshops.map((ws) => (
                                <button
                                    key={ws.id}
                                    onClick={() => setSelectedWorkshop(ws.id)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear ${
                                        selectedWorkshop === ws.id
                                            ? "bg-[#14B8A6] text-white"
                                            : "text-[var(--pa-text-secondary)] hover:text-[var(--pa-text-primary)]"
                                    }`}
                                >
                                    {ws.title.split(" ").slice(0, 3).join(" ")}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[var(--pa-border-default)] text-[var(--pa-text-secondary)]">
                                    <th className="px-5 py-3 font-medium">Student</th>
                                    <th className="px-5 py-3 font-medium">Registered</th>
                                    <th className="px-5 py-3 font-medium">Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations
                                    .filter((r) => r.workshopId === selectedWorkshop)
                                    .map((r) => (
                                        <tr
                                            key={r.id}
                                            className="border-b border-[var(--pa-border-default)] last:border-b-0"
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-7 items-center justify-center rounded-full bg-[#14B8A6]/15 text-xs font-semibold text-[#14B8A6]">
                                                        {r.studentName.split(" ").map((n) => n[0]).join("")}
                                                    </div>
                                                    <span className="font-medium text-[var(--pa-text-primary)]">
                                                        {r.studentName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-[var(--pa-text-secondary)]">
                                                {formatDate(r.registeredDate)}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {r.paid ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/15 px-2.5 py-0.5 text-xs font-medium text-[#22C55E]">
                                                        <span className="size-1.5 rounded-full bg-[#22C55E]" />
                                                        Paid
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/15 px-2.5 py-0.5 text-xs font-medium text-[#F59E0B]">
                                                        <span className="size-1.5 rounded-full bg-[#F59E0B]" />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Past Workshops (Collapsed) ──────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                    <button
                        onClick={() => setShowPast(!showPast)}
                        className="flex w-full items-center justify-between p-5 text-left transition duration-100 ease-linear hover:bg-[var(--pa-bg-hover)]"
                    >
                        <div>
                            <h2 className="text-base font-semibold text-[var(--pa-text-primary)]">
                                Past Workshops
                            </h2>
                            <p className="mt-0.5 text-sm text-[var(--pa-text-muted)]">
                                {pastWorkshops.length} completed workshops
                            </p>
                        </div>
                        {showPast ? (
                            <ChevronUp className="size-5 text-[var(--pa-text-muted)]" />
                        ) : (
                            <ChevronDown className="size-5 text-[var(--pa-text-muted)]" />
                        )}
                    </button>

                    {showPast && (
                        <div className="border-t border-[var(--pa-border-default)] p-5">
                            <div className="space-y-3">
                                {pastWorkshops.map((ws) => (
                                    <div
                                        key={ws.id}
                                        className="flex flex-col gap-3 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex size-9 items-center justify-center rounded-full text-xs font-bold"
                                                style={{
                                                    backgroundColor: ws.instructorColor,
                                                    color: ws.instructorColor === "#E2F4A6" || ws.instructorColor === "#EEA0FF" ? "#1a1a1a" : "#fff",
                                                }}
                                            >
                                                {ws.instructorInitials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                                    {ws.title}
                                                </p>
                                                <p className="text-xs text-[var(--pa-text-muted)]">
                                                    {ws.date} &middot; {ws.instructor}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-[var(--pa-text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <Users01 className="size-3.5" />
                                                {ws.spotsBooked}/{ws.spotsTotal}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CurrencyDollar className="size-3.5" />
                                                {ws.price}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
