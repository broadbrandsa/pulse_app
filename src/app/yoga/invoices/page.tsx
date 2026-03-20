"use client";

import { useState } from "react";
import {
    FileCheck02,
    Plus,
    Send01,
    Download01,
    ChevronRight,
    SearchLg,
} from "@untitledui/icons";

// -- Types ------------------------------------------------------------------------

type InvoiceStatus = "paid" | "outstanding" | "overdue" | "draft";
type FilterTab = "all" | InvoiceStatus;

type Invoice = {
    id: string;
    client: string;
    date: string;
    amount: string;
    status: InvoiceStatus;
    description: string;
};

// -- Mock Data --------------------------------------------------------------------

const invoices: Invoice[] = [
    { id: "INV-Y001", client: "Kefilwe Molefe", date: "2026-03-18", amount: "R1,099", status: "paid", description: "Monthly Unlimited Membership" },
    { id: "INV-Y002", client: "Lerato Phiri", date: "2026-03-15", amount: "R950", status: "paid", description: "10-Class Pass" },
    { id: "INV-Y003", client: "Priya Chetty", date: "2026-03-14", amount: "R280", status: "paid", description: "Sound Bath Workshop" },
    { id: "INV-Y004", client: "Zanele Mthembu", date: "2026-03-10", amount: "R550", status: "outstanding", description: "5-Class Pass" },
    { id: "INV-Y005", client: "Thandi Ndaba", date: "2026-02-28", amount: "R1,099", status: "overdue", description: "Monthly Unlimited Renewal" },
    { id: "INV-Y006", client: "Nomsa Dlamini", date: "2026-03-17", amount: "R120", status: "paid", description: "Drop-in Class" },
    { id: "INV-Y007", client: "Instructor: Sipho M.", date: "2026-03-01", amount: "R8,500", status: "outstanding", description: "Contractor Payment \u2014 March" },
    { id: "INV-Y008", client: "Walk-in Student", date: "2026-03-19", amount: "R120", status: "draft", description: "Drop-in Class" },
];

const stats = [
    { label: "Outstanding", value: "R9,050", color: "#F59E0B", bgColor: "bg-[#F59E0B]/15" },
    { label: "Paid This Month", value: "R2,449", color: "#22C55E", bgColor: "bg-[#22C55E]/15" },
    { label: "Overdue", value: "R1,099", color: "#EF4444", bgColor: "bg-[#EF4444]/15" },
    { label: "Draft", value: "1", color: "#71717A", bgColor: "bg-[#71717A]/15" },
];

const tabs: { label: string; value: FilterTab }[] = [
    { label: "All", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Outstanding", value: "outstanding" },
    { label: "Overdue", value: "overdue" },
    { label: "Draft", value: "draft" },
];

// -- Helpers ----------------------------------------------------------------------

function statusBadge(status: InvoiceStatus) {
    const config: Record<InvoiceStatus, { bg: string; text: string; label: string }> = {
        paid: { bg: "bg-[#22C55E]/15", text: "text-[#22C55E]", label: "Paid" },
        outstanding: { bg: "bg-[#F59E0B]/15", text: "text-[#F59E0B]", label: "Outstanding" },
        overdue: { bg: "bg-[#EF4444]/15", text: "text-[#EF4444]", label: "Overdue" },
        draft: { bg: "bg-[#71717A]/15", text: "text-[var(--pa-text-muted)]", label: "Draft" },
    };
    const c = config[status];
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
            <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: status === "paid" ? "#22C55E" : status === "outstanding" ? "#F59E0B" : status === "overdue" ? "#EF4444" : "#71717A" }}
            />
            {c.label}
        </span>
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// -- Page Component ---------------------------------------------------------------

