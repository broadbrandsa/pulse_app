"use client";

import { useState } from "react";
import Image from "next/image";

type Product = {
  id: string; name: string; price: number; category: string;
  description: string; gradient: string; badge?: string; image?: string;
};

type CartItem = { product: Product; qty: number };

const PRODUCTS: Product[] = [
  { id: "p1", name: "12-Week Strength Programme", price: 1499, category: "Programmes", description: "Complete progressive overload programme with video guides.", gradient: "from-[#5A4EFF] to-[#8B7FFF]", badge: "Best Seller", image: "/product images/victor-freitas-WvDYdXDzkhs-unsplash.jpg" },
  { id: "p2", name: "HIIT Workout Guide", price: 499, category: "Programmes", description: "High-intensity interval training for fat loss.", gradient: "from-[#EEA0FF] to-[#FF6BE6]", image: "/product images/bruce-mars-y0SMHt74yqc-unsplash.jpg" },
  { id: "p3", name: "Nutrition eBook", price: 299, category: "Guides", description: "Complete guide to fuelling your training.", gradient: "from-[#E2F4A6] to-[#B8D945]", badge: "Popular", image: "/product images/ellephant-Cypu5hrDTm8-unsplash.jpg" },
  { id: "p4", name: "Resistance Bands Set", price: 450, category: "Equipment", description: "5-piece set with carry bag. Light to heavy.", gradient: "from-orange-400 to-red-500", image: "/product images/karsten-winegeart-0Wra5YYVQJE-unsplash.jpg" },
  { id: "p5", name: "Protein Shaker Bottle", price: 180, category: "Equipment", description: "BPA-free 700ml shaker with mixing ball.", gradient: "from-cyan-400 to-blue-500", image: "/product images/samuel-girven-fqMu99l8sqo-unsplash.jpg" },
  { id: "p6", name: "Foam Roller Premium", price: 650, category: "Equipment", description: "High-density EVA foam roller for recovery.", gradient: "from-green-400 to-emerald-500", image: "/product images/humphrey-m-LOA2mTj1vhc-unsplash.jpg" },
  { id: "p7", name: "Meal Prep Containers (10pk)", price: 350, category: "Equipment", description: "Microwave-safe, leak-proof containers.", gradient: "from-yellow-400 to-orange-400", image: "/product images/mr-lee-f4RBYsY2hxA-unsplash.jpg" },
  { id: "p8", name: "Branded Training Vest", price: 550, category: "Apparel", description: "Moisture-wicking performance fabric.", gradient: "from-purple-400 to-pink-500", image: "/product images/meghan-holmes-buWcS7G1_28-unsplash.jpg" },
  { id: "p9", name: "Mobility Workshop", price: 799, category: "Courses", description: "2-hour recorded workshop on mobility drills.", gradient: "from-teal-400 to-cyan-500", image: "/product images/centre-for-ageing-better-dHHcDjMcN_I-unsplash.jpg" },
  { id: "p10", name: "Custom Meal Plan", price: 899, category: "Guides", description: "Personalised meal plan based on your goals.", gradient: "from-rose-400 to-pink-500", badge: "New", image: "/product images/rahul-gupta-2rZ4nhCdQNc-unsplash.jpg" },
];

const CATEGORIES = ["All", "Programmes", "Guides", "Equipment", "Apparel", "Courses"];

type CheckoutStep = "cart" | "details" | "payment" | "success";

