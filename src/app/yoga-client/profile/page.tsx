"use client";

import { useState } from "react";
import {
  Award01,
  Star01,
  Gift01,
  CreditCard01,
  Calendar,
  Clock,
  User01,
  MarkerPin01,
  Phone01,
  Mail01,
  ChevronRight,
  Heart,
  Globe02,
  Shield01,
  Bell01,
  Copy01,
  Check,
  Download01,
  Trash02,
  Settings01,
} from "@untitledui/icons";

const tabs = ["Rewards", "My Membership", "My Studio", "Account"];

const rewardsHistory = [
  { id: 1, action: "Class attended: Hot Yoga Flow", pts: "+25", date: "19 Mar" },
  { id: 2, action: "Class attended: Vinyasa Power", pts: "+25", date: "18 Mar" },
  { id: 3, action: "Referral: Thandi M.", pts: "+200", date: "15 Mar" },
  { id: 4, action: "Class attended: Yin Restore", pts: "+25", date: "17 Mar" },
  { id: 5, action: "5-day streak bonus", pts: "+50", date: "16 Mar" },
];

const paymentHistory = [
  { id: 1, date: "15 Mar 2026", amount: "R1,099", status: "Paid", method: "Visa ****4821" },
  { id: 2, date: "15 Feb 2026", amount: "R1,099", status: "Paid", method: "Visa ****4821" },
  { id: 3, date: "15 Jan 2026", amount: "R1,099", status: "Paid", method: "Visa ****4821" },
];

const tierProgress = [
  { name: "Lotus", minPts: 0, color: "bg-gray-400" },
  { name: "Yogi", minPts: 1000, color: "bg-[#14B8A6]" },
  { name: "Master", minPts: 5000, color: "bg-purple-500" },
  { name: "Guru", minPts: 10000, color: "bg-amber-500" },
];

