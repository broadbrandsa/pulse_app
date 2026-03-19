"use client";

import { useState, useMemo, useCallback } from "react";
import {
    Plus,
    Eye,
    Download01,
    Send01,
    Check,
    Clock,
    AlertCircle,
    XClose,
    Trash01,
    ChevronDown,
    Mail01,
    RefreshCw01,
    CreditCard01,
    Receipt,
    Calendar,
    ArrowRight,
} from "@untitledui/icons";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { InitialsAvatar } from "@/components/ui/initials-avatar";

// ── Types ────────────────────────────────────────────────────────────────────

type InvoiceStatus = "Paid" | "Outstanding" | "Overdue" | "Draft";
type ChaseStatus = "Reminder sent" | "Final notice" | "Auto-chase ON" | null;
type TabKey = "All" | "Outstanding" | "Overdue" | "Paid" | "Recurring";

interface LineItem {
    description: string;
    qty: number;
    rate: number;
}

interface Invoice {
    id: string;
    clientName: string;
    clientInitials: string;
    clientEmail: string;
    invoiceNumber: string;
    description: string;
    amount: number;
    dueDate: string;
    issueDate: string;
    status: InvoiceStatus;
    chaseStatus: ChaseStatus;
    lineItems: LineItem[];
    isRecurring: boolean;
    recurringActive?: boolean;
}

