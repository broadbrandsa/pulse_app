"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus,
  Copy01,
  Eye,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  Calendar,
  CurrencyDollar,
  Mail01,
  Download01,
  FileCheck02,
  FilePlus02,
} from "@untitledui/icons";
import { proposals as mockProposals, clients, contractSignatures } from "@/lib/mock-data";
import type { Proposal, ProposalStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { InitialsAvatar } from "@/components/ui/initials-avatar";

// ── Tab types ────────────────────────────────────────────────────────────────

type DocTab = "proposals" | "contracts" | "forms";

const TABS: { key: DocTab; label: string }[] = [
  { key: "proposals", label: "Proposals" },
  { key: "contracts", label: "Contracts" },
  { key: "forms", label: "Forms & Waivers" },
];

// ── Proposals helpers ────────────────────────────────────────────────────────

type TabFilter = "all" | "draft" | "sent" | "accepted" | "declined";

interface NewTier {
  name: string;
  sessions: number;
  price: number;
  features: string;
}

const statusConfig: Record<ProposalStatus, { label: string; classes: string }> = {
  draft: { label: "Draft", classes: "bg-[#333333] text-[#A1A1AA]" },
  sent: { label: "Sent", classes: "bg-[#5A4EFF]/20 text-[#5A4EFF]" },
  viewed: { label: "Viewed", classes: "bg-[#EEA0FF]/20 text-[#EEA0FF]" },
  accepted: { label: "Accepted", classes: "bg-[#E2F4A6]/20 text-[#E2F4A6]" },
  declined: { label: "Declined", classes: "bg-red-500/20 text-red-400" },
};

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

// ── Forms data ───────────────────────────────────────────────────────────────

type Template = {
  id: string; name: string; description: string; fields: number;
  lastUsed: string; responses: number; category: string;
};

type Submission = {
  id: string; formName: string; clientName: string; clientAvatar: string;
  submittedAt: string; status: "complete" | "partial" | "new";
};

const INITIAL_TEMPLATES: Template[] = [
  { id: "t1", name: "Client Onboarding", description: "Comprehensive intake form for new clients including medical history and goals.", fields: 18, lastUsed: "2 days ago", responses: 47, category: "Intake" },
  { id: "t2", name: "PAR-Q Health Screening", description: "Physical Activity Readiness Questionnaire for health risk assessment.", fields: 12, lastUsed: "1 week ago", responses: 89, category: "Health" },
  { id: "t3", name: "Progress Check-in", description: "Weekly progress report including measurements and subjective feedback.", fields: 10, lastUsed: "Today", responses: 234, category: "Progress" },
  { id: "t4", name: "Session Feedback", description: "Post-session feedback form to improve training experience.", fields: 6, lastUsed: "3 days ago", responses: 156, category: "Feedback" },
  { id: "t5", name: "Nutrition Diary", description: "Daily food logging template with macro tracking.", fields: 8, lastUsed: "1 day ago", responses: 312, category: "Nutrition" },
];

const SUBMISSIONS: Submission[] = [
  { id: "s1", formName: "Client Onboarding", clientName: "Thando Nkosi", clientAvatar: "TN", submittedAt: "10 min ago", status: "complete" },
  { id: "s2", formName: "Progress Check-in", clientName: "Lerato Mokoena", clientAvatar: "LM", submittedAt: "1 hour ago", status: "complete" },
  { id: "s3", formName: "PAR-Q Health Screening", clientName: "Ryan Govender", clientAvatar: "RG", submittedAt: "3 hours ago", status: "new" },
  { id: "s4", formName: "Nutrition Diary", clientName: "Naledi Phiri", clientAvatar: "NP", submittedAt: "5 hours ago", status: "complete" },
  { id: "s5", formName: "Session Feedback", clientName: "James van der Merwe", clientAvatar: "JM", submittedAt: "1 day ago", status: "complete" },
  { id: "s6", formName: "Progress Check-in", clientName: "Aisha Patel", clientAvatar: "AP", submittedAt: "1 day ago", status: "partial" },
  { id: "s7", formName: "Client Onboarding", clientName: "Bongani Zulu", clientAvatar: "BZ", submittedAt: "2 days ago", status: "complete" },
  { id: "s8", formName: "Nutrition Diary", clientName: "Chloe Botha", clientAvatar: "CB", submittedAt: "2 days ago", status: "complete" },
  { id: "s9", formName: "Progress Check-in", clientName: "Thando Nkosi", clientAvatar: "TN", submittedAt: "3 days ago", status: "complete" },
  { id: "s10", formName: "Session Feedback", clientName: "Lerato Mokoena", clientAvatar: "LM", submittedAt: "3 days ago", status: "complete" },
];

const FORM_CLIENTS = [
  { id: "cl1", name: "Thando Nkosi", avatar: "TN" },
  { id: "cl2", name: "Lerato Mokoena", avatar: "LM" },
  { id: "cl3", name: "Ryan Govender", avatar: "RG" },
  { id: "cl4", name: "Naledi Phiri", avatar: "NP" },
  { id: "cl5", name: "James van der Merwe", avatar: "JM" },
  { id: "cl6", name: "Aisha Patel", avatar: "AP" },
];

const submissionStatusStyles: Record<string, { bg: string; text: string; label: string }> = {
  complete: { bg: "bg-[#E2F4A6]/20", text: "text-[#E2F4A6]", label: "Complete" },
  partial: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Partial" },
  new: { bg: "bg-[#5A4EFF]/20", text: "text-[#5A4EFF]", label: "New" },
};

const CATEGORIES = ["Intake", "Health", "Progress", "Feedback", "Nutrition", "Custom"];
const FIELD_TYPES = ["Text", "Email", "Phone", "Number", "Textarea", "Checkbox", "Select", "Date"];

type FieldRow = { id: string; label: string; type: string };

// ── Component ────────────────────────────────────────────────────────────────

function DocumentsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = (searchParams.get("tab") as DocTab) || "proposals";

  // ── Tab switching ─────────────────────────────────────────────────────────
  function setTab(tab: DocTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "proposals") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const qs = params.toString();
    router.push(qs ? `/documents?${qs}` : "/documents");
  }

  // ── Proposals state ───────────────────────────────────────────────────────
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [proposalFilter, setProposalFilter] = useState<TabFilter>("all");
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [tiers, setTiers] = useState<NewTier[]>([{ name: "", sessions: 0, price: 0, features: "" }]);

  const sentCount = proposals.filter((p) => p.status !== "draft").length;
  const acceptedCount = proposals.filter((p) => p.status === "accepted").length;
  const pendingCount = proposals.filter((p) => p.status === "sent" || p.status === "viewed").length;
  const conversionValue = proposals.filter((p) => p.status === "accepted").reduce((sum, p) => sum + p.totalValue, 0);

  const proposalTabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "draft", label: "Drafts" },
    { key: "sent", label: "Sent" },
    { key: "accepted", label: "Accepted" },
    { key: "declined", label: "Declined" },
  ];

  const filtered = proposals.filter((p) => {
    if (proposalFilter === "all") return true;
    if (proposalFilter === "sent") return p.status === "sent" || p.status === "viewed";
    return p.status === proposalFilter;
  });

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  function resetProposalModal() {
    setShowProposalModal(false);
    setModalStep(1);
    setSelectedClientId("");
    setProposalTitle("");
    setTiers([{ name: "", sessions: 0, price: 0, features: "" }]);
  }

  function addTier() {
    if (tiers.length < 3) setTiers([...tiers, { name: "", sessions: 0, price: 0, features: "" }]);
  }
  function removeTier(index: number) {
    setTiers(tiers.filter((_, i) => i !== index));
  }
  function updateTier(index: number, field: keyof NewTier, value: string | number) {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  }

  function handleSendProposal() {
    if (!selectedClient || !proposalTitle || tiers.length === 0) return;
    const totalValue = tiers.reduce((sum, t) => sum + t.price, 0);
    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(expiry.getDate() + 7);

    const newProposal: Proposal = {
      id: `prop${Date.now()}`,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientInitials: selectedClient.initials,
      title: proposalTitle,
      status: "sent",
      tiers: tiers.map((t) => ({
        name: t.name, sessions: t.sessions, sessionType: "Personal Training",
        validity: "3 months", price: t.price,
        features: t.features.split(",").map((f) => f.trim()).filter(Boolean),
      })),
      totalValue,
      sentDate: today.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
    };
    setProposals([newProposal, ...proposals]);
    resetProposalModal();
  }

  function duplicateProposal(p: Proposal) {
    const dup: Proposal = {
      ...p, id: `prop${Date.now()}`, status: "draft",
      sentDate: "", expiryDate: "", signedDate: undefined,
      title: `${p.title} (Copy)`,
    };
    setProposals([dup, ...proposals]);
  }

  // ── Forms state ───────────────────────────────────────────────────────────
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [formsSubTab, setFormsSubTab] = useState<"templates" | "submissions">("templates");
  const [sendModal, setSendModal] = useState<string | null>(null);
  const [createFormModal, setCreateFormModal] = useState(false);
  const [selectedFormClients, setSelectedFormClients] = useState<string[]>([]);
  const [sendSuccess, setSendSuccess] = useState(false);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Intake");
  const [formFields, setFormFields] = useState<FieldRow[]>([{ id: crypto.randomUUID(), label: "", type: "Text" }]);

  function resetFormBuilder() {
    setFormName(""); setFormDescription(""); setFormCategory("Intake");
    setFormFields([{ id: crypto.randomUUID(), label: "", type: "Text" }]);
  }
  function addField() {
    setFormFields((prev) => [...prev, { id: crypto.randomUUID(), label: "", type: "Text" }]);
  }
  function removeField(id: string) {
    setFormFields((prev) => (prev.length > 1 ? prev.filter((f) => f.id !== id) : prev));
  }
  function updateField(id: string, key: "label" | "type", value: string) {
    setFormFields((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  }
  function handleSaveForm() {
    if (!formName.trim()) return;
    const newTemplate: Template = {
      id: `t${Date.now()}`, name: formName.trim(), description: formDescription.trim(),
      fields: formFields.length, responses: 0, lastUsed: "Just now", category: formCategory,
    };
    setTemplates((prev) => [newTemplate, ...prev]);
    setCreateFormModal(false);
    resetFormBuilder();
  }
  function toggleFormClient(id: string) {
    setSelectedFormClients((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }
  function handleSendForm() {
    setSendSuccess(true);
    setTimeout(() => { setSendModal(null); setSendSuccess(false); setSelectedFormClients([]); }, 1500);
  }

  const sendTemplate = templates.find((t) => t.id === sendModal);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-[#FAFAFA] lg:text-2xl">Documents</h1>
        <p className="mt-0.5 text-sm text-[#A1A1AA]">
          Proposals, agreements, forms and waivers
        </p>
      </div>

      {/* Combined stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard title="Proposals Sent" value={String(sentCount)} icon={<Mail01 className="size-5" />} />
        <StatCard title="Forms Completed" value="41" icon={<FileCheck02 className="size-5" />} />
        <StatCard title="Contracts Signed" value={String(contractSignatures.length)} icon={<Check className="size-5" />} />
        <StatCard title="Awaiting" value={String(pendingCount + 4)} icon={<Calendar className="size-5" />} />
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
      {/* PROPOSALS TAB                                                         */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === "proposals" && (
        <div className="flex flex-col gap-4">
          {/* Filter + New button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1 overflow-x-auto rounded-lg bg-[#1A1A1A] p-1">
              {proposalTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setProposalFilter(tab.key)}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear ${
                    proposalFilter === tab.key
                      ? "bg-[#5A4EFF] text-white"
                      : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowProposalModal(true)}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8]"
            >
              <Plus className="size-4" />
              New Proposal
            </button>
          </div>

          {/* Proposal list */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-[#262626] bg-[#111111] p-8 text-center">
                <p className="text-sm text-[#71717A]">No proposals found for this filter.</p>
              </div>
            )}
            {filtered.map((p) => {
              const cfg = statusConfig[p.status];
              return (
                <div key={p.id} className="rounded-2xl border border-[#262626] bg-[#111111] p-4 transition duration-100 ease-linear hover:border-[#333333] lg:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                      <InitialsAvatar initials={p.clientInitials} color={getAvatarColor(p.clientInitials)} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-[#FAFAFA]">{p.title}</h3>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.classes}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-[#A1A1AA]">{p.clientName}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#71717A]">
                          {p.sentDate && <span>Sent {formatDate(p.sentDate)}</span>}
                          {p.expiryDate && <span>Expires {formatDate(p.expiryDate)}</span>}
                          <span>{p.tiers.length} tier{p.tiers.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#FAFAFA]">{formatCurrency(p.totalValue)}</p>
                        <p className="text-xs text-[#71717A]">Total value</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 rounded-lg border border-[#262626] px-3 py-2 text-xs font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:border-[#5A4EFF] hover:text-[#5A4EFF]">
                          <Eye className="size-3.5" />
                          View
                        </button>
                        <button onClick={() => duplicateProposal(p)} className="flex items-center gap-1.5 rounded-lg border border-[#262626] px-3 py-2 text-xs font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:border-[#5A4EFF] hover:text-[#5A4EFF]">
                          <Copy01 className="size-3.5" />
                          Duplicate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Proposal Modal */}
          {showProposalModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-2xl rounded-2xl border border-[#262626] bg-[#111111] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#262626] px-6 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#FAFAFA]">New Proposal</h2>
                    <p className="text-sm text-[#71717A]">Step {modalStep} of 3</p>
                  </div>
                  <button onClick={resetProposalModal} className="rounded-lg p-2 text-[#71717A] transition duration-100 ease-linear hover:bg-[#1A1A1A] hover:text-[#FAFAFA]">
                    <X className="size-5" />
                  </button>
                </div>
                <div className="flex gap-2 px-6 pt-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className={`h-1 flex-1 rounded-full transition duration-100 ease-linear ${step <= modalStep ? "bg-[#5A4EFF]" : "bg-[#262626]"}`} />
                  ))}
                </div>
                <div className="px-6 py-5">
                  {modalStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Select Client</label>
                        <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]">
                          <option value="">Choose a client...</option>
                          {clients.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                      </div>
                      {selectedClient && (
                        <div className="flex items-center gap-3 rounded-lg border border-[#262626] bg-[#0A0A0A] p-3">
                          <InitialsAvatar initials={selectedClient.initials} src={selectedClient.avatarUrl} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-[#FAFAFA]">{selectedClient.name}</p>
                            <p className="text-xs text-[#71717A]">{selectedClient.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {modalStep === 2 && (
                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Proposal Title</label>
                        <input type="text" value={proposalTitle} onChange={(e) => setProposalTitle(e.target.value)} placeholder="e.g. 12-Week Body Transformation" className="w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                      </div>
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <label className="text-sm font-medium text-[#FAFAFA]">Package Tiers</label>
                          {tiers.length < 3 && (
                            <button onClick={addTier} className="flex items-center gap-1 text-xs font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:text-[#4840E8]">
                              <Plus className="size-3.5" />Add Tier
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          {tiers.map((tier, i) => (
                            <div key={i} className="rounded-lg border border-[#262626] bg-[#0A0A0A] p-4">
                              <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs font-medium text-[#A1A1AA]">Tier {i + 1}</span>
                                {tiers.length > 1 && (
                                  <button onClick={() => removeTier(i)} className="text-[#71717A] transition duration-100 ease-linear hover:text-red-400">
                                    <X className="size-4" />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                  <input type="text" value={tier.name} onChange={(e) => updateTier(i, "name", e.target.value)} placeholder="Tier name" className="w-full rounded-lg border border-[#262626] bg-[#111111] px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs text-[#71717A]">Sessions</label>
                                  <input type="number" value={tier.sessions || ""} onChange={(e) => updateTier(i, "sessions", Number(e.target.value))} placeholder="0" className="w-full rounded-lg border border-[#262626] bg-[#111111] px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs text-[#71717A]">Price (ZAR)</label>
                                  <input type="number" value={tier.price || ""} onChange={(e) => updateTier(i, "price", Number(e.target.value))} placeholder="0" className="w-full rounded-lg border border-[#262626] bg-[#111111] px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                                </div>
                                {tier.sessions > 0 && tier.price > 0 && (
                                  <div className="col-span-2">
                                    <p className="text-xs text-[#5A4EFF]">{formatCurrency(Math.round(tier.price / tier.sessions))} per session</p>
                                  </div>
                                )}
                                <div className="col-span-2">
                                  <label className="mb-1 block text-xs text-[#71717A]">Features (comma-separated)</label>
                                  <input type="text" value={tier.features} onChange={(e) => updateTier(i, "features", e.target.value)} placeholder="PT sessions, Nutrition plan, Weekly check-ins" className="w-full rounded-lg border border-[#262626] bg-[#111111] px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {modalStep === 3 && (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-[#262626] bg-[#0A0A0A] p-4">
                        <h3 className="text-sm font-semibold text-[#FAFAFA]">Proposal Summary</h3>
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-[#71717A]">Client</span><span className="text-[#FAFAFA]">{selectedClient?.name ?? "--"}</span></div>
                          <div className="flex justify-between"><span className="text-[#71717A]">Title</span><span className="text-[#FAFAFA]">{proposalTitle || "--"}</span></div>
                          <div className="flex justify-between"><span className="text-[#71717A]">Tiers</span><span className="text-[#FAFAFA]">{tiers.length}</span></div>
                          <div className="flex justify-between border-t border-[#262626] pt-2">
                            <span className="font-medium text-[#71717A]">Total Value</span>
                            <span className="font-semibold text-[#E2F4A6]">{formatCurrency(tiers.reduce((sum, t) => sum + t.price, 0))}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-3 lg:grid-cols-3">
                        {tiers.map((tier, i) => (
                          <div key={i} className="rounded-lg border border-[#262626] bg-[#0A0A0A] p-4">
                            <h4 className="text-sm font-semibold text-[#FAFAFA]">{tier.name || `Tier ${i + 1}`}</h4>
                            <p className="mt-1 text-lg font-bold text-[#5A4EFF]">{formatCurrency(tier.price)}</p>
                            <p className="text-xs text-[#71717A]">
                              {tier.sessions} sessions
                              {tier.sessions > 0 && tier.price > 0 && <span> ({formatCurrency(Math.round(tier.price / tier.sessions))}/session)</span>}
                            </p>
                            {tier.features && (
                              <ul className="mt-2 space-y-1">
                                {tier.features.split(",").map((f) => f.trim()).filter(Boolean).map((f, fi) => (
                                  <li key={fi} className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                                    <Check className="size-3 text-[#E2F4A6]" />{f}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-[#262626] px-6 py-4">
                  <button onClick={() => { if (modalStep === 1) resetProposalModal(); else setModalStep(modalStep - 1); }} className="flex items-center gap-1 text-sm font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:text-[#FAFAFA]">
                    {modalStep === 1 ? "Cancel" : (<><ChevronLeft className="size-4" />Back</>)}
                  </button>
                  {modalStep < 3 ? (
                    <button onClick={() => setModalStep(modalStep + 1)} disabled={(modalStep === 1 && !selectedClientId) || (modalStep === 2 && (!proposalTitle || tiers.every((t) => !t.name)))} className="flex items-center gap-1 rounded-lg bg-[#5A4EFF] px-4 py-2 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8] disabled:cursor-not-allowed disabled:opacity-40">
                      Next<ChevronRight className="size-4" />
                    </button>
                  ) : (
                    <button onClick={handleSendProposal} className="flex items-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8]">
                      <Mail01 className="size-4" />Send Proposal
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CONTRACTS TAB                                                         */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === "contracts" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-end">
            <button className="flex items-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8]">
              <FilePlus02 className="size-4" />
              Send for Signing
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contractSignatures.map((cs) => {
              const methodBadge = cs.signatureMethod === "drawn"
                ? "bg-[#EEA0FF]/20 text-[#EEA0FF]"
                : "bg-[#5A4EFF]/20 text-[#5A4EFF]";
              return (
                <div key={cs.id} className="rounded-2xl border border-[#262626] bg-[#111111] p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar initials={cs.clientName.split(" ").map((n) => n[0]).join("")} color={getAvatarColor(cs.clientName.split(" ").map((n) => n[0]).join(""))} size="sm" />
                      <div>
                        <h3 className="text-sm font-semibold text-[#FAFAFA]">{cs.clientName}</h3>
                        <p className="text-xs text-[#71717A]">{cs.contractType}</p>
                      </div>
                    </div>
                    <button className="rounded-lg p-2 text-[#A1A1AA] transition duration-100 ease-linear hover:bg-[#1A1A1A] hover:text-[#FAFAFA]">
                      <Download01 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="text-[#A1A1AA]">Signed {formatDate(cs.signedDate)}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium capitalize ${methodBadge}`}>
                      {cs.signatureMethod}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FORMS & WAIVERS TAB                                                   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {currentTab === "forms" && (
        <div className="flex flex-col gap-4">
          {/* Actions + sub-toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1 rounded-lg bg-[#1A1A1A] p-1">
              {(["templates", "submissions"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFormsSubTab(t)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition duration-100 ease-linear ${
                    formsSubTab === t ? "bg-[#5A4EFF] text-white" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCreateFormModal(true)} className="flex shrink-0 items-center gap-2 rounded-lg bg-[#5A4EFF] px-4 py-2.5 text-sm font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8]">
                <Plus className="size-4" />Create Form
              </button>
            </div>
          </div>

          {/* Templates */}
          {formsSubTab === "templates" && (
            <div className="space-y-3">
              {templates.map((t) => (
                <div key={t.id} className="rounded-2xl border border-[#262626] bg-[#111111] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold text-[#FAFAFA]">{t.name}</h3>
                        <span className="rounded-md bg-[#262626] px-2 py-0.5 text-xs text-[#71717A]">{t.category}</span>
                      </div>
                      <p className="mb-3 text-sm text-[#A1A1AA]">{t.description}</p>
                      <div className="flex items-center gap-4 text-xs text-[#71717A]">
                        <span>{t.fields} fields</span>
                        <span>{t.responses} responses</span>
                        <span>Last used {t.lastUsed}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSendModal(t.id); setSelectedFormClients([]); setSendSuccess(false); }}
                      className="shrink-0 rounded-lg border border-[#262626] bg-[#111111] px-4 py-2 text-sm font-medium text-[#FAFAFA] transition duration-100 ease-linear hover:bg-[#1a1a1a]"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submissions */}
          {formsSubTab === "submissions" && (
            <div className="space-y-2">
              {SUBMISSIONS.map((s) => {
                const st = submissionStatusStyles[s.status];
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-2xl border border-[#262626] bg-[#111111] p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] text-sm font-medium text-white">
                      {s.clientAvatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#FAFAFA]">{s.clientName}</p>
                      <p className="truncate text-sm text-[#71717A]">{s.formName}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${st.bg} ${st.text}`}>{st.label}</span>
                      <p className="mt-1 text-xs text-[#71717A]">{s.submittedAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Send Form Modal */}
          {sendModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSendModal(null)}>
              <div className="w-full max-w-md rounded-2xl border border-[#262626] bg-[#111111] p-6" onClick={(e) => e.stopPropagation()}>
                {sendSuccess ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E2F4A6]/20">
                      <Check className="size-6 text-[#E2F4A6]" />
                    </div>
                    <p className="font-medium text-[#FAFAFA]">Form sent successfully!</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#FAFAFA]">Send Form</h3>
                      <button onClick={() => setSendModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71717A] transition duration-100 ease-linear hover:text-[#FAFAFA]">
                        <X className="size-5" />
                      </button>
                    </div>
                    {sendTemplate && <p className="mb-4 text-sm text-[#A1A1AA]">Sending &ldquo;{sendTemplate.name}&rdquo; to selected clients.</p>}
                    <div className="mb-4 max-h-60 space-y-2 overflow-y-auto">
                      {FORM_CLIENTS.map((c) => (
                        <button key={c.id} onClick={() => toggleFormClient(c.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 transition duration-100 ease-linear ${
                          selectedFormClients.includes(c.id) ? "border-[#5A4EFF] bg-[#5A4EFF]/10" : "border-[#262626] bg-[#0A0A0A]"
                        }`}>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#5A4EFF] to-[#EEA0FF] text-xs font-medium text-white">{c.avatar}</div>
                          <span className="text-sm text-[#FAFAFA]">{c.name}</span>
                          {selectedFormClients.includes(c.id) && <Check className="ml-auto size-4 text-[#5A4EFF]" />}
                        </button>
                      ))}
                    </div>
                    <button onClick={handleSendForm} disabled={selectedFormClients.length === 0} className="w-full rounded-xl bg-[#5A4EFF] py-3 font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8] disabled:opacity-40">
                      Send to {selectedFormClients.length} client{selectedFormClients.length !== 1 ? "s" : ""}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Create Form Modal */}
          {createFormModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => { setCreateFormModal(false); resetFormBuilder(); }}>
              <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#262626] bg-[#111111] p-6" onClick={(e) => e.stopPropagation()}>
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#FAFAFA]">Create Form</h3>
                  <button onClick={() => { setCreateFormModal(false); resetFormBuilder(); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71717A] transition duration-100 ease-linear hover:text-[#FAFAFA]">
                    <X className="size-5" />
                  </button>
                </div>
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">Form Name <span className="text-red-400">*</span></label>
                  <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Client Onboarding" className="w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                </div>
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">Description</label>
                  <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Briefly describe this form..." rows={3} className="w-full resize-none rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                </div>
                <div className="mb-5">
                  <label className="mb-1.5 block text-sm font-medium text-[#A1A1AA]">Category</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full appearance-none rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]">
                    {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-medium text-[#A1A1AA]">Fields</label>
                  <div className="space-y-2">
                    {formFields.map((field) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <input type="text" value={field.label} onChange={(e) => updateField(field.id, "label", e.target.value)} placeholder="Field label" className="flex-1 rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]" />
                        <select value={field.type} onChange={(e) => updateField(field.id, "type", e.target.value)} className="flex-1 appearance-none rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#FAFAFA] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF]">
                          {FIELD_TYPES.map((ft) => (<option key={ft} value={ft}>{ft}</option>))}
                        </select>
                        <button onClick={() => removeField(field.id)} disabled={formFields.length <= 1} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#71717A] transition duration-100 ease-linear hover:text-red-400 disabled:opacity-30 disabled:hover:text-[#71717A]">
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addField} className="mt-2 text-sm font-medium text-[#5A4EFF] transition duration-100 ease-linear hover:text-[#4840E8]">+ Add Field</button>
                </div>
                <div className="space-y-2">
                  <button onClick={handleSaveForm} disabled={!formName.trim()} className="w-full rounded-xl bg-[#5A4EFF] py-3 font-medium text-white transition duration-100 ease-linear hover:bg-[#4840E8] disabled:opacity-40">Save Form</button>
                  <button onClick={() => { setCreateFormModal(false); resetFormBuilder(); }} className="w-full rounded-xl bg-[#262626] py-3 font-medium text-[#FAFAFA] transition duration-100 ease-linear hover:bg-[#333]">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <DocumentsPageInner />
    </Suspense>
  );
}
