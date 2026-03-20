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
    Link01,
    Calendar,
} from "@untitledui/icons";

// -- Types ------------------------------------------------------------------------

type NotificationSetting = {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
};

type SettingsTab = "general" | "integrations";

// -- Mock Data --------------------------------------------------------------------

const businessDetails = {
    name: "Ubuntu Yoga Studio",
    owner: "Amahle Dlamini",
    address: "45 Albert Road, Woodstock, Cape Town",
    phone: "+27 21 461 8900",
    email: "hello@ubuntuyoga.co.za",
    hours: [
        { days: "Mon\u2013Fri", time: "06:00\u201320:00" },
        { days: "Sat", time: "07:00\u201314:00" },
        { days: "Sun", time: "08:00\u201312:00" },
    ],
};

const bookingSettings = [
    { label: "Minimum notice", value: "1 hour" },
    { label: "Cancellation policy", value: "Free up to 4h before class" },
    { label: "Waitlist", value: "Enabled" },
    { label: "Online booking", value: "Enabled" },
    { label: "Max class size", value: "20 students" },
    { label: "Late arrivals", value: "5 min grace period" },
];

const paymentSettings = [
    { label: "Accepted methods", value: "Card, EFT, SnapScan, Zapper, Cash, PayFast" },
    { label: "VAT", value: "15%" },
    { label: "Auto-generate invoices", value: "On" },
    { label: "Membership auto-renew", value: "On" },
];

const initialNotificationSettings: NotificationSetting[] = [
    { id: "bookings", label: "Class bookings", description: "Get notified when a student books a class", enabled: true },
    { id: "cancellations", label: "Cancellations", description: "Get notified when a student cancels a booking", enabled: true },
    { id: "waitlist", label: "Waitlist updates", description: "Notifications when waitlist spots open up", enabled: true },
    { id: "membership", label: "Membership renewals", description: "Get notified when memberships renew or expire", enabled: true },
    { id: "streaks", label: "Streak achievements", description: "Celebrate student streak milestones", enabled: false },
    { id: "low-stock", label: "Low stock alerts", description: "Get notified when retail stock is running low", enabled: true },
];

const integrations = [
    { name: "Google Calendar", description: "Sync class schedules to Google Calendar", connected: true, color: "#4285F4" },
    { name: "WhatsApp Business", description: "Send booking confirmations via WhatsApp", connected: true, color: "#25D366" },
    { name: "SnapScan", description: "Accept SnapScan payments", connected: true, color: "#00A1E0" },
    { name: "PayFast", description: "Online payment gateway for memberships", connected: false, color: "#00457C" },
    { name: "Mailchimp", description: "Email marketing and newsletters", connected: false, color: "#FFE01B" },
];

// -- Section Card Component -------------------------------------------------------

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

// -- Toggle Component -------------------------------------------------------------

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
                enabled ? "bg-[#14B8A6]" : "bg-[#3f3f46]"
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

// -- Page Component ---------------------------------------------------------------

