"use client";

import { useState } from "react";
import {
    Package,
    SearchLg,
    Plus,
    AlertTriangle,
    Edit05,
    Trash01,
    ShoppingCart01,
    XClose,
    TrendUp01,
    ChevronDown,
} from "@untitledui/icons";

// ── Types ────────────────────────────────────────────────────────────────────

interface InventoryItem {
    id: number;
    name: string;
    category: string;
    sku: string;
    stock: number;
    reorder: number;
    price: string;
    cost: string;
    supplier: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const inventoryItems: InventoryItem[] = [
    { id: 1, name: "ORS Olive Oil Relaxer", category: "Hair Care", sku: "SKU-001", stock: 2, reorder: 10, price: "R120", cost: "R65", supplier: "Hairhouse" },
    { id: 2, name: "Cantu Shea Butter Leave-In", category: "Hair Care", sku: "SKU-002", stock: 3, reorder: 8, price: "R95", cost: "R48", supplier: "Hairhouse" },
    { id: 3, name: "Dark & Lovely Hair Colour (Jet Black)", category: "Colour", sku: "SKU-003", stock: 1, reorder: 5, price: "R85", cost: "R42", supplier: "Cosmo Beauty" },
    { id: 4, name: "Eco Styler Gel (Olive Oil)", category: "Styling", sku: "SKU-004", stock: 12, reorder: 8, price: "R65", cost: "R30", supplier: "Hairhouse" },
    { id: 5, name: "Wella Koleston Hair Colour", category: "Colour", sku: "SKU-005", stock: 8, reorder: 10, price: "R145", cost: "R72", supplier: "Wella SA" },
    { id: 6, name: "GHD Ceramic Flat Iron", category: "Tools", sku: "SKU-006", stock: 4, reorder: 2, price: "R2,500", cost: "R1,800", supplier: "GHD Direct" },
    { id: 7, name: "Bonnet Hair Dryer Attachment", category: "Tools", sku: "SKU-007", stock: 6, reorder: 3, price: "R350", cost: "R180", supplier: "Cosmo Beauty" },
    { id: 8, name: "Satin Edge Hair Clips (12pk)", category: "Accessories", sku: "SKU-008", stock: 15, reorder: 10, price: "R45", cost: "R18", supplier: "Hairhouse" },
    { id: 9, name: "Jamaican Black Castor Oil", category: "Hair Care", sku: "SKU-009", stock: 5, reorder: 8, price: "R110", cost: "R55", supplier: "Afro Naturals" },
    { id: 10, name: "Crochet Braids (Pack of 6)", category: "Accessories", sku: "SKU-010", stock: 20, reorder: 15, price: "R180", cost: "R85", supplier: "Hair World" },
];

const categories = ["All", "Hair Care", "Colour", "Styling", "Tools", "Accessories"];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getStockStatus(stock: number, reorder: number): "critical" | "warning" | "good" {
    if (stock < reorder * 0.3) return "critical";
    if (stock < reorder) return "warning";
    return "good";
}

function stockColor(status: "critical" | "warning" | "good"): string {
    switch (status) {
        case "critical":
            return "#EF4444";
        case "warning":
            return "#F59E0B";
        case "good":
            return "#22C55E";
    }
}

// ── Page Component ───────────────────────────────────────────────────────────

export default function SalonInventoryPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [showAddModal, setShowAddModal] = useState(false);

    // Form state for add product modal
    const [formName, setFormName] = useState("");
    const [formCategory, setFormCategory] = useState("Hair Care");
    const [formSku, setFormSku] = useState("");
    const [formStock, setFormStock] = useState("");
    const [formReorder, setFormReorder] = useState("");
    const [formPrice, setFormPrice] = useState("");
    const [formCost, setFormCost] = useState("");
    const [formSupplier, setFormSupplier] = useState("");

