"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Star01,
  Gift01,
  Users01,
  Edit01,
  ArrowUp,
  ArrowDown,
  Activity,
  Copy01,
  Share07,
  Check,
  Plus,
  X,
  Calendar,
  Package,
  Tag01,
  Clock,
  BarChart01,
  RefreshCw01,
  ShoppingBag01,
} from "@untitledui/icons";
import {
  clients,
  loyaltyTiers,
  loyaltyEvents,
  challenges as mockChallenges,
  challengeLeaderboard as mockLeaderboard,
} from "@/lib/mock-data";
import type { Challenge, ChallengeEntry, ChallengeType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { InitialsAvatar } from "@/components/ui/initials-avatar";

// ── Tab types ────────────────────────────────────────────────────────────────

type GrowTab = "referrals" | "challenges" | "loyalty" | "packages";

const TABS: { key: GrowTab; label: string }[] = [
  { key: "referrals", label: "Referrals" },
  { key: "challenges", label: "Challenges" },
  { key: "loyalty", label: "Loyalty" },
  { key: "packages", label: "Packages" },
];

// ── Referrals data ───────────────────────────────────────────────────────────

const referralCodes = [
  { client: "Thando Mbeki", initials: "TM", code: "THANDO10", shared: 12, signUps: 5, converted: 4, points: 400 },
  { client: "Pieter Cloete", initials: "PC", code: "PIETER22", shared: 8, signUps: 3, converted: 2, points: 200 },
  { client: "Naledi Dlamini", initials: "ND", code: "NALEDI5", shared: 15, signUps: 4, converted: 3, points: 300 },
  { client: "Jacques van Wyk", initials: "JW", code: "JACQUES7", shared: 6, signUps: 2, converted: 1, points: 100 },
  { client: "Zanele Khumalo", initials: "ZK", code: "ZANELE9", shared: 9, signUps: 1, converted: 1, points: 100 },
  { client: "Ruan Botha", initials: "RB", code: "RUAN15", shared: 4, signUps: 1, converted: 0, points: 0 },
  { client: "Amahle Nkosi", initials: "AN", code: "AMAHLE3", shared: 7, signUps: 1, converted: 1, points: 100 },
  { client: "Gerhard Steyn", initials: "GS", code: "GERHARD8", shared: 3, signUps: 1, converted: 0, points: 0 },
];

const referralActivity = [
  { id: "ra1", text: "Pieter Cloete\u2019s code PIETER22 was used", time: "2 days ago" },
  { id: "ra2", text: "Thando Mbeki earned 100 points from referral", time: "3 days ago" },
  { id: "ra3", text: "Naledi Dlamini\u2019s code NALEDI5 converted a new client", time: "5 days ago" },
  { id: "ra4", text: "Zanele Khumalo shared code ZANELE9 via WhatsApp", time: "1 week ago" },
  { id: "ra5", text: "Jacques van Wyk\u2019s referral signed up for PT Package", time: "1 week ago" },
];

// ── Loyalty data ─────────────────────────────────────────────────────────────

const pointsRules = [
  { label: "PT Session", value: "10 pts / R100", description: "Earn on every session" },
  { label: "Package Purchase", value: "10 pts / R100", description: "Bonus on bulk buys" },
  { label: "Referral", value: "100 pts", description: "For each new client referred" },
  { label: "Google Review", value: "25 pts", description: "One-time bonus" },
  { label: "Birthday Bonus", value: "50 pts", description: "Auto-credited yearly" },
];

// ── Challenges helpers ───────────────────────────────────────────────────────

const avatarColors = [
  "#5A4EFF", "#EEA0FF", "#E2F4A6", "#F59E0B", "#3B82F6",
  "#EF4444", "#22C55E", "#F97316", "#8B5CF6", "#EC4899",
];

function getAvatarColor(initials: string): string {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return avatarColors[code % avatarColors.length];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  const end = new Date(dateStr);
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function rankAccent(rank: number): string {
  if (rank === 1) return "border-l-4 border-l-[#F59E0B]";
  if (rank === 2) return "border-l-4 border-l-[#A1A1AA]";
  if (rank === 3) return "border-l-4 border-l-[#F97316]";
  return "";
}

function rankBadge(rank: number): string | null {
  if (rank === 1) return "text-[#F59E0B]";
  if (rank === 2) return "text-[#A1A1AA]";
  if (rank === 3) return "text-[#F97316]";
  return null;
}

// ── Packages data ────────────────────────────────────────────────────────────

type PackageItem = {
  id: string;
  name: string;
  sessions: number | "Unlimited";
  originalPrice: number | null;
  price: number;
  discount: number | null;
  discountLabel: string | null;
  validity: string;
  services: string[];
  salesCount: number;
  isActive: boolean;
  badge?: string;
};

type Promotion = {
  id: string;
  name: string;
  code: string;
  discountType: "percent" | "fixed" | "free";
  value: number | string;
  appliesTo: string;
  dateRange: string | null;
  usedCount: number;
  maxUses: number | null;
  status: "Active" | "Scheduled" | "Expired";
};

const initialPackages: PackageItem[] = [
  { id: "pkg-1", name: "Starter Pack", sessions: 5, originalPrice: 5000, price: 4500, discount: 10, discountLabel: "10% off", validity: "6 weeks", services: ["PT Sessions"], salesCount: 12, isActive: true },
  { id: "pkg-2", name: "Core Pack", sessions: 10, originalPrice: 10000, price: 8000, discount: 20, discountLabel: "20% off", validity: "3 months", services: ["PT Sessions"], salesCount: 18, isActive: true },
  { id: "pkg-3", name: "Elite Pack", sessions: 20, originalPrice: 20000, price: 14000, discount: 30, discountLabel: "30% off", validity: "6 months", services: ["PT Sessions", "Body Assessment"], salesCount: 7, isActive: true },
  { id: "pkg-4", name: "Monthly Unlimited", sessions: "Unlimited", originalPrice: null, price: 6500, discount: null, discountLabel: "Flat rate", validity: "30 days", services: ["All Sessions"], salesCount: 5, isActive: true },
  { id: "pkg-5", name: "Nutrition + Training Bundle", sessions: 10, originalPrice: 11176, price: 9500, discount: 15, discountLabel: "15% off", validity: "3 months", services: ["PT Sessions", "Nutrition Consults"], salesCount: 0, isActive: false },
  { id: "pkg-6", name: "New Joiner Special", sessions: 3, originalPrice: null, price: 2400, discount: null, discountLabel: null, validity: "2 weeks", services: ["PT Sessions"], salesCount: 0, isActive: true, badge: "New" },
];

const initialPromotions: Promotion[] = [
  { id: "promo-1", name: "New Year 2025", code: "NY2025", discountType: "percent", value: 15, appliesTo: "All packages", dateRange: "1 Jan – 31 Jan 2025", usedCount: 24, maxUses: 50, status: "Expired" },
  { id: "promo-2", name: "Refer-a-Friend Bonus", code: "FRIEND20", discountType: "percent", value: 20, appliesTo: "First package", dateRange: null, usedCount: 9, maxUses: null, status: "Active" },
  { id: "promo-3", name: "Summer Shred", code: "SUMMER10", discountType: "fixed", value: 500, appliesTo: "10+ session packages", dateRange: "1 Dec – 28 Feb 2025", usedCount: 31, maxUses: 100, status: "Expired" },
  { id: "promo-4", name: "Free Trial Session", code: "TRYME", discountType: "free", value: "1 free session", appliesTo: "New clients", dateRange: null, usedCount: 14, maxUses: null, status: "Active" },
];

// ── Component ────────────────────────────────────────────────────────────────

function GrowPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = (searchParams.get("tab") as GrowTab) || "referrals";

  // Referrals state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Challenges state
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [leaderboard] = useState<ChallengeEntry[]>(mockLeaderboard);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<ChallengeType>("competitive");
  const [newMetric, setNewMetric] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newPrize, setNewPrize] = useState("");

  // Loyalty state
  const [showAllEarners, setShowAllEarners] = useState(false);

  // Packages state
  const [pkgList, setPkgList] = useState<PackageItem[]>(initialPackages);
  const [pkgSubTab, setPkgSubTab] = useState<"packages" | "promotions">("packages");

  // ── Tab switching ─────────────────────────────────────────────────────────
  function setTab(tab: GrowTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "referrals") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const qs = params.toString();
    router.push(qs ? `/grow?${qs}` : "/grow");
  }

  // ── Challenges helpers ────────────────────────────────────────────────────
  const activeChallenge = challenges.find((c) => c.status === "active");
  const pastChallenges = challenges.filter((c) => c.status === "completed");

  function resetChallengeModal() {
    setShowChallengeModal(false);
    setNewName(""); setNewType("competitive"); setNewMetric("");
    setNewTarget(""); setNewStartDate(""); setNewEndDate(""); setNewPrize("");
  }

  function handleCreateChallenge() {
    if (!newName || !newMetric || !newStartDate || !newEndDate) return;
    const newChallenge: Challenge = {
      id: `ch${Date.now()}`, name: newName, type: newType, metric: newMetric,
      goal: newType === "threshold" ? newTarget : undefined,
      startDate: newStartDate, endDate: newEndDate, participantCount: 0, status: "active",
    };
    setChallenges([newChallenge, ...challenges]);
    resetChallengeModal();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  // ── Loyalty helpers ───────────────────────────────────────────────────────
  const topEarners = [...clients]
    .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
    .slice(0, showAllEarners ? 20 : 10);
  const activeLoyaltyMembers = clients.filter((c) => c.loyaltyPoints > 0).length;
  const avgPointsPerClient = Math.round(clients.reduce((sum, c) => sum + c.loyaltyPoints, 0) / clients.length);

  // ── Packages helpers ──────────────────────────────────────────────────────
  const activePackagesCount = pkgList.filter((p) => p.isActive).length;
  const totalSold = pkgList.reduce((s, p) => s + p.salesCount, 0);

  function togglePackageActive(id: string) {
    setPkgList((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-[#FAFAFA] lg:text-2xl">Grow</h1>
        <p className="mt-0.5 text-sm text-[#A1A1AA]">
          Retain clients, reward loyalty, run promotions
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 overflow-x-auto rounded-lg bg-[#1A1A1A] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
              currentTab === tab.key
                ? "bg-[#5A4EFF] text-white"
                : "text-[#A1A1AA] hover:text-[#FAFAFA]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* REFERRALS TAB                                                         */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === "referrals" && (
        <div className="flex flex-col gap-6">
          {/* Stats strip */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4">
              <p className="text-xs text-[#A1A1AA]">Codes Active</p>
              <p className="mt-1 text-2xl font-semibold text-[#FAFAFA]">24</p>
            </div>
            <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4">
              <p className="text-xs text-[#A1A1AA]">Total Referrals</p>
              <p className="mt-1 text-2xl font-semibold text-[#FAFAFA]">18</p>
            </div>
            <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4">
              <p className="text-xs text-[#A1A1AA]">Converted</p>
              <p className="mt-1 text-2xl font-semibold text-[#E2F4A6]">12</p>
            </div>
            <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4">
              <p className="text-xs text-[#A1A1AA]">Revenue</p>
              <p className="mt-1 text-2xl font-semibold text-[#5A4EFF]">R14,400</p>
            </div>
          </div>

          {/* Info card */}
          <div className="rounded-2xl border border-[#5A4EFF]/20 bg-[#5A4EFF]/5 p-4">
            <p className="text-sm text-[#A1A1AA]">
              Your clients each get a unique code. When someone new uses their code, your client earns{" "}
              <span className="font-semibold text-[#E2F4A6]">100 bonus points</span> + the new client gets{" "}
              <span className="font-semibold text-[#5A4EFF]">R100 off</span>.
            </p>
          </div>

          {/* Referral codes table - mobile cards */}
          <div>
            <h2 className="mb-3 text-base font-semibold text-[#FAFAFA]">Referral Codes</h2>
            <div className="flex flex-col gap-2 lg:hidden">
              {referralCodes.map((row) => (
                <div key={row.code} className="rounded-2xl border border-[#262626] bg-[#111111] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <InitialsAvatar initials={row.initials} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-[#FAFAFA]">{row.client}</p>
                        <p className="font-mono text-xs text-[#5A4EFF]">{row.code}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(row.code);
                        setCopiedCode(row.code);
                        setTimeout(() => setCopiedCode(null), 2000);
                      }}
                      className="flex items-center gap-1 rounded-lg border border-[#262626] px-2.5 py-1.5 text-xs font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A]"
                    >
                      {copiedCode === row.code ? <Check className="size-3.5 text-[#E2F4A6]" /> : <Copy01 className="size-3.5" />}
                      {copiedCode === row.code ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-[#A1A1AA]">
                    <span>Shared: {row.shared}</span>
                    <span>Sign-ups: {row.signUps}</span>
                    <span>Converted: {row.converted}</span>
                    <span className="font-semibold text-[#E2F4A6]">{row.points} pts</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block">
              <div className="overflow-hidden rounded-2xl border border-[#262626]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#262626] bg-[#0A0A0A]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#A1A1AA]">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#A1A1AA]">Code</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#A1A1AA]">Shared</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#A1A1AA]">Sign-ups</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#A1A1AA]">Converted</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#A1A1AA]">Points</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#A1A1AA]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralCodes.map((row) => (
                      <tr key={row.code} className="border-b border-[#262626] last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <InitialsAvatar initials={row.initials} size="sm" />
                            <span className="text-sm font-medium text-[#FAFAFA]">{row.client}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-sm text-[#5A4EFF]">{row.code}</td>
                        <td className="px-4 py-3 text-right text-sm text-[#A1A1AA]">{row.shared}</td>
                        <td className="px-4 py-3 text-right text-sm text-[#A1A1AA]">{row.signUps}</td>
                        <td className="px-4 py-3 text-right text-sm text-[#A1A1AA]">{row.converted}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-[#E2F4A6]">{row.points}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(row.code);
                              setCopiedCode(row.code);
                              setTimeout(() => setCopiedCode(null), 2000);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#262626] px-2.5 py-1.5 text-xs font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A]"
                          >
                            {copiedCode === row.code ? <Check className="size-3.5 text-[#E2F4A6]" /> : <Copy01 className="size-3.5" />}
                            {copiedCode === row.code ? "Copied" : "Copy"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent referral activity */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#FAFAFA]">Recent Referral Activity</h3>
            <div className="flex flex-col gap-2">
              {referralActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-[#262626] bg-[#111111] px-4 py-3"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EEA0FF]/10 text-[#EEA0FF]">
                    <Share07 className="size-4" />
                  </div>
                  <p className="flex-1 text-sm text-[#FAFAFA]">{item.text}</p>
                  <span className="flex-shrink-0 text-xs text-[#A1A1AA]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CHALLENGES TAB                                                        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === "challenges" && (
        <div className="flex flex-col gap-6">
          {/* Header with create button */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowChallengeModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8]"
            >
              <Plus className="size-4" />
              Create Challenge
            </button>
          </div>

          {/* Active Challenge */}
          {activeChallenge && (
            <div className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5A4EFF]/10 text-[#5A4EFF]">
                    <Activity className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-[#FAFAFA]">{activeChallenge.name}</h2>
                      <span className="inline-flex items-center rounded-full bg-[#8B5CF6]/20 px-2.5 py-0.5 text-xs font-medium text-[#8B5CF6]">
                        {activeChallenge.type === "competitive" ? "Competitive" : "Threshold"}
                      </span>
                    </div>
                    <p className="text-sm text-[#71717A]">{activeChallenge.metric}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-[#A1A1AA]">
                    <Calendar className="size-4" />
                    <span>Ends in {daysUntil(activeChallenge.endDate)} days</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#A1A1AA]">
                    <Users01 className="size-4" />
                    <span>{activeChallenge.participantCount}/24 participants</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="mt-5">
                <h3 className="mb-3 text-sm font-semibold text-[#A1A1AA]">Leaderboard</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#262626]">
                        <th className="pb-3 text-left text-xs font-medium text-[#71717A]">Rank</th>
                        <th className="pb-3 text-left text-xs font-medium text-[#71717A]">Participant</th>
                        <th className="pb-3 text-right text-xs font-medium text-[#71717A]">Score</th>
                        <th className="pb-3 text-right text-xs font-medium text-[#71717A]">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                      {leaderboard.map((entry) => {
                        const accent = rankAccent(entry.rank);
                        const badge = rankBadge(entry.rank);
                        const isSelected = selectedRow === entry.clientId;
                        return (
                          <tr
                            key={entry.clientId}
                            onClick={() => setSelectedRow(isSelected ? null : entry.clientId)}
                            className={`cursor-pointer transition duration-100 ease-linear ${accent} ${
                              isSelected ? "bg-[#5A4EFF]/10" : "hover:bg-[#1A1A1A]"
                            }`}
                          >
                            <td className="py-3 pl-3 pr-2">
                              <span className={`text-sm font-bold ${badge ?? "text-[#71717A]"}`}>
                                #{entry.rank}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <InitialsAvatar initials={entry.clientInitials} color={getAvatarColor(entry.clientInitials)} size="sm" />
                                <span className="text-sm font-medium text-[#FAFAFA]">{entry.clientName}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-3 text-right">
                              <span className="text-sm font-semibold text-[#FAFAFA]">{entry.score}</span>
                            </td>
                            <td className="py-3 pr-3 text-right">
                              {entry.change > 0 ? (
                                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[#22C55E]">
                                  <ArrowUp className="size-3" />{entry.change}
                                </span>
                              ) : entry.change < 0 ? (
                                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[#EF4444]">
                                  <ArrowDown className="size-3" />{Math.abs(entry.change)}
                                </span>
                              ) : (
                                <span className="text-xs text-[#71717A]">--</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Past Challenges */}
          <div>
            <h2 className="mb-3 text-base font-semibold text-[#FAFAFA]">Past Challenges</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {pastChallenges.map((ch) => (
                <div key={ch.id} className="rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#FAFAFA]">{ch.name}</h3>
                        <StatusBadge variant="default">Completed</StatusBadge>
                      </div>
                      <p className="mt-1 text-xs text-[#71717A]">{ch.metric}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[#8B5CF6]/20 px-2 py-0.5 text-[10px] font-medium text-[#8B5CF6]">
                      {ch.type === "competitive" ? "Competitive" : "Threshold"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-[#A1A1AA]">
                    <span>{formatDate(ch.startDate)} - {formatDate(ch.endDate)}</span>
                    <span>{ch.participantCount} participants</span>
                  </div>
                  {ch.winner && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F59E0B]/10 px-3 py-2">
                      <Star01 className="size-4 text-[#F59E0B]" />
                      <span className="text-xs font-medium text-[#F59E0B]">Winner: {ch.winner}</span>
                    </div>
                  )}
                  {!ch.winner && ch.type === "threshold" && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#5A4EFF]/10 px-3 py-2">
                      <Check className="size-4 text-[#5A4EFF]" />
                      <span className="text-xs font-medium text-[#5A4EFF]">
                        Threshold challenge{ch.goal ? ` \u2014 Goal: ${ch.goal}` : ""}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Create Challenge Modal */}
          {showChallengeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-lg rounded-2xl border border-[#262626] bg-[#111111] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#262626] px-6 py-4">
                  <h2 className="text-lg font-semibold text-[#FAFAFA]">Create Challenge</h2>
                  <button onClick={resetChallengeModal} className="rounded-lg p-2 text-[#71717A] transition duration-100 ease-linear hover:bg-[#1A1A1A] hover:text-[#FAFAFA]">
                    <X className="size-5" />
                  </button>
                </div>
                <div className="space-y-4 px-6 py-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Challenge Name</label>
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. May Fitness Blitz" className="w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Type</label>
                    <div className="flex gap-2">
                      {([{ key: "competitive", label: "Competitive" }, { key: "threshold", label: "Threshold" }] as const).map((opt) => (
                        <button key={opt.key} onClick={() => setNewType(opt.key)} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition duration-100 ease-linear ${newType === opt.key ? "border-[#5A4EFF] bg-[#5A4EFF]/10 text-[#5A4EFF]" : "border-[#262626] text-[#A1A1AA] hover:border-[#333333]"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Metric</label>
                    <input type="text" value={newMetric} onChange={(e) => setNewMetric(e.target.value)} placeholder="e.g. Most sessions attended" className="w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                  </div>
                  {newType === "threshold" && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Target / Goal</label>
                      <input type="text" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} placeholder="e.g. 20 logged days" className="w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Start Date</label>
                      <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} className="w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">End Date</label>
                      <input type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} className="w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] [color-scheme:dark]" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Prize (optional)</label>
                    <input type="text" value={newPrize} onChange={(e) => setNewPrize(e.target.value)} placeholder="e.g. Free month of training" className="w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-[#262626] px-6 py-4">
                  <button onClick={resetChallengeModal} className="rounded-lg border border-[#262626] px-4 py-2 text-sm font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:border-[#333333] hover:text-[#FAFAFA]">Cancel</button>
                  <button onClick={handleCreateChallenge} disabled={!newName || !newMetric || !newStartDate || !newEndDate} className="flex items-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8] disabled:cursor-not-allowed disabled:opacity-40">
                    <Activity className="size-4" />
                    Launch Challenge
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Toast */}
          {showToast && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#E2F4A6]/20 bg-[#111111] px-4 py-3 shadow-2xl">
              <Check className="size-4 text-[#E2F4A6]" />
              <span className="text-sm font-medium text-[#E2F4A6]">Challenge launched successfully!</span>
              <button onClick={() => setShowToast(false)} className="ml-2 text-[#71717A] transition duration-100 ease-linear hover:text-[#FAFAFA]">
                <X className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* LOYALTY TAB                                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === "loyalty" && (
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard title="Points Issued" value="4,820" change="+320 this month" changeType="positive" icon={<Star01 className="size-5" />} />
            <StatCard title="Points Redeemed" value="1,240" change="+200 this month" changeType="neutral" icon={<Gift01 className="size-5" />} />
            <StatCard title="Active Members" value={String(activeLoyaltyMembers)} subtitle="With loyalty points" icon={<Users01 className="size-5" />} />
            <StatCard title="Avg Points/Client" value={String(avgPointsPerClient)} change="+12% vs last month" changeType="positive" icon={<Activity className="size-5" />} />
          </div>

          {/* Tier breakdown */}
          <div>
            <h2 className="mb-3 text-base font-semibold text-[#FAFAFA]">Tier Breakdown</h2>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible">
              {loyaltyTiers.map((tier) => (
                <div key={tier.name} className="min-w-[160px] snap-start rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="text-sm font-semibold text-[#FAFAFA]">{tier.name}</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-[#FAFAFA]">{tier.memberCount}</p>
                  <p className="text-xs text-[#A1A1AA]">members</p>
                  <p className="mt-1 text-xs text-[#A1A1AA]">
                    {tier.minPoints.toLocaleString()}&ndash;{tier.maxPoints >= 99999 ? "\u221E" : tier.maxPoints.toLocaleString()} pts
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Points rules */}
          <div>
            <h2 className="mb-3 text-base font-semibold text-[#FAFAFA]">Points Rules</h2>
            <div className="flex flex-col gap-2 lg:grid lg:grid-cols-5">
              {pointsRules.map((rule) => (
                <div key={rule.label} className="flex items-center justify-between rounded-2xl border border-[#262626] bg-[#111111] p-4 lg:flex-col lg:items-start lg:justify-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#FAFAFA]">{rule.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#5A4EFF]">{rule.value}</p>
                    <p className="mt-0.5 text-xs text-[#A1A1AA]">{rule.description}</p>
                  </div>
                  <button className="ml-3 flex-shrink-0 text-[#A1A1AA] transition duration-100 ease-linear hover:text-[#A1A1AA] lg:mt-2 lg:ml-0">
                    <Edit01 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Top earners */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#FAFAFA]">Top Earners</h2>
              <button onClick={() => setShowAllEarners(!showAllEarners)} className="text-sm font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:text-[#4840E8]">
                {showAllEarners ? "Show less" : "View all"}
              </button>
            </div>

            {/* Mobile: card list */}
            <div className="flex flex-col gap-2 lg:hidden">
              {topEarners.map((client, index) => (
                <div key={client.id} className="flex items-center gap-3 rounded-2xl border border-[#262626] bg-[#111111] px-4 py-3">
                  <span className="w-5 text-center text-xs font-medium text-[#A1A1AA]">{index + 1}</span>
                  <InitialsAvatar initials={client.initials} src={client.avatarUrl} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-[#FAFAFA]">{client.name}</p>
                      <StatusBadge variant={client.loyaltyTier.toLowerCase() as "bronze" | "silver" | "gold" | "platinum"}>
                        {client.loyaltyTier}
                      </StatusBadge>
                    </div>
                    <p className="text-xs text-[#A1A1AA]">{client.loyaltyPoints.toLocaleString()} pts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#5A4EFF]">{client.loyaltyPoints.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden lg:block">
              <div className="overflow-hidden rounded-2xl border border-[#262626]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#262626] bg-[#0A0A0A]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#A1A1AA]">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#A1A1AA]">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#A1A1AA]">Tier</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#A1A1AA]">Membership</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#A1A1AA]">Points</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#A1A1AA]">Total Spend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topEarners.map((client, index) => (
                      <tr key={client.id} className="border-b border-[#262626] last:border-0">
                        <td className="px-4 py-3 text-sm text-[#A1A1AA]">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <InitialsAvatar initials={client.initials} src={client.avatarUrl} size="sm" />
                            <div>
                              <p className="text-sm font-medium text-[#FAFAFA]">{client.name}</p>
                              <p className="text-xs text-[#A1A1AA]">{client.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge variant={client.loyaltyTier.toLowerCase() as "bronze" | "silver" | "gold" | "platinum"}>
                            {client.loyaltyTier}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#A1A1AA]">{client.membershipType}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-[#5A4EFF]">
                          {client.loyaltyPoints.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-[#FAFAFA]">
                          {formatCurrency(client.totalSpend)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div>
            <h2 className="mb-3 text-base font-semibold text-[#FAFAFA]">Recent Activity</h2>
            <div className="flex flex-col gap-2">
              {loyaltyEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 rounded-2xl border border-[#262626] bg-[#111111] px-4 py-3">
                  <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    event.type === "earned" ? "bg-[#E2F4A6]/10 text-[#E2F4A6]" : "bg-[#5A4EFF]/10 text-[#5A4EFF]"
                  }`}>
                    {event.type === "earned" ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#FAFAFA]">
                      <span className="font-medium">{event.clientName}</span>{" "}
                      {event.type === "earned" ? "earned" : "redeemed"}{" "}
                      <span className={`font-semibold ${event.type === "earned" ? "text-[#E2F4A6]" : "text-[#5A4EFF]"}`}>
                        {event.type === "earned" ? "+" : "-"}{event.points} pts
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-[#A1A1AA]">{event.description}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-[#A1A1AA]">{event.timestamp.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PACKAGES TAB                                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === "packages" && (
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard title="Active Packages" value={String(activePackagesCount)} icon={<Package className="size-5" />} />
            <StatCard title="Total Sold" value={String(totalSold)} change="+8 this month" changeType="positive" icon={<ShoppingBag01 className="size-5" />} />
            <StatCard title="Credits Outstanding" value="142" subtitle="Across all clients" icon={<RefreshCw01 className="size-5" />} />
            <StatCard title="Active Promotions" value="2" icon={<Tag01 className="size-5" />} />
          </div>

          {/* Sub-toggle */}
          <div className="flex gap-1 rounded-lg bg-[#1A1A1A] p-1 self-start">
            {(["packages", "promotions"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setPkgSubTab(t)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition duration-100 ease-linear ${
                  pkgSubTab === t ? "bg-[#5A4EFF] text-white" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Packages grid */}
          {pkgSubTab === "packages" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pkgList.map((pkg) => (
                <div key={pkg.id} className={`rounded-2xl border bg-[#111111] p-5 transition duration-100 ease-linear ${pkg.isActive ? "border-[#262626]" : "border-[#262626]/50 opacity-60"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#FAFAFA]">{pkg.name}</h3>
                        {pkg.badge && (
                          <span className="rounded-full bg-[#E2F4A6]/20 px-2 py-0.5 text-[10px] font-medium text-[#E2F4A6]">{pkg.badge}</span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[#71717A]">{pkg.services.join(", ")}</p>
                    </div>
                    <button
                      onClick={() => togglePackageActive(pkg.id)}
                      className={`relative h-6 w-11 rounded-full transition duration-100 ease-linear ${pkg.isActive ? "bg-[#5A4EFF]" : "bg-[#333333]"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition duration-100 ease-linear ${pkg.isActive ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#FAFAFA]">R{pkg.price.toLocaleString()}</span>
                    {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                      <span className="text-sm text-[#71717A] line-through">R{pkg.originalPrice.toLocaleString()}</span>
                    )}
                    {pkg.discountLabel && (
                      <span className="rounded-full bg-[#E2F4A6]/20 px-2 py-0.5 text-[10px] font-medium text-[#E2F4A6]">{pkg.discountLabel}</span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-[#A1A1AA]">
                    <span>{pkg.sessions === "Unlimited" ? "Unlimited" : `${pkg.sessions} sessions`}</span>
                    <span>{pkg.validity}</span>
                    <span>{pkg.salesCount} sold</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Promotions */}
          {pkgSubTab === "promotions" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {initialPromotions.map((promo) => {
                const statusClasses = promo.status === "Active"
                  ? "bg-[#E2F4A6]/20 text-[#E2F4A6]"
                  : promo.status === "Scheduled"
                  ? "bg-[#5A4EFF]/20 text-[#5A4EFF]"
                  : "bg-[#333333] text-[#A1A1AA]";

                const usagePercent = promo.maxUses ? Math.round((promo.usedCount / promo.maxUses) * 100) : null;

                return (
                  <div key={promo.id} className="rounded-2xl border border-[#262626] bg-[#111111] p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-[#FAFAFA]">{promo.name}</h3>
                        <p className="mt-0.5 font-mono text-xs text-[#5A4EFF]">{promo.code}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses}`}>
                        {promo.status}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-[#A1A1AA]">
                      <p>
                        {promo.discountType === "percent" ? `${promo.value}% off` : promo.discountType === "fixed" ? `R${promo.value} off` : String(promo.value)}
                        {" "}&middot; {promo.appliesTo}
                      </p>
                      {promo.dateRange && <p className="mt-0.5 text-xs text-[#71717A]">{promo.dateRange}</p>}
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                        <span>{promo.usedCount} used{promo.maxUses ? ` / ${promo.maxUses}` : ""}</span>
                        {usagePercent !== null && <span>{usagePercent}%</span>}
                      </div>
                      {promo.maxUses && (
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#262626]">
                          <div
                            className="h-full rounded-full bg-[#5A4EFF] transition duration-100 ease-linear"
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GrowPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <GrowPageInner />
    </Suspense>
  );
}
