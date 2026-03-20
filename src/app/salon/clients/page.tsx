"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    SearchLg,
    Plus,
    Users01,
    Star01,
    ChevronRight,
    Phone01,
    RefreshCw05,
    TrendUp01,
} from "@untitledui/icons";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

interface SalonClient {
    id: string;
    name: string;
    phone: string;
    lastVisit: string;
    stylist: string;
    tier: "Gold" | "Silver" | "Bronze";
    service: string;
    visits: number;
    initials: string;
}

const salonClients: SalonClient[] = [
    { id: "1", name: "Thandi Mokoena", phone: "+27 72 345 6789", lastVisit: "2026-03-17", stylist: "Naledi", tier: "Gold", service: "Braids", visits: 24, initials: "TM" },
    { id: "2", name: "Khanyi Langa", phone: "+27 83 456 7890", lastVisit: "2026-03-15", stylist: "Zinhle", tier: "Silver", service: "Wash & Blow", visits: 12, initials: "KL" },
    { id: "3", name: "Precious Ndlovu", phone: "+27 61 567 8901", lastVisit: "2026-03-14", stylist: "Buhle", tier: "Gold", service: "Colour", visits: 30, initials: "PN" },
    { id: "4", name: "Lerato Phiri", phone: "+27 79 678 9012", lastVisit: "2026-03-10", stylist: "Zinhle", tier: "Bronze", service: "Relaxer", visits: 8, initials: "LP" },
    { id: "5", name: "Nompilo Sithole", phone: "+27 82 789 0123", lastVisit: "2026-03-12", stylist: "Buhle", tier: "Silver", service: "Locs Retwist", visits: 15, initials: "NS" },
    { id: "6", name: "Ayanda Khumalo", phone: "+27 71 890 1234", lastVisit: "2026-03-18", stylist: "Naledi", tier: "Gold", service: "Silk Press", visits: 28, initials: "AK" },
    { id: "7", name: "Sibongile Dube", phone: "+27 84 901 2345", lastVisit: "2026-03-08", stylist: "Zinhle", tier: "Bronze", service: "Wig Install", visits: 5, initials: "SD" },
    { id: "8", name: "Zanele Wezi", phone: "+27 73 012 3456", lastVisit: "2026-03-16", stylist: "Naledi", tier: "Silver", service: "Treatment", visits: 18, initials: "ZW" },
];

const stats = [
    { label: "Total Clients", value: "342", icon: Users01, change: "+12%" },
    { label: "New This Month", value: "18", icon: Plus, change: "+6" },
    { label: "Avg. Visit Frequency", value: "3.2 weeks", icon: RefreshCw05, change: "-0.3" },
    { label: "Retention Rate", value: "89%", icon: TrendUp01, change: "+2%" },
];

