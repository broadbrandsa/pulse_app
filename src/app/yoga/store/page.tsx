"use client";

import { useState } from "react";
import {
    ShoppingBag01,
    ShoppingCart01,
    Plus,
    Minus,
    XClose,
    SearchLg,
} from "@untitledui/icons";

// -- Types ------------------------------------------------------------------------

type Category = "All" | "Mats" | "Props" | "Wellness" | "Accessories";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    emoji: string;
    description: string;
    inStock: boolean;
}

interface CartItem extends Product {
    qty: number;
}

// -- Mock Data --------------------------------------------------------------------

const products: Product[] = [
    { id: "mat-eco", name: "Eco Cork Yoga Mat", price: 450, category: "Mats", emoji: "\u{1F9D8}", description: "Natural cork surface, non-slip", inStock: true },
    { id: "mat-pro", name: "Pro Alignment Mat", price: 850, category: "Mats", emoji: "\u{1F9D8}\u200D\u2640\uFE0F", description: "Built-in alignment guides, 6mm thick", inStock: true },
    { id: "mat-travel", name: "Travel Mat", price: 380, category: "Mats", emoji: "\u2708\uFE0F", description: "Foldable, lightweight 2mm", inStock: true },
    { id: "mat-premium", name: "Premium Natural Rubber Mat", price: 1200, category: "Mats", emoji: "\u2B50", description: "Ultra-grip, eco-friendly, 5mm", inStock: true },
    { id: "block", name: "Cork Yoga Block", price: 180, category: "Props", emoji: "\u{1F9F1}", description: "Sustainable cork, firm support", inStock: true },
    { id: "strap", name: "Cotton Yoga Strap", price: 120, category: "Props", emoji: "\u{1F3CB}\uFE0F", description: "2.5m adjustable D-ring strap", inStock: true },
    { id: "bolster", name: "Meditation Bolster", price: 380, category: "Props", emoji: "\u{1F4AE}", description: "Organic cotton cover, buckwheat fill", inStock: true },
    { id: "oil-lav", name: "Lavender Essential Oil", price: 90, category: "Wellness", emoji: "\u{1F33F}", description: "Pure lavender, 10ml roll-on", inStock: true },
    { id: "oil-euc", name: "Eucalyptus Oil Blend", price: 120, category: "Wellness", emoji: "\u{1F343}", description: "Breathing blend, 10ml", inStock: true },
    { id: "oil-set", name: "Essential Oil Set (5 pack)", price: 250, category: "Wellness", emoji: "\u{1F490}", description: "Lavender, eucalyptus, peppermint, lemon, tea tree", inStock: true },
    { id: "bottle", name: "Bamboo Water Bottle", price: 180, category: "Accessories", emoji: "\u{1F4A7}", description: "750ml insulated bamboo", inStock: true },
    { id: "towel", name: "Hot Yoga Towel", price: 220, category: "Accessories", emoji: "\u{1F9F9}", description: "Microfiber, mat-sized, quick-dry", inStock: true },
];

const categories: Category[] = ["All", "Mats", "Props", "Wellness", "Accessories"];

// -- Helpers ----------------------------------------------------------------------

function formatRand(amount: number): string {
    return `R${amount.toLocaleString("en-ZA")}`;
}

// -- Page Component ---------------------------------------------------------------

