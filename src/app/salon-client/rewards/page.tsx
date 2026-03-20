"use client";

import { useState } from "react";
import { Award01, Star01, Gift01, Share07, Check, Copy01, ArrowUp, ArrowDown } from "@untitledui/icons";

const availableRewards = [
  { id: 1, name: "Free Wash & Blow", points: 500, emoji: "💆🏾‍♀️" },
  { id: 2, name: "20% Off Any Service", points: 800, emoji: "🏷️" },
  { id: 3, name: "Free Deep Condition", points: 400, emoji: "💧" },
  { id: 4, name: "Free Trim", points: 250, emoji: "✂️" },
  { id: 5, name: "R100 Product Voucher", points: 600, emoji: "🛍️" },
  { id: 6, name: "Free Silk Press", points: 700, emoji: "🌟" },
];

const pointsHistory = [
  { id: 1, description: "Box Braids visit", points: 85, type: "earned" as const, date: "17 Mar 2026" },
  { id: 2, description: "Wash & Blow visit", points: 25, type: "earned" as const, date: "28 Feb 2026" },
  { id: 3, description: "Redeemed: Free Trim", points: -250, type: "redeemed" as const, date: "20 Feb 2026" },
  { id: 4, description: "Treatment visit", points: 35, type: "earned" as const, date: "10 Feb 2026" },
  { id: 5, description: "Referral bonus", points: 100, type: "earned" as const, date: "5 Feb 2026" },
  { id: 6, description: "Cornrows visit", points: 40, type: "earned" as const, date: "25 Jan 2026" },
];

const tierBenefits = [
  "Priority booking access",
  "Birthday month double points",
  "Exclusive product discounts",
  "Free consultation sessions",
];

export default function RewardsPage() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [redeemedId, setRedeemedId] = useState<number | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("THANDI50").catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRedeem = (id: number) => {
    setRedeemedId(id);
    setTimeout(() => setRedeemedId(null), 2000);
  };

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Tier Card */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-[#141414] to-[#D946EF]/5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
              <Award01 className="size-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-amber-400">Gold Tier</h1>
              <p className="text-xs text-[var(--pa-text-muted)]">Member since Jan 2025</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[var(--pa-text-primary)]">2,450</p>
            <p className="text-xs text-[var(--pa-text-muted)]">points</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-[var(--pa-text-secondary)]">
            <span>Maintain Gold status</span>
            <span className="font-medium text-amber-400">2,450 / 3,000 pts</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--pa-border-default)]">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all" style={{ width: "82%" }} />
          </div>
          <p className="mt-1.5 text-[10px] text-zinc-600">550 more points to maintain Gold by Dec 2026</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {tierBenefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-1.5">
              <Check className="size-3 text-amber-400" />
              <span className="text-[10px] text-[var(--pa-text-secondary)]">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Rewards */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--pa-text-primary)]">
          <Gift01 className="size-4 text-[#D946EF]" />
          Available Rewards
        </h2>
        <div className="space-y-2">
          {availableRewards.map((reward) => {
            const canRedeem = 2450 >= reward.points;
            const isRedeemed = redeemedId === reward.id;
            return (
              <div key={reward.id} className="flex items-center justify-between rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{reward.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-[var(--pa-text-primary)]">{reward.name}</p>
                    <p className="flex items-center gap-1 text-xs text-amber-400">
                      <Star01 className="size-3" />
                      {reward.points} pts
                    </p>
                  </div>
                </div>
                <button
                  disabled={!canRedeem || isRedeemed}
                  onClick={() => handleRedeem(reward.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    isRedeemed
                      ? "bg-emerald-500/15 text-emerald-400"
                      : canRedeem
                        ? "bg-[#D946EF] text-white hover:bg-[#C026D3]"
                        : "bg-[var(--pa-bg-elevated)] text-zinc-600"
                  }`}
                >
                  {isRedeemed ? "Redeemed!" : "Redeem"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points History */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--pa-text-primary)]">
          <Star01 className="size-4 text-amber-400" />
          Points History
        </h2>
        <div className="space-y-2">
          {pointsHistory.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3.5">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${entry.type === "earned" ? "bg-emerald-500/15" : "bg-[#D946EF]/15"}`}>
                  {entry.type === "earned" ? (
                    <ArrowUp className="size-4 text-emerald-400" />
                  ) : (
                    <ArrowDown className="size-4 text-[#D946EF]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--pa-text-primary)]">{entry.description}</p>
                  <p className="text-xs text-[var(--pa-text-muted)]">{entry.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${entry.type === "earned" ? "text-emerald-400" : "text-[#D946EF]"}`}>
                {entry.type === "earned" ? "+" : ""}{entry.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Code */}
      <div className="rounded-2xl border border-[#D946EF]/20 bg-[#D946EF]/5 p-5">
        <div className="flex items-center gap-2.5">
          <Share07 className="size-5 text-[#D946EF]" />
          <h2 className="text-sm font-semibold text-[var(--pa-text-primary)]">Refer a Friend</h2>
        </div>
        <p className="mt-2 text-xs text-[var(--pa-text-secondary)]">Share your code with friends and earn 100 bonus points for each referral!</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 items-center justify-between rounded-lg border border-[#D946EF]/30 bg-[var(--pa-bg-surface)] px-4 py-2.5">
            <span className="text-sm font-bold tracking-widest text-[#D946EF]">THANDI50</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D946EF] text-white transition hover:bg-[#C026D3]"
          >
            {copiedCode ? <Check className="size-4" /> : <Copy01 className="size-4" />}
          </button>
        </div>
        {copiedCode && <p className="mt-2 text-xs text-emerald-400">Code copied to clipboard!</p>}
      </div>
    </div>
  );
}
