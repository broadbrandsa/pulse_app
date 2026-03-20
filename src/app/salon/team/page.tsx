"use client";

import { useState } from "react";
import {
    Users01,
    CreditCard01,
    Star01,
    Clock,
    Phone01,
    Mail01,
    Calendar,
    ChevronRight,
} from "@untitledui/icons";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type Tab = "schedule" | "members" | "commission" | "timeclock";

interface ScheduleBlock {
    time: string;
    client: string;
    service: string;
}

interface StylistSchedule {
    name: string;
    initials: string;
    color: string;
    role: string;
    schedule: ScheduleBlock[];
    available: string[];
}

interface TeamMember {
    name: string;
    role: string;
    phone: string;
    email: string;
    specialties: string[];
    hired: string;
    commission: string;
    rating: number;
    clients: number;
}

interface CommissionRow {
    name: string;
    revenue: string;
    rate: string;
    commission: string;
    tips: string;
    total: string;
}

interface TimeEntry {
    name: string;
    clockIn: string;
    clockOut: string | null;
    status: "clocked-in" | "clocked-out";
    hoursToday: string;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                           */
/* ------------------------------------------------------------------ */

const stylistSchedules: StylistSchedule[] = [
    {
        name: "Naledi Mokoena",
        initials: "NM",
        color: "#D946EF",
        role: "Owner / Senior Stylist",
        schedule: [
            { time: "08:00-11:00", client: "Thandi M.", service: "Braids" },
            { time: "14:00-15:30", client: "Ayanda K.", service: "Silk Press" },
        ],
        available: ["11:00-14:00", "15:30-18:00"],
    },
    {
        name: "Zinhle Nkosi",
        initials: "ZN",
        color: "#3B82F6",
        role: "Stylist",
        schedule: [
            { time: "08:30-09:30", client: "Khanyi L.", service: "Wash & Blow" },
            { time: "11:00-13:00", client: "Lerato P.", service: "Relaxer" },
            { time: "15:30-16:30", client: "Sibongile D.", service: "Wig Install" },
        ],
        available: ["09:30-11:00", "13:00-15:30", "16:30-18:00"],
    },
    {
        name: "Buhle Mthembu",
        initials: "BM",
        color: "#F59E0B",
        role: "Junior Stylist",
        schedule: [
            { time: "09:00-11:30", client: "Precious N.", service: "Colour" },
            { time: "13:00-14:30", client: "Nompilo S.", service: "Locs Retwist" },
        ],
        available: ["08:00-09:00", "11:30-13:00", "14:30-18:00"],
    },
];

const teamMembers: TeamMember[] = [
    {
        name: "Naledi Mokoena",
        role: "Owner / Senior Stylist",
        phone: "+27 82 111 2222",
        email: "naledi@naledisstudio.co.za",
        specialties: ["Braids", "Silk Press", "Colour"],
        hired: "2020-01-15",
        commission: "50%",
        rating: 4.9,
        clients: 142,
    },
    {
        name: "Zinhle Nkosi",
        role: "Stylist",
        phone: "+27 83 333 4444",
        email: "zinhle@naledisstudio.co.za",
        specialties: ["Wash & Blow", "Relaxer", "Wig Install"],
        hired: "2022-06-01",
        commission: "40%",
        rating: 4.8,
        clients: 98,
    },
    {
        name: "Buhle Mthembu",
        role: "Junior Stylist",
        phone: "+27 71 555 6666",
        email: "buhle@naledisstudio.co.za",
        specialties: ["Colour", "Locs Retwist", "Treatment"],
        hired: "2024-02-15",
        commission: "35%",
        rating: 4.7,
        clients: 67,
    },
];

const commissionData: CommissionRow[] = [
    { name: "Naledi", revenue: "R32,400", rate: "50%", commission: "R16,200", tips: "R2,800", total: "R19,000" },
    { name: "Zinhle", revenue: "R24,600", rate: "40%", commission: "R9,840", tips: "R1,950", total: "R11,790" },
    { name: "Buhle", revenue: "R18,200", rate: "35%", commission: "R6,370", tips: "R1,200", total: "R7,570" },
];

const timeEntries: TimeEntry[] = [
    { name: "Naledi", clockIn: "07:45", clockOut: null, status: "clocked-in", hoursToday: "8h 15min" },
    { name: "Zinhle", clockIn: "08:15", clockOut: null, status: "clocked-in", hoursToday: "7h 45min" },
    { name: "Buhle", clockIn: "08:55", clockOut: null, status: "clocked-in", hoursToday: "7h 05min" },
];

const memberColors = ["#D946EF", "#3B82F6", "#F59E0B"];
const memberInitials = ["NM", "ZN", "BM"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const tabs: { id: Tab; label: string }[] = [
    { id: "schedule", label: "Schedule" },
    { id: "members", label: "Members" },
    { id: "commission", label: "Commission" },
    { id: "timeclock", label: "Time Clock" },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function SalonTeamPage() {
    const [activeTab, setActiveTab] = useState<Tab>("schedule");

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Team Management
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Manage your stylists, schedules, and commissions
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-[#D946EF] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#C026D3]">
                        <Users01 className="size-4" />
                        Add Team Member
                    </button>
                </div>

                {/* ── Stats Cards ─────────────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#D946EF]/15">
                                <Users01 className="size-5 text-[#D946EF]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Team Members</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">3 active</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#22C55E]/15">
                                <CreditCard01 className="size-5 text-[#22C55E]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Total Revenue Today</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">R8,450</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#F59E0B]/15">
                                <Star01 className="size-5 text-[#F59E0B]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Average Rating</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">4.8 / 5</p>
                    </div>
                </div>

                {/* ── Tab Navigation ─────────────────────────────────────── */}
                <div className="flex gap-1 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                activeTab === tab.id
                                    ? "bg-[#D946EF] text-white"
                                    : "text-[var(--pa-text-secondary)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ─────────────────────────────────────────── */}
                {activeTab === "schedule" && <ScheduleTab />}
                {activeTab === "members" && <MembersTab />}
                {activeTab === "commission" && <CommissionTab />}
                {activeTab === "timeclock" && <TimeClockTab />}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Schedule Tab                                                        */
/* ------------------------------------------------------------------ */

function ScheduleTab() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--pa-text-primary)]">Today&apos;s Schedule</h2>
                <p className="text-sm text-[var(--pa-text-secondary)]">
                    {new Date().toLocaleDateString("en-ZA", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                    })}
                </p>
            </div>

            <div className="space-y-4">
                {stylistSchedules.map((stylist) => (
                    <div
                        key={stylist.name}
                        className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5"
                    >
                        {/* Stylist header */}
                        <div className="mb-4 flex items-center gap-3">
                            <div
                                className="flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                                style={{ backgroundColor: stylist.color }}
                            >
                                {stylist.initials}
                            </div>
                            <div>
                                <p className="font-medium text-[var(--pa-text-primary)]">{stylist.name}</p>
                                <p className="text-xs text-[var(--pa-text-secondary)]">{stylist.role}</p>
                            </div>
                        </div>

                        {/* Time blocks */}
                        <div className="space-y-2">
                            {stylist.schedule.map((block) => (
                                <div
                                    key={block.time}
                                    className="flex items-center gap-3 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3"
                                >
                                    <div
                                        className="h-8 w-1 rounded-full"
                                        style={{ backgroundColor: stylist.color }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                                {block.client}
                                            </p>
                                            <span className="text-xs text-[var(--pa-text-secondary)]">
                                                {block.time}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--pa-text-secondary)]">{block.service}</p>
                                    </div>
                                    <ChevronRight className="size-4 text-[var(--pa-text-muted)]" />
                                </div>
                            ))}

                            {/* Available slots */}
                            {stylist.available.map((slot) => (
                                <div
                                    key={slot}
                                    className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--pa-border-default)] bg-[var(--pa-bg-base)]/50 px-4 py-3"
                                >
                                    <div className="h-8 w-1 rounded-full bg-[var(--pa-border-default)]" />
                                    <div className="flex-1">
                                        <p className="text-sm text-[var(--pa-text-muted)]">Available</p>
                                        <p className="text-xs text-[var(--pa-text-muted)]">{slot}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Members Tab                                                         */
/* ------------------------------------------------------------------ */

function MembersTab() {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--pa-text-primary)]">Team Members</h2>

            <div className="space-y-4">
                {teamMembers.map((member, idx) => (
                    <div
                        key={member.name}
                        className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5"
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            {/* Left: profile info */}
                            <div className="flex gap-4">
                                <div
                                    className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                                    style={{ backgroundColor: memberColors[idx] }}
                                >
                                    {memberInitials[idx]}
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-[var(--pa-text-primary)]">
                                        {member.name}
                                    </p>
                                    <p className="text-sm text-[#D946EF]">{member.role}</p>

                                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--pa-text-secondary)]">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Phone01 className="size-3.5 text-[var(--pa-text-muted)]" />
                                            {member.phone}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Mail01 className="size-3.5 text-[var(--pa-text-muted)]" />
                                            {member.email}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {member.specialties.map((s) => (
                                            <span
                                                key={s}
                                                className="rounded-full bg-[#D946EF]/10 px-2.5 py-0.5 text-xs font-medium text-[#D946EF]"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: stats */}
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2 text-center">
                                    <p className="text-xs text-[var(--pa-text-secondary)]">Commission</p>
                                    <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">
                                        {member.commission}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2 text-center">
                                    <p className="text-xs text-[var(--pa-text-secondary)]">Rating</p>
                                    <p className="mt-0.5 text-sm font-semibold text-[#F59E0B]">
                                        {member.rating}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2 text-center">
                                    <p className="text-xs text-[var(--pa-text-secondary)]">Clients</p>
                                    <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">
                                        {member.clients}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2 text-center">
                                    <p className="text-xs text-[var(--pa-text-secondary)]">Hired</p>
                                    <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">
                                        {formatDate(member.hired)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Commission Tab                                                      */
/* ------------------------------------------------------------------ */

function CommissionTab() {
    const totals = {
        revenue: "R75,200",
        commission: "R32,410",
        tips: "R5,950",
        total: "R38,360",
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--pa-text-primary)]">
                    Commission Breakdown
                </h2>
                <span className="text-sm text-[var(--pa-text-secondary)]">March 2026</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[var(--pa-border-default)] text-[var(--pa-text-secondary)]">
                            <th className="px-5 py-3.5 font-medium">Stylist</th>
                            <th className="px-5 py-3.5 font-medium">Revenue</th>
                            <th className="px-5 py-3.5 font-medium">Rate</th>
                            <th className="px-5 py-3.5 font-medium">Commission</th>
                            <th className="px-5 py-3.5 font-medium">Tips</th>
                            <th className="px-5 py-3.5 font-medium">Total Payout</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commissionData.map((row, idx) => (
                            <tr
                                key={row.name}
                                className="border-b border-[var(--pa-border-default)] last:border-b-0"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                                            style={{ backgroundColor: memberColors[idx] }}
                                        >
                                            {memberInitials[idx]}
                                        </div>
                                        <span className="font-medium text-[var(--pa-text-primary)]">
                                            {row.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-[var(--pa-text-primary)]">{row.revenue}</td>
                                <td className="px-5 py-4">
                                    <span className="rounded-full bg-[#D946EF]/10 px-2 py-0.5 text-xs font-medium text-[#D946EF]">
                                        {row.rate}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-[var(--pa-text-primary)]">{row.commission}</td>
                                <td className="px-5 py-4 text-[#22C55E]">{row.tips}</td>
                                <td className="px-5 py-4 font-semibold text-[var(--pa-text-primary)]">
                                    {row.total}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t border-[var(--pa-border-default)] bg-[var(--pa-bg-base)]">
                            <td className="px-5 py-3.5 font-semibold text-[var(--pa-text-primary)]">Total</td>
                            <td className="px-5 py-3.5 font-semibold text-[var(--pa-text-primary)]">
                                {totals.revenue}
                            </td>
                            <td className="px-5 py-3.5" />
                            <td className="px-5 py-3.5 font-semibold text-[var(--pa-text-primary)]">
                                {totals.commission}
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-[#22C55E]">
                                {totals.tips}
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-[#D946EF]">
                                {totals.total}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Time Clock Tab                                                      */
/* ------------------------------------------------------------------ */

function TimeClockTab() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--pa-text-primary)]">Time Clock</h2>
                <p className="text-sm text-[var(--pa-text-secondary)]">
                    {new Date().toLocaleDateString("en-ZA", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                    })}
                </p>
            </div>

            <div className="space-y-3">
                {timeEntries.map((entry, idx) => (
                    <div
                        key={entry.name}
                        className="flex flex-col gap-4 rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                                style={{ backgroundColor: memberColors[idx] }}
                            >
                                {memberInitials[idx]}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-[var(--pa-text-primary)]">{entry.name}</p>
                                    {entry.status === "clocked-in" && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/15 px-2.5 py-0.5 text-xs font-medium text-[#22C55E]">
                                            <span className="relative flex size-2">
                                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22C55E] opacity-75" />
                                                <span className="relative inline-flex size-2 rounded-full bg-[#22C55E]" />
                                            </span>
                                            Clocked In
                                        </span>
                                    )}
                                </div>
                                <div className="mt-0.5 flex items-center gap-3 text-sm text-[var(--pa-text-secondary)]">
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="size-3.5 text-[var(--pa-text-muted)]" />
                                        In: {entry.clockIn}
                                    </span>
                                    <span>&middot;</span>
                                    <span>Today: {entry.hoursToday}</span>
                                </div>
                            </div>
                        </div>

                        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DC2626] bg-[#DC2626]/10 px-4 py-2 text-sm font-medium text-[#DC2626] transition duration-100 ease-linear hover:bg-[#DC2626]/20">
                            <Clock className="size-4" />
                            Clock Out
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
