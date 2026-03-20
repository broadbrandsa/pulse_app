"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Phone01,
    Mail01,
    Calendar,
    Star01,
    Clock,
    Edit05,
    User01,
    Plus,
    ChevronRight,
} from "@untitledui/icons";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const clientDetail = {
    name: "Thandi Mokoena",
    phone: "+27 72 345 6789",
    email: "thandi.m@email.co.za",
    initials: "TM",
    joined: "2024-06-15",
    totalSpent: "R18,450",
    totalVisits: 24,
    loyaltyPoints: 1845,
    loyaltyTier: "Gold" as const,
    preferredStylist: "Naledi",
    nextAppointment: { date: "2026-03-22", time: "09:00", service: "Braids" },
    birthday: "1995-08-12",
};

const colourFormulas = [
    { date: "2026-03-14", formula: "6N base + 20vol developer, 30min processing", notes: "Slight warmth at roots, adjust next time", stylist: "Buhle" },
    { date: "2026-01-20", formula: "7NW highlights with balayage technique, 45min", notes: "Client loved the result", stylist: "Buhle" },
    { date: "2025-11-08", formula: "Virgin application: 5N full head, 40min", notes: "First colour service", stylist: "Naledi" },
];

const hairProfile = {
    type: "4C",
    texture: "Coily",
    porosity: "High",
    scalp: "Normal",
    allergies: "None known",
    preferredProducts: ["ORS Olive Oil", "Cantu Shea Butter", "Eco Styler Gel"],
    notes: "Prefers minimal heat. Natural hair journey since 2023.",
};

const visitHistory = [
    { date: "2026-03-17", service: "Box Braids", stylist: "Naledi", duration: "3h", amount: "R850", rating: 5 },
    { date: "2026-02-28", service: "Wash & Blow", stylist: "Zinhle", duration: "1h", amount: "R250", rating: 5 },
    { date: "2026-02-10", service: "Treatment", stylist: "Naledi", duration: "45min", amount: "R350", rating: 4 },
    { date: "2026-01-20", service: "Colour", stylist: "Buhle", duration: "2.5h", amount: "R650", rating: 5 },
    { date: "2025-12-15", service: "Silk Press", stylist: "Naledi", duration: "1.5h", amount: "R450", rating: 5 },
];

const clientNotes = [
    { date: "2026-03-17", author: "Naledi", text: "Thandi wants to try knotless braids next visit. Prefers waist-length." },
    { date: "2026-02-10", author: "Naledi", text: "Scalp is in good condition. Recommended deep conditioning treatment every 4 weeks." },
    { date: "2025-12-15", author: "Naledi", text: "Discussed transitioning to fully natural styling. Client is excited about protective styles." },
];

/* ------------------------------------------------------------------ */
/*  Types & Helpers                                                    */
/* ------------------------------------------------------------------ */

type Tab = "Overview" | "Colour Formula" | "Hair Profile" | "Visit History" | "Notes";
const tabs: Tab[] = ["Overview", "Colour Formula", "Hair Profile", "Visit History", "Notes"];

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function renderStars(count: number): string {
    return "\u2605".repeat(count) + "\u2606".repeat(5 - count);
}

/* ------------------------------------------------------------------ */
/*  Tab Content Components                                             */
/* ------------------------------------------------------------------ */

