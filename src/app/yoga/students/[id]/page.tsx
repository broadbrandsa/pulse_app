"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Phone01,
    Mail01,
    Calendar,
    Clock,
    Edit05,
    Plus,
    CheckCircle,
    XCircle,
    CreditCard02,
    File06,
    Target04,
    RefreshCw05,
    Award01,
} from "@untitledui/icons";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const studentDetail = {
    name: "Kefilwe Sithole",
    phone: "+27 76 234 5678",
    email: "kefilwe.s@email.co.za",
    initials: "KS",
    joined: "2025-06-10",
    membershipType: "Monthly Unlimited" as const,
    membershipStatus: "Active" as const,
    renewalDate: "2026-04-10",
    autoRenew: true,
    monthlyRate: "R850",
    totalClasses: 34,
    streak: 8,
    classesThisMonth: 9,
    favStyle: "Vinyasa Flow",
    lifetimeClasses: 34,
    goalsTarget: 12,
    goalsCompleted: 9,
};

const stylesExplored = [
    { name: "Vinyasa Flow", count: 14 },
    { name: "Hatha", count: 8 },
    { name: "Ashtanga", count: 5 },
    { name: "Yin Yoga", count: 4 },
    { name: "Restorative", count: 2 },
    { name: "Power Yoga", count: 1 },
];

const weekStreak = [
    { day: "Mon", date: "17 Mar", attended: true, className: "Vinyasa Flow" },
    { day: "Tue", date: "18 Mar", attended: true, className: "Hatha" },
    { day: "Wed", date: "19 Mar", attended: true, className: "Vinyasa Flow" },
    { day: "Thu", date: "20 Mar", attended: false, className: null },
    { day: "Fri", date: "14 Mar", attended: true, className: "Ashtanga" },
    { day: "Sat", date: "15 Mar", attended: true, className: "Yin Yoga" },
    { day: "Sun", date: "16 Mar", attended: false, className: null },
];

const attendanceLog = [
    { date: "2026-03-19", className: "Vinyasa Flow", style: "Vinyasa", instructor: "Zanele Mthembu", checkIn: "QR Scan", payment: "Membership", duration: "60 min", month: "March 2026" },
    { date: "2026-03-18", className: "Hatha Basics", style: "Hatha", instructor: "Priya Govender", checkIn: "Front Desk", payment: "Membership", duration: "75 min", month: "March 2026" },
    { date: "2026-03-17", className: "Vinyasa Flow", style: "Vinyasa", instructor: "Zanele Mthembu", checkIn: "QR Scan", payment: "Membership", duration: "60 min", month: "March 2026" },
    { date: "2026-03-15", className: "Ashtanga Primary", style: "Ashtanga", instructor: "Ravi Pillay", checkIn: "App Check-in", payment: "Membership", duration: "90 min", month: "March 2026" },
    { date: "2026-03-14", className: "Yin Yoga", style: "Yin", instructor: "Thandi Nkosi", checkIn: "QR Scan", payment: "Membership", duration: "60 min", month: "March 2026" },
    { date: "2026-03-12", className: "Power Yoga", style: "Power", instructor: "Zanele Mthembu", checkIn: "Front Desk", payment: "Membership", duration: "60 min", month: "March 2026" },
    { date: "2026-03-10", className: "Vinyasa Flow", style: "Vinyasa", instructor: "Zanele Mthembu", checkIn: "QR Scan", payment: "Membership", duration: "60 min", month: "March 2026" },
    { date: "2026-03-07", className: "Hatha Basics", style: "Hatha", instructor: "Priya Govender", checkIn: "App Check-in", payment: "Membership", duration: "75 min", month: "March 2026" },
    { date: "2026-03-05", className: "Restorative", style: "Restorative", instructor: "Thandi Nkosi", checkIn: "QR Scan", payment: "Membership", duration: "60 min", month: "March 2026" },
    { date: "2026-02-27", className: "Vinyasa Flow", style: "Vinyasa", instructor: "Zanele Mthembu", checkIn: "QR Scan", payment: "Membership", duration: "60 min", month: "February 2026" },
    { date: "2026-02-25", className: "Ashtanga Primary", style: "Ashtanga", instructor: "Ravi Pillay", checkIn: "Front Desk", payment: "Membership", duration: "90 min", month: "February 2026" },
    { date: "2026-02-22", className: "Yin Yoga", style: "Yin", instructor: "Thandi Nkosi", checkIn: "QR Scan", payment: "Membership", duration: "60 min", month: "February 2026" },
];