    const filtered = inventoryItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.sku.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const lowStockItems = inventoryItems
        .filter((item) => item.stock < item.reorder)
        .sort((a, b) => a.stock / a.reorder - b.stock / b.reorder);

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
                {/* ── Header ──────────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">
                            Inventory Management
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">
                            Track products, stock levels, and suppliers
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#D946EF] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#C026D3]"
                    >
                        <Plus className="size-5" />
                        Add Product
                    </button>
                </div>

                {/* ── SECTION 1 — Stats Row ────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                    {/* Total Products */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#D946EF]/15">
                                <Package className="size-5 text-[#D946EF]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Total Products</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">48</p>
                    </div>

                    {/* Low Stock Items */}
                    <div className="rounded-2xl border border-[#EF4444]/30 bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#EF4444]/15">
                                <AlertTriangle className="size-5 text-[#EF4444]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Low Stock Items</p>
                        <p className="mt-1 text-2xl font-semibold text-[#EF4444]">6</p>
                    </div>

                    {/* Stock Value */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#22C55E]/15">
                                <TrendUp01 className="size-5 text-[#22C55E]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Stock Value</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">R24,500</p>
                    </div>

                    {/* Items Sold This Month */}
                    <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#3B82F6]/15">
                                <ShoppingCart01 className="size-5 text-[#3B82F6]" />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--pa-text-secondary)]">Items Sold This Month</p>
                        <p className="mt-1 text-2xl font-semibold text-[var(--pa-text-primary)]">34</p>
                    </div>
                </div>