type FilterTab = "All" | "VIP" | "Regular" | "New";
const filterTabs: FilterTab[] = ["All", "VIP", "Regular", "New"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const tierColors: Record<string, { bg: string; text: string }> = {
    Gold: { bg: "bg-amber-500/15", text: "text-amber-400" },
    Silver: { bg: "bg-gray-400/15", text: "text-[var(--pa-text-secondary)]" },
    Bronze: { bg: "bg-orange-600/15", text: "text-orange-400" },
};

const avatarColors = [
    "bg-[#D946EF]/20 text-[#D946EF]",
    "bg-purple-500/20 text-purple-400",
    "bg-pink-500/20 text-pink-400",
    "bg-fuchsia-500/20 text-fuchsia-400",
    "bg-violet-500/20 text-violet-400",
    "bg-rose-500/20 text-rose-400",
    "bg-cyan-500/20 text-cyan-400",
    "bg-teal-500/20 text-teal-400",
];

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function filterClients(clients: SalonClient[], tab: FilterTab, search: string): SalonClient[] {
    let filtered = clients;

    if (tab === "VIP") {
        filtered = filtered.filter((c) => c.tier === "Gold");
    } else if (tab === "Regular") {
        filtered = filtered.filter((c) => c.tier === "Silver");
    } else if (tab === "New") {
        filtered = filtered.filter((c) => c.visits < 10);
    }

    if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter((c) => c.name.toLowerCase().includes(q));
    }

    return filtered;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SalonClientsPage() {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<FilterTab>("All");

    const filteredClients = useMemo(
        () => filterClients(salonClients, activeTab, search),
        [activeTab, search],
    );

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--pa-text-primary)]">Clients</h1>
                    <p className="mt-1 text-sm text-[var(--pa-text-secondary)]">
                        Manage your salon client database
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg bg-[#D946EF] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#C026D3]">
                    <Plus className="size-4" />
                    Add Client
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <SearchLg className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[var(--pa-text-muted)]" />
                <input
                    type="text"
                    placeholder="Search clients by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--pa-text-primary)] placeholder-[var(--pa-text-muted)] outline-none transition duration-100 ease-linear focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF]"
                />
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
                                <div className="flex size-9 items-center justify-center rounded-lg bg-[#D946EF]/10">
                                    <Icon className="size-4 text-[#D946EF]" />
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
            <div className="mb-4 flex gap-1 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-1">
                {filterTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-md px-4 py-1.5 text-sm font-medium transition duration-100 ease-linear ${
                            activeTab === tab
                                ? "bg-[#D946EF] text-white"
                                : "text-[var(--pa-text-secondary)] hover:text-white"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Client Table */}
            <div className="overflow-hidden rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)]">
                {/* Table Header */}
                <div className="hidden border-b border-[var(--pa-border-default)] px-4 py-3 sm:grid sm:grid-cols-[2fr_1.2fr_1fr_1fr_0.8fr_1fr_auto] sm:gap-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Client</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Phone</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Last Visit</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Stylist</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Tier</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]">Service</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--pa-text-muted)]" />
                </div>

                {/* Rows */}
                {filteredClients.length === 0 && (
                    <div className="px-4 py-12 text-center text-sm text-[var(--pa-text-muted)]">
                        No clients found matching your search.
                    </div>
                )}

                {filteredClients.map((client, idx) => {
                    const tier = tierColors[client.tier];
                    const avatarColor = avatarColors[idx % avatarColors.length];

                    return (
                        <div
                            key={client.id}
                            className="border-b border-[var(--pa-border-default)] px-4 py-3 transition duration-100 ease-linear last:border-b-0 hover:bg-white/[0.02] sm:grid sm:grid-cols-[2fr_1.2fr_1fr_1fr_0.8fr_1fr_auto] sm:items-center sm:gap-4"
                        >
                            {/* Client name + avatar */}
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor}`}
                                >
                                    {client.initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-[var(--pa-text-primary)]">
                                        {client.name}
                                    </p>
                                    <p className="text-xs text-[var(--pa-text-muted)] sm:hidden">
                                        {client.service}
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="mt-2 flex items-center gap-1.5 sm:mt-0">
                                <Phone01 className="size-3.5 text-[var(--pa-text-muted)] sm:hidden" />
                                <span className="text-sm text-[var(--pa-text-secondary)]">{client.phone}</span>
                            </div>

                            {/* Last visit */}
                            <p className="mt-1 text-sm text-[var(--pa-text-secondary)] sm:mt-0">
                                {formatDate(client.lastVisit)}
                            </p>

                            {/* Stylist */}
                            <p className="hidden text-sm text-[var(--pa-text-secondary)] sm:block">
                                {client.stylist}
                            </p>

                            {/* Tier badge */}
                            <div className="mt-2 sm:mt-0">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tier.bg} ${tier.text}`}
                                >
                                    {client.tier === "Gold" && (
                                        <Star01 className="size-3" />
                                    )}
                                    {client.tier}
                                </span>
                            </div>

                            {/* Service */}
                            <p className="hidden text-sm text-[var(--pa-text-secondary)] sm:block">
                                {client.service}
                            </p>

                            {/* Action */}
                            <Link
                                href={`/salon/clients/${client.id}`}
                                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#D946EF] transition duration-100 ease-linear hover:text-[#E879F9] sm:mt-0"
                            >
                                View
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