export default function YogaProfilePage() {
  const [activeTab, setActiveTab] = useState("Rewards");
  const [copiedCode, setCopiedCode] = useState(false);

  function handleCopyCode() {
    navigator.clipboard.writeText("KEFILWE10").catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  return (
    <div className="px-4 py-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#14B8A6]/20 text-lg font-bold text-[#14B8A6] ring-2 ring-[#14B8A6]/30">
          KS
        </div>
        <div>
          <h1 className="text-lg font-bold text-[var(--pa-text-primary)]">Kefilwe Sithole</h1>
          <p className="text-sm text-[var(--pa-text-secondary)]">Member since January 2026</p>
          <div className="mt-1 flex items-center gap-1.5">
            <Award01 className="size-3.5 text-[#14B8A6]" />
            <span className="text-xs font-medium text-[#14B8A6]">Yogi Tier &middot; 2,340 pts</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-[var(--pa-border-default)]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-3 py-2.5 text-xs font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-[#14B8A6] text-[#14B8A6]"
                : "text-[var(--pa-text-muted)] hover:text-[var(--pa-text-secondary)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "Rewards" && <RewardsTab copiedCode={copiedCode} onCopyCode={handleCopyCode} />}
        {activeTab === "My Membership" && <MembershipTab />}
        {activeTab === "My Studio" && <StudioTab />}
        {activeTab === "Account" && <AccountTab />}
      </div>
    </div>
  );
}

function RewardsTab({ copiedCode, onCopyCode }: { copiedCode: boolean; onCopyCode: () => void }) {
  return (
    <div className="space-y-6">
      {/* Points Summary */}
      <div className="rounded-2xl border border-[#14B8A6]/20 bg-gradient-to-br from-[#14B8A6]/10 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-[var(--pa-text-primary)]">2,340</p>
            <p className="text-xs text-[var(--pa-text-secondary)]">Total points earned</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14B8A6]/15">
            <Star01 className="size-6 text-[#14B8A6]" />
          </div>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">Tier Progress</h3>
        <p className="mt-1 text-xs text-[var(--pa-text-secondary)]">Current: Yogi &middot; Next: Master at 5,000 pts</p>
        <div className="mt-3 flex items-center justify-between text-xs text-[var(--pa-text-muted)]">
          <span>2,340 pts</span>
          <span>5,000 pts</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--pa-border-default)]">
          <div className="h-full rounded-full bg-[#14B8A6]" style={{ width: "47%" }} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          {tierProgress.map((tier) => (
            <div key={tier.name} className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${tier.color}`} />
              <span className="text-[10px] text-[var(--pa-text-muted)]">{tier.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Code */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="flex items-center gap-2">
          <Gift01 className="size-4 text-[#14B8A6]" />
          <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">Referral Code</h3>
        </div>
        <p className="mt-1 text-xs text-[var(--pa-text-secondary)]">Share your code and earn 200 pts per referral</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 rounded-lg bg-[var(--pa-bg-elevated)] px-3 py-2 text-center">
            <span className="text-sm font-bold tracking-wider text-[var(--pa-text-primary)]">KEFILWE10</span>
          </div>
          <button
            onClick={onCopyCode}
            className="flex items-center gap-1.5 rounded-lg bg-[#14B8A6] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#0D9488]"
          >
            {copiedCode ? <Check className="size-3.5" /> : <Copy01 className="size-3.5" />}
            {copiedCode ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Recent Rewards Activity */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Recent Activity</h3>
        <div className="space-y-2">
          {rewardsHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3">
              <div>
                <p className="text-xs font-medium text-[var(--pa-text-primary)]">{item.action}</p>
                <p className="text-[10px] text-[var(--pa-text-muted)]">{item.date}</p>
              </div>
              <span className="text-xs font-bold text-[#14B8A6]">{item.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MembershipTab() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="rounded-2xl border border-[#14B8A6]/20 bg-gradient-to-br from-[#14B8A6]/10 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">Monthly Unlimited</h3>
              <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-400">Active</span>
            </div>
            <p className="mt-1 text-xl font-bold text-[var(--pa-text-primary)]">R1,099<span className="text-xs font-normal text-[var(--pa-text-muted)]">/month</span></p>
          </div>
          <CreditCard01 className="size-8 text-[#14B8A6]" />
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-secondary)]">
            <Calendar className="size-3" />
            <span>Renews 15 April 2026</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--pa-text-secondary)]">
            <CreditCard01 className="size-3" />
            <span>Visa ending in 4821</span>
          </div>
        </div>
      </div>

      {/* Plan Benefits */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Plan Benefits</h3>
        <div className="space-y-2">
          {[
            "Unlimited classes per month",
            "Access to all class styles",
            "Priority booking (24h early access)",
            "10% off workshops",
            "Free mat rental",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <Check className="size-3.5 text-[#14B8A6]" />
              <span className="text-xs text-[var(--pa-text-secondary)]">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Payment History</h3>
        <div className="space-y-2">
          {paymentHistory.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-3">
              <div>
                <p className="text-xs font-medium text-[var(--pa-text-primary)]">{payment.date}</p>
                <p className="text-[10px] text-[var(--pa-text-muted)]">{payment.method}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-[var(--pa-text-primary)]">{payment.amount}</p>
                <span className="text-[10px] text-green-400">{payment.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudioTab() {
  return (
    <div className="space-y-6">
      {/* Studio Info */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14B8A6]/10">
            <span className="text-xl">{"\uD83E\uDDD8\u200D\u2640\uFE0F"}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">Ubuntu Yoga</h3>
            <p className="text-xs text-[var(--pa-text-secondary)]">Your home studio</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[var(--pa-text-secondary)]">
            <MarkerPin01 className="size-3.5" />
            <span>23 Mandela Drive, Sandton, Johannesburg</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--pa-text-secondary)]">
            <Phone01 className="size-3.5" />
            <span>011 784 2341</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--pa-text-secondary)]">
            <Mail01 className="size-3.5" />
            <span>hello@ubuntuyoga.co.za</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--pa-text-secondary)]">
            <Globe02 className="size-3.5" />
            <span>www.ubuntuyoga.co.za</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--pa-text-secondary)]">
            <Clock className="size-3.5" />
            <span>Mon-Fri 06:00-21:00 &middot; Sat-Sun 07:00-18:00</span>
          </div>
        </div>
      </div>

      {/* Preferred Instructor */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Preferred Instructor</h3>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14B8A6]/20 text-xs font-bold text-[#14B8A6]">
            AM
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--pa-text-primary)]">Amahle</p>
            <p className="text-xs text-[var(--pa-text-muted)]">Hot Yoga &middot; Vinyasa specialist</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star01 key={i} className="size-3.5 text-amber-400" />
          ))}
          <span className="ml-1 text-xs text-[var(--pa-text-muted)]">12 classes together</span>
        </div>
      </div>

      {/* Leave a Review */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="flex items-center gap-2">
          <Heart className="size-4 text-[#14B8A6]" />
          <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">Leave a Review</h3>
        </div>
        <p className="mt-1 text-xs text-[var(--pa-text-secondary)]">Help others discover Ubuntu Yoga by sharing your experience</p>
        <button className="mt-3 rounded-lg bg-[#14B8A6] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#0D9488]">
          Write a Review
        </button>
      </div>
    </div>
  );
}

function AccountTab() {
  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[var(--pa-text-primary)]">Personal Details</h3>
        <div className="space-y-3">
          {[
            { label: "Full name", value: "Kefilwe Sithole" },
            { label: "Email", value: "kefilwe@example.com" },
            { label: "Phone", value: "+27 82 345 6789" },
            { label: "Date of birth", value: "15 June 1994" },
            { label: "Emergency contact", value: "Naledi Sithole — +27 83 456 7890" },
          ].map((field) => (
            <div key={field.label} className="flex items-center justify-between">
              <span className="text-xs text-[var(--pa-text-muted)]">{field.label}</span>
              <span className="text-xs font-medium text-[var(--pa-text-primary)]">{field.value}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#14B8A6] transition hover:text-[#0D9488]">
          <Settings01 className="size-3.5" />
          Edit Details
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="flex items-center gap-2">
          <Bell01 className="size-4 text-[var(--pa-text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">Notification Preferences</h3>
        </div>
        <div className="mt-3 space-y-3">
          {[
            { label: "Class reminders", desc: "30 min before class", enabled: true },
            { label: "Booking confirmations", desc: "Email & push", enabled: true },
            { label: "Studio announcements", desc: "Push notifications", enabled: true },
            { label: "Marketing emails", desc: "Weekly digest", enabled: false },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[var(--pa-text-primary)]">{pref.label}</p>
                <p className="text-[10px] text-[var(--pa-text-muted)]">{pref.desc}</p>
              </div>
              <div className={`h-5 w-9 rounded-full transition ${pref.enabled ? "bg-[#14B8A6]" : "bg-[var(--pa-border-default)]"}`}>
                <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${pref.enabled ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Information */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="flex items-center gap-2">
          <Shield01 className="size-4 text-[var(--pa-text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">Health Information</h3>
        </div>
        <p className="mt-1 text-xs text-[var(--pa-text-secondary)]">Shared with instructors for your safety</p>
        <div className="mt-3 space-y-2">
          {[
            { label: "Injuries", value: "None reported" },
            { label: "Allergies", value: "None" },
            { label: "Experience level", value: "Intermediate" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs text-[var(--pa-text-muted)]">{item.label}</span>
              <span className="text-xs font-medium text-[var(--pa-text-primary)]">{item.value}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#14B8A6] transition hover:text-[#0D9488]">
          <Settings01 className="size-3.5" />
          Update Health Info
        </button>
      </div>

      {/* POPIA */}
      <div className="rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-4">
        <div className="flex items-center gap-2">
          <Shield01 className="size-4 text-[var(--pa-text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">POPIA &amp; Data Privacy</h3>
        </div>
        <p className="mt-1 text-xs text-[var(--pa-text-secondary)]">Manage your personal data under POPIA regulations</p>
        <div className="mt-3 flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[var(--pa-border-default)] bg-[var(--pa-bg-elevated)] px-3 py-2 text-xs font-medium text-[var(--pa-text-primary)] transition hover:bg-[var(--pa-bg-hover)]">
            <Download01 className="size-3.5" />
            Download My Data
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20">
            <Trash02 className="size-3.5" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