                {/* ── SECTION 2 — Search + Category Filter ─────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <SearchLg className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[var(--pa-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search products or SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="min-h-[44px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--pa-text-primary)] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF]"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`min-h-[36px] rounded-lg px-3 py-1.5 text-sm font-medium transition duration-100 ease-linear ${
                                    activeCategory === cat
                                        ? "bg-[#D946EF] text-white"
                                        : "bg-[var(--pa-bg-elevated)] text-[var(--pa-text-secondary)] hover:bg-[#262626] hover:text-[var(--pa-text-primary)]"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 3 — Inventory Table ──────────────────────── */}
                <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)]">
                                    <th className="px-4 py-3 font-medium text-[var(--pa-text-secondary)]">Name</th>
                                    <th className="px-4 py-3 font-medium text-[var(--pa-text-secondary)]">Category</th>
                                    <th className="px-4 py-3 font-medium text-[var(--pa-text-secondary)]">SKU</th>
                                    <th className="px-4 py-3 font-medium text-[var(--pa-text-secondary)]">Stock</th>
                                    <th className="px-4 py-3 font-medium text-[var(--pa-text-secondary)]">Price</th>
                                    <th className="px-4 py-3 font-medium text-[var(--pa-text-secondary)]">Supplier</th>
                                    <th className="px-4 py-3 font-medium text-[var(--pa-text-secondary)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item, idx) => {
                                    const status = getStockStatus(item.stock, item.reorder);
                                    const color = stockColor(status);
                                    const ratio = Math.min(item.stock / item.reorder, 1);

                                    return (
                                        <tr
                                            key={item.id}
                                            className={`border-b border-[var(--pa-border-default)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)] ${
                                                idx % 2 === 0 ? "bg-[var(--pa-bg-surface)]" : "bg-[var(--pa-bg-topbar)]"
                                            }`}
                                        >
                                            <td className="px-4 py-3 font-medium text-[var(--pa-text-primary)]">
                                                {item.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-md bg-[var(--pa-bg-elevated)] px-2 py-0.5 text-xs font-medium text-[#D946EF]">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-[var(--pa-text-muted)]">
                                                {item.sku}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className="text-sm font-semibold"
                                                        style={{ color }}
                                                    >
                                                        {item.stock}
                                                    </span>
                                                    <div className="h-2 w-20 overflow-hidden rounded-full bg-[#262626]">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-300"
                                                            style={{
                                                                width: `${ratio * 100}%`,
                                                                backgroundColor: color,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-[var(--pa-text-primary)]">
                                                {item.price}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--pa-text-secondary)]">
                                                {item.supplier}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <button className="rounded-lg p-2 text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[#262626] hover:text-[var(--pa-text-primary)]">
                                                        <Edit05 className="size-4" />
                                                    </button>
                                                    <button className="rounded-lg p-2 text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[#EF4444]/15 hover:text-[#EF4444]">
                                                        <Trash01 className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-12 text-center text-sm text-[var(--pa-text-muted)]"
                                        >
                                            No products found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── SECTION 4 — Low Stock Alerts Panel ───────────────── */}
                <div className="rounded-2xl border border-[#EF4444]/20 bg-[var(--pa-bg-surface)] p-4 lg:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#EF4444]/15">
                            <AlertTriangle className="size-5 text-[#EF4444]" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-[var(--pa-text-primary)] lg:text-lg">
                                Low Stock Alerts
                            </h2>
                            <p className="text-xs text-[var(--pa-text-secondary)]">
                                {lowStockItems.length} items need restocking
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        {lowStockItems.map((item) => {
                            const status = getStockStatus(item.stock, item.reorder);
                            const color = stockColor(status);

                            return (
                                <div
                                    key={item.id}
                                    className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-[var(--pa-text-muted)]">
                                            {item.category} &middot; {item.sku}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-sm font-semibold"
                                            style={{ color }}
                                        >
                                            {item.stock} left
                                        </span>
                                        <span className="text-xs text-[var(--pa-text-muted)]">
                                            / {item.reorder} reorder level
                                        </span>
                                    </div>

                                    <button className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#D946EF]/15 px-3 py-1.5 text-sm font-medium text-[#D946EF] transition duration-100 ease-linear hover:bg-[#D946EF]/25">
                                        <ShoppingCart01 className="size-4" />
                                        Reorder
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── SECTION 5 — Add Product Modal ───────────────────────── */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[var(--pa-text-primary)]">
                                Add New Product
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="rounded-lg p-2 text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:bg-[#262626] hover:text-[var(--pa-text-primary)]"
                            >
                                <XClose className="size-5" />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--pa-text-secondary)]">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g. Shea Butter Leave-In"
                                    className="min-h-[44px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5 text-sm text-[var(--pa-text-primary)] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF]"
                                />
                            </div>

                            {/* Category + SKU row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--pa-text-secondary)]">
                                        Category
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value)}
                                            className="min-h-[44px] w-full appearance-none rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5 pr-9 text-sm text-[var(--pa-text-primary)] outline-none transition duration-100 ease-linear focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF]"
                                        >
                                            {categories.filter((c) => c !== "All").map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--pa-text-muted)]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--pa-text-secondary)]">
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        value={formSku}
                                        onChange={(e) => setFormSku(e.target.value)}
                                        placeholder="SKU-011"
                                        className="min-h-[44px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5 text-sm text-[var(--pa-text-primary)] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF]"
                                    />
                                </div>
                            </div>

                            {/* Stock + Reorder row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--pa-text-secondary)]">
                                        Stock Qty
                                    </label>
                                    <input
                                        type="number"
                                        value={formStock}
                                        onChange={(e) => setFormStock(e.target.value)}
                                        placeholder="0"
                                        className="min-h-[44px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5 text-sm text-[var(--pa-text-primary)] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--pa-text-secondary)]">
                                        Reorder Level
                                    </label>
                                    <input
                                        type="number"
                                        value={formReorder}
                                        onChange={(e) => setFormReorder(e.target.value)}
                                        placeholder="10"
                                        className="min-h-[44px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5 text-sm text-[var(--pa-text-primary)] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF]"
                                    />
                                </div>
                            </div>

                            {/* Price + Cost row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--pa-text-secondary)]">
                                        Selling Price
                                    </label>
                                    <input
                                        type="text"
                                        value={formPrice}
                                        onChange={(e) => setFormPrice(e.target.value)}
                                        placeholder="R120"
                                        className="min-h-[44px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5 text-sm text-[var(--pa-text-primary)] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--pa-text-secondary)]">
                                        Cost Price
                                    </label>
                                    <input
                                        type="text"
                                        value={formCost}
                                        onChange={(e) => setFormCost(e.target.value)}
                                        placeholder="R65"
                                        className="min-h-[44px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5 text-sm text-[var(--pa-text-primary)] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF]"
                                    />
                                </div>
                            </div>

                            {/* Supplier */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--pa-text-secondary)]">
                                    Supplier
                                </label>
                                <input
                                    type="text"
                                    value={formSupplier}
                                    onChange={(e) => setFormSupplier(e.target.value)}
                                    placeholder="e.g. Hairhouse"
                                    className="min-h-[44px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5 text-sm text-[var(--pa-text-primary)] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF]"
                                />
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="min-h-[44px] rounded-xl border border-[var(--pa-border-default)] bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="min-h-[44px] rounded-xl bg-[#D946EF] px-4 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#C026D3]"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
