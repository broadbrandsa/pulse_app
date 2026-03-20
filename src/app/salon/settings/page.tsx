"use client";

import { useState } from "react";
import {
    Settings01,
    Home01,
    Phone01,
    Mail01,
    Clock,
    CreditCard01,
    Bell01,
    Users01,
} from "@untitledui/icons";

// ── Types ────────────────────────────────────────────────────────────────────

type NotificationSetting = {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
};

// ── Mock Data ────────────────────────────────────────────────────────────────

const businessDetails = {
    name: "Naledi\u2019s Hair Studio",
    address: "45 Vilakazi Street, Soweto, Johannesburg",
    phone: "+27 11 234 5678",
    email: "info@naledisstudio.co.za",
    hours: [
        { days: "Mon\u2013Fri", time: "08:00\u201318:00" },
        { days: "Sat", time: "08:00\u201316:00" },
        { days: "Sun", time: "Closed" },
    ],
};

const bookingSettings = [
    { label: "Minimum notice", value: "2 hours" },
    { label: "Cancellation policy", value: "Free up to 24h" },
    { label: "Walk-ins accepted", value: "Yes" },
    { label: "Online booking", value: "Enabled" },
];

const paymentSettings = [
    { label: "Accepted methods", value: "Cash, Card, EFT" },
    { label: "VAT", value: "15%" },
    { label: "Auto-generate invoices", value: "On" },
];

const initialNotificationSettings: NotificationSetting[] = [
    { id: "bookings", label: "New bookings", description: "Get notified when a client books an appointment", enabled: true },
    { id: "cancellations", label: "Cancellations", description: "Get notified when a client cancels an appointment", enabled: true },
    { id: "low-stock", label: "Low stock alerts", description: "Get notified when product stock is running low", enabled: true },
    { id: "payments", label: "Payment confirmations", description: "Get notified when a payment is received", enabled: false },
    { id: "milestones", label: "Client milestones", description: "Get notified when clients reach loyalty tiers", enabled: true },
];

// ── Section Card Component ───────────────────────────────────────────────────

