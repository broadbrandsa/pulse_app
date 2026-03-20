"use client";

import { useState } from "react";
import {
    File06,
    FileCheck02,
    Plus,
    Edit05,
    Send01,
    Download01,
    Copy01,
    SearchLg,
} from "@untitledui/icons";

// ── Brand Accent ────────────────────────────────────────────────────────────
const BRAND = "#D946EF";

// ── Types ───────────────────────────────────────────────────────────────────

type Tab = "consent" | "consultations" | "templates";

// ── Mock Data ───────────────────────────────────────────────────────────────

const consentForms = [
    { id: 1, client: "Thandi Mokoena", type: "Colour Consent", date: "2026-03-14", status: "signed" as const, stylist: "Buhle" },
    { id: 2, client: "Lerato Phiri", type: "Chemical Treatment Consent", date: "2026-03-10", status: "signed" as const, stylist: "Zinhle" },
    { id: 3, client: "Precious Ndlovu", type: "Colour Consent", date: "2026-03-14", status: "signed" as const, stylist: "Buhle" },
    { id: 4, client: "Sibongile Dube", type: "Extension Consent", date: "2026-03-08", status: "pending" as const, stylist: "Zinhle" },
    { id: 5, client: "Zanele Wezi", type: "Colour Consent", date: "2026-03-16", status: "signed" as const, stylist: "Naledi" },
];

const consultations = [
    {
        id: 1,
        client: "Thandi Mokoena",
        date: "2026-03-17",
        type: "Pre-Colour",
        notes: "Client wants subtle highlights. Patch test done. No allergies.",
        stylist: "Buhle",
    },
    {
        id: 2,
        client: "Nompilo Sithole",
        date: "2026-03-12",
        type: "Scalp Assessment",
        notes: "Mild dryness on crown area. Recommended weekly oil treatment.",
        stylist: "Buhle",
    },
    {
        id: 3,
        client: "Ayanda Khumalo",
        date: "2026-03-18",
        type: "Style Consultation",
        notes: "Wants to transition from relaxed to natural. Discussed big chop vs gradual.",
        stylist: "Naledi",
    },
];

