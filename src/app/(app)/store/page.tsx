"use client";

import { useState } from "react";
import Image from "next/image";

type Product = {
  id: string; name: string; price: number; category: string;
  status: "active" | "draft"; stock: number; sold: number;
  gradient: string; image?: string;
};

type Order = {
  id: string; customer: string; avatar: string; items: string[];
  total: number; status: "completed" | "pending" | "refunded";
  date: string;
};

const PRODUCTS: Product[] = [
  { id: "pr1", name: "12-Week Strength Programme", price: 1499, category: "Programmes", status: "active", stock: -1, sold: 87, gradient: "from-[#5A4EFF] to-[#8B7FFF]", image: "/product images/victor-freitas-WvDYdXDzkhs-unsplash.jpg" },
  { id: "pr2", name: "HIIT Workout Guide", price: 499, category: "Programmes", status: "active", stock: -1, sold: 142, gradient: "from-[#EEA0FF] to-[#FF6BE6]", image: "/product images/bruce-mars-y0SMHt74yqc-unsplash.jpg" },
  { id: "pr3", name: "Nutrition eBook", price: 299, category: "Guides", status: "active", stock: -1, sold: 234, gradient: "from-[#E2F4A6] to-[#B8D945]", image: "/product images/ellephant-Cypu5hrDTm8-unsplash.jpg" },
  { id: "pr4", name: "Resistance Bands Set", price: 450, category: "Equipment", status: "active", stock: 23, sold: 56, gradient: "from-orange-400 to-red-500", image: "/product images/karsten-winegeart-0Wra5YYVQJE-unsplash.jpg" },
  { id: "pr5", name: "Protein Shaker Bottle", price: 180, category: "Equipment", status: "active", stock: 45, sold: 89, gradient: "from-cyan-400 to-blue-500", image: "/product images/samuel-girven-fqMu99l8sqo-unsplash.jpg" },
  { id: "pr6", name: "Foam Roller Premium", price: 650, category: "Equipment", status: "active", stock: 12, sold: 34, gradient: "from-green-400 to-emerald-500", image: "/product images/humphrey-m-LOA2mTj1vhc-unsplash.jpg" },
  { id: "pr7", name: "Meal Prep Containers (10pk)", price: 350, category: "Equipment", status: "active", stock: 67, sold: 78, gradient: "from-yellow-400 to-orange-400", image: "/product images/mr-lee-f4RBYsY2hxA-unsplash.jpg" },
  { id: "pr8", name: "Branded Training Vest", price: 550, category: "Apparel", status: "active", stock: 30, sold: 45, gradient: "from-purple-400 to-pink-500", image: "/product images/meghan-holmes-buWcS7G1_28-unsplash.jpg" },
  { id: "pr9", name: "Performance Shorts", price: 480, category: "Apparel", status: "draft", stock: 50, sold: 0, gradient: "from-indigo-400 to-violet-500", image: "/product images/jonathan-borba-lrQPTQs7nQQ-unsplash.jpg" },
  { id: "pr10", name: "Mobility Workshop (Video)", price: 799, category: "Courses", status: "active", stock: -1, sold: 23, gradient: "from-teal-400 to-cyan-500", image: "/product images/centre-for-ageing-better-dHHcDjMcN_I-unsplash.jpg" },
  { id: "pr11", name: "Custom Meal Plan Template", price: 199, category: "Guides", status: "draft", stock: -1, sold: 0, gradient: "from-rose-400 to-pink-500", image: "/product images/rahul-gupta-2rZ4nhCdQNc-unsplash.jpg" },
  { id: "pr12", name: "Gym Bag - Limited Edition", price: 899, category: "Apparel", status: "draft", stock: 15, sold: 0, gradient: "from-slate-400 to-zinc-500", image: "/product images/john-fornander-TAZoUmDqzXk-unsplash.jpg" },
];