function SectionCard({
    icon: Icon,
    iconColor,
    iconBg,
    title,
    description,
    children,
    href,
}: {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    iconColor: string;
    iconBg: string;
    title: string;
    description: string;
    children?: React.ReactNode;
    href?: string;
}) {
    const Wrapper = href ? "a" : "div";
    const wrapperProps = href ? { href } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={`block rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5 transition duration-100 ease-linear ${
                href ? "cursor-pointer hover:border-[#3f3f46]" : ""
            }`}
        >
            <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-full ${iconBg}`}>
                    <Icon className="size-5" style={{ color: iconColor }} />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-[var(--pa-text-primary)]">{title}</h2>
                    <p className="text-sm text-[var(--pa-text-secondary)]">{description}</p>
                </div>
                {href && (
                    <svg className="ml-auto size-5 text-[var(--pa-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                )}
            </div>
            {children && <div className="mt-4">{children}</div>}
        </Wrapper>
    );
}

// ── Toggle Component ─────────────────────────────────────────────────────────

function Toggle({
    enabled,
    onToggle,
}: {
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition duration-100 ease-linear ${
                enabled ? "bg-[#D946EF]" : "bg-[#3f3f46]"
            }`}
        >
            <span
                className={`inline-block size-4 rounded-full bg-white transition duration-100 ease-linear ${
                    enabled ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    );
}

// ── Page Component ───────────────────────────────────────────────────────────

export default function SalonSettingsPage() {
    const [notifSettings, setNotifSettings] = useState(initialNotificationSettings);

    const toggleNotif = (id: string) => {
        setNotifSettings((prev) =>
            prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
        );
    };

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-3xl space-y-4 lg:space-y-6">
                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#D946EF]/15">
                        <Settings01 className="size-5 text-[#D946EF]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">Settings</h1>
                        <p className="text-sm text-[var(--pa-text-secondary)]">Manage your salon preferences</p>
                    </div>
                </div>

                {/* ── 1. Business Details ─────────────────────────────── */}
                <SectionCard
                    icon={Home01}
                    iconColor="#D946EF"
                    iconBg="bg-[#D946EF]/15"
                    title="Business Details"
                    description="Your salon information"
                >
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 rounded-xl bg-[var(--pa-bg-base)] p-3">
                            <Home01 className="mt-0.5 size-4 shrink-0 text-[var(--pa-text-muted)]" />
                            <div>
                                <p className="text-sm font-medium text-[var(--pa-text-primary)]">{businessDetails.name}</p>
                                <p className="mt-0.5 text-sm text-[var(--pa-text-secondary)]">{businessDetails.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-[var(--pa-bg-base)] p-3">
                            <Phone01 className="size-4 shrink-0 text-[var(--pa-text-muted)]" />
                            <p className="text-sm text-[var(--pa-text-primary)]">{businessDetails.phone}</p>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-[var(--pa-bg-base)] p-3">
                            <Mail01 className="size-4 shrink-0 text-[var(--pa-text-muted)]" />
                            <p className="text-sm text-[var(--pa-text-primary)]">{businessDetails.email}</p>
                        </div>
                        <div className="flex items-start gap-3 rounded-xl bg-[var(--pa-bg-base)] p-3">
                            <Clock className="mt-0.5 size-4 shrink-0 text-[var(--pa-text-muted)]" />
                            <div className="space-y-1">
                                {businessDetails.hours.map((h) => (
                                    <div key={h.days} className="flex items-center gap-4">
                                        <span className="w-16 text-sm text-[var(--pa-text-secondary)]">{h.days}</span>
                                        <span className={`text-sm ${h.time === "Closed" ? "text-[var(--pa-text-muted)]" : "text-[var(--pa-text-primary)]"}`}>
                                            {h.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* ── 2. Team Management ──────────────────────────────── */}
                <SectionCard
                    icon={Users01}
                    iconColor="#3B82F6"
                    iconBg="bg-[#3B82F6]/15"
                    title="Team Management"
                    description="Manage stylists, roles and schedules"
                    href="/salon/team"
                />

                {/* ── 3. Services & Pricing ───────────────────────────── */}
                <SectionCard
                    icon={Settings01}
                    iconColor="#F59E0B"
                    iconBg="bg-[#F59E0B]/15"
                    title="Services & Pricing"
                    description="Manage your service menu and prices"
                    href="/salon/packages"
                />

                {/* ── 4. Booking Settings ─────────────────────────────── */}
                <SectionCard
                    icon={Clock}
                    iconColor="#14B8A6"
                    iconBg="bg-[#14B8A6]/15"
                    title="Booking Settings"
                    description="Configure booking rules and policies"
                >
                    <div className="divide-y divide-[#262626]">
                        {bookingSettings.map((s) => (
                            <div key={s.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                <span className="text-sm text-[var(--pa-text-secondary)]">{s.label}</span>
                                <span className="text-sm font-medium text-[var(--pa-text-primary)]">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── 5. Payment Settings ─────────────────────────────── */}
                <SectionCard
                    icon={CreditCard01}
                    iconColor="#22C55E"
                    iconBg="bg-[#22C55E]/15"
                    title="Payment Settings"
                    description="Payment methods and billing preferences"
                >
                    <div className="divide-y divide-[#262626]">
                        {paymentSettings.map((s) => (
                            <div key={s.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                <span className="text-sm text-[var(--pa-text-secondary)]">{s.label}</span>
                                <span className="text-sm font-medium text-[var(--pa-text-primary)]">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── 6. Notification Settings ────────────────────────── */}
                <SectionCard
                    icon={Bell01}
                    iconColor="#D946EF"
                    iconBg="bg-[#D946EF]/15"
                    title="Notification Settings"
                    description="Choose which notifications you receive"
                >
                    <div className="divide-y divide-[#262626]">
                        {notifSettings.map((s) => (
                            <div key={s.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-[var(--pa-text-primary)]">{s.label}</p>
                                    <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">{s.description}</p>
                                </div>
                                <Toggle
                                    enabled={s.enabled}
                                    onToggle={() => toggleNotif(s.id)}
                                />
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}