function OverviewTab() {
    const c = clientDetail;
    return (
        <div className="space-y-4">
            {/* Contact & Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Contact Info */}
                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                    <h3 className="mb-3 text-sm font-medium text-[var(--pa-text-secondary)]">Contact Information</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Phone01 className="size-4 text-[var(--pa-text-muted)]" />
                            <span className="text-sm text-[var(--pa-text-primary)]">{c.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail01 className="size-4 text-[var(--pa-text-muted)]" />
                            <span className="text-sm text-[var(--pa-text-primary)]">{c.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="size-4 text-[var(--pa-text-muted)]" />
                            <span className="text-sm text-[var(--pa-text-secondary)]">
                                Birthday: {formatDate(c.birthday)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <User01 className="size-4 text-[var(--pa-text-muted)]" />
                            <span className="text-sm text-[var(--pa-text-secondary)]">
                                Member since {formatDate(c.joined)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Loyalty */}
                <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                    <h3 className="mb-3 text-sm font-medium text-[var(--pa-text-secondary)]">Loyalty & Spending</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--pa-text-secondary)]">Total Spent</span>
                            <span className="text-sm font-semibold text-[var(--pa-text-primary)]">{c.totalSpent}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--pa-text-secondary)]">Total Visits</span>
                            <span className="text-sm font-semibold text-[var(--pa-text-primary)]">{c.totalVisits}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--pa-text-secondary)]">Loyalty Points</span>
                            <span className="text-sm font-semibold text-[#D946EF]">{c.loyaltyPoints}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--pa-text-secondary)]">Tier</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
                                <Star01 className="size-3" />
                                {c.loyaltyTier}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--pa-text-secondary)]">Preferred Stylist</span>
                            <span className="text-sm text-[var(--pa-text-primary)]">{c.preferredStylist}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Appointment */}
            <div className="rounded-xl border border-[#D946EF]/30 bg-[#D946EF]/5 p-4">
                <h3 className="mb-2 text-sm font-medium text-[#D946EF]">Next Appointment</h3>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-[#D946EF]" />
                        <span className="text-sm text-[var(--pa-text-primary)]">{formatDate(c.nextAppointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="size-4 text-[#D946EF]" />
                        <span className="text-sm text-[var(--pa-text-primary)]">{c.nextAppointment.time}</span>
                    </div>
                    <span className="rounded-full bg-[#D946EF]/15 px-2.5 py-0.5 text-xs font-medium text-[#D946EF]">
                        {c.nextAppointment.service}
                    </span>
                </div>
            </div>

            {/* Visit Summary */}
            <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                <h3 className="mb-3 text-sm font-medium text-[var(--pa-text-secondary)]">Recent Visits</h3>
                <div className="space-y-2">
                    {visitHistory.slice(0, 3).map((visit) => (
                        <div
                            key={visit.date + visit.service}
                            className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2"
                        >
                            <div>
                                <p className="text-sm font-medium text-[var(--pa-text-primary)]">{visit.service}</p>
                                <p className="text-xs text-[var(--pa-text-muted)]">
                                    {formatDate(visit.date)} &middot; {visit.stylist}
                                </p>
                            </div>
                            <span className="text-sm font-medium text-[var(--pa-text-primary)]">{visit.amount}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ColourFormulaTab() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--pa-text-secondary)]">Colour Formula History</h3>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#D946EF] px-3 py-1.5 text-xs font-medium text-white transition duration-100 ease-linear hover:bg-[#C026D3]">
                    <Plus className="size-3.5" />
                    Add Formula
                </button>
            </div>

            {colourFormulas.map((formula) => (
                <div
                    key={formula.date}
                    className="rounded-xl border border-[var(--pa-border-default)] border-l-[#D946EF] bg-[var(--pa-bg-surface)] p-4"
                    style={{ borderLeftWidth: "3px" }}
                >
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-3.5 text-[var(--pa-text-muted)]" />
                            <span className="text-xs text-[var(--pa-text-secondary)]">{formatDate(formula.date)}</span>
                        </div>
                        <span className="text-xs text-[var(--pa-text-muted)]">by {formula.stylist}</span>
                    </div>
                    <p className="mb-2 text-sm font-medium text-[var(--pa-text-primary)]">{formula.formula}</p>
                    {formula.notes && (
                        <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                            <p className="text-xs text-[var(--pa-text-secondary)]">
                                <span className="font-medium text-[var(--pa-text-secondary)]">Notes:</span> {formula.notes}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function HairProfileTab() {
    const hp = hairProfile;

    const profileFields = [
        { label: "Hair Type", value: hp.type },
        { label: "Texture", value: hp.texture },
        { label: "Porosity", value: hp.porosity },
        { label: "Scalp Condition", value: hp.scalp },
        { label: "Allergies / Sensitivities", value: hp.allergies },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--pa-text-secondary)]">Hair Profile</h3>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-white/[0.05]">
                    <Edit05 className="size-3.5" />
                    Edit Profile
                </button>
            </div>

            {/* Profile Fields */}
            <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    {profileFields.map((field) => (
                        <div key={field.label}>
                            <p className="mb-1 text-xs text-[var(--pa-text-muted)]">{field.label}</p>
                            <p className="text-sm font-medium text-[var(--pa-text-primary)]">{field.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preferred Products */}
            <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                <h4 className="mb-3 text-sm font-medium text-[var(--pa-text-secondary)]">Preferred Products</h4>
                <div className="flex flex-wrap gap-2">
                    {hp.preferredProducts.map((product) => (
                        <span
                            key={product}
                            className="rounded-full bg-[#D946EF]/10 px-3 py-1 text-xs font-medium text-[#D946EF]"
                        >
                            {product}
                        </span>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
                <h4 className="mb-2 text-sm font-medium text-[var(--pa-text-secondary)]">Hair Notes</h4>
                <p className="text-sm text-[var(--pa-text-secondary)]">{hp.notes}</p>
            </div>
        </div>
    );
}

function VisitHistoryTab() {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--pa-text-secondary)]">All Visits</h3>

            <div className="overflow-hidden rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                {/* Header */}
                <div className="hidden border-b border-[var(--pa-border-default)] px-4 py-3 sm:grid sm:grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr] sm:gap-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Service</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Stylist</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Date</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Duration</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Amount</span>
                </div>

                {visitHistory.map((visit) => (
                    <div
                        key={visit.date + visit.service}
                        className="border-b border-[var(--pa-border-default)] px-4 py-3 last:border-b-0 sm:grid sm:grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr] sm:items-center sm:gap-4"
                    >
                        <div>
                            <p className="text-sm font-medium text-[var(--pa-text-primary)]">{visit.service}</p>
                            <p className="text-xs text-amber-400 sm:hidden">
                                {renderStars(visit.rating)}
                            </p>
                        </div>
                        <p className="mt-1 text-sm text-[var(--pa-text-secondary)] sm:mt-0">{visit.stylist}</p>
                        <p className="mt-1 text-sm text-[var(--pa-text-secondary)] sm:mt-0">{formatDate(visit.date)}</p>
                        <div className="mt-1 flex items-center gap-1 sm:mt-0">
                            <Clock className="size-3.5 text-[var(--pa-text-muted)] sm:hidden" />
                            <p className="text-sm text-[var(--pa-text-secondary)]">{visit.duration}</p>
                        </div>
                        <div className="mt-1 flex items-center justify-between sm:mt-0">
                            <p className="text-sm font-medium text-[var(--pa-text-primary)]">{visit.amount}</p>
                            <span className="hidden text-xs text-amber-400 sm:inline">
                                {renderStars(visit.rating)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function NotesTab() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--pa-text-secondary)]">Client Notes</h3>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#D946EF] px-3 py-1.5 text-xs font-medium text-white transition duration-100 ease-linear hover:bg-[#C026D3]">
                    <Plus className="size-3.5" />
                    Add Note
                </button>
            </div>

            {clientNotes.map((note) => (
                <div
                    key={note.date + note.text.slice(0, 20)}
                    className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-[#D946EF]">{note.author}</span>
                        <span className="text-xs text-[var(--pa-text-muted)]">{formatDate(note.date)}</span>
                    </div>
                    <p className="text-sm text-[var(--pa-text-secondary)]">{note.text}</p>
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SalonClientDetailPage() {
    const [activeTab, setActiveTab] = useState<Tab>("Overview");
    const c = clientDetail;

    const tabContent: Record<Tab, React.ReactNode> = {
        Overview: <OverviewTab />,
        "Colour Formula": <ColourFormulaTab />,
        "Hair Profile": <HairProfileTab />,
        "Visit History": <VisitHistoryTab />,
        Notes: <NotesTab />,
    };

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 sm:px-6 lg:px-8">
            {/* Back link */}
            <Link
                href="/salon/clients"
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:text-[var(--pa-text-primary)]"
            >
                <ArrowLeft className="size-4" />
                Back to Clients
            </Link>

            {/* Client Header */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#D946EF]/20 text-lg font-semibold text-[#D946EF]">
                        {c.initials}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold text-[var(--pa-text-primary)]">{c.name}</h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
                                <Star01 className="size-3" />
                                {c.loyaltyTier}
                            </span>
                        </div>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            {c.totalVisits} visits &middot; Member since {formatDate(c.joined)}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <a
                        href={`tel:${c.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-white/[0.05]"
                    >
                        <Phone01 className="size-4" />
                        Call
                    </a>
                    <a
                        href={`mailto:${c.email}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-white/[0.05]"
                    >
                        <Mail01 className="size-4" />
                        Email
                    </a>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-[#D946EF] px-4 py-2 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#C026D3]">
                        <Calendar className="size-4" />
                        Book
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
                                ? "bg-[#D946EF] text-white"
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
