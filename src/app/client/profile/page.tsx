"use client";

import { useState } from "react";
import {
  User01,
  Mail01,
  Phone,
  Star01,
  Copy01,
  Gift01,
  Heart,
  Trophy01,
  Shield01,
  Bell01,
  Lock01,
  Download01,
  Trash02,
  ChevronDown,
  ChevronUp,
  Check,
  Send01,
  MessageSquare02,
  Calendar,
  Award01,
  Target04,
  Zap,
  Share07,
} from "@untitledui/icons";

/* ─── mock data ─── */
const earnCards = [
  { action: "Attend session", pts: "+40", emoji: "🏋️" },
  { action: "Check-in", pts: "+5", emoji: "📝" },
  { action: "Log meals", pts: "+5", emoji: "🥗" },
  { action: "Refer friend", pts: "+100", emoji: "🤝" },
  { action: "Leave review", pts: "+25", emoji: "⭐" },
  { action: "Birthday", pts: "+50", emoji: "🎂" },
];

const pointsHistory = [
  { id: 1, label: "PT Session attended", pts: "+40", date: "18 Mar", type: "earned" },
  { id: 2, label: "Daily check-in", pts: "+5", date: "18 Mar", type: "earned" },
  { id: 3, label: "Retail discount redeemed", pts: "-200", date: "15 Mar", type: "redeemed" },
  { id: 4, label: "Referred Thabo M.", pts: "+100", date: "12 Mar", type: "earned" },
  { id: 5, label: "Review submitted", pts: "+25", date: "10 Mar", type: "earned" },
];

const goldBenefits = [
  "Priority booking for peak-time sessions",
  "Access to monthly fitness challenges",
  "10% discount on retail products",
  "Free quarterly fitness assessment",
];

const notifToggles = [
  { key: "session24h", label: "Session reminder (24h)", default: true },
  { key: "session2h", label: "Session reminder (2h)", default: true },
  { key: "messages", label: "Messages from Sipho", default: true },
  { key: "points", label: "Points & rewards", default: true },
  { key: "programme", label: "Programme updates", default: true },
  { key: "marketing", label: "Marketing & promos", default: false },
];

const specialties = ["Strength", "HIIT", "Weight Loss", "Rehabilitation", "Boxing"];

type TabKey = "rewards" | "account" | "mypt";

