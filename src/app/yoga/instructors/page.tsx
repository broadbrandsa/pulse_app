"use client";

import { useState } from "react";
import {
    Plus,
    Users01,
    Calendar,
    CurrencyDollar,
    Star01,
    Clock,
    ChevronRight,
    Mail01,
    Phone01,
} from "@untitledui/icons";

// ── Types ────────────────────────────────────────────────────────────────────

interface Instructor {
    id: number;
    name: string;
    initials: string;
    color: string;
    textColor: string;
    role: string;
    specialties: string[];
    employmentType: string;
    compensation: string;
    classesThisWeek: number;
    email: string;
    phone: string;
}

interface ScheduleBlock {
    time: string;
    className: string;
    room: string;
}

interface InstructorSchedule {
    name: string;
    initials: string;
    color: string;
    textColor: string;
    schedule: ScheduleBlock[];
    available: string[];
}

interface PayrollRow {
    name: string;
    initials: string;
    color: string;
    textColor: string;
    type: string;
    rate: string;
    classesThisMonth: number;
    grossPay: string;
    deductions: string;
    netPay: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const instructors: Instructor[] = [
    {
        id: 1,
        name: "Amahle",
        initials: "A",
        color: "#5A4EFF",
        textColor: "#fff",
        role: "Owner",
        specialties: ["Vinyasa", "Hot", "Power"],
        employmentType: "Owner",
        compensation: "—",
        classesThisWeek: 22,
        email: "amahle@pulseflow.co.za",
        phone: "+27 82 100 2000",
    },
    {
        id: 2,
        name: "Ravi",
        initials: "R",
        color: "#EEA0FF",
        textColor: "#1a1a1a",
        role: "Senior Instructor",
        specialties: ["Vinyasa", "Power", "Hatha"],
        employmentType: "Contractor",
        compensation: "R420/class",
        classesThisWeek: 18,
        email: "ravi@pulseflow.co.za",
        phone: "+27 83 200 3000",
    },
    {
        id: 3,
        name: "Sipho",
        initials: "S",
        color: "#E2F4A6",
        textColor: "#1a1a1a",
        role: "Instructor",
        specialties: ["Yin", "Meditation", "Restorative"],
        employmentType: "Contractor",
        compensation: "R350/class",
        classesThisWeek: 12,
        email: "sipho@pulseflow.co.za",
        phone: "+27 71 300 4000",
    },
    {
        id: 4,
        name: "Candice",
        initials: "C",
        color: "#F59E0B",
        textColor: "#1a1a1a",
        role: "Instructor",
        specialties: ["Hatha", "Restorative", "Yin"],
        employmentType: "Employee",
        compensation: "R18k/month",
        classesThisWeek: 16,
        email: "candice@pulseflow.co.za",
        phone: "+27 72 400 5000",
    },
];

const instructorSchedules: InstructorSchedule[] = [
    {
        name: "Amahle",
        initials: "A",
        color: "#5A4EFF",
        textColor: "#fff",
        schedule: [
            { time: "06:00 – 07:00", className: "Power Vinyasa", room: "Hot Room" },
            { time: "09:00 – 10:15", className: "Vinyasa Flow", room: "Flow Room" },
            { time: "17:30 – 18:45", className: "Hot Yoga", room: "Hot Room" },
        ],
        available: ["07:00 – 09:00", "10:15 – 17:30"],
    },
    {
        name: "Ravi",
        initials: "R",
        color: "#EEA0FF",
        textColor: "#1a1a1a",
        schedule: [
            { time: "07:00 – 08:15", className: "Hatha Flow", room: "Flow Room" },
            { time: "12:00 – 13:00", className: "Power Lunch", room: "Hot Room" },
            { time: "18:00 – 19:15", className: "Vinyasa", room: "Flow Room" },
        ],
        available: ["08:15 – 12:00", "13:00 – 18:00"],
    },
    {
        name: "Sipho",
        initials: "S",
        color: "#E2F4A6",
        textColor: "#1a1a1a",
        schedule: [
            { time: "10:00 – 11:15", className: "Yin Yoga", room: "Zen Room" },
            { time: "19:30 – 20:30", className: "Meditation", room: "Zen Room" },
        ],
        available: ["08:00 – 10:00", "11:15 – 19:30"],
    },
    {
        name: "Candice",
        initials: "C",
        color: "#F59E0B",
        textColor: "#1a1a1a",
        schedule: [
            { time: "08:00 – 09:15", className: "Gentle Hatha", room: "Flow Room" },
            { time: "11:00 – 12:00", className: "Restorative", room: "Zen Room" },
            { time: "16:00 – 17:15", className: "Yin Flow", room: "Zen Room" },
        ],
        available: ["09:15 – 11:00", "12:00 – 16:00"],
    },
];

const payrollData: PayrollRow[] = [
    { name: "Amahle", initials: "A", color: "#5A4EFF", textColor: "#fff", type: "Owner", rate: "—", classesThisMonth: 88, grossPay: "—", deductions: "—", netPay: "—" },
    { name: "Ravi", initials: "R", color: "#EEA0FF", textColor: "#1a1a1a", type: "Contractor", rate: "R420/class", classesThisMonth: 72, grossPay: "R30,240", deductions: "—", netPay: "R30,240" },
    { name: "Sipho", initials: "S", color: "#E2F4A6", textColor: "#1a1a1a", type: "Contractor", rate: "R350/class", classesThisMonth: 48, grossPay: "R16,800", deductions: "—", netPay: "R16,800" },
    { name: "Candice", initials: "C", color: "#F59E0B", textColor: "#1a1a1a", type: "Employee", rate: "R18,000/mo", classesThisMonth: 64, grossPay: "R18,000", deductions: "R3,600", netPay: "R14,400" },
];

// ── Tab types ────────────────────────────────────────────────────────────────

type TabKey = "instructors" | "schedule" | "payroll";

const tabs: { key: TabKey; label: string }[] = [
    { key: "instructors", label: "Instructors" },
    { key: "schedule", label: "Schedule" },
    { key: "payroll", label: "Payroll" },
];

// ── Page Component ───────────────────────────────────────────────────────────

export default function YogaInstructorsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("instructors");

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Instructor Management
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Manage your instructors, schedules, and payroll
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                        <Users01 className="size-4" />
                        Add Instructor
                    </button>
                </div>