const ORDERS: Order[] = [
  { id: "ORD-001", customer: "Thando Nkosi", avatar: "TN", items: ["12-Week Strength Programme"], total: 1499, status: "completed", date: "Today" },
  { id: "ORD-002", customer: "Lerato Mokoena", avatar: "LM", items: ["Nutrition eBook", "Protein Shaker"], total: 479, status: "completed", date: "Today" },
  { id: "ORD-003", customer: "Ryan Govender", avatar: "RG", items: ["Branded Training Vest"], total: 550, status: "pending", date: "Yesterday" },
  { id: "ORD-004", customer: "Naledi Phiri", avatar: "NP", items: ["HIIT Workout Guide"], total: 499, status: "completed", date: "Yesterday" },
  { id: "ORD-005", customer: "James van der Merwe", avatar: "JM", items: ["Resistance Bands Set", "Foam Roller"], total: 1100, status: "completed", date: "2 days ago" },
  { id: "ORD-006", customer: "Aisha Patel", avatar: "AP", items: ["Meal Prep Containers"], total: 350, status: "refunded", date: "3 days ago" },
  { id: "ORD-007", customer: "Bongani Zulu", avatar: "BZ", items: ["Mobility Workshop"], total: 799, status: "completed", date: "3 days ago" },
  { id: "ORD-008", customer: "Chloe Botha", avatar: "CB", items: ["12-Week Strength Programme", "Nutrition eBook"], total: 1798, status: "completed", date: "4 days ago" },
  { id: "ORD-009", customer: "Thando Nkosi", avatar: "TN", items: ["Protein Shaker Bottle"], total: 180, status: "completed", date: "5 days ago" },
  { id: "ORD-010", customer: "Ryan Govender", avatar: "RG", items: ["Foam Roller Premium"], total: 650, status: "pending", date: "5 days ago" },
];

const orderStatusStyles: Record<string, { bg: string; text: string }> = {
  completed: { bg: "bg-[#E2F4A6]/20", text: "text-[#E2F4A6]" },
  pending: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  refunded: { bg: "bg-red-500/20", text: "text-red-400" },
};

export default function StoreManagementPage() {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState(PRODUCTS);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");

  const filteredProducts = products.filter((p) => statusFilter === "all" || p.status === statusFilter);
  const totalRevenue = ORDERS.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.total, 0);
  const activeProducts = products.filter((p) => p.status === "active").length;

  const toggleStatus = (id: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "active" ? "draft" as const : "active" as const } : p));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Store</h1>
            <p className="text-sm text-[#A1A1AA] mt-1">Manage products and orders</p>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="bg-[#111111] border border-[#262626] rounded-xl px-4 py-2">
              <p className="text-[#71717A] text-xs">Revenue</p>
              <p className="text-[#E2F4A6] font-bold">R{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-[#111111] border border-[#262626] rounded-xl px-4 py-2">
              <p className="text-[#71717A] text-xs">Active</p>
              <p className="text-[#FAFAFA] font-bold">{activeProducts}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#111111] rounded-xl mb-6 border border-[#262626]">
          {(["products", "orders"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 min-h-[40px] rounded-lg text-sm font-medium capitalize transition duration-100 ease-linear ${
              tab === t ? "bg-[#5A4EFF] text-white" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
            }`}>{t}</button>
          ))}
        </div>

        {/* Products */}
        {tab === "products" && (
          <>
            <div className="flex gap-2 mb-4">
              {(["all", "active", "draft"] as const).map((f) => (
                <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm capitalize font-medium transition duration-100 ease-linear ${
                  statusFilter === f ? "bg-[#5A4EFF] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA]"
                }`}>{f}</button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden">
                  <div className="relative h-40 bg-[#1A1A1A]">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className={`h-full bg-gradient-to-br ${p.gradient} flex items-center justify-center`}>
                        <span className="text-white/80 text-3xl font-bold">{p.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-sm text-[#FAFAFA]">{p.name}</h3>
                        <p className="text-xs text-[#71717A] mt-0.5">{p.category}</p>
                      </div>
                      <span className="text-[#E2F4A6] font-semibold text-sm">R{p.price}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-3 text-xs text-[#71717A]">
                        <span>{p.sold} sold</span>
                        {p.stock >= 0 && <span>{p.stock} in stock</span>}
                        {p.stock < 0 && <span>Digital</span>}
                      </div>
                      <button onClick={() => toggleStatus(p.id)} className={`relative w-10 h-5 rounded-full transition duration-100 ease-linear ${
                        p.status === "active" ? "bg-[#5A4EFF]" : "bg-[#262626]"
                      }`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                          p.status === "active" ? "left-5.5" : "left-0.5"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-2">
            {ORDERS.map((o) => {
              const st = orderStatusStyles[o.status];
              return (
                <div key={o.id} className="bg-[#111111] border border-[#262626] rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] flex items-center justify-center text-white text-sm font-medium shrink-0">{o.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-[#FAFAFA]">{o.customer}</p>
                      <span className="text-xs text-[#71717A]">{o.id}</span>
                    </div>
                    <p className="text-sm text-[#71717A] truncate">{o.items.join(", ")}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm text-[#FAFAFA]">R{o.total}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium capitalize ${st.bg} ${st.text}`}>{o.status}</span>
                      <span className="text-xs text-[#71717A]">{o.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}