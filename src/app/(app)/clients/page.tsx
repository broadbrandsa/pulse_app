"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SearchLg, Plus, Calendar, Mail01, Eye, ChevronRight } from "@untitledui/icons";
import { clients } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Client, MembershipType, MembershipStatus, LoyaltyTier } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { InitialsAvatar } from "@/components/ui/initials-avatar";

const membershipStatusVariant: Record<MembershipStatus, "success" | "warning" | "danger" | "info"> = {
    Active: "success",
    "Expiring Soon": "warning",
    Lapsed: "danger",
    Trial: "info",
};

const loyaltyTierVariant: Record<LoyaltyTier, "bronze" | "silver" | "gold" | "platinum"> = {
    Bronze: "bronze",
    Silver: "silver",
    Gold: "gold",
    Platinum: "platinum",
};

type SortOption = "lastVisit" | "name" | "totalSpend";

export default function ClientsPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [membershipFilter, setMembershipFilter] = useState<MembershipType | "All">("All");
    const [statusFilter, setStatusFilter] = useState<MembershipStatus | "All">("All");
    const [sortBy, setSortBy] = useState<SortOption>("lastVisit");
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const filteredClients = useMemo(() => {
        let result = [...clients];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.email.toLowerCase().includes(q) ||
                    c.phone.includes(q)
            );
        }

        if (membershipFilter !== "All") {
            result = result.filter((c) => c.membershipType === membershipFilter);
        }

        if (statusFilter !== "All") {
            result = result.filter((c) => c.membershipStatus === statusFilter);
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "totalSpend":
                    return b.totalSpend - a.totalSpend;
                case "lastVisit":
                default:
                    return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
            }
        });

        return result;
    }, [search, membershipFilter, statusFilter, sortBy]);

    const activeCount = clients.filter((c) => c.membershipStatus === "Active").length;
    const expiringCount = clients.filter((c) => c.membershipStatus === "Expiring Soon").length;
    const trialCount = clients.filter((c) => c.membershipStatus === "Trial").length || 5;
    const newThisMonth = 3;

    const totalPages = Math.ceil(filteredClients.length / pageSize);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const sortOptions: { key: SortOption; label: string }[] = [
        { key: "lastVisit", label: "Last Visit" },
        { key: "name", label: "Name" },
        { key: "totalSpend", label: "Spend" },
    ];

    return (
        <div className="min-h-screen bg-[#111111] pb-28 lg:pb-6">
            {/* Sticky Search Bar */}
            <div className="sticky top-0 z-30 bg-[#111111] px-4 pb-3 pt-4 lg:px-6">
                <div className="relative">
                    <SearchLg className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#A1A1AA]" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="h-12 w-full rounded-2xl border border-[#262626] bg-[#111111] pl-11 pr-4 text-sm text-[#FAFAFA] placeholder-[#A1A1AA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] focus:ring-1 focus:ring-[#5A4EFF]"
                    />
                </div>
            </div>

            <div className="px-4 lg:px-6">
                {/* Stats Strip */}
                <div className="flex gap-3 overflow-x-auto pb-1 pt-2 snap-x lg:grid lg:grid-cols-4 lg:overflow-visible">
                    <div className="min-w-[140px] snap-start rounded-2xl border border-[#262626] bg-[#111111] p-3 lg:min-w-0">
                        <p className="text-xs text-[#A1A1AA]">Active Clients</p>
                        <p className="mt-1 text-xl font-semibold text-[#FAFAFA]">{activeCount}</p>
                    </div>
                    <div className="min-w-[140px] snap-start rounded-2xl border border-[#262626] bg-[#111111] p-3 lg:min-w-0">
                        <p className="text-xs text-[#A1A1AA]">Expiring Soon</p>
                        <p className="mt-1 text-xl font-semibold text-[#F59E0B]">{expiringCount}</p>
                    </div>
                    <div className="min-w-[140px] snap-start rounded-2xl border border-[#262626] bg-[#111111] p-3 lg:min-w-0">
                        <p className="text-xs text-[#A1A1AA]">Trials</p>
                        <p className="mt-1 text-xl font-semibold text-[#14B8A6]">{trialCount}</p>
                    </div>
                    <div className="min-w-[140px] snap-start rounded-2xl border border-[#262626] bg-[#111111] p-3 lg:min-w-0">
                        <p className="text-xs text-[#A1A1AA]">New This Month</p>
                        <p className="mt-1 text-xl font-semibold text-[#FAFAFA]">{newThisMonth}</p>
                    </div>
                </div>

                {/* Filter Toggle (mobile) + Filters */}
                <div className="mt-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#111111] px-4 py-2.5 text-sm font-medium text-[#FAFAFA] transition duration-100 ease-linear hover:bg-[#1A1A1A] lg:hidden"
                    >
                        Filters
                        <svg
                            className={`size-4 transition-transform duration-150 ${showFilters ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div className={`mt-3 flex-wrap items-center gap-3 ${showFilters ? "flex" : "hidden"} lg:flex`}>
                        <select
                            value={membershipFilter}
                            onChange={(e) => {
                                setMembershipFilter(e.target.value as MembershipType | "All");
                                setCurrentPage(1);
                            }}
                            className="min-h-[44px] rounded-lg border border-[#262626] bg-[#111111] px-3 py-2 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]"
                        >
                            <option value="All">All Memberships</option>
                            <option value="Monthly">Monthly</option>
                            <option value="PT Package">PT Package</option>
                            <option value="Drop-in">Drop-in</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as MembershipStatus | "All");
                                setCurrentPage(1);
                            }}
                            className="min-h-[44px] rounded-lg border border-[#262626] bg-[#111111] px-3 py-2 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Expiring Soon">Expiring Soon</option>
                            <option value="Lapsed">Lapsed</option>
                            <option value="Trial">Trial</option>
                        </select>

                        <div className="flex items-center gap-1 rounded-lg border border-[#262626] bg-[#111111] p-1">
                            {sortOptions.map((opt) => (
                                <button
                                    key={opt.key}
                                    onClick={() => setSortBy(opt.key)}
                                    className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear ${
                                        sortBy === opt.key
                                            ? "bg-[#5A4EFF] text-white"
                                            : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Card List */}
                <div className="mt-4 space-y-3 lg:hidden">
                    {paginatedClients.map((client) => (
                        <button
                            key={client.id}
                            onClick={() => router.push(`/clients/${client.id}`)}
                            className="flex w-full flex-col gap-2.5 rounded-2xl border border-[#262626] bg-[#111111] p-4 text-left transition duration-100 ease-linear active:bg-[#1A1A1A]"
                        >
                            {/* Row 1: Avatar + Name + Chevron */}
                            <div className="flex min-h-[44px] items-center gap-3">
                                <InitialsAvatar initials={client.initials} src={client.avatarUrl} size="sm" />
                                <span className="flex-1 font-medium text-[#FAFAFA]">{client.name}</span>
                                <ChevronRight className="size-5 text-[#A1A1AA]" />
                            </div>

                            {/* Row 2: Badges */}
                            <div className="flex flex-wrap items-center gap-1.5">
                                <StatusBadge variant="info">{client.membershipType}</StatusBadge>
                                <StatusBadge variant={membershipStatusVariant[client.membershipStatus]} dot>
                                    {client.membershipStatus}
                                </StatusBadge>
                                <StatusBadge variant={loyaltyTierVariant[client.loyaltyTier]}>
                                    {client.loyaltyTier}
                                </StatusBadge>
                            </div>

                            {/* Row 3: Last visit + Spend */}
                            <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                                <span>Last visit: {formatDate(client.lastVisit)}</span>
                                <span className="font-medium text-[#FAFAFA]">{formatCurrency(client.totalSpend)}</span>
                            </div>
                        </button>
                    ))}

                    {paginatedClients.length === 0 && (
                        <div className="py-12 text-center text-sm text-[#A1A1AA]">
                            No clients found matching your search.
                        </div>
                    )}
                </div>

                {/* Desktop Table */}
                <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-[#262626] lg:block">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#262626] bg-[#0A0A0A]">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Membership</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Tier</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Last Visit</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Spend</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedClients.map((client) => (
                                <tr
                                    key={client.id}
                                    onClick={() => router.push(`/clients/${client.id}`)}
                                    className="cursor-pointer border-b border-[#262626] bg-[#111111] transition duration-100 ease-linear hover:bg-[#1A1A1A]"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <InitialsAvatar initials={client.initials} src={client.avatarUrl} size="sm" />
                                            <div>
                                                <p className="font-medium text-[#FAFAFA]">{client.name}</p>
                                                <p className="text-xs text-[#A1A1AA]">{client.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#A1A1AA]">{client.membershipType}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge variant={membershipStatusVariant[client.membershipStatus]} dot>
                                            {client.membershipStatus}
                                        </StatusBadge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge variant={loyaltyTierVariant[client.loyaltyTier]}>
                                            {client.loyaltyTier}
                                        </StatusBadge>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#A1A1AA]">{formatDate(client.lastVisit)}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-[#FAFAFA]">{formatCurrency(client.totalSpend)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/clients/${client.id}`);
                                                }}
                                                className="rounded-lg p-2 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A] hover:text-[#FAFAFA]"
                                            >
                                                <Eye className="size-4" />
                                            </button>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="rounded-lg p-2 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A] hover:text-[#FAFAFA]"
                                            >
                                                <Calendar className="size-4" />
                                            </button>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="rounded-lg p-2 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A] hover:text-[#FAFAFA]"
                                            >
                                                <Mail01 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="min-h-[44px] rounded-lg border border-[#262626] px-3 py-2 text-sm font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A] disabled:opacity-40"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`min-h-[44px] min-w-[44px] rounded-lg text-sm font-medium transition duration-100 ease-linear ${
                                    currentPage === page
                                        ? "bg-[#5A4EFF] text-white"
                                        : "border border-[#262626] text-[#A1A1AA] hover:bg-[#1A1A1A]"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="min-h-[44px] rounded-lg border border-[#262626] px-3 py-2 text-sm font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A] disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* FAB - Add Client (mobile) */}
            <button className="fixed bottom-[84px] right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#5A4EFF] text-white shadow-lg transition duration-100 ease-linear active:bg-[#4840E8] lg:hidden">
                <Plus className="size-6" />
            </button>

            {/* Desktop Add Client button (in header area) */}
            <div className="fixed right-6 top-4 z-30 hidden lg:block">
                <button className="inline-flex items-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#4840E8]">
                    <Plus className="size-4" />
                    Add Client
                </button>
            </div>
        </div>
    );
}