interface ChaseEvent {
    date: string;
    label: string;
    type: "sent" | "scheduled" | "warning";
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const invoices: Invoice[] = [
    {
        id: "1",
        clientName: "Thabo Mokoena",
        clientInitials: "TM",
        clientEmail: "thabo@email.com",
        invoiceNumber: "INV-0041",
        description: "Monthly PT Package - April",
        amount: 4500,
        dueDate: "2025-04-25",
        issueDate: "2025-04-01",
        status: "Outstanding",
        chaseStatus: "Auto-chase ON",
        lineItems: [
            { description: "Personal Training - 12 Sessions", qty: 12, rate: 350 },
            { description: "Nutrition Plan", qty: 1, rate: 300 },
        ],
        isRecurring: true,
        recurringActive: true,
    },
    {
        id: "2",
        clientName: "Naledi Khumalo",
        clientInitials: "NK",
        clientEmail: "naledi@email.com",
        invoiceNumber: "INV-0040",
        description: "Group Class Package",
        amount: 2400,
        dueDate: "2025-04-10",
        issueDate: "2025-03-25",
        status: "Overdue",
        chaseStatus: "Final notice",
        lineItems: [
            { description: "Group Fitness - 8 Sessions", qty: 8, rate: 250 },
            { description: "Gym Access", qty: 1, rate: 400 },
        ],
        isRecurring: false,
    },
    {
        id: "3",
        clientName: "James van der Berg",
        clientInitials: "JV",
        clientEmail: "james@email.com",
        invoiceNumber: "INV-0039",
        description: "PT Sessions - March",
        amount: 5200,
        dueDate: "2025-03-28",
        issueDate: "2025-03-01",
        status: "Paid",
        chaseStatus: null,
        lineItems: [
            { description: "Personal Training - 10 Sessions", qty: 10, rate: 450 },
            { description: "Body Composition Analysis", qty: 2, rate: 350 },
        ],
        isRecurring: false,
    },
    {
        id: "4",
        clientName: "Priya Naidoo",
        clientInitials: "PN",
        clientEmail: "priya@email.com",
        invoiceNumber: "INV-0038",
        description: "Wellness Consultation",
        amount: 1800,
        dueDate: "2025-04-15",
        issueDate: "2025-04-01",
        status: "Outstanding",
        chaseStatus: "Reminder sent",
        lineItems: [
            { description: "Wellness Consultation - Initial", qty: 1, rate: 800 },
            { description: "Follow-up Sessions", qty: 2, rate: 500 },
        ],
        isRecurring: false,
    },
    {
        id: "5",
        clientName: "Sarah Johnson",
        clientInitials: "SJ",
        clientEmail: "sarah@email.com",
        invoiceNumber: "INV-0037",
        description: "Yoga Package - April",
        amount: 3200,
        dueDate: "2025-03-20",
        issueDate: "2025-03-01",
        status: "Paid",
        chaseStatus: null,
        lineItems: [
            { description: "Yoga Classes - Unlimited Monthly", qty: 1, rate: 2200 },
            { description: "Private Yoga Session", qty: 2, rate: 500 },
        ],
        isRecurring: true,
        recurringActive: true,
    },
    {
        id: "6",
        clientName: "Michael Okonkwo",
        clientInitials: "MO",
        clientEmail: "michael@email.com",
        invoiceNumber: "INV-0036",
        description: "Strength Programme",
        amount: 6800,
        dueDate: "2025-03-15",
        issueDate: "2025-03-01",
        status: "Paid",
        chaseStatus: null,
        lineItems: [
            { description: "Strength & Conditioning - 16 Sessions", qty: 16, rate: 400 },
            { description: "Supplement Pack", qty: 1, rate: 400 },
        ],
        isRecurring: false,
    },
    {
        id: "7",
        clientName: "Zanele Dlamini",
        clientInitials: "ZD",
        clientEmail: "zanele@email.com",
        invoiceNumber: "INV-0035",
        description: "Monthly Membership",
        amount: 900,
        dueDate: "2025-04-20",
        issueDate: "2025-04-01",
        status: "Outstanding",
        chaseStatus: "Auto-chase ON",
        lineItems: [
            { description: "Gym Membership - Monthly", qty: 1, rate: 900 },
        ],
        isRecurring: true,
        recurringActive: false,
    },
    {
        id: "8",
        clientName: "David Pillay",
        clientInitials: "DP",
        clientEmail: "david@email.com",
        invoiceNumber: "INV-0034",
        description: "Boxing Classes",
        amount: 3300,
        dueDate: "2025-03-30",
        issueDate: "2025-03-15",
        status: "Paid",
        chaseStatus: null,
        lineItems: [
            { description: "Boxing Training - 6 Sessions", qty: 6, rate: 500 },
            { description: "Boxing Gloves", qty: 1, rate: 300 },
        ],
        isRecurring: false,
    },
];

const chaseTimeline: ChaseEvent[] = [
    { date: "2025-04-07", label: "Invoice sent to client", type: "sent" },
    { date: "2025-04-12", label: "Payment reminder (3 days before due)", type: "sent" },
    { date: "2025-04-15", label: "Due date reminder", type: "sent" },
    { date: "2025-04-18", label: "Overdue notice (3 days)", type: "warning" },
    { date: "2025-04-22", label: "7-day overdue reminder", type: "scheduled" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const statusBadgeVariant: Record<InvoiceStatus, "success" | "info" | "danger" | "default"> = {
    Paid: "success",
    Outstanding: "info",
    Overdue: "danger",
    Draft: "default",
};

function chaseBadgeStyle(chase: ChaseStatus) {
    switch (chase) {
        case "Reminder sent":
            return "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20";
        case "Final notice":
            return "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/20";
        case "Auto-chase ON":
            return "bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20";
        default:
            return "";
    }
}

const VAT_RATE = 0.15;

function calcSubtotal(items: LineItem[]) {
    return items.reduce((s, i) => s + i.qty * i.rate, 0);
}

// ── Component ────────────────────────────────────────────────────────────────

export default function InvoicesPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("All");
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [recurringStates, setRecurringStates] = useState<Record<string, boolean>>(() => {
        const map: Record<string, boolean> = {};
        invoices.forEach((inv) => {
            if (inv.isRecurring) map[inv.id] = inv.recurringActive ?? true;
        });
        return map;
    });

    // Auto-chase settings
    const [chaseSettings, setChaseSettings] = useState({
        threeDaysBefore: true,
        dueDate: true,
        threeDaysOver: true,
        sevenDaysOver: false,
        fourteenDaysOver: false,
    });

    // New invoice form
    const [newInvoice, setNewInvoice] = useState({
        client: "",
        lineItems: [{ description: "", qty: 1, rate: 0 }] as LineItem[],
        includeVat: true,
        dueDate: "",
        isRecurring: false,
    });

    const tabs: TabKey[] = ["All", "Outstanding", "Overdue", "Paid", "Recurring"];

    const filteredInvoices = useMemo(() => {
        switch (activeTab) {
            case "Outstanding":
                return invoices.filter((i) => i.status === "Outstanding");
            case "Overdue":
                return invoices.filter((i) => i.status === "Overdue");
            case "Paid":
                return invoices.filter((i) => i.status === "Paid");
            case "Recurring":
                return invoices.filter((i) => i.isRecurring);
            default:
                return invoices;
        }
    }, [activeTab]);

    const toggleRecurring = useCallback((id: string) => {
        setRecurringStates((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    const toggleChase = useCallback((key: keyof typeof chaseSettings) => {
        setChaseSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const addLineItem = useCallback(() => {
        setNewInvoice((prev) => ({
            ...prev,
            lineItems: [...prev.lineItems, { description: "", qty: 1, rate: 0 }],
        }));
    }, []);

    const removeLineItem = useCallback((index: number) => {
        setNewInvoice((prev) => ({
            ...prev,
            lineItems: prev.lineItems.filter((_, i) => i !== index),
        }));
    }, []);

    const updateLineItem = useCallback((index: number, field: keyof LineItem, value: string | number) => {
        setNewInvoice((prev) => ({
            ...prev,
            lineItems: prev.lineItems.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    }, []);

    // Stats
    const outstandingTotal = invoices.filter((i) => i.status === "Outstanding").reduce((s, i) => s + i.amount, 0);
    const outstandingCount = invoices.filter((i) => i.status === "Outstanding").length;
    const overdueTotal = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
    const overdueCount = invoices.filter((i) => i.status === "Overdue").length;
    const paidThisMonth = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
    const autochaseCount = invoices.filter((i) => i.chaseStatus === "Auto-chase ON").length;

    return (
        <div className="min-h-screen bg-[#0A0A0A] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[#FAFAFA] lg:text-2xl">Invoices</h1>
                        <p className="mt-0.5 text-sm text-[#A1A1AA]">Manage billing and payment collection</p>
                    </div>
                    <button
                        onClick={() => setShowNewModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#4840E8]"
                    >
                        <Plus className="size-4" />
                        New Invoice
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                    <StatCard
                        title="Outstanding"
                        value={formatCurrency(outstandingTotal)}
                        subtitle={`${outstandingCount} invoices`}
                        icon={<Clock className="size-5" />}
                    />
                    <div className="rounded-2xl border border-[#EF4444]/20 bg-[#111111] p-4 lg:p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-[#A1A1AA]">Overdue</p>
                                <p className="mt-2 text-2xl font-semibold text-[#EF4444]">{formatCurrency(overdueTotal)}</p>
                                <p className="mt-1 text-sm text-[#71717A]">{overdueCount} invoice{overdueCount !== 1 ? "s" : ""}</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EF4444]/10 text-[#EF4444]">
                                <AlertCircle className="size-5" />
                            </div>
                        </div>
                    </div>
                    <StatCard
                        title="Paid this month"
                        value={formatCurrency(paidThisMonth)}
                        icon={<Check className="size-5" />}
                    />
                    <StatCard
                        title="Auto-chase active"
                        value={String(autochaseCount)}
                        icon={<Send01 className="size-5" />}
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 overflow-x-auto rounded-lg bg-[#1A1A1A] p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                activeTab === tab
                                    ? "bg-[#5A4EFF] text-white"
                                    : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Invoice Table */}
                <div className="overflow-x-auto rounded-2xl border border-[#262626]">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#262626] bg-[#0A0A0A]">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Client</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Invoice #</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA] lg:table-cell">Description</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Amount</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA] md:table-cell">Due Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Status</th>
                                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA] lg:table-cell">Chase</th>
                                {activeTab === "Recurring" && (
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Active</th>
                                )}
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((inv) => (
                                <tr
                                    key={inv.id}
                                    className="border-b border-[#262626] bg-[#111111] transition duration-100 ease-linear hover:bg-[#1A1A1A]"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <InitialsAvatar initials={inv.clientInitials} size="sm" />
                                            <div>
                                                <p className="text-sm font-medium text-[#FAFAFA]">{inv.clientName}</p>
                                                <p className="hidden text-xs text-[#71717A] lg:block">{inv.clientEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-mono text-[#A1A1AA]">{inv.invoiceNumber}</td>
                                    <td className="hidden px-4 py-3 text-sm text-[#A1A1AA] lg:table-cell">{inv.description}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-[#FAFAFA]">{formatCurrency(inv.amount)}</td>
                                    <td className="hidden px-4 py-3 text-sm text-[#A1A1AA] md:table-cell">
                                        {new Date(inv.dueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge variant={statusBadgeVariant[inv.status]}>{inv.status}</StatusBadge>
                                    </td>
                                    <td className="hidden px-4 py-3 lg:table-cell">
                                        {inv.chaseStatus ? (
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${chaseBadgeStyle(inv.chaseStatus)}`}>
                                                {inv.chaseStatus}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-[#71717A]">-</span>
                                        )}
                                    </td>
                                    {activeTab === "Recurring" && (
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => toggleRecurring(inv.id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-100 ease-linear ${
                                                    recurringStates[inv.id] ? "bg-[#5A4EFF]" : "bg-[#333333]"
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 rounded-full bg-white transition duration-100 ease-linear ${
                                                        recurringStates[inv.id] ? "translate-x-6" : "translate-x-1"
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                    )}
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedInvoice(inv)}
                                            className="rounded-lg p-2 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A] hover:text-[#FAFAFA]"
                                            title="View"
                                        >
                                            <Eye className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-[#A1A1AA]">
                                        No invoices found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Auto-chase Settings */}
                <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5A4EFF]/10 text-[#5A4EFF]">
                            <RefreshCw01 className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-[#FAFAFA] lg:text-lg">Auto-chase Settings</h2>
                            <p className="text-sm text-[#71717A]">Automatically send reminders for outstanding invoices</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-3 lg:mt-6">
                        {([
                            { key: "threeDaysBefore" as const, label: "3 days before due date", desc: "Send a friendly payment reminder" },
                            { key: "dueDate" as const, label: "On due date", desc: "Remind client payment is due today" },
                            { key: "threeDaysOver" as const, label: "3 days overdue", desc: "First overdue notice" },
                            { key: "sevenDaysOver" as const, label: "7 days overdue", desc: "Follow-up overdue notice" },
                            { key: "fourteenDaysOver" as const, label: "14 days overdue", desc: "Final notice before escalation" },
                        ]).map((setting) => (
                            <div
                                key={setting.key}
                                className="flex items-center justify-between rounded-lg border border-[#262626] bg-[#0A0A0A] px-4 py-3"
                            >
                                <div>
                                    <p className="text-sm font-medium text-[#FAFAFA]">{setting.label}</p>
                                    <p className="text-xs text-[#71717A]">{setting.desc}</p>
                                </div>
                                <button
                                    onClick={() => toggleChase(setting.key)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition duration-100 ease-linear ${
                                        chaseSettings[setting.key] ? "bg-[#5A4EFF]" : "bg-[#333333]"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 rounded-full bg-white transition duration-100 ease-linear ${
                                            chaseSettings[setting.key] ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Invoice Detail Modal ──────────────────────────────────────── */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setSelectedInvoice(null)}
                    />
                    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#262626] bg-[#111111] p-6">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-semibold text-[#FAFAFA]">{selectedInvoice.invoiceNumber}</h2>
                                    <StatusBadge variant={statusBadgeVariant[selectedInvoice.status]}>
                                        {selectedInvoice.status}
                                    </StatusBadge>
                                </div>
                                <p className="mt-1 text-sm text-[#A1A1AA]">
                                    Issued: {new Date(selectedInvoice.issueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                                    {" \u00b7 "}
                                    Due: {new Date(selectedInvoice.dueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="rounded-lg p-2 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A] hover:text-[#FAFAFA]"
                            >
                                <XClose className="size-5" />
                            </button>
                        </div>

                        {/* Client */}
                        <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#262626] bg-[#0A0A0A] p-3">
                            <InitialsAvatar initials={selectedInvoice.clientInitials} size="sm" />
                            <div>
                                <p className="text-sm font-medium text-[#FAFAFA]">{selectedInvoice.clientName}</p>
                                <p className="text-xs text-[#71717A]">{selectedInvoice.clientEmail}</p>
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="mt-4 overflow-hidden rounded-lg border border-[#262626]">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#262626] bg-[#0A0A0A]">
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-[#A1A1AA]">Description</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium uppercase text-[#A1A1AA]">Qty</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium uppercase text-[#A1A1AA]">Rate</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium uppercase text-[#A1A1AA]">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.lineItems.map((item, i) => (
                                        <tr key={i} className="border-b border-[#262626] bg-[#111111]">
                                            <td className="px-4 py-2 text-sm text-[#FAFAFA]">{item.description}</td>
                                            <td className="px-4 py-2 text-right text-sm text-[#A1A1AA]">{item.qty}</td>
                                            <td className="px-4 py-2 text-right text-sm text-[#A1A1AA]">{formatCurrency(item.rate)}</td>
                                            <td className="px-4 py-2 text-right text-sm font-medium text-[#FAFAFA]">{formatCurrency(item.qty * item.rate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="border-t border-[#262626] bg-[#0A0A0A] px-4 py-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#A1A1AA]">Subtotal</span>
                                    <span className="text-[#FAFAFA]">{formatCurrency(calcSubtotal(selectedInvoice.lineItems))}</span>
                                </div>
                                <div className="mt-1 flex justify-between text-sm">
                                    <span className="text-[#A1A1AA]">VAT (15%)</span>
                                    <span className="text-[#FAFAFA]">{formatCurrency(calcSubtotal(selectedInvoice.lineItems) * VAT_RATE)}</span>
                                </div>
                                <div className="mt-2 flex justify-between border-t border-[#262626] pt-2 text-base font-semibold">
                                    <span className="text-[#FAFAFA]">Total</span>
                                    <span className="text-[#FAFAFA]">{formatCurrency(calcSubtotal(selectedInvoice.lineItems) * (1 + VAT_RATE))}</span>
                                </div>
                            </div>
                        </div>

                        {/* Chase Timeline */}
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-[#FAFAFA]">Chase Timeline</h3>
                            <div className="mt-3 space-y-0">
                                {chaseTimeline.map((event, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`h-2.5 w-2.5 rounded-full ${
                                                    event.type === "sent"
                                                        ? "bg-[#E2F4A6]"
                                                        : event.type === "warning"
                                                        ? "bg-[#F59E0B]"
                                                        : "bg-[#333333]"
                                                }`}
                                            />
                                            {i < chaseTimeline.length - 1 && (
                                                <div className="w-px flex-1 bg-[#262626]" />
                                            )}
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-sm text-[#FAFAFA]">{event.label}</p>
                                            <p className="text-xs text-[#71717A]">
                                                {new Date(event.date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-6 flex flex-wrap gap-2 border-t border-[#262626] pt-4">
                            {selectedInvoice.status !== "Paid" && (
                                <button className="inline-flex items-center gap-2 rounded-lg bg-[#E2F4A6] px-4 py-2.5 text-sm font-semibold text-[#0A0A0A] transition duration-100 ease-linear hover:bg-[#d4e89a]">
                                    <Check className="size-4" />
                                    Mark as Paid
                                </button>
                            )}
                            {selectedInvoice.status !== "Paid" && (
                                <button className="inline-flex items-center gap-2 rounded-lg border border-[#262626] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] transition duration-100 ease-linear hover:bg-[#1A1A1A]">
                                    <Send01 className="size-4" />
                                    Send Reminder
                                </button>
                            )}
                            <button className="inline-flex items-center gap-2 rounded-lg border border-[#262626] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] transition duration-100 ease-linear hover:bg-[#1A1A1A]">
                                <Download01 className="size-4" />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── New Invoice Modal ────────────────────────────────────────── */}
            {showNewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowNewModal(false)}
                    />
                    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#262626] bg-[#111111] p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#FAFAFA]">New Invoice</h2>
                            <button
                                onClick={() => setShowNewModal(false)}
                                className="rounded-lg p-2 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A] hover:text-[#FAFAFA]"
                            >
                                <XClose className="size-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            {/* Client */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Client</label>
                                <select
                                    value={newInvoice.client}
                                    onChange={(e) => setNewInvoice((p) => ({ ...p, client: e.target.value }))}
                                    className="h-11 w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] focus:ring-1 focus:ring-[#5A4EFF]"
                                >
                                    <option value="">Select a client...</option>
                                    {invoices.map((inv) => (
                                        <option key={inv.id} value={inv.clientName}>{inv.clientName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Line Items */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Line Items</label>
                                <div className="space-y-2">
                                    {newInvoice.lineItems.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                value={item.description}
                                                onChange={(e) => updateLineItem(i, "description", e.target.value)}
                                                className="h-11 flex-1 rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] focus:ring-1 focus:ring-[#5A4EFF]"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Qty"
                                                value={item.qty || ""}
                                                onChange={(e) => updateLineItem(i, "qty", parseInt(e.target.value) || 0)}
                                                className="h-11 w-20 rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] focus:ring-1 focus:ring-[#5A4EFF]"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Rate"
                                                value={item.rate || ""}
                                                onChange={(e) => updateLineItem(i, "rate", parseFloat(e.target.value) || 0)}
                                                className="h-11 w-28 rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] focus:ring-1 focus:ring-[#5A4EFF]"
                                            />
                                            {newInvoice.lineItems.length > 1 && (
                                                <button
                                                    onClick={() => removeLineItem(i)}
                                                    className="rounded-lg p-2 text-[#EF4444] transition duration-100 ease-linear hover:bg-[#EF4444]/10"
                                                >
                                                    <Trash01 className="size-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={addLineItem}
                                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:text-[#4840E8]"
                                >
                                    <Plus className="size-4" /> Add line item
                                </button>
                            </div>

                            {/* VAT Toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#FAFAFA]">Include VAT (15%)</p>
                                    <p className="text-xs text-[#71717A]">Add 15% VAT to invoice total</p>
                                </div>
                                <button
                                    onClick={() => setNewInvoice((p) => ({ ...p, includeVat: !p.includeVat }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-100 ease-linear ${
                                        newInvoice.includeVat ? "bg-[#5A4EFF]" : "bg-[#333333]"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 rounded-full bg-white transition duration-100 ease-linear ${
                                            newInvoice.includeVat ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Due Date</label>
                                <input
                                    type="date"
                                    value={newInvoice.dueDate}
                                    onChange={(e) => setNewInvoice((p) => ({ ...p, dueDate: e.target.value }))}
                                    className="h-11 w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] focus:ring-1 focus:ring-[#5A4EFF]"
                                />
                            </div>

                            {/* Recurring Toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#FAFAFA]">Recurring Invoice</p>
                                    <p className="text-xs text-[#71717A]">Automatically generate this invoice monthly</p>
                                </div>
                                <button
                                    onClick={() => setNewInvoice((p) => ({ ...p, isRecurring: !p.isRecurring }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-100 ease-linear ${
                                        newInvoice.isRecurring ? "bg-[#5A4EFF]" : "bg-[#333333]"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 rounded-full bg-white transition duration-100 ease-linear ${
                                            newInvoice.isRecurring ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Summary */}
                            {(() => {
                                const subtotal = calcSubtotal(newInvoice.lineItems);
                                const vat = newInvoice.includeVat ? subtotal * VAT_RATE : 0;
                                const total = subtotal + vat;
                                return (
                                    <div className="rounded-lg border border-[#262626] bg-[#0A0A0A] p-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#A1A1AA]">Subtotal</span>
                                            <span className="text-[#FAFAFA]">{formatCurrency(subtotal)}</span>
                                        </div>
                                        {newInvoice.includeVat && (
                                            <div className="mt-1 flex justify-between text-sm">
                                                <span className="text-[#A1A1AA]">VAT (15%)</span>
                                                <span className="text-[#FAFAFA]">{formatCurrency(vat)}</span>
                                            </div>
                                        )}
                                        <div className="mt-2 flex justify-between border-t border-[#262626] pt-2 text-base font-semibold">
                                            <span className="text-[#FAFAFA]">Total</span>
                                            <span className="text-[#FAFAFA]">{formatCurrency(total)}</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Submit */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setShowNewModal(false)}
                                    className="flex-1 rounded-lg border border-[#262626] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] transition duration-100 ease-linear hover:bg-[#1A1A1A]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowNewModal(false)}
                                    className="flex-1 rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#4840E8]"
                                >
                                    Create Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
