"use client";

import { useState } from "react";
import {
    File06,
    FileCheck02,
    Download01,
    ChevronRight,
    SearchLg,
    Plus,
    Users01,
    Shield01,
} from "@untitledui/icons";

// -- Types ------------------------------------------------------------------------

type DocTab = "waivers" | "intake" | "contracts";

type Document = {
    id: string;
    name: string;
    description: string;
    category: DocTab;
    lastUpdated: string;
    signed: number;
    total: number;
    status: "active" | "draft";
};

// -- Mock Data --------------------------------------------------------------------

const documents: Document[] = [
    // Waivers
    {
        id: "W-001",
        name: "Liability Waiver",
        description: "Standard liability and assumption of risk waiver for all yoga classes",
        category: "waivers",
        lastUpdated: "2026-03-01",
        signed: 186,
        total: 244,
        status: "active",
    },
    {
        id: "W-002",
        name: "Pregnancy Disclaimer Form",
        description: "Additional waiver and medical clearance for prenatal yoga students",
        category: "waivers",
        lastUpdated: "2026-02-15",
        signed: 12,
        total: 14,
        status: "active",
    },
    // Intake Forms
    {
        id: "I-001",
        name: "Health Assessment",
        description: "Comprehensive health questionnaire covering medical history and conditions",
        category: "intake",
        lastUpdated: "2026-03-10",
        signed: 210,
        total: 244,
        status: "active",
    },
    {
        id: "I-002",
        name: "Injuries & Limitations Form",
        description: "Details on current injuries, physical limitations, and modifications needed",
        category: "intake",
        lastUpdated: "2026-03-05",
        signed: 98,
        total: 244,
        status: "active",
    },
    // Contracts
    {
        id: "C-001",
        name: "Membership Agreement",
        description: "Terms and conditions for monthly unlimited membership plans",
        category: "contracts",
        lastUpdated: "2026-01-15",
        signed: 64,
        total: 64,
        status: "active",
    },
    {
        id: "C-002",
        name: "Instructor Contract",
        description: "Independent contractor agreement for yoga instructors",
        category: "contracts",
        lastUpdated: "2026-02-01",
        signed: 4,
        total: 5,
        status: "active",
    },
    {
        id: "C-003",
        name: "Workshop Facilitator Agreement",
        description: "Contract for guest workshop facilitators and visiting teachers",
        category: "contracts",
        lastUpdated: "2026-03-12",
        signed: 0,
        total: 1,
        status: "draft",
    },
];

const tabConfig: { label: string; value: DocTab; icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }[] = [
    { label: "Waivers", value: "waivers", icon: Shield01, color: "#EF4444" },
    { label: "Intake Forms", value: "intake", icon: FileCheck02, color: "#14B8A6" },
    { label: "Contracts", value: "contracts", icon: File06, color: "#7C3AED" },
];

// -- Helpers ----------------------------------------------------------------------

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// -- Page Component ---------------------------------------------------------------

export default function YogaDocumentsPage() {
    const [activeTab, setActiveTab] = useState<DocTab>("waivers");
    const [search, setSearch] = useState("");

    const filtered = documents.filter((doc) => {
        const matchesTab = doc.category === activeTab;
        const matchesSearch =
            doc.name.toLowerCase().includes(search.toLowerCase()) ||
            doc.description.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const activeConfig = tabConfig.find((t) => t.value === activeTab)!;

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                            <File06 className="size-5 text-[#14B8A6]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">Documents</h1>
                            <p className="text-sm text-[var(--pa-text-secondary)]">Manage waivers, intake forms, and contracts</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 self-start rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                        <Plus className="size-4" />
                        New Document
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 lg:gap-4">
                    {tabConfig.map((tab) => {
                        const docs = documents.filter((d) => d.category === tab.value);
                        const totalSigned = docs.reduce((s, d) => s + d.signed, 0);
                        const totalDocs = docs.reduce((s, d) => s + d.total, 0);
                        const Icon = tab.icon;
                        return (
                            <div key={tab.value} className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex size-10 items-center justify-center rounded-full"
                                        style={{ backgroundColor: `${tab.color}20` }}
                                    >
                                        <Icon className="size-5" style={{ color: tab.color }} />
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">{tab.label}</p>
                                <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">{docs.length}</p>
                                <p className="mt-0.5 text-xs text-[var(--pa-text-muted)]">{totalSigned}/{totalDocs} signed</p>
                            </div>
                        );
                    })}
                </div>

                {/* Tabs + Search */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabConfig.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                    activeTab === tab.value
                                        ? "bg-[#14B8A6] text-white"
                                        : "text-[var(--pa-text-muted)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <SearchLg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--pa-text-muted)]" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search documents..."
                            className="min-h-[40px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] pl-10 pr-4 text-sm text-[var(--pa-text-primary)] placeholder-[var(--pa-text-muted)] outline-none transition duration-100 ease-linear focus:border-[#14B8A6] sm:w-64"
                        />
                    </div>
                </div>

                {/* Document Cards */}
                <div className="space-y-3">
                    {filtered.map((doc) => {
                        const pct = doc.total > 0 ? Math.round((doc.signed / doc.total) * 100) : 0;
                        return (
                            <div
                                key={doc.id}
                                className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5 transition duration-100 ease-linear hover:border-[#14B8A6]/30"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">{doc.name}</h3>
                                            {doc.status === "draft" && (
                                                <span className="rounded-full bg-[#71717A]/15 px-2 py-0.5 text-[10px] font-medium text-[var(--pa-text-muted)]">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-[var(--pa-text-secondary)]">{doc.description}</p>
                                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--pa-text-muted)]">
                                            <span>Updated {formatDate(doc.lastUpdated)}</span>
                                            <span className="flex items-center gap-1">
                                                <Users01 className="size-3.5" />
                                                {doc.signed}/{doc.total} signed
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <button className="flex size-9 items-center justify-center rounded-xl text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]">
                                            <Download01 className="size-4" />
                                        </button>
                                        <button className="flex size-9 items-center justify-center rounded-xl text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]">
                                            <ChevronRight className="size-4" />
                                        </button>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="mt-3">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--pa-bg-elevated)]">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${pct}%`,
                                                backgroundColor: pct === 100 ? "#22C55E" : activeConfig.color,
                                            }}
                                        />
                                    </div>
                                    <p className="mt-1 text-right text-[10px] text-[var(--pa-text-muted)]">{pct}% complete</p>
                                </div>
                            </div>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-12 text-center">
                            <File06 className="mx-auto mb-3 size-10 text-[var(--pa-bg-elevated)]" />
                            <p className="text-sm text-[var(--pa-text-muted)]">No documents found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