export default function YogaSettingsPage() {
    const [notifSettings, setNotifSettings] = useState(initialNotificationSettings);
    const [activeTab, setActiveTab] = useState<SettingsTab>("general");

    const toggleNotif = (id: string) => {
        setNotifSettings((prev) =>
            prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
        );
    };

    return (
        <div className="min-h-screen bg-[var(--pa-bg-base)] px-4 py-6 lg:px-6 lg:py-8">
            <div className="mx-auto max-w-3xl space-y-4 lg:space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#14B8A6]/15">
                        <Settings01 className="size-5 text-[#14B8A6]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--pa-text-primary)] lg:text-2xl">Settings</h1>
                        <p className="text-sm text-[var(--pa-text-secondary)]">Manage your studio preferences</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                            activeTab === "general"
                                ? "bg-[#14B8A6] text-white"
                                : "text-[var(--pa-text-muted)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                        }`}
                    >
                        General
                    </button>
                    <button
                        onClick={() => setActiveTab("integrations")}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                            activeTab === "integrations"
                                ? "bg-[#14B8A6] text-white"
                                : "text-[var(--pa-text-muted)] hover:bg-[var(--pa-bg-elevated)] hover:text-[var(--pa-text-primary)]"
                        }`}
                    >
                        Integrations
                    </button>
                </div>

                {activeTab === "general" && (
                    <>
                        {/* 1. Business Details */}
                        <SectionCard
                            icon={Home01}
                            iconColor="#14B8A6"
                            iconBg="bg-[#14B8A6]/15"
                            title="Business Details"
                            description="Your studio information"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 rounded-xl bg-[var(--pa-bg-base)] p-3">
                                    <Home01 className="mt-0.5 size-4 shrink-0 text-[var(--pa-text-muted)]" />
                                    <div>
                                        <p className="text-sm font-medium text-[var(--pa-text-primary)]">{businessDetails.name}</p>
                                        <p className="mt-0.5 text-xs text-[var(--pa-text-muted)]">Owner: {businessDetails.owner}</p>
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
                                                <span className="text-sm text-[var(--pa-text-primary)]">{h.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* 2. Team / Instructors */}
                        <SectionCard
                            icon={Users01}
                            iconColor="#3B82F6"
                            iconBg="bg-[#3B82F6]/15"
                            title="Instructors"
                            description="Manage teachers, roles and schedules"
                            href="/yoga/team"
                        />

                        {/* 3. Class Schedule */}
                        <SectionCard
                            icon={Calendar}
                            iconColor="#F59E0B"
                            iconBg="bg-[#F59E0B]/15"
                            title="Class Schedule"
                            description="Manage class timetable and capacity"
                            href="/yoga/schedule"
                        />

                        {/* 4. Booking Settings */}
                        <SectionCard
                            icon={Clock}
                            iconColor="#14B8A6"
                            iconBg="bg-[#14B8A6]/15"
                            title="Booking Settings"
                            description="Configure booking rules and policies"
                        >
                            <div className="divide-y divide-[var(--pa-border-subtle)]">
                                {bookingSettings.map((s) => (
                                    <div key={s.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                        <span className="text-sm text-[var(--pa-text-secondary)]">{s.label}</span>
                                        <span className="text-sm font-medium text-[var(--pa-text-primary)]">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>

                        {/* 5. Payment Settings */}
                        <SectionCard
                            icon={CreditCard01}
                            iconColor="#22C55E"
                            iconBg="bg-[#22C55E]/15"
                            title="Payment Settings"
                            description="Payment methods and billing preferences"
                        >
                            <div className="divide-y divide-[var(--pa-border-subtle)]">
                                {paymentSettings.map((s) => (
                                    <div key={s.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                        <span className="text-sm text-[var(--pa-text-secondary)]">{s.label}</span>
                                        <span className="text-sm font-medium text-[var(--pa-text-primary)]">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>

                        {/* 6. Notification Settings */}
                        <SectionCard
                            icon={Bell01}
                            iconColor="#14B8A6"
                            iconBg="bg-[#14B8A6]/15"
                            title="Notification Settings"
                            description="Choose which notifications you receive"
                        >
                            <div className="divide-y divide-[var(--pa-border-subtle)]">
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
                    </>
                )}

                {activeTab === "integrations" && (
                    <div className="space-y-3">
                        {integrations.map((int) => (
                            <div
                                key={int.name}
                                className="flex items-center gap-4 rounded-2xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-surface)] p-5"
                            >
                                <div
                                    className="flex size-10 items-center justify-center rounded-full"
                                    style={{ backgroundColor: `${int.color}20` }}
                                >
                                    <Link01 className="size-5" style={{ color: int.color }} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-semibold text-[var(--pa-text-primary)]">{int.name}</h3>
                                    <p className="mt-0.5 text-xs text-[var(--pa-text-secondary)]">{int.description}</p>
                                </div>
                                {int.connected ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/15 px-2.5 py-0.5 text-xs font-medium text-[#22C55E]">
                                        <span className="size-1.5 rounded-full bg-[#22C55E]" />
                                        Connected
                                    </span>
                                ) : (
                                    <button className="rounded-xl border border-[var(--pa-border-default)] bg-[var(--pa-bg-base)] px-4 py-2 text-xs font-medium text-[var(--pa-text-secondary)] transition duration-100 ease-linear hover:border-[#14B8A6]/50 hover:text-[var(--pa-text-primary)]">
                                        Connect
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