                {/* ── Stats Cards ─────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                                <Users01 className="size-5 text-[#14B8A6]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Total Instructors</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">4</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#3B82F6]/15">
                                <Calendar className="size-5 text-[#3B82F6]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Classes This Week</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">18</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#F59E0B]/15">
                                <Star01 className="size-5 text-[#F59E0B]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Avg Students / Class</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">14.2</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#22C55E]/15">
                                <CurrencyDollar className="size-5 text-[#22C55E]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Earned This Week</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">R8,400</p>
                    </div>
                </div>

                {/* ── Tab Navigation ──────────────────────────────────── */}
                <div className="flex gap-1 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                activeTab === tab.key
                                    ? "bg-[#14B8A6] text-white"
                                    : "text-[var(--pa-text-secondary)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ─────────────────────────────────────── */}
                {activeTab === "instructors" && <InstructorsTab />}
                {activeTab === "schedule" && <ScheduleTab />}
                {activeTab === "payroll" && <PayrollTab />}
            </div>
        </div>
    );
}

// ── Instructors Tab ──────────────────────────────────────────────────────────

function InstructorsTab() {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {instructors.map((instructor) => (
                <div
                    key={instructor.id}
                    className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5"
                >
                    <div className="flex gap-4">
                        <div
                            className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                            style={{ backgroundColor: instructor.color, color: instructor.textColor }}
                        >
                            {instructor.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-semibold text-[var(--pa-text-primary)]">
                                        {instructor.name}
                                    </p>
                                    <p className="text-sm text-[#14B8A6]">{instructor.role}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-[var(--pa-text-primary)]">
                                        {instructor.classesThisWeek}
                                    </p>
                                    <p className="text-xs text-[var(--pa-text-muted)]">classes/week</p>
                                </div>
                            </div>

                            {/* Specialties */}
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {instructor.specialties.map((s) => (
                                    <span
                                        key={s}
                                        className="rounded-full bg-[#14B8A6]/10 px-2.5 py-0.5 text-xs font-medium text-[#14B8A6]"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>

                            {/* Contact + compensation */}
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--pa-text-secondary)]">
                                <span className="inline-flex items-center gap-1.5">
                                    <Mail01 className="size-3.5 text-[var(--pa-text-muted)]" />
                                    {instructor.email}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Phone01 className="size-3.5 text-[var(--pa-text-muted)]" />
                                    {instructor.phone}
                                </span>
                            </div>

                            {/* Employment info */}
                            <div className="mt-3 flex flex-wrap gap-3">
                                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2 text-center">
                                    <p className="text-xs text-[var(--pa-text-secondary)]">Type</p>
                                    <p className="mt-0.5 text-sm font-semibold text-[var(--pa-text-primary)]">
                                        {instructor.employmentType}
                                    </p>
                                </div>
                                {instructor.compensation !== "—" && (
                                    <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2 text-center">
                                        <p className="text-xs text-[var(--pa-text-secondary)]">Rate</p>
                                        <p className="mt-0.5 text-sm font-semibold text-[#14B8A6]">
                                            {instructor.compensation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Schedule Tab ─────────────────────────────────────────────────────────────

function ScheduleTab() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--pa-text-primary)]">Weekly Schedule</h2>
                <p className="text-sm text-[var(--pa-text-secondary)]">
                    {new Date().toLocaleDateString("en-ZA", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                    })}
                </p>
            </div>

            <div className="space-y-4">
                {instructorSchedules.map((instructor) => (
                    <div
                        key={instructor.name}
                        className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5"
                    >
                        {/* Instructor header */}
                        <div className="mb-4 flex items-center gap-3">
                            <div
                                className="flex size-10 items-center justify-center rounded-full text-sm font-semibold"
                                style={{ backgroundColor: instructor.color, color: instructor.textColor }}
                            >
                                {instructor.initials}
                            </div>
                            <div>
                                <p className="font-medium text-[var(--pa-text-primary)]">{instructor.name}</p>
                                <p className="text-xs text-[var(--pa-text-secondary)]">
                                    {instructor.schedule.length} classes today
                                </p>
                            </div>
                        </div>

                        {/* Time blocks */}
                        <div className="space-y-2">
                            {instructor.schedule.map((block) => (
                                <div
                                    key={block.time}
                                    className="flex items-center gap-3 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3"
                                >
                                    <div
                                        className="h-8 w-1 rounded-full"
                                        style={{ backgroundColor: instructor.color }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                                {block.className}
                                            </p>
                                            <span className="text-xs text-[var(--pa-text-secondary)]">
                                                {block.time}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--pa-text-secondary)]">{block.room}</p>
                                    </div>
                                    <ChevronRight className="size-4 text-[var(--pa-text-muted)]" />
                                </div>
                            ))}

                            {/* Available slots */}
                            {instructor.available.map((slot) => (
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

// ── Payroll Tab ──────────────────────────────────────────────────────────────

function PayrollTab() {
    const totalGross = "R65,040";
    const totalDeductions = "R3,600";
    const totalNet = "R61,440";

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--pa-text-primary)]">
                    Monthly Payroll Summary
                </h2>
                <span className="text-sm text-[var(--pa-text-secondary)]">March 2026</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[var(--pa-border-default)] text-[var(--pa-text-secondary)]">
                            <th className="px-5 py-3.5 font-medium">Instructor</th>
                            <th className="px-5 py-3.5 font-medium">Type</th>
                            <th className="px-5 py-3.5 font-medium">Rate</th>
                            <th className="px-5 py-3.5 font-medium">Classes</th>
                            <th className="px-5 py-3.5 font-medium">Gross Pay</th>
                            <th className="px-5 py-3.5 font-medium">Deductions</th>
                            <th className="px-5 py-3.5 font-medium">Net Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrollData.map((row) => (
                            <tr
                                key={row.name}
                                className="border-b border-[var(--pa-border-default)] last:border-b-0"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="flex size-8 items-center justify-center rounded-full text-xs font-semibold"
                                            style={{ backgroundColor: row.color, color: row.textColor }}
                                        >
                                            {row.initials}
                                        </div>
                                        <span className="font-medium text-[var(--pa-text-primary)]">
                                            {row.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                        row.type === "Owner"
                                            ? "bg-[#5A4EFF]/10 text-[#5A4EFF]"
                                            : row.type === "Contractor"
                                              ? "bg-[#14B8A6]/10 text-[#14B8A6]"
                                              : "bg-[#F59E0B]/10 text-[#F59E0B]"
                                    }`}>
                                        {row.type}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-[var(--pa-text-secondary)]">{row.rate}</td>
                                <td className="px-5 py-4 text-[var(--pa-text-primary)]">{row.classesThisMonth}</td>
                                <td className="px-5 py-4 text-[var(--pa-text-primary)]">{row.grossPay}</td>
                                <td className="px-5 py-4 text-[#EF4444]">{row.deductions}</td>
                                <td className="px-5 py-4 font-semibold text-[var(--pa-text-primary)]">{row.netPay}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t border-[var(--pa-border-default)] bg-[var(--pa-bg-base)]">
                            <td className="px-5 py-3.5 font-semibold text-[var(--pa-text-primary)]">Total</td>
                            <td className="px-5 py-3.5" />
                            <td className="px-5 py-3.5" />
                            <td className="px-5 py-3.5 font-semibold text-[var(--pa-text-primary)]">272</td>
                            <td className="px-5 py-3.5 font-semibold text-[var(--pa-text-primary)]">{totalGross}</td>
                            <td className="px-5 py-3.5 font-semibold text-[#EF4444]">{totalDeductions}</td>
                            <td className="px-5 py-3.5 font-semibold text-[#14B8A6]">{totalNet}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