export default function YogaInvoicesPage() {
    const [activeTab, setActiveTab] = useState<FilterTab>("all");
    const [search, setSearch] = useState("");

    const filtered = invoices.filter((inv) => {
        const matchesTab = activeTab === "all" || inv.status === activeTab;
        const matchesSearch =
            inv.client.toLowerCase().includes(search.toLowerCase()) ||
            inv.id.toLowerCase().includes(search.toLowerCase()) ||
            inv.description.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                            <FileCheck02 className="size-5 text-[#14B8A6]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">Invoices</h1>
                            <p className="text-sm text-[var(--pa-text-secondary)]">Manage and track all studio invoices</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 self-start rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                        <Plus className="size-4" />
                        New Invoice
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                    {stats.map((s) => (
                        <div key={s.label} className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                            <div className="flex items-center gap-3">
                                <div className={`flex size-10 items-center justify-center rounded-full ${s.bgColor}`}>
                                    <FileCheck02 className="size-5" style={{ color: s.color }} />
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">{s.label}</p>
                            <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
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
                            placeholder="Search invoices..."
                            className="min-h-[40px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] pl-10 pr-4 text-sm text-[var(--pa-text-primary)] placeholder-[var(--pa-text-muted)] outline-none transition duration-100 ease-linear focus:border-[#14B8A6] sm:w-64"
                        />
                    </div>
                </div>

                {/* Invoice Table */}
                <div className="overflow-hidden rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--pa-border-default)]">
                                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Invoice</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Client</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Description</th>
                                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Amount</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Status</th>
                                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--pa-border-subtle)]">
                                {filtered.map((inv) => (
                                    <tr key={inv.id} className="transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)]">
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-[var(--pa-text-primary)]">{inv.id}</td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--pa-text-primary)]">{inv.client}</td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--pa-text-secondary)]">{formatDate(inv.date)}</td>
                                        <td className="px-5 py-4 text-sm text-[var(--pa-text-secondary)]">{inv.description}</td>
                                        <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold text-[var(--pa-text-primary)]">{inv.amount}</td>
                                        <td className="whitespace-nowrap px-5 py-4">{statusBadge(inv.status)}</td>
                                        <td className="whitespace-nowrap px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button className="flex size-8 items-center justify-center rounded-lg text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]">
                                                    <ChevronRight className="size-4" />
                                                </button>
                                                <button className="flex size-8 items-center justify-center rounded-lg text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]">
                                                    <Send01 className="size-4" />
                                                </button>
                                                <button className="flex size-8 items-center justify-center rounded-lg text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]">
                                                    <Download01 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="divide-y divide-[var(--pa-border-subtle)] lg:hidden">
                        {filtered.map((inv) => (
                            <div key={inv.id} className="p-4 transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)]">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-[var(--pa-text-primary)]">{inv.id}</span>
                                            {statusBadge(inv.status)}
                                        </div>
                                        <p className="mt-1 text-sm text-[var(--pa-text-primary)]">{inv.client}</p>
                                        <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">{inv.description}</p>
                                        <p className="mt-0.5 text-xs text-[var(--pa-text-muted)]">{formatDate(inv.date)}</p>
                                    </div>
                                    <p className="shrink-0 text-sm font-semibold text-[var(--pa-text-primary)]">{inv.amount}</p>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <button className="flex items-center gap-1.5 rounded-lg bg-[var(--pa-bg-elevated)] px-3 py-1.5 text-xs text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:text-[var(--pa-text-primary)]">
                                        <ChevronRight className="size-3.5" />
                                        View
                                    </button>
                                    <button className="flex items-center gap-1.5 rounded-lg bg-[var(--pa-bg-elevated)] px-3 py-1.5 text-xs text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:text-[var(--pa-text-primary)]">
                                        <Send01 className="size-3.5" />
                                        Send
                                    </button>
                                    <button className="flex items-center gap-1.5 rounded-lg bg-[var(--pa-bg-elevated)] px-3 py-1.5 text-xs text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:text-[var(--pa-text-primary)]">
                                        <Download01 className="size-3.5" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state */}
                    {filtered.length === 0 && (
                        <div className="p-12 text-center">
                            <FileCheck02 className="mx-auto mb-3 size-10 text-[var(--pa-bg-elevated)]" />
                            <p className="text-sm text-[var(--pa-text-muted)]">No invoices found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
