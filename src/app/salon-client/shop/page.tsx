"use client";

import { useState } from "react";
import { Star01, ShoppingBag01, Plus, Minus, XClose } from "@untitledui/icons";

interface Product {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  rating: number;
  category: string;
}

const shopProducts: Product[] = [
  { id: 1, name: "ORS Olive Oil Relaxer", price: "R120", priceNum: 120, image: "🫒", rating: 4.5, category: "Hair Care" },
  { id: 2, name: "Cantu Shea Butter Leave-In", price: "R95", priceNum: 95, image: "🧈", rating: 4.8, category: "Hair Care" },
  { id: 3, name: "Eco Styler Gel", price: "R65", priceNum: 65, image: "💅", rating: 4.3, category: "Styling" },
  { id: 4, name: "Jamaican Black Castor Oil", price: "R110", priceNum: 110, image: "🌿", rating: 4.7, category: "Hair Care" },
  { id: 5, name: "Dark & Lovely Colour", price: "R85", priceNum: 85, image: "🎨", rating: 4.2, category: "Hair Care" },
  { id: 6, name: "Satin Edge Clips (12pk)", price: "R45", priceNum: 45, image: "📎", rating: 4.0, category: "Tools" },
  { id: 7, name: "TRESemme Heat Spray", price: "R80", priceNum: 80, image: "🔥", rating: 4.4, category: "Styling" },
  { id: 8, name: "Wide Tooth Comb", price: "R35", priceNum: 35, image: "🪮", rating: 4.6, category: "Tools" },
];

const categories = ["All", "Hair Care", "Styling", "Tools"];

interface CartItem {
  product: Product;
  qty: number;
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filtered = activeCategory === "All" ? shopProducts : shopProducts.filter((p) => p.category === activeCategory);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing && existing.qty > 1) {
        return prev.map((item) => (item.product.id === productId ? { ...item, qty: item.qty - 1 } : item));
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.priceNum * item.qty, 0);

  const getCartQty = (productId: number) => {
    return cart.find((item) => item.product.id === productId)?.qty ?? 0;
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-lg font-bold text-[var(--pa-text-primary)]">Shop Products</h1>
        <p className="text-xs text-[var(--pa-text-muted)]">Professional products recommended for your hair type</p>
      </div>

      {/* Category Filter */}
      <div className="mb-5 flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition ${
              activeCategory === cat
                ? "bg-[#D946EF] text-white"
                : "bg-[var(--pa-bg-elevated)] text-[var(--pa-text-secondary)] hover:bg-[var(--pa-bg-elevated)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((product) => {
          const qty = getCartQty(product.id);
          return (
            <div key={product.id} className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3.5">
              <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-[var(--pa-bg-elevated)] text-4xl">
                {product.image}
              </div>
              <p className="text-sm font-medium leading-tight text-[var(--pa-text-primary)]">{product.name}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Star01 className="size-3 text-amber-400" />
                <span className="text-xs text-[var(--pa-text-secondary)]">{product.rating}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-[#D946EF]">{product.price}</span>
                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D946EF] text-white transition hover:bg-[#C026D3]"
                  >
                    <Plus className="size-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] text-[var(--pa-text-secondary)] transition hover:bg-[var(--pa-bg-elevated)]"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-semibold text-[var(--pa-text-primary)]">{qty}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#D946EF] text-white transition hover:bg-[#C026D3]"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary (sticky bottom) */}
      {totalItems > 0 && (
        <>
          {/* Cart detail overlay */}
          {showCart && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
              <div className="w-full max-w-md rounded-t-2xl border-t border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[var(--pa-text-primary)]">Your Cart</h3>
                  <button onClick={() => setShowCart(false)} className="rounded-lg p-1 text-[var(--pa-text-secondary)] transition hover:bg-[var(--pa-bg-elevated)]">
                    <XClose className="size-5" />
                  </button>
                </div>
                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between rounded-lg bg-[var(--pa-bg-surface)] p-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{item.product.image}</span>
                        <div>
                          <p className="text-sm font-medium text-[var(--pa-text-primary)]">{item.product.name}</p>
                          <p className="text-xs text-[var(--pa-text-muted)]">{item.product.price} x {item.qty}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[var(--pa-text-primary)]">R{item.product.priceNum * item.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[var(--pa-border-default)] pt-4">
                  <span className="text-sm font-semibold text-[var(--pa-text-secondary)]">Total</span>
                  <span className="text-lg font-bold text-[#D946EF]">R{totalPrice}</span>
                </div>
                <button className="mt-4 w-full rounded-xl bg-[#D946EF] py-3 text-sm font-semibold text-white transition hover:bg-[#C026D3]">
                  Checkout
                </button>
              </div>
            </div>
          )}

          {/* Sticky bar */}
          <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-[var(--pa-border-default)] bg-[var(--pa-bg-topbar)] px-4 py-3">
            <button
              onClick={() => setShowCart(true)}
              className="flex w-full items-center justify-between rounded-xl bg-[#D946EF] px-4 py-3 transition hover:bg-[#C026D3]"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag01 className="size-4 text-white" />
                <span className="text-sm font-semibold text-white">{totalItems} {totalItems === 1 ? "item" : "items"}</span>
              </div>
              <span className="text-sm font-bold text-white">R{totalPrice}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