const paymentHistory = [
    { date: "2026-03-10", description: "Monthly Unlimited - March 2026", amount: "R850", method: "Debit Order", status: "Paid" },
    { date: "2026-02-10", description: "Monthly Unlimited - February 2026", amount: "R850", method: "Debit Order", status: "Paid" },
    { date: "2026-01-10", description: "Monthly Unlimited - January 2026", amount: "R850", method: "Debit Order", status: "Paid" },
    { date: "2025-12-10", description: "Monthly Unlimited - December 2025", amount: "R850", method: "Debit Order", status: "Paid" },
    { date: "2025-11-10", description: "Monthly Unlimited - November 2025", amount: "R850", method: "Debit Order", status: "Paid" },
    { date: "2025-10-10", description: "Monthly Unlimited - October 2025", amount: "R850", method: "Debit Order", status: "Paid" },
];

const studentNotes = [
    { date: "2026-03-19", author: "Zanele Mthembu", text: "Kefilwe progressing well with headstand prep. Suggested she attend the inversions workshop on 28 March." },
    { date: "2026-03-10", author: "Zanele Mthembu", text: "Mentioned lower back tightness. Recommended hip-opener focused classes and home stretches." },
    { date: "2026-02-15", author: "Priya Govender", text: "Excellent form in warrior sequences. Ready to progress to intermediate Hatha." },
];

/* ------------------------------------------------------------------ */
/*  Types & Helpers                                                    */
/* ------------------------------------------------------------------ */

type Tab = "Overview" | "Practice Log" | "Memberships & Passes" | "Notes" | "Payments" | "Forms";
const tabs: Tab[] = ["Overview", "Practice Log", "Memberships & Passes", "Notes", "Payments", "Forms"];

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

const styleBadgeColors: Record<string, { bg: string; text: string }> = {
    Vinyasa: { bg: "bg-blue-500/15", text: "text-blue-400" },
    Hatha: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
    Ashtanga: { bg: "bg-orange-500/15", text: "text-orange-400" },
    Yin: { bg: "bg-purple-400/15", text: "text-purple-400" },
    Restorative: { bg: "bg-pink-400/15", text: "text-pink-400" },
    Power: { bg: "bg-red-500/15", text: "text-red-400" },
};

/* ------------------------------------------------------------------ */
/*  Tab Content Components                                             */
/* ------------------------------------------------------------------ */

