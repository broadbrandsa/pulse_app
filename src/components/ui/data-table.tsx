"use client";

import { useState, type FC, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "@untitledui/icons";

interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    pageSize?: number;
    onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({ columns, data, pageSize = 10, onRowClick }: DataTableProps<T>) {
    const [page, setPage] = useState(0);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const sorted = sortKey
        ? [...data].sort((a, b) => {
              const aVal = a[sortKey];
              const bVal = b[sortKey];
              if (typeof aVal === "number" && typeof bVal === "number") {
                  return sortDir === "asc" ? aVal - bVal : bVal - aVal;
              }
              return sortDir === "asc"
                  ? String(aVal).localeCompare(String(bVal))
                  : String(bVal).localeCompare(String(aVal));
          })
        : data;

    const totalPages = Math.ceil(sorted.length / pageSize);
    const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    return (
        <div>
            <div className="overflow-x-auto rounded-xl border border-[#E5E5E5]">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#E5E5E5] bg-white">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#52525B] ${col.sortable ? "cursor-pointer hover:text-[#52525B]" : ""}`}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && sortKey === col.key && (
                                            <span>{sortDir === "asc" ? "↑" : "↓"}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map((item, i) => (
                            <tr
                                key={i}
                                className={`border-b border-[#F0F0F0] bg-white transition duration-100 ease-linear ${onRowClick ? "cursor-pointer hover:bg-[#F5F5F5]" : ""}`}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3 text-sm text-[#09090B]">
                                        {col.render ? col.render(item) : String(item[col.key] ?? "")}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-[#52525B]">
                        Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            className="rounded-lg border border-[#E5E5E5] p-2 text-[#52525B] transition duration-100 ease-linear hover:bg-[#F5F5F5] disabled:opacity-40"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            disabled={page === totalPages - 1}
                            className="rounded-lg border border-[#E5E5E5] p-2 text-[#52525B] transition duration-100 ease-linear hover:bg-[#F5F5F5] disabled:opacity-40"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