const templates = [
    { id: 1, name: "Colour Consent Form", type: "consent" as const, lastUpdated: "2026-01-15", usageCount: 48 },
    { id: 2, name: "Chemical Treatment Consent", type: "consent" as const, lastUpdated: "2026-02-01", usageCount: 22 },
    { id: 3, name: "Extension Consent Form", type: "consent" as const, lastUpdated: "2025-11-20", usageCount: 15 },
    { id: 4, name: "Pre-Colour Consultation", type: "consultation" as const, lastUpdated: "2026-01-10", usageCount: 35 },
    { id: 5, name: "New Client Intake", type: "consultation" as const, lastUpdated: "2026-03-01", usageCount: 67 },
    { id: 6, name: "Scalp Assessment", type: "consultation" as const, lastUpdated: "2025-12-05", usageCount: 12 },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function statusBadge(status: "signed" | "pending") {
    if (status === "signed") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/15 px-2.5 py-0.5 text-xs font-medium text-[#22C55E]">
                <span className="size-1.5 rounded-full bg-[#22C55E]" />
                Signed
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/15 px-2.5 py-0.5 text-xs font-medium text-[#F59E0B]">
            <span className="size-1.5 rounded-full bg-[#F59E0B]" />
            Pending
        </span>
    );
}

function templateTypeBadge(type: "consent" | "consultation") {
    if (type === "consent") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B82F6]/15 px-2.5 py-0.5 text-xs font-medium text-[#3B82F6]">
                <FileCheck02 className="size-3" />
                Consent
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D946EF]/15 px-2.5 py-0.5 text-xs font-medium text-[#D946EF]">
            <File06 className="size-3" />
            Consultation
        </span>
    );
}

// ── Page Component ──────────────────────────────────────────────────────────

export default function SalonDocumentsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("consent");
    const [searchQuery, setSearchQuery] = useState("");

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: "consent", label: "Consent Forms", count: consentForms.length },
        { key: "consultations", label: "Consultations", count: consultations.length },
        { key: "templates", label: "Templates", count: templates.length },
    ];

    // Filtered consent forms
    const filteredConsent = consentForms.filter(
        (f) =>
            f.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.type.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Filtered consultations
    const filteredConsultations = consultations.filter(
        (c) =>
            c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.type.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Filtered templates
    const filteredTemplates = templates.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Documents
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Consent forms, consultations, and templates
                        </p>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear"
                        style={{ backgroundColor: BRAND }}
                    >
                        <Plus className="size-4" />
                        New Document
                    </button>
                </div>

                {/* ── Tab Navigation + Search ────────────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-1 rounded-lg bg-[var(--pa-bg-surface)] p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                    activeTab === tab.key
                                        ? "bg-[#262626] text-[var(--pa-text-primary)]"
                                        : "text-[var(--pa-text-secondary)] hover:text-[var(--pa-text-primary)]"
                                }`}
                            >
                                {tab.label}
                                <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                        activeTab === tab.key
                                            ? "bg-[#3F3F46] text-[var(--pa-text-primary)]"
                                            : "bg-[#262626] text-[var(--pa-text-muted)]"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <SearchLg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--pa-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] py-2 pl-9 pr-3 text-sm text-[var(--pa-text-primary)] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#D946EF] sm:w-64"
                        />
                    </div>
                </div>

                {/* ── CONSENT FORMS TAB ──────────────────────────────────── */}
                {activeTab === "consent" && (
                    <div className="space-y-2">
                        {filteredConsent.length === 0 ? (
                            <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-8 text-center">
                                <p className="text-sm text-[var(--pa-text-muted)]">No consent forms found</p>
                            </div>
                        ) : (
                            filteredConsent.map((form) => (
                                <div
                                    key={form.id}
                                    className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 transition duration-100 ease-linear hover:border-[#3F3F46]"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-lg bg-[#262626]">
                                                {form.status === "signed" ? (
                                                    <FileCheck02 className="size-5 text-[#22C55E]" />
                                                ) : (
                                                    <File06 className="size-5 text-[#F59E0B]" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                                    {form.client}
                                                </p>
                                                <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">
                                                    {form.type}
                                                </p>
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--pa-text-muted)]">
                                                    <span>{formatDate(form.date)}</span>
                                                    <span className="text-[#3F3F46]">&middot;</span>
                                                    <span>Stylist: {form.stylist}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {statusBadge(form.status)}
                                            <button className="rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-2 text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:border-[#3F3F46] hover:text-[var(--pa-text-primary)]">
                                                <Download01 className="size-4" />
                                            </button>
                                            {form.status === "pending" && (
                                                <button
                                                    className="rounded-lg p-2 text-white transition duration-100 ease-linear"
                                                    style={{ backgroundColor: BRAND }}
                                                    title="Resend"
                                                >
                                                    <Send01 className="size-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ── CONSULTATIONS TAB ──────────────────────────────────── */}
                {activeTab === "consultations" && (
                    <div className="space-y-3">
                        {filteredConsultations.length === 0 ? (
                            <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-8 text-center">
                                <p className="text-sm text-[var(--pa-text-muted)]">No consultations found</p>
                            </div>
                        ) : (
                            filteredConsultations.map((consult) => (
                                <div
                                    key={consult.id}
                                    className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 transition duration-100 ease-linear hover:border-[#3F3F46] lg:p-5"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="flex size-10 items-center justify-center rounded-lg"
                                                style={{ backgroundColor: `${BRAND}20` }}
                                            >
                                                <File06 className="size-5" style={{ color: BRAND }} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                                    {consult.client}
                                                </p>
                                                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                                    <span
                                                        className="rounded-md px-2 py-0.5 text-xs font-medium"
                                                        style={{
                                                            backgroundColor: `${BRAND}15`,
                                                            color: BRAND,
                                                        }}
                                                    >
                                                        {consult.type}
                                                    </span>
                                                    <span className="text-xs text-[var(--pa-text-muted)]">
                                                        {formatDate(consult.date)}
                                                    </span>
                                                    <span className="text-[#3F3F46]">&middot;</span>
                                                    <span className="text-xs text-[var(--pa-text-muted)]">
                                                        Stylist: {consult.stylist}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-2 text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:border-[#3F3F46] hover:text-[var(--pa-text-primary)]">
                                                <Edit05 className="size-4" />
                                            </button>
                                            <button className="rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-2 text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:border-[#3F3F46] hover:text-[var(--pa-text-primary)]">
                                                <Download01 className="size-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-3 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] p-3">
                                        <p className="text-xs leading-relaxed text-[#D4D4D8]">
                                            {consult.notes}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ── TEMPLATES TAB ──────────────────────────────────────── */}
                {activeTab === "templates" && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTemplates.length === 0 ? (
                            <div className="col-span-full rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-8 text-center">
                                <p className="text-sm text-[var(--pa-text-muted)]">No templates found</p>
                            </div>
                        ) : (
                            filteredTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 transition duration-100 ease-linear hover:border-[#3F3F46] lg:p-5"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-lg bg-[#262626]">
                                                {template.type === "consent" ? (
                                                    <FileCheck02 className="size-5 text-[#3B82F6]" />
                                                ) : (
                                                    <File06 className="size-5" style={{ color: BRAND }} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                                    {template.name}
                                                </p>
                                                <div className="mt-1">
                                                    {templateTypeBadge(template.type)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-[var(--pa-border-default)] pt-3">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] uppercase tracking-wider text-[var(--pa-text-muted)]">
                                                Last updated
                                            </p>
                                            <p className="text-xs text-[var(--pa-text-secondary)]">
                                                {formatDate(template.lastUpdated)}
                                            </p>
                                        </div>
                                        <div className="text-right space-y-0.5">
                                            <p className="text-[10px] uppercase tracking-wider text-[var(--pa-text-muted)]">
                                                Used
                                            </p>
                                            <p className="text-xs font-semibold text-[var(--pa-text-primary)]">
                                                {template.usageCount}x
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-2">
                                        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] py-2 text-xs font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:border-[#3F3F46] hover:text-[var(--pa-text-primary)]">
                                            <Edit05 className="size-3.5" />
                                            Edit
                                        </button>
                                        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] py-2 text-xs font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:border-[#3F3F46] hover:text-[var(--pa-text-primary)]">
                                            <Copy01 className="size-3.5" />
                                            Duplicate
                                        </button>
                                        <button
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-white transition duration-100 ease-linear"
                                            style={{ backgroundColor: BRAND }}
                                        >
                                            <Send01 className="size-3.5" />
                                            Send
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