function OverviewTab() {
    const s = studentDetail;
    const goalsPct = Math.round((s.goalsCompleted / s.goalsTarget) * 100);

    return (
        <div className="space-y-4">
            {/* Practice Summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Classes This Month", value: String(s.classesThisMonth), icon: Calendar },
                    { label: "Favourite Style", value: s.favStyle, icon: Award01 },
                    { label: "Current Streak", value: `\uD83D\uDD25 ${s.streak} days`, icon: null },
                    { label: "Lifetime Classes", value: String(s.lifetimeClasses), icon: Target04 },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4"
                    >
                        <p className="mb-1 text-xs text-[var(--pa-text-muted)]">{item.label}</p>
                        <p className="text-lg font-semibold text-[var(--pa-text-primary)]">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Styles Explored */}
            <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                <h3 className="mb-3 text-sm font-medium text-[var(--pa-text-secondary)]">Styles Explored</h3>
                <div className="flex flex-wrap gap-2">
                    {stylesExplored.map((style) => {
                        const colors = styleBadgeColors[style.name.split(" ")[0]] ?? { bg: "bg-gray-400/15", text: "text-[var(--pa-text-secondary)]" };
                        return (
                            <span
                                key={style.name}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
                            >
                                {style.name}
                                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{style.count}</span>
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Monthly Goal Progress */}
            <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[var(--pa-text-secondary)]">Monthly Goal</h3>
                    <span className="text-xs text-[var(--pa-text-muted)]">{s.goalsCompleted} / {s.goalsTarget} classes</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                        className="h-full rounded-full bg-[#14B8A6] transition-all duration-300"
                        style={{ width: `${Math.min(goalsPct, 100)}%` }}
                    />
                </div>
                <p className="mt-2 text-xs text-[var(--pa-text-muted)]">{goalsPct}% complete &mdash; {s.goalsTarget - s.goalsCompleted} classes to go this month</p>
            </div>

            {/* Contact Info */}
            <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                <h3 className="mb-3 text-sm font-medium text-[var(--pa-text-secondary)]">Contact Information</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Phone01 className="size-4 text-[var(--pa-text-muted)]" />
                        <span className="text-sm text-[var(--pa-text-primary)]">{s.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail01 className="size-4 text-[var(--pa-text-muted)]" />
                        <span className="text-sm text-[var(--pa-text-primary)]">{s.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="size-4 text-[var(--pa-text-muted)]" />
                        <span className="text-sm text-[var(--pa-text-secondary)]">
                            Member since {formatDate(s.joined)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PracticeLogTab() {
    // Group attendance by month
    const months = Array.from(new Set(attendanceLog.map((a) => a.month)));

    return (
        <div className="space-y-4">
            {/* 7-Day Streak Strip */}
            <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                <h3 className="mb-3 text-sm font-medium text-[var(--pa-text-secondary)]">This Week</h3>
                <div className="flex items-center justify-between gap-2">
                    {weekStreak.map((day) => (
                        <div key={day.day} className="flex flex-col items-center gap-1.5">
                            <span className="text-[10px] font-medium text-[var(--pa-text-muted)]">{day.day}</span>
                            <div
                                className={`flex size-9 items-center justify-center rounded-full text-xs font-medium ${
                                    day.attended
                                        ? "bg-[#14B8A6] text-white"
                                        : "border border-[var(--pa-border-default)] bg-transparent text-[var(--pa-text-muted)]"
                                }`}
                            >
                                {day.attended ? (
                                    <CheckCircle className="size-4" />
                                ) : (
                                    <XCircle className="size-4" />
                                )}
                            </div>
                            <span className="text-[10px] text-[var(--pa-text-muted)]">{day.date}</span>
                            {day.className && (
                                <span className="max-w-[60px] truncate text-[9px] text-[var(--pa-text-muted)]">{day.className}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Attendance List grouped by month */}
            {months.map((month) => {
                const monthEntries = attendanceLog.filter((a) => a.month === month);
                return (
                    <div key={month}>
                        <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-sm font-medium text-[var(--pa-text-secondary)]">{month}</h3>
                            <span className="rounded-full bg-[#14B8A6]/10 px-2 py-0.5 text-[10px] font-medium text-[#14B8A6]">
                                {monthEntries.length} classes
                            </span>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                            {/* Header */}
                            <div className="hidden border-b border-[var(--pa-border-default)] px-4 py-3 sm:grid sm:grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.6fr] sm:gap-4">
                                <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Date</span>
                                <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Class</span>
                                <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Instructor</span>
                                <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Check-in</span>
                                <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Payment</span>
                                <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Duration</span>
                            </div>

                            {monthEntries.map((entry) => {
                                const badge = styleBadgeColors[entry.style] ?? { bg: "bg-gray-400/15", text: "text-[var(--pa-text-secondary)]" };
                                return (
                                    <div
                                        key={entry.date + entry.className}
                                        className="border-b border-[var(--pa-border-default)] px-4 py-3 last:border-b-0 sm:grid sm:grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.6fr] sm:items-center sm:gap-4"
                                    >
                                        {/* Date */}
                                        <p className="text-sm text-[var(--pa-text-secondary)]">{formatDate(entry.date)}</p>

                                        {/* Class + style badge */}
                                        <div className="mt-1 sm:mt-0">
                                            <p className="text-sm font-medium text-[var(--pa-text-primary)]">{entry.className}</p>
                                            <span className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.bg} ${badge.text}`}>
                                                {entry.style}
                                            </span>
                                        </div>

                                        {/* Instructor */}
                                        <p className="mt-1 text-sm text-[var(--pa-text-secondary)] sm:mt-0">{entry.instructor}</p>

                                        {/* Check-in method */}
                                        <p className="mt-1 text-sm text-[var(--pa-text-secondary)] sm:mt-0">{entry.checkIn}</p>

                                        {/* Payment */}
                                        <p className="mt-1 text-sm text-[var(--pa-text-secondary)] sm:mt-0">{entry.payment}</p>

                                        {/* Duration */}
                                        <div className="mt-1 flex items-center gap-1 sm:mt-0">
                                            <Clock className="size-3.5 text-[var(--pa-text-muted)] sm:hidden" />
                                            <p className="text-sm text-[var(--pa-text-secondary)]">{entry.duration}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function MembershipsTab() {
    const s = studentDetail;

    return (
        <div className="space-y-4">
            {/* Current Membership Card */}
            <div className="rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/5 p-5">
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-[var(--pa-text-primary)]">{s.membershipType}</h3>
                            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                                {s.membershipStatus}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-[var(--pa-text-secondary)]">{s.monthlyRate} / month</p>
                    </div>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-hover)]">
                        <Edit05 className="size-3.5" />
                        Manage
                    </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                        <p className="text-xs text-[var(--pa-text-muted)]">Next Renewal</p>
                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">{formatDate(s.renewalDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[var(--pa-text-muted)]">Auto-Renew</p>
                        <div className="flex items-center gap-1.5">
                            <div className={`size-2 rounded-full ${s.autoRenew ? "bg-emerald-400" : "bg-red-400"}`} />
                            <p className="text-sm font-medium text-[var(--pa-text-primary)]">{s.autoRenew ? "Enabled" : "Disabled"}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-[var(--pa-text-muted)]">Payment Method</p>
                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">Debit Order</p>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            <div>
                <h3 className="mb-2 text-sm font-medium text-[var(--pa-text-secondary)]">Payment History</h3>
                <div className="overflow-hidden rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                    <div className="hidden border-b border-[var(--pa-border-default)] px-4 py-3 sm:grid sm:grid-cols-[1fr_2fr_0.8fr_1fr_0.8fr] sm:gap-4">
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Date</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Description</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Amount</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Method</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Status</span>
                    </div>
                    {paymentHistory.map((payment) => (
                        <div
                            key={payment.date + payment.description}
                            className="border-b border-[var(--pa-border-default)] px-4 py-3 last:border-b-0 sm:grid sm:grid-cols-[1fr_2fr_0.8fr_1fr_0.8fr] sm:items-center sm:gap-4"
                        >
                            <p className="text-sm text-[var(--pa-text-secondary)]">{formatDate(payment.date)}</p>
                            <p className="mt-1 text-sm font-medium text-[var(--pa-text-primary)] sm:mt-0">{payment.description}</p>
                            <p className="mt-1 text-sm font-semibold text-[var(--pa-text-primary)] sm:mt-0">{payment.amount}</p>
                            <div className="mt-1 flex items-center gap-1.5 sm:mt-0">
                                <CreditCard02 className="size-3.5 text-[var(--pa-text-muted)] sm:hidden" />
                                <p className="text-sm text-[var(--pa-text-secondary)]">{payment.method}</p>
                            </div>
                            <div className="mt-1 sm:mt-0">
                                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                                    {payment.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function NotesTab() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--pa-text-secondary)]">Instructor Notes</h3>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#14B8A6] px-3 py-1.5 text-xs font-medium text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                    <Plus className="size-3.5" />
                    Add Note
                </button>
            </div>

            {studentNotes.map((note) => (
                <div
                    key={note.date + note.text.slice(0, 20)}
                    className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-[#14B8A6]">{note.author}</span>
                        <span className="text-xs text-[var(--pa-text-muted)]">{formatDate(note.date)}</span>
                    </div>
                    <p className="text-sm text-[var(--pa-text-secondary)]">{note.text}</p>
                </div>
            ))}
        </div>
    );
}

function PaymentsTab() {
    return (
        <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                    <p className="text-xs text-[var(--pa-text-muted)]">Total Paid (Lifetime)</p>
                    <p className="mt-1 text-xl font-semibold text-[var(--pa-text-primary)]">R8,500</p>
                </div>
                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                    <p className="text-xs text-[var(--pa-text-muted)]">Avg. Cost per Class</p>
                    <p className="mt-1 text-xl font-semibold text-[var(--pa-text-primary)]">R250</p>
                </div>
                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                    <p className="text-xs text-[var(--pa-text-muted)]">Outstanding Balance</p>
                    <p className="mt-1 text-xl font-semibold text-emerald-400">R0</p>
                </div>
            </div>

            {/* All Payments */}
            <div>
                <h3 className="mb-2 text-sm font-medium text-[var(--pa-text-secondary)]">All Payments</h3>
                <div className="overflow-hidden rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                    {paymentHistory.map((payment) => (
                        <div
                            key={payment.date + payment.description}
                            className="flex items-center justify-between border-b border-[var(--pa-border-default)] px-4 py-3 last:border-b-0"
                        >
                            <div>
                                <p className="text-sm font-medium text-[var(--pa-text-primary)]">{payment.description}</p>
                                <p className="text-xs text-[var(--pa-text-muted)]">{formatDate(payment.date)} &middot; {payment.method}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-[var(--pa-text-primary)]">{payment.amount}</p>
                                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                                    {payment.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FormsTab() {
    const forms = [
        { name: "Liability Waiver", status: "Signed", date: "2025-06-10" },
        { name: "Health Questionnaire", status: "Signed", date: "2025-06-10" },
        { name: "Photo Consent", status: "Pending", date: null },
        { name: "Emergency Contact Form", status: "Signed", date: "2025-06-10" },
    ];

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--pa-text-secondary)]">Forms & Waivers</h3>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#14B8A6] px-3 py-1.5 text-xs font-medium text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                    <Plus className="size-3.5" />
                    Send Form
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                {forms.map((form) => (
                    <div
                        key={form.name}
                        className="flex items-center justify-between border-b border-[var(--pa-border-default)] px-4 py-3 last:border-b-0"
                    >
                        <div className="flex items-center gap-3">
                            <File06 className="size-4 text-[var(--pa-text-muted)]" />
                            <div>
                                <p className="text-sm font-medium text-[var(--pa-text-primary)]">{form.name}</p>
                                {form.date && (
                                    <p className="text-xs text-[var(--pa-text-muted)]">Signed {formatDate(form.date)}</p>
                                )}
                            </div>
                        </div>
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                form.status === "Signed"
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : "bg-amber-500/15 text-amber-400"
                            }`}
                        >
                            {form.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function YogaStudentDetailPage() {
    const [activeTab, setActiveTab] = useState<Tab>("Overview");
    const s = studentDetail;

    const tabContent: Record<Tab, React.ReactNode> = {
        Overview: <OverviewTab />,
        "Practice Log": <PracticeLogTab />,
        "Memberships & Passes": <MembershipsTab />,
        Notes: <NotesTab />,
        Payments: <PaymentsTab />,
        Forms: <FormsTab />,
    };

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 sm:px-6 lg:px-8">
            {/* Back link */}
            <Link
                href="/yoga/students"
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:text-[var(--pa-text-primary)]"
            >
                <ArrowLeft className="size-4" />
                Back to Students
            </Link>

            {/* Student Header */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#14B8A6]/20 text-lg font-semibold text-[#14B8A6]">
                        {s.initials}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold text-[var(--pa-text-primary)]">{s.name}</h1>
                            <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-400">
                                {s.membershipType}
                            </span>
                        </div>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            {s.totalClasses} classes &middot; {"\uD83D\uDD25"} {s.streak} day streak &middot; Member since {formatDate(s.joined)}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <a
                        href={`tel:${s.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-hover)]"
                    >
                        <Phone01 className="size-4" />
                        Call
                    </a>
                    <a
                        href={`mailto:${s.email}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-hover)]"
                    >
                        <Mail01 className="size-4" />
                        Email
                    </a>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-[#14B8A6] px-4 py-2 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                        <RefreshCw05 className="size-4" />
                        Renew
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-1">
                {tabs.map((tab) => (
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

            {/* Tab Content */}
            <div>{tabContent[activeTab]}</div>
        </div>
    );
}