export default function YogaStorePage() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);

    const filteredProducts = products.filter((p) => {
        const matchesCat = activeCategory === "All" || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    function addToCart(product: Product) {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === product.id);
            if (existing) {
                return prev.map((c) =>
                    c.id === product.id ? { ...c, qty: c.qty + 1 } : c
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    }

    function updateQty(id: string, delta: number) {
        setCart((prev) =>
            prev
                .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
                .filter((c) => c.qty > 0)
        );
    }

    function removeItem(id: string) {
        setCart((prev) => prev.filter((c) => c.id !== id));
    }

    const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-[1400px]">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                            <ShoppingBag01 className="size-5 text-[#14B8A6]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">Retail Store</h1>
                            <p className="text-sm text-[var(--pa-text-secondary)]">Yoga essentials and wellness products</p>
                        </div>
                    </div>
                    <div className="relative">
                        <SearchLg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--pa-text-muted)]" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="min-h-[40px] w-full rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] pl-10 pr-4 text-sm text-[var(--pa-text-primary)] placeholder-[var(--pa-text-muted)] outline-none transition duration-100 ease-linear focus:border-[#14B8A6] sm:w-64"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Left -- Products */}
                    <div className="flex-1 space-y-4">
                        {/* Category pills */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition duration-100 ease-linear ${
                                        activeCategory === cat
                                            ? "bg-[#14B8A6] text-white"
                                            : "border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] text-[var(--pa-text-secondary)] hover:border-[#14B8A6]/50 hover:text-[var(--pa-text-primary)]"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Product grid */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group flex flex-col rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4 transition duration-100 ease-linear hover:border-[#14B8A6]/50"
                                >
                                    <div className="mb-3 flex size-16 items-center justify-center rounded-xl bg-[var(--pa-bg-elevated)] text-3xl">
                                        {product.emoji}
                                    </div>
                                    <h3 className="text-sm font-medium text-[var(--pa-text-primary)]">{product.name}</h3>
                                    <p className="mt-0.5 text-xs text-[var(--pa-text-muted)]">{product.description}</p>
                                    <div className="mt-auto flex items-center justify-between pt-3">
                                        <span className="text-sm font-semibold text-[#14B8A6]">{formatRand(product.price)}</span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="flex size-8 items-center justify-center rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] transition duration-100 ease-linear hover:bg-[#14B8A6] hover:text-white"
                                        >
                                            <Plus className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-12 text-center">
                                <ShoppingBag01 className="mx-auto mb-3 size-10 text-[var(--pa-bg-elevated)]" />
                                <p className="text-sm text-[var(--pa-text-muted)]">No products found</p>
                            </div>
                        )}
                    </div>

                    {/* Right -- Cart */}
                    <div className="w-full lg:sticky lg:top-6 lg:w-[360px] lg:self-start">
                        <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <ShoppingCart01 className="size-5 text-[#14B8A6]" />
                                <h2 className="text-base font-semibold text-[var(--pa-text-primary)]">Cart</h2>
                                {cartCount > 0 && (
                                    <span className="ml-auto rounded-full bg-[#14B8A6] px-2 py-0.5 text-xs font-medium text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </div>

                            {cart.length === 0 ? (
                                <div className="py-8 text-center text-sm text-[var(--pa-text-muted)]">
                                    Your cart is empty
                                </div>
                            ) : (
                                <>
                                    <div className="max-h-[300px] space-y-2 overflow-y-auto">
                                        {cart.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3 rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-3 py-2.5"
                                            >
                                                <span className="text-lg">{item.emoji}</span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm text-[var(--pa-text-primary)]">{item.name}</p>
                                                    <p className="text-xs text-[var(--pa-text-secondary)]">{formatRand(item.price)}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => updateQty(item.id, -1)}
                                                        className="flex size-6 items-center justify-center rounded-md border border-[var(--pa-border-default)] text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)]"
                                                    >
                                                        <Minus className="size-3" />
                                                    </button>
                                                    <span className="w-5 text-center text-sm font-medium text-[var(--pa-text-primary)]">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateQty(item.id, 1)}
                                                        className="flex size-6 items-center justify-center rounded-md border border-[var(--pa-border-default)] text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:bg-[var(--pa-bg-elevated)]"
                                                    >
                                                        <Plus className="size-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex size-5 items-center justify-center text-[var(--pa-text-muted)] transition duration-100 ease-linear hover:text-[#DC2626]"
                                                >
                                                    <XClose className="size-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 space-y-2 border-t border-[var(--pa-border-default)] pt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--pa-text-secondary)]">Subtotal</span>
                                            <span className="text-[var(--pa-text-primary)]">{formatRand(cartTotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--pa-text-secondary)]">VAT (15%)</span>
                                            <span className="text-[var(--pa-text-primary)]">{formatRand(Math.round(cartTotal * 0.15))}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-[var(--pa-border-default)] pt-2 text-base font-semibold">
                                            <span className="text-[var(--pa-text-primary)]">Total</span>
                                            <span className="text-[#14B8A6]">{formatRand(cartTotal + Math.round(cartTotal * 0.15))}</span>
                                        </div>
                                    </div>

                                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-3 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-[#0D9488]">
                                        <ShoppingCart01 className="size-4" />
                                        Checkout &middot; {formatRand(cartTotal + Math.round(cartTotal * 0.15))}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