export default function ProfilePage() {
  const [tab, setTab] = useState<TabKey>("rewards");
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(notifToggles.map((n) => [n.key, n.default]))
  );
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const copyCode = () => {
    navigator.clipboard.writeText("KEFILWE10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleNotif = (key: string) => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const tabs: { key: TabKey; label: string }[] = [
    { key: "rewards", label: "Rewards" },
    { key: "account", label: "Account" },
    { key: "mypt", label: "My PT" },
  ];

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-[#141414] p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition ${
              tab === t.key ? "bg-[#5A4EFF] text-white" : "text-[#71717A] hover:text-[#A1A1AA]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════ REWARDS TAB ═══════════ */}
      {tab === "rewards" && (
        <div className="space-y-6">
          {/* Points hero */}
          <div className="flex flex-col items-center rounded-2xl border border-[#262626] bg-[#141414] p-6 text-center space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">Your Points</p>
            <p className="text-5xl font-black tabular-nums text-[#FAFAFA]">1,240</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400">
              <Trophy01 className="size-3.5" /> Gold Tier
            </span>
            <div className="w-full space-y-1.5 pt-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#262626]">
                <div className="h-full w-[83%] rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
              </div>
              <p className="text-xs text-[#71717A]">260 points to <span className="font-semibold text-[#A1A1AA]">Platinum</span></p>
            </div>
          </div>

          {/* How to earn */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#FAFAFA]">How to earn more</h3>
            <div className="grid grid-cols-3 gap-2">
              {earnCards.map((c) => (
                <div key={c.action} className="flex flex-col items-center rounded-xl border border-[#262626] bg-[#141414] p-3 text-center">
                  <span className="text-xl">{c.emoji}</span>
                  <p className="mt-1.5 text-[11px] leading-tight text-[#A1A1AA]">{c.action}</p>
                  <p className="mt-1 text-xs font-bold text-[#E2F4A6]">{c.pts}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Referral code */}
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-5 space-y-4">
            <p className="text-sm font-semibold text-[#FAFAFA]">Refer a Friend</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-lg bg-[#1A1A1A] px-4 py-3 text-center text-lg font-black tracking-widest text-[#5A4EFF]">
                KEFILWE10
              </div>
              <button onClick={copyCode} className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#262626] transition hover:bg-[#1A1A1A]">
                {copied ? <Check className="size-4 text-[#E2F4A6]" /> : <Copy01 className="size-4 text-[#A1A1AA]" />}
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#25D366]/15 transition hover:bg-[#25D366]/25">
                <Share07 className="size-4 text-[#25D366]" />
              </button>
            </div>
            <p className="text-xs text-[#71717A]">1 friend referred &middot; 100 pts earned</p>
          </div>

          {/* Points history */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#FAFAFA]">Points History</h3>
            <div className="divide-y divide-[#1A1A1A] rounded-xl border border-[#262626] bg-[#141414]">
              {pointsHistory.map((h) => (
                <div key={h.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm text-[#FAFAFA]">{h.label}</p>
                    <p className="text-xs text-[#52525B]">{h.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${h.type === "earned" ? "text-[#E2F4A6]" : "text-[#EEA0FF]"}`}>{h.pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gold tier benefits */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5">
            <button onClick={() => setBenefitsOpen(!benefitsOpen)} className="flex w-full items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Trophy01 className="size-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">Gold Tier Benefits</span>
              </div>
              {benefitsOpen ? <ChevronUp className="size-4 text-amber-400" /> : <ChevronDown className="size-4 text-amber-400" />}
            </button>
            {benefitsOpen && (
              <div className="space-y-2 px-4 pb-4">
                {goldBenefits.map((b) => (
                  <div key={b} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-3.5 text-amber-400" />
                    <p className="text-xs text-[#A1A1AA]">{b}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ ACCOUNT TAB ═══════════ */}
      {tab === "account" && (
        <div className="space-y-6">
          {/* Personal details */}
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#FAFAFA]">Personal Details</h3>
              <button className="text-xs font-medium text-[#5A4EFF] hover:underline">Edit</button>
            </div>
            {[
              ["Name", "Kefilwe Sithole"],
              ["Email", "kefilwe@email.com"],
              ["Phone", "+27 82 345 6789"],
              ["Date of Birth", "14 Aug 1994"],
              ["Emergency Contact", "Thandi Sithole · +27 83 456 7890"],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-[#71717A]">{label}</span>
                <span className="text-right text-[#FAFAFA]">{val}</span>
              </div>
            ))}
          </div>

          {/* Membership card */}
          <div className="rounded-2xl border border-[#5A4EFF]/30 bg-gradient-to-br from-[#5A4EFF]/10 to-[#141414] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#5A4EFF]">PT Package</p>
                <p className="mt-1 text-lg font-bold text-[#FAFAFA]">4 / 10 sessions</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A4EFF]/20">
                <Zap className="size-5 text-[#5A4EFF]" />
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#262626]">
              <div className="h-full w-[40%] rounded-full bg-[#5A4EFF]" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#71717A]">Expires 12 Jun 2025</span>
              <button className="rounded-lg bg-[#5A4EFF] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#4F44E6]">Top up</button>
            </div>
          </div>

          {/* Notification toggles */}
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#FAFAFA]">Notifications</h3>
            {notifToggles.map((n) => (
              <div key={n.key} className="flex items-center justify-between">
                <span className="text-sm text-[#A1A1AA]">{n.label}</span>
                <button
                  onClick={() => toggleNotif(n.key)}
                  className={`relative h-6 w-11 rounded-full transition ${notifications[n.key] ? "bg-[#5A4EFF]" : "bg-[#333]"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${notifications[n.key] ? "translate-x-5.5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Privacy */}
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#FAFAFA]">Privacy</h3>
            <button className="flex w-full items-center justify-between rounded-lg p-2 text-sm text-[#A1A1AA] transition hover:bg-[#1A1A1A]">
              <span className="flex items-center gap-2"><Shield01 className="size-4" /> Your data</span>
              <ChevronDown className="size-4 -rotate-90" />
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg p-2 text-sm text-[#A1A1AA] transition hover:bg-[#1A1A1A]">
              <Download01 className="size-4" /> Download my data
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg p-2 text-sm text-red-400 transition hover:bg-red-500/5">
              <Trash02 className="size-4" /> Delete account
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ MY PT TAB ═══════════ */}
      {tab === "mypt" && (
        <div className="space-y-6">
          {/* PT profile */}
          <div className="flex flex-col items-center rounded-2xl border border-[#262626] bg-[#141414] p-6 text-center space-y-3">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#5A4EFF]/20 text-xl font-bold text-[#5A4EFF]">
              SD
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#FAFAFA]">Sipho Dlamini</h3>
              <p className="text-xs text-[#71717A]">PT &middot; Cape Town</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Star01 className="size-4 text-amber-400" />
              <span className="text-sm font-semibold text-[#FAFAFA]">4.9</span>
              <span className="text-xs text-[#71717A]">(47 reviews)</span>
            </div>
            <p className="text-sm leading-relaxed text-[#A1A1AA]">
              Passionate about helping clients reach their peak potential. Specialising in strength training and rehabilitation with 8 years of experience.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {specialties.map((s) => (
                <span key={s} className="rounded-full bg-[#5A4EFF]/10 px-3 py-1 text-xs font-medium text-[#5A4EFF]">{s}</span>
              ))}
            </div>
          </div>

          {/* Package & next session */}
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#71717A]">Package</span>
              <span className="font-medium text-[#FAFAFA]">PT 10-pack (4 left)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#71717A]">Next session</span>
              <span className="font-medium text-[#FAFAFA]">Thu 20 Mar, 10:00</span>
            </div>
          </div>

          {/* Write review */}
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#FAFAFA]">Write a Review</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star01 className={`size-7 transition ${star <= rating ? "text-amber-400 fill-amber-400" : "text-[#333]"}`} />
                </button>
              ))}
              {rating > 0 && <span className="ml-2 text-xs text-[#71717A]">{rating}/5</span>}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with Sipho..."
              rows={3}
              className="w-full resize-none rounded-xl border border-[#262626] bg-[#0A0A0A] px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#52525B] outline-none focus:border-[#5A4EFF]"
            />
            <button
              disabled={rating === 0}
              className="w-full rounded-xl bg-[#5A4EFF] py-3 text-sm font-semibold text-white transition hover:bg-[#4F44E6] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </div>

          {/* Contact */}
          <div className="flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366]/15 py-3 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366]/25">
              <MessageSquare02 className="size-4" /> WhatsApp
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#262626] py-3 text-sm font-semibold text-[#A1A1AA] transition hover:bg-[#1A1A1A]">
              <Mail01 className="size-4" /> Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