export default function PublicStorePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = categoryFilter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === categoryFilter);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    setShowCart(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.product.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.product.id !== id));

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheckout = () => {
    if (checkoutStep === "cart") setCheckoutStep("details");
    else if (checkoutStep === "details" && validateDetails()) setCheckoutStep("payment");
    else if (checkoutStep === "payment") {
      setCheckoutStep("success");
      setTimeout(() => { setCart([]); setShowCart(false); setCheckoutStep("cart"); setForm({ name: "", email: "", phone: "" }); }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Header */}
      <div className="border-b border-[#262626] bg-[#111111]">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] flex items-center justify-center text-white font-bold">SD</div>
              <div>
                <h1 className="text-lg font-bold">Sipho Dlamini</h1>
                <p className="text-sm text-[#A1A1AA]">Fitness Store</p>
              </div>
            </div>
            <button onClick={() => setShowCart(true)} className="relative min-h-[44px] px-4 bg-[#111111] border border-[#262626] rounded-xl flex items-center gap-2 text-[#FAFAFA] hover:bg-[#1a1a1a] transition duration-100 ease-linear">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="text-sm font-medium">Cart</span>
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#5A4EFF] text-white text-xs flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategoryFilter(c)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition duration-100 ease-linear ${
              categoryFilter === c ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA]"
            }`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden group">
              <div className="h-40 relative bg-[#1A1A1A]">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
                ) : (
                  <div className={`h-full bg-gradient-to-br ${p.gradient} flex items-center justify-center`}>
                    <span className="text-white/70 text-4xl font-bold">{p.name.charAt(0)}</span>
                  </div>
                )}
                {p.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/40 text-white text-xs font-medium backdrop-blur-sm">{p.badge}</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-[#71717A] mb-1">{p.category}</p>
                <h3 className="font-semibold text-[#FAFAFA] text-sm mb-1">{p.name}</h3>
                <p className="text-xs text-[#A1A1AA] mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#E2F4A6] font-bold">R{p.price}</span>
                  <button onClick={() => addToCart(p)} className="min-h-[36px] px-4 bg-[#5A4EFF] text-white rounded-lg text-sm font-medium hover:bg-[#4840E8] transition duration-100 ease-linear">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Bottom Sheet */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 z-50" onClick={() => { setShowCart(false); setCheckoutStep("cart"); }}>
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-[#111111] border-t border-[#262626] rounded-t-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-[#262626]" /></div>

            <div className="p-4">
              {checkoutStep === "success" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#E2F4A6]/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#E2F4A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#FAFAFA] mb-2">Order Confirmed!</h3>
                  <p className="text-[#A1A1AA]">Check your email for order details.</p>
                </div>
              ) : (
                <>
                  {/* Cart Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#FAFAFA]">
                      {checkoutStep === "cart" && `Cart (${cartCount})`}
                      {checkoutStep === "details" && "Your Details"}
                      {checkoutStep === "payment" && "Payment"}
                    </h3>
                    <button onClick={() => { setShowCart(false); setCheckoutStep("cart"); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717A] hover:text-[#FAFAFA]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  {/* Step: Cart */}
                  {checkoutStep === "cart" && (
                    <>
                      {cart.length === 0 ? (
                        <p className="text-center text-[#71717A] py-8">Your cart is empty.</p>
                      ) : (
                        <div className="space-y-3 mb-4">
                          {cart.map((item) => (
                            <div key={item.product.id} className="flex items-center gap-3 bg-[#0A0A0A] border border-[#262626] rounded-xl p-3">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.product.gradient} flex items-center justify-center shrink-0`}>
                                <span className="text-white/70 font-bold">{item.product.name.charAt(0)}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#FAFAFA] truncate">{item.product.name}</p>
                                <p className="text-sm text-[#E2F4A6]">R{item.product.price}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => updateQty(item.product.id, -1)} className="w-7 h-7 rounded-md bg-[#262626] text-[#FAFAFA] flex items-center justify-center text-sm">-</button>
                                <span className="text-sm w-5 text-center">{item.qty}</span>
                                <button onClick={() => updateQty(item.product.id, 1)} className="w-7 h-7 rounded-md bg-[#262626] text-[#FAFAFA] flex items-center justify-center text-sm">+</button>
                              </div>
                              <button onClick={() => removeFromCart(item.product.id)} className="text-[#71717A] hover:text-red-400 ml-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Step: Details */}
                  {checkoutStep === "details" && (
                    <div className="space-y-3 mb-4">
                      {(["name", "email", "phone"] as const).map((field) => (
                        <div key={field}>
                          <label className="block text-sm text-[#A1A1AA] mb-1 capitalize">{field}</label>
                          <input
                            type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                            value={form[field]}
                            onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: "" }); }}
                            className={`w-full min-h-[44px] px-4 bg-[#0A0A0A] border rounded-xl text-[#FAFAFA] placeholder-[#71717A] outline-none focus:border-[#5A4EFF] transition duration-100 ease-linear ${
                              errors[field] ? "border-red-500" : "border-[#262626]"
                            }`}
                          />
                          {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Step: Payment */}
                  {checkoutStep === "payment" && (
                    <div className="mb-4">
                      <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 space-y-2 mb-4">
                        {cart.map((item) => (
                          <div key={item.product.id} className="flex justify-between text-sm">
                            <span className="text-[#A1A1AA]">{item.product.name} x{item.qty}</span>
                            <span className="text-[#FAFAFA]">R{item.product.price * item.qty}</span>
                          </div>
                        ))}
                        <div className="border-t border-[#262626] pt-2 flex justify-between">
                          <span className="font-medium text-[#FAFAFA]">Total</span>
                          <span className="font-bold text-[#E2F4A6]">R{cartTotal}</span>
                        </div>
                      </div>
                      <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4">
                        <p className="text-sm text-[#A1A1AA] mb-3">Payment Method</p>
                        <div className="space-y-2">
                          {["Card Payment", "EFT / Bank Transfer", "SnapScan"].map((m) => (
                            <label key={m} className="flex items-center gap-3 p-3 bg-[#111111] border border-[#262626] rounded-lg cursor-pointer hover:border-[#5A4EFF]/50 transition duration-100 ease-linear">
                              <input type="radio" name="payment" defaultChecked={m === "Card Payment"} className="accent-[#5A4EFF]" />
                              <span className="text-sm text-[#FAFAFA]">{m}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Action */}
                  {cart.length > 0 && (
                    <div className="flex gap-3 pt-2 border-t border-[#262626]">
                      {checkoutStep !== "cart" && (
                        <button onClick={() => setCheckoutStep(checkoutStep === "payment" ? "details" : "cart")} className="min-h-[44px] px-6 bg-[#111111] border border-[#262626] text-[#FAFAFA] rounded-xl font-medium hover:bg-[#1a1a1a] transition duration-100 ease-linear">
                          Back
                        </button>
                      )}
                      <button onClick={handleCheckout} className="flex-1 min-h-[44px] bg-[#5A4EFF] text-white rounded-xl font-medium hover:bg-[#4840E8] transition duration-100 ease-linear">
                        {checkoutStep === "cart" && `Checkout - R${cartTotal}`}
                        {checkoutStep === "details" && "Continue to Payment"}
                        {checkoutStep === "payment" && `Pay R${cartTotal}`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}